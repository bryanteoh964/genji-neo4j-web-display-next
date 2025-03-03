import { auth } from "../../../../auth.prod";
import client from "../../../../lib/db.prod";
import { NextResponse } from "next/server";
import { ObjectId } from 'mongodb';

// mark review notification as read
export async function POST(req) {
    const session = await auth();

    if (!session || session.user.role !== 'admin') {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    
    try {
        const { notificationId, userId, action, version } = await req.json();
        
        const db = await client.db('user');
        
        const notification = await db.collection('notification').findOne( { _id: new ObjectId(notificationId) });
        
        if (!notification) {
            return NextResponse.json(
                { message: 'Notification not found' }, 
                { status: 404 }
            );
        }
        
        const res = await db.collection('notification').findOneAndUpdate(
            {  
                _id:  new ObjectId(notificationId),
                version: version || 0
            },    
            { 
                $set: { 
                    needsReview: false,
                    isRead: true,
                    reviewedAt: new Date(),
                    reviewedBy: userId,
                    reviewAction: action
                },
                $inc: { version: 1 }
            },
            { returnDocument: 'after' }
        );
        
        if (!res) {
            return NextResponse.json({ 
                    message: 'Notification was reviewed by another admin',
                    errorType: 'versionConflict'
                },{ status: 409 }
            );
        };
      
        return NextResponse.json({ message: 'Notification review resolved' }, { status: 200 });


    } catch (error) {
        console.error('Error resolving review notification:', error);
        return NextResponse.json({ error: 'Failed to resolve review' }, { status: 500 });
    }
}