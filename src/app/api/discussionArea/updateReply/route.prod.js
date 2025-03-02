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

        // add notification to admins
        await db.collection('notification').insertOne({
            recipient: admin._id.toString(),
            sender: userId,
            senderName: session.user.name || session.user.email,
            senderImage: session.user.image,
            type: 'replyEdit',
            relatedItem: _id,
            pageType: reply.pageType,
            identifier: reply.identifier,
            content: `Reply edited: "${content.substring(0, 50)}${content.length > 50 ? '...' : ''}"`,
            needsReview: true,
            isRead: false,
            createdAt: new Date(),
            version: 0
        });

        return NextResponse.json({ message: 'Reply updated' }, { status: 200 });

    } catch (error) {
        console.error('Error updating replu:', error);
        return NextResponse.json(
            { error: 'Failed to update reply' }, 
            { status: 500 }
        );
    }
}