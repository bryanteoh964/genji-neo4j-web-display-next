import { auth } from "../../../../auth.prod";
import client from "../../../../lib/db.prod";
import { NextResponse } from "next/server";
import { ObjectId } from 'mongodb';
import { version } from "os";

// only admin can hide reply from users
export async function POST(req) {
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
                { message: 'reply not found' }, 
                { status: 404 }
            );
        }

        if (!reply.like) {
            reply.like = [];
        }

        // add or remove user from like list
        if (reply.like.includes(userId)) {
            await db.collection('reply').findOneAndUpdate(
                { _id: new ObjectId(_id) },
                { 
                    $pull: { like: userId }
                }
            );

            return NextResponse.json({ message: 'User is pulled out of like list' }, { status: 200 });
            
        } else {

            await db.collection('reply').findOneAndUpdate(
                { _id: new ObjectId(_id) },
                { 
                    $addToSet: { like: userId }
                }
            );

            // add notification to the user who posted the reply
            if (reply.user !== userId) {
                await db.collection('notification').insertOne({
                  recipient: reply.user,
                  sender: userId,
                  senderName: session.user.name || session.user.email,
                  senderImage: session.user.image,
                  type: 'likeReply',
                  relatedItem: _id,
                  pageType: reply.pageType,
                  identifier: reply.identifier,
                  content: `Liked your reply: "${reply.content.substring(0, 40)}${reply.content.length > 40 ? '...' : ''}"`,
                  isRead: false,
                  createdAt: new Date(),
                  version: 0
                });
              }

            return NextResponse.json({ message: 'User is added into like list' }, { status: 200 });
        }

    } catch (error) {
        console.error('Error deal with like list:', error);
        return NextResponse.json(
            { error: 'Failed to deal with like list' }, 
            { status: 500 }
        );
    }
}
