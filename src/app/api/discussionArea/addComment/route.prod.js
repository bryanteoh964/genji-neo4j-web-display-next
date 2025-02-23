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
                                                                    isPinned: false
                                                                 } )

        return NextResponse.json({ comment, _id: comment.insertedId }, { status: 200 });

    } catch (error) {
        console.error('Error adding discussion comment:', error);
        return NextResponse.json({ error: 'Failed to add discussion comment' }, { status: 500 });
    }

}
