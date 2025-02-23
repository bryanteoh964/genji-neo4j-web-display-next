import { auth } from "../../../../auth.prod";
import client from "../../../../lib/db.prod";
import { NextResponse } from "next/server";
import { ObjectId } from 'mongodb';

// only admin can pin comments
export async function POST(req) {
    const session = await auth();

    if (!session?.user?.role === 'admin') {
        return NextResponse.json(
            { message: 'Unauthorized' }, 
            { status: 401 }
        );
    }

    try {
        const { _id } = await req.json();
        const db = await client.db('user');

        const comment = await db.collection('discussion').findOne({
            _id: new ObjectId(_id)
        });

        if (!comment) {
            return NextResponse.json(
                { message: 'Comment not found' },
                { status: 404 }
            );
        }

        // Toggle pin status
        await db.collection('discussion').updateOne(
            { _id: new ObjectId(_id) },
            { $set: { isPinned: !comment.isPinned } }
        );

        return NextResponse.json(
            { message: `Comment ${comment.isPinned ? 'unpinned' : 'pinned'} successfully` },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error toggling pin status:', error);
        return NextResponse.json(
            { error: 'Failed to toggle pin status' },
            { status: 500 }
        );
    }
}