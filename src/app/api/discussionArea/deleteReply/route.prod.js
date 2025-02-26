import { auth } from "../../../../auth.prod";
import client from "../../../../lib/db.prod";
import { NextResponse } from "next/server";
import { ObjectId } from 'mongodb';

// handle comment reply deletion
// admin and the user who posted the reply can delete it
export async function DELETE(req) {
    const session = await auth();

    if (!session) {
        return NextResponse.json({ message: 'Unauthorized'}, { status: 401 });
    }

    try {
        const { _id, userId, version } = await req.json();
        
        const db = await client.db('user');

        const reply = await db.collection('reply').findOne({  _id: new ObjectId(_id) });


        if (!reply) {
            return NextResponse.json(
                { message: 'comment reply not found' }, 
                { status: 404 }
            );
        }

        if (reply.user !== userId && session.user.role !== 'admin') {
            return NextResponse.json({ message: 'Unauthorized'}, { status: 401 });
        }

        const result = await db.collection('reply').findOneAndDelete({ 
            _id: new ObjectId(_id),
            version: version || 0 
        });

        if (!result) {
            return NextResponse.json({ 
                message: 'Reply has been deleted by another admin, please refresh and try again',
                errorType: 'versionConflict' 
            }, { status: 409 });
        }


        return NextResponse.json({ message: 'reply deleted' }, { status: 200 });

    } catch (error) {
        console.error('Error removing reply:', error);
        return NextResponse.json(
            { error: 'Failed to remove reply' }, 
            { status: 500 }
        );
    }
}