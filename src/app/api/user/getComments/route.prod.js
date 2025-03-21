import { auth } from "../../../../auth.prod";
import client from "../../../../lib/db.prod";
import { NextResponse } from "next/server";
import { ObjectId } from 'mongodb';

// get one user's all comments
export async function GET(req) {
    const session = await auth();

    let page = 1;
    let limit = 5;

    if (!session) {
        return NextResponse.json({ message: 'Unauthorized'}, { status: 401 });
    }

    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get('userId');
        const pageParam = searchParams.get('page');
        const limitParam = searchParams.get('limit');

        if (pageParam) {
            const parsedPage = parseInt(pageParam);
            if (!isNaN(parsedPage) && parsedPage > 0) {
              page = parsedPage;
            }
        }
          
          if (limitParam) {
            const parsedLimit = parseInt(limitParam);
            if (!isNaN(parsedLimit) && parsedLimit > 0) {
              limit = parsedLimit;
            }
        }

        const skip = (page - 1) * limit;
    
        const db = await client.db('user');

        const comments = await db.collection('discussion')
            .aggregate([
                { 
                    $match: {
                        user: userId,
                        isHidden: false
                    }
                },
                {
                    $sort: {  
                        createdAt: -1   
                    }
                }
            ])
            .skip(skip)
            .limit(limit)
            .toArray();

        // console.log('userId:', userId);

        if (!comments || comments.length === 0) {
            return NextResponse.json({ comments: [] }, { status: 200 });
        }

        const totalComments = await db.collection('discussion').countDocuments({ user: userId, isHidden: false });

        return NextResponse.json({ comments, totalComments, currentPage: page, totalPages: Math.ceil(totalComments / limit) || 1 }, { status: 200 });

    } catch (error) {
        console.error('Error finding comments:', error);
        return NextResponse.json(
            { error: 'Failed to find user comments' }, 
            { status: 500 }
        );
    }
}