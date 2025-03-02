import { auth } from "../../../../auth.prod";
import client from "../../../../lib/db.prod";
import { NextResponse } from "next/server";
import { ObjectId } from 'mongodb';

// mark notification as read
export async function POST(req) {

    const session = await auth();

    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    
    try {

        const db = await client.db('user');

        const { notificationId, userId } = await req.json();
      
        await db.collection('notification').updateOne(
            { _id: new ObjectId(notificationId), recipient: userId },
            { $set: { isRead: true } }
);
      
        return NextResponse.json({ success: true }, {status: 200 });

    } catch (error) {

        console.error('Error marking notification as read:', error);

        return NextResponse.json({ error: 'Failed to update notification' }, { status: 500 });
    }
  }