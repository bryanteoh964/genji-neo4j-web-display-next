import { version } from "os";
import { auth } from "../../../../auth.prod";
import client from "../../../../lib/db.prod";
import { NextResponse } from "next/server";

export async function POST(req) {
    const session = await auth();

    if (!session) {
        return NextResponse.json({ message: 'Unauthorized'}, { status: 401 });
    }
           
        // for registered users, add into the record of discussion comments
    try {
        const { pageType, identifier, userId, content } = await req.json();
            
        const db = await client.db('user');

        // add comment to the discussion collection
        const comment = await db.collection('discussion').insertOne( 
                                                                 { 
                                                                    pageType: pageType, 
                                                                    identifier: identifier,
                                                                    user: userId,
                                                                    content: content,
                                                                    createdAt: new Date(),
                                                                    updatedAt: new Date(),
                                                                    like: [],
                                                                    isEdited: false,
                                                                    isHidden: false,
                                                                    isPinned: false,
                                                                    version: 0
                                                                 } )


        // add notification to admins
        await db.collection('notification').insertOne(
            {
                recepient: 'admin',
                sender: userId,
                senderName: session.user.name || session.user.email,
                senderImage: session.user.image,
                type: 'newComment',
                relatedItem: comment.insertedId.toString(),
                pageType,
                identifier,
                content: content.substring(0, 50) + (content.length > 50 ? '...' : ''),
                needsReview: true,
                isRead: false,
                createdAt: new Date(),
                version: 0
            });

        return NextResponse.json({ comment, _id: comment.insertedId }, { status: 200 });

    } catch (error) {
        console.error('Error adding discussion comment:', error);
        return NextResponse.json({ error: 'Failed to add discussion comment' }, { status: 500 });
    }

}
