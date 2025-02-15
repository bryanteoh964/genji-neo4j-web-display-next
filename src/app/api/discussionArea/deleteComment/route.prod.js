import { auth } from "../../../../auth.prod";
import client from "../../../../lib/db.prod";
import { NextResponse } from "next/server";
import { ObjectId } from 'mongodb';

// handle comment deletion
// admin and the user who posted the comment can delete it
// only admin can delete visitor's comments
// set _id: 'visitor' to delete visitor's comments
export async function DELETE(req) {
    const session = await auth();

    if (!session) {
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

        if (comment.user !== session.user.id && session.user.role !== 'admin') {
            return NextResponse.json({ message: 'Unauthorized'}, { status: 401 });
        }

        await db.collection('discussion').deleteOne({ 
            _id: new ObjectId(_id)
        });

        return NextResponse.json({ message: 'Comment deleted' }, { status: 200 });

    } catch (error) {
        console.error('Error removing comment:', error);
        return NextResponse.json(
            { error: 'Failed to remove comment' }, 
            { status: 500 }
        );
    }
}