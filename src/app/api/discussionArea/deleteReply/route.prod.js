import { auth } from "../../../../auth.prod";
import client from "../../../../lib/db.prod";
import { NextResponse } from "next/server";
import { ObjectId } from 'mongodb';

// handle comment reply deletion
// admin and the user who posted the reply can delete it
export async function DELETE(req) {
    const session = await auth();

    if (!session) {
        return NextResponse.json({ message: 'Unauthorized'}, { status: 401 });
    }

    try {
        const { _id, userId } = await req.json();
        
        const db = await client.db('user');

        const reply = await db.collection('reply').findOne({  _id: new ObjectId(_id) });


        if (!reply) {
            return NextResponse.json(
                { message: 'comment reply not found' }, 
                { status: 404 }
            );
        }

        if (reply.user !== userId && session.user.role !== 'admin') {
            return NextResponse.json({ message: 'Unauthorized'}, { status: 401 });
        }

        await db.collection('reply').deleteOne({ 
            _id: new ObjectId(_id)
        });

        return NextResponse.json({ message: 'reply deleted' }, { status: 200 });

    } catch (error) {
        console.error('Error removing reply:', error);
        return NextResponse.json(
            { error: 'Failed to remove reply' }, 
            { status: 500 }
        );
    }
}