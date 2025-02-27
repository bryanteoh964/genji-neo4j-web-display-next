import { auth } from "../../../../auth.prod";
import client from "../../../../lib/db.prod";
import { NextResponse } from "next/server";
import { ObjectId } from 'mongodb';

// get comment by Id
export async function GET(req) {

    const session = await auth();

    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    
    const { searchParams } = new URL(req.url);
    const commentId = searchParams.get('commentId');

    try {
        const db = await client.db('user');
        
        const comment = await db.collection('discussion')
            .findOne({ _id: new ObjectId(commentId) });

        console.log('comment:', comment);
            
        if (!comment) {
            return NextResponse.json({ message: 'Comment not found' }, { status: 404 });
        }
      
        return NextResponse.json({ 
            _id: comment._id,
            version: comment.version || 0,
            isHidden: comment.isHidden
        }, { status: 200 });

    } catch (error) {
        console.error('Error fetching comment:', error);
        return NextResponse.json({ error: 'Failed to fetch comment' }, { status: 500 });
    }
}