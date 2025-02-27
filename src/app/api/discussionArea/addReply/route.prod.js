import { auth } from "../../../../auth.prod";
import client from "../../../../lib/db.prod";
import { NextResponse } from "next/server";
import { ObjectId } from 'mongodb';
import { version } from "os";

export async function POST(req) {
    const session = await auth();

    if (!session) {
        return NextResponse.json({ message: 'Unauthorized'}, { status: 401 });
    }
           
        // for registered users, add into the record of reply collection
    try {
        const { baseCommentId, userId, content } = await req.json();
            
        const db = await client.db('user');

        const baseComment = await db.collection('discussion').findOne({ _id: new ObjectId(baseCommentId) });

        // add reply to the reply collection
        const reply = await db.collection('reply').insertOne( 
                                                                 { 
                                                                    baseCommentId: baseCommentId,
                                                                    pageType: baseComment.pageType,
                                                                    identifier: baseComment.identifier,
                                                                    user: userId,
                                                                    content: content,
                                                                    createdAt: new Date(),
                                                                    updatedAt: new Date(),
                                                                    like: [],
                                                                    isEdited: false,
                                                                    isHidden: false,
                                                                    version: 0
                                                                 } )

    
        // add notification to admins
        
        await db.collection('notification').insertOne(
            {
                recepient: 'admin',
                sender: userId,
                senderName: session.user.name || session.user.email,
                senderImage: session.user.image,
                type: 'newReply',
                relatedItem: reply.insertedId.toString(),
                pageType: baseComment.pageType,
                identifier: baseComment.identifier,
                content: content.substring(0, 50) + (content.length > 50 ? '...' : ''),
                needsReview: true,
                isRead: false,
                createdAt: new Date(),
                version: 0
            });
        
        // add notification to the user who posted the base comment
        if (baseComment.user !== userId) {
            await db.collection('notification').insertOne({
              recipient: baseComment.user,
              sender: userId,
              senderName: session.user.name || session.user.email,
              senderImage: session.user.image,
              type: 'newReply',
              relatedItem: reply.insertedId.toString(),
              pageType: baseComment.pageType,
              identifier: baseComment.identifier,
              content: content.substring(0, 50) + (content.length > 50 ? '...' : ''),
              isRead: false,
              createdAt: new Date()
            });
          }

        return NextResponse.json({ reply }, { status: 200 });

    } catch (error) {
        console.error('Error adding comment reply:', error);
        return NextResponse.json({ error: 'Failed to add comment reply' }, { status: 500 });
    }

}
