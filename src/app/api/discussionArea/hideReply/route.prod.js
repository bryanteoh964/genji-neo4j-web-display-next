import { auth } from "../../../../auth.prod";
import client from "../../../../lib/db.prod";
import { NextResponse } from "next/server";
import { ObjectId } from 'mongodb';

// only admin can hide reply from users
export async function POST(req) {
    const session = await auth();

    if (!session || session.user.role !== 'admin') {
        return NextResponse.json({ message: 'Unauthorized'}, { status: 401 });
    }

    try {
        const { _id } = await req.json();
        
        const db = await client.db('user');

        const reply = await db.collection('reply').findOne({  _id: new ObjectId(_id) });


        if (!reply) {
            return NextResponse.json(
                { message: 'comment not found' }, 
                { status: 404 }
            );
        }

        await db.collection('reply').findOneAndUpdate(
            { _id: new ObjectId(_id) },
            { 
                $set: { isHidden: !reply.isHidden }
            }
        )

        return NextResponse.json({ message: 'Reply is hidden now' }, { status: 200 });

    } catch (error) {
        console.error('Error removing reply:', error);
        return NextResponse.json(
            { error: 'Failed to remove reply' }, 
            { status: 500 }
        );
    }
}
