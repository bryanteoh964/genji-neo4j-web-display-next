import { auth } from "../../../../auth.prod";
import client from "../../../../lib/db.prod";
import { NextResponse } from "next/server";

export async function POST(req) {
    const session = await auth();

    if (!session) {
        return NextResponse.json({ message: 'Unauthorized'}, { status: 401 });
    }
           
        // for registered users, add into the record of reply collection
    try {
        const { baseCommentId, userId, content } = await req.json();
            
        const db = await client.db('user');

        const reply = await db.collection('reply').insertOne( 
                                                                 { 
                                                                    baseCommentId: baseCommentId,
                                                                    user: userId,
                                                                    content: content,
                                                                    createdAt: new Date(),
                                                                    updatedAt: new Date(),
                                                                    like: [],
                                                                    isEdited: false,
                                                                    isHidden: false,
                                                                    like: []
                                                                 } )

        return NextResponse.json({ reply }, { status: 200 });

    } catch (error) {
        console.error('Error adding comment reply:', error);
        return NextResponse.json({ error: 'Failed to add comment reply' }, { status: 500 });
    }

}
