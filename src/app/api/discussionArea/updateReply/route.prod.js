import { auth } from "../../../../auth.prod";
import client from "../../../../lib/db.prod";
import { NextResponse } from "next/server";
import { ObjectId } from 'mongodb';

// only the user who posted the comment can update it
export async function POST(req) {
    const session = await auth();

    if (!session) {
        return NextResponse.json({ message: 'Unauthorized'}, { status: 401 });
    }

    try {
        const { _id, userId, content, version } = await req.json();
        
        const db = await client.db('user');

        const reply = await db.collection('reply').findOne({  _id: new ObjectId(_id) });

        if (!reply) {
            return NextResponse.json(
                { message: 'reply not found' }, 
                { status: 404 }
            );
        }

        if (reply.user !== userId) {
            return NextResponse.json({ message: 'Unauthorized'}, { status: 401 });
        }

        const res = await db.collection('reply').findOneAndUpdate(
            { 
                _id: new ObjectId(_id),
                version: version || 0
            },    
            { 
                $set: { 
                    content: content,
                    updatedAt: new Date()
                },
                $inc: { version: 1 }
            },
            { returnDocument: 'after' }
        );

        if (!res) {
            return NextResponse.json({ 
                    message: 'Reply was updated by another user',
                    errorType: 'versionConflict'
                },{ status: 409 }
            );
        };

        return NextResponse.json({ message: 'Reply updated' }, { status: 200 });

    } catch (error) {
        console.error('Error updating replu:', error);
        return NextResponse.json(
            { error: 'Failed to update reply' }, 
            { status: 500 }
        );
    }
}