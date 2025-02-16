import { auth } from "../../../../auth.prod";
import client from "../../../../lib/db.prod";
import { NextResponse } from "next/server";
import { ObjectId } from 'mongodb';

// get all comments for a page including the user info for each comment
export async function GET(req) {
    const session = await auth();

    if (!session) {
        return NextResponse.json({ message: 'Unauthorized'}, { status: 401 });
    }

    try {
        const { searchParams } = new URL(req.url);
        const pageType = searchParams.get('pageType');
        const identifier = searchParams.get('identifier');

        const db = await client.db('user');

        const comments = await db.collection('discussion')
            .find({
                pageType,
                identifier
            })
            .sort({ createdAt: -1 })
            .toArray();
            
        if (!comments || comments.length === 0) {
            return NextResponse.json({ comments: [] }, { status: 200 });
        }

        // match the user id with the user info
        if (comments.length > 0) {
               
            const userIds = [...new Set(comments.map(comment =>  new ObjectId(comment.user)))];

            //console.log('userIds:', userIds);
                
            const users = await db.collection('info')
                .find({ _id: { $in: userIds } })
                .project({ _id: 1, name: 1, googleName: 1, image: 1 })
                .toArray();
            
            //console.log('users:', users);
    
            const userMap = new Map(users.map(user => [user._id.toString(), user]));

            comments.forEach(comment => {
                const user = userMap.get(comment.user.toString());
                if (user) {
                    comment.userName = user.name || user.googleName;
                    comment.userImage = user.image;
                }
            });
        }

        return NextResponse.json({ comments }, { status: 200 });

    } catch (error) {
        console.error('Error getting comments:', error);
        return NextResponse.json(
            { error: 'Failed to get comments' }, 
            { status: 500 }
        );
    }


}