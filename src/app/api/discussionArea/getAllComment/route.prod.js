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
        const userId = searchParams.get('userId');

        const db = await client.db('user');

        const comments = await db.collection('discussion')
            .aggregate([
                { 
                    $match: {
                        pageType,
                        identifier
                    }
                },
                {
                    $addFields: {
                        likeCount: {
                            $size: {
                                $ifNull: ["$like", []]
                            }
                        }
                    }
                },
                {
                    $sort: {
                        isPinned: -1,      
                        likeCount: -1,   
                        createdAt: -1   
                    }
                }
            ])
            .toArray();
            
        if (!comments || comments.length === 0) {
            return NextResponse.json({ comments: [] }, { status: 200 });
        }


        const replies = await db.collection('reply')
            .find({
                baseCommentId: { 
                    $in: comments.map(comment => comment._id.toString()) 
                }
            })
            .sort({ createdAt: 1 })
            .toArray();

        
        const userIds = [...new Set([
            ...comments.map(comment => comment.user),
            ...replies.map(reply => reply.user)
        ])].map(id => new ObjectId(id));


        // match the user id with the user info
        const users = await db.collection('info')
            .find({ _id: { $in: userIds } })
            .project({ _id: 1, name: 1, googleName: 1, image: 1 })
            .toArray();

        const userMap = new Map(users.map(user => [user._id.toString(), user]));

        // match reply
        const replyMap = new Map();
        replies.forEach(reply => {
            const user = userMap.get(reply.user.toString());
            if (user) {
                reply.userName = user.name || user.googleName;
                reply.userImage = user.image;
            }
            reply.likeCount = (reply.like || []).length;
            reply.isLikedByUser = userId ? (reply.like || []).includes(userId) : false;

            if (!replyMap.has(reply.baseCommentId)) {
                replyMap.set(reply.baseCommentId, []);
            }
            replyMap.get(reply.baseCommentId).push(reply);
        });

        // match comment with user info and reply
        comments.forEach(comment => {
            const user = userMap.get(comment.user.toString());
            if (user) {
                comment.userName = user.name || user.googleName;
                comment.userImage = user.image;
            }
            
            comment.likeCount = (comment.like || []).length;
            comment.isLikedByUser = userId ? (comment.like || []).includes(userId) : false;

            comment.replies = replyMap.get(comment._id.toString()) || [];
        });

        return NextResponse.json({ comments }, { status: 200 });

    } catch (error) {
        console.error('Error getting comments:', error);
        return NextResponse.json(
            { error: 'Failed to get comments' }, 
            { status: 500 }
        );
    }


}