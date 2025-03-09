import { auth } from "../../../../auth.prod";
import client from "../../../../lib/db.prod";
import { NextResponse } from "next/server";

export async function POST(req) {
           
    const session = await auth();

    if (!session) {
        return NextResponse.json({ message: 'Unauthorized'}, { status: 401 });
    }

    // all registered or unregisterd users can add new trans
    try {
        const { pageType, identifier, userId, content } = await req.json();
            
        const db = await client.db('user');

        // add trans to the translation collection
        const trans = await db.collection('translation').insertOne( 
                                                                 { 
                                                                    pageType: pageType, 
                                                                    identifier: identifier,
                                                                    user: userId,
                                                                    content: content,
                                                                    createdAt: new Date(),
                                                                    updatedAt: new Date(),
                                                                    isHidden: false,
                                                                    version: 0
                                                                 } )


        // add notification to admins
        await db.collection('notification').insertOne(
            {
                recipient: 'admin',
                sender: userId,
                senderName: session.user.name || session.user.email,
                senderImage: session.user.image,
                type: 'newTrans',
                relatedItem: trans.insertedId.toString(),
                pageType,
                identifier,
                content: content.substring(0, 50) + (content.length > 50 ? '...' : ''),
                needsReview: true,
                isRead: false,
                createdAt: new Date(),
                version: 0
            });

        return NextResponse.json({ trans, _id: trans.insertedId }, { status: 200 });

    } catch (error) {
        console.error('Error adding trans:', error);
        return NextResponse.json({ error: 'Failed to add trans' }, { status: 500 });
    }

}
