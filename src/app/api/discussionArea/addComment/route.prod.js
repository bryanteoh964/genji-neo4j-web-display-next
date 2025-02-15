import { auth } from "../../../../auth.prod";
import client from "../../../../lib/db.prod";
import { NextResponse } from "next/server";

export async function POST(req) {
    const session = await auth();

    // for unregistered users, add into the record of visitor's comments
    if (!session) {
        try {
            const { pageType, identifier, content } = await req.json();
            
            const db = await client.db('user');
            const visitorComment = await db.collection('discussion').insertOne( 
                                                                 { 
                                                                    pageType: pageType, 
                                                                    identifier: identifier,
                                                                    user: 'visitor',
                                                                    content: content,
                                                                    createdAt: new Date(),
                                                                    isHidden: false
                                                                 } )

            return NextResponse.json({ visitorComment, _id: visitorComment.insertedId }, { status: 200 });

        } catch (error) {
            console.error('Error adding visitor\'s comment:', error);
            return NextResponse.json({ error: 'Failed to add visitor\'s comment' }, { status: 500 });
        }
           
        // for registered users, add into the record of discussion comments
    } else {
        try {
            const { pageType, identifier, content } = await req.json();
            
            const db = await client.db('user');
            const comment = await db.collection('discussion').insertOne( 
                                                                 { 
                                                                    pageType: pageType, 
                                                                    identifier: identifier,
                                                                    user: session.user.id,
                                                                    content: content,
                                                                    createdAt: new Date(),
                                                                    updatedAt: new Date(),
                                                                    isEdited: false,
                                                                    isHidden: false
                                                                 } )

            return NextResponse.json({ comment, _id: comment.insertedId }, { status: 200 });

        } catch (error) {
            console.error('Error adding discussion comment:', error);
            return NextResponse.json({ error: 'Failed to add discussion comment' }, { status: 500 });
        }
    }

}
