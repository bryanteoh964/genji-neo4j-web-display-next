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

        const comment = await db.collection('discussion').findOne({  _id: new ObjectId(_id) });

        if (!comment) {
            return NextResponse.json(
                { message: 'comment not found' }, 
                { status: 404 }
            );
        }

        if (comment.user !== userId) {
            return NextResponse.json({ message: 'Unauthorized'}, { status: 401 });
        }

        const res = await db.collection('discussion').findOneAndUpdate(
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

        //console.log('findOneAndUpdate result:', JSON.stringify(res, null, 2));

        if (!res) {
            return NextResponse.json({ 
                    message: 'Comment was updated by another user',
                    errorType: 'versionConflict'
                },{ status: 409 }
            );
        };

        // add notification to admins

        await db.collection('notification').insertOne({
            recipient: 'admin',
            sender: userId,
            senderName: session.user.name || session.user.email,
            senderImage: session.user.image,
            type: 'commentEdit',
            relatedItem: _id,
            pageType: comment.pageType,
            identifier: comment.identifier,
            content: `Comment edited: "${content.substring(0, 50)}${content.length > 50 ? '...' : ''}"`,
            needsReview: true,
            isRead: false,
            createdAt: new Date(),
            version: 0
        });
        

        return NextResponse.json({ message: 'Comment updated' }, { status: 200 });

    } catch (error) {
        console.error('Error updating comment:', error);
        return NextResponse.json(
            { error: 'Failed to update comment' }, 
            { status: 500 }
        );
    }
}