import { auth } from "../../../../auth.prod";
import client from "../../../../lib/db.prod";
import { NextResponse } from "next/server";
import { ObjectId } from 'mongodb';

// only admin can hide comments from users
export async function POST(req) {
    const session = await auth();

    if (!session || session.user.role !== 'admin') {
        return NextResponse.json({ message: 'Unauthorized'}, { status: 401 });
    }

    try {
        const { _id } = await req.json();
        
        const db = await client.db('user');

        const comment = await db.collection('discussion').findOne({  _id: new ObjectId(_id) });


        if (!comment) {
            return NextResponse.json(
                { message: 'comment not found' }, 
                { status: 404 }
            );
        }

        await db.collection('discussion').findOneAndUpdate(
            { _id: new ObjectId(_id) },
            { 
                $set: { isHidden: true }
            }
        )

        return NextResponse.json({ message: 'Comment is hidden now' }, { status: 200 });

    } catch (error) {
        console.error('Error removing comment:', error);
        return NextResponse.json(
            { error: 'Failed to remove comment' }, 
            { status: 500 }
        );
    }
}
