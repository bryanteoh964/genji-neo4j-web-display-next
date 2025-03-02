import { auth } from "../../../../auth.prod";
import client from "../../../../lib/db.prod";
import { NextResponse } from "next/server";

export async function POST(req) {

    const session = await auth();

    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    
    try {

        const { userId } = await req.json();
        
        const db = await client.db('user');
        
        // Mark all unread notifications as read
        const result = await db.collection('notification').updateMany(
            { recipient: userId, isRead: false },
            { 
                $set: { 
                    isRead: true,
                    updatedAt: new Date()
                },
                $inc: { version: 1 }
            }
        );
      
        return NextResponse.json({ 
            success: true,
            modifiedCount: result.modifiedCount 
        }, { status: 200 });

    } catch (error) {
        console.error('Error marking all notifications as read:', error);
        return NextResponse.json({ 
            error: 'Failed to update notifications',
            message: error.message 
        }, { status: 500 });
    }
}