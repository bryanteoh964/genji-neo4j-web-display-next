import { auth } from "../../../../auth.prod";
import client from "../../../../lib/db.prod";
import { NextResponse } from "next/server";
import { ObjectId } from 'mongodb';

// only admin and the user who posted the comment can update it
export async function POST(req) {
    const session = await auth();

    if (!session) {
        return NextResponse.json({ message: 'Unauthorized'}, { status: 401 });
    }

    try {
        const { _id, content } = await req.json();
        
        const db = await client.db('user');

        const comment = await db.collection('discussion').findOne({  _id: new ObjectId(_id) });

        if (!comment) {
            return NextResponse.json(
                { message: 'comment not found' }, 
                { status: 404 }
            );
        }

        if (comment.user !== session.user.id && session.user.role !== 'admin') {
            return NextResponse.json({ message: 'Unauthorized'}, { status: 401 });
        }

        await db.collection('discussion').findOneAndUpdate(
            {  _id: new ObjectId(_id) },    
            { 
                $set: { content: content }
            }
        );

        return NextResponse.json({ message: 'Comment updated' }, { status: 200 });

    } catch (error) {
        console.error('Error updating comment:', error);
        return NextResponse.json(
            { error: 'Failed to update comment' }, 
            { status: 500 }
        );
    }
}