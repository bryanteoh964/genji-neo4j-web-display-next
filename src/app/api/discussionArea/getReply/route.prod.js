import { auth } from "../../../../auth.prod";
import client from "../../../../lib/db.prod";
import { NextResponse } from "next/server";
import { ObjectId } from 'mongodb';

// get reply by Id
export async function GET(req) {

    const session = await auth();

    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    
    const { searchParams } = new URL(req.url);
    const replyId = searchParams.get('replyId');

    try {
        const db = await client.db('user');
        
        const reply = await db.collection('reply')
            .findOne({ _id: new ObjectId(replyId) });
            
        if (!reply) {
            return NextResponse.json({ message: 'Reply not found' }, { status: 404 });
        }
      
        return NextResponse.json({ 
            _id: reply._id,
            version: reply.version || 0,
            isHidden: reply.isHidden
        }, { status: 200 });

    } catch (error) {
        console.error('Error fetching reply:', error);
        return NextResponse.json({ error: 'Failed to fetch reply' }, { status: 500 });
    }
}