import { ReceiptIcon } from "lucide-react";
import { auth } from "../../../../auth.prod";
import client from "../../../../lib/db.prod";
import { NextResponse } from "next/server";

// get admin review notifications
export async function GET(req) {

    const session = await auth();

    if (!session || session.user.role !== 'admin') {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    
    try {
        const db = await client.db('user');
      
        const notifications = await db.collection('notification')
            .find({
                recipient: 'admin',
                needsReview: false,
                isRead: true
            })
            .sort({ createdAt: -1 })
            .toArray();
      
        return NextResponse.json({ notifications }, { status: 200 });

    } catch (error) {
        console.error('Error fetching admin review notifications:', error);
        return NextResponse.json({ error: 'Failed to fetch notifications' }, { status: 500 });
    }
}