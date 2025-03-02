import { auth } from "../../../../auth.prod";
import client from "../../../../lib/db.prod";
import { NextResponse } from "next/server";
import { ObjectId } from 'mongodb';

// get unread notifications
export async function GET(req) {

    const session = await auth();

    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    
    try {
      const db = await client.db('user');

      const { searchParams } = new URL(req.url);
      const userId = searchParams.get('userId');
      
      const notifications = await db.collection('notification')
        .find({ 
          recipient: userId,
          isRead: true,
          needsReview: { $ne: true } 
        })
        .sort({ createdAt: -1 })
        .toArray();
      
      return NextResponse.json({ notifications }, { status: 200 });

    } catch (error) {

      console.error('Error fetching notifications:', error);

      return NextResponse.json({ error: 'Failed to fetch notifications' }, { status: 500 });
    }
  }