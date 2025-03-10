import { auth } from "../../../../auth.prod";
import client from "../../../../lib/db.prod";
import { NextResponse } from "next/server";
import { ObjectId } from 'mongodb';

export async function POST(req) {
    const session = await auth();

    if (!session) {
        return NextResponse.json({ message: 'Unauthorized'}, { status: 401 });
    }

    try {
        const { _id, userId } = await req.json();
        
        const db = await client.db('user');

        const comment = await db.collection('discussion').findOne({  _id: new ObjectId(_id) });


        if (!comment) {
            return NextResponse.json(
                { message: 'comment not found' }, 
                { status: 404 }
            );
        }

        if (!comment.like) {
            comment.like = [];
        }

        // add or remove user from like list
        if (comment.like.includes(userId)) {
            await db.collection('discussion').findOneAndUpdate(
                { _id: new ObjectId(_id) },
                { 
                    $pull: { like: userId }
                }
            );

            return NextResponse.json({ message: 'User is pulled out of like list' }, { status: 200 });
            
        } else {

            await db.collection('discussion').findOneAndUpdate(
                { _id: new ObjectId(_id) },
                { 
                    $addToSet: { like: userId }
                }
            );

            // add notification to the user who posted the comment
            if (comment.user !== userId) {
                await db.collection('notification').insertOne({
                  recipient: comment.user,
                  sender: userId,
                  senderName: session.user.name || session.user.email,
                  senderImage: session.user.image,
                  type: 'likeComment',
                  relatedItem: _id,
                  pageType: comment.pageType,
                  identifier: comment.identifier,
                  content: `Liked your comment: "${comment.content.substring(0, 40)}${comment.content.length > 40 ? '...' : ''}"`,
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
