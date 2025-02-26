import { auth } from "../../../../auth.prod";
import client from "../../../../lib/db.prod";
import { NextResponse } from "next/server";
import { ObjectId } from 'mongodb';

// handle comment deletion
// admin and the user who posted the comment can delete it
export async function DELETE(req) {
    const session = await auth();

    if (!session) {
        return NextResponse.json({ message: 'Unauthorized'}, { status: 401 });
    }

    try {
        const { _id, userId, version } = await req.json();
        
        const db = await client.db('user');

        const comment = await db.collection('discussion').findOne({  _id: new ObjectId(_id) });


        if (!comment) {
            return NextResponse.json(
                { message: 'comment not found' }, 
                { status: 404 }
            );
        }

        if (comment.user !== userId && session.user.role !== 'admin') {
            return NextResponse.json({ message: 'Unauthorized'}, { status: 401 });
        }


        const session = client.startSession();
        session.startTransaction();

        try {

            // delete related replies first
            await db.collection('reply').deleteMany({
                baseCommentId: _id
            }, { session });


            const commentRes = await db.collection('discussion').findOneAndDelete({ 
                _id: new ObjectId(_id),
                version: version || 0 
            }, { session });

            // if comment has been modified by another admin rollback transaction
            if (!commentRes) {
                await session.abortTransaction();
                session.endSession();
                return NextResponse.json({ 
                        message: 'Comment has been deleted by another admin, refresh and try again', 
                        errorType: 'versionConflict'
                    }, { status: 409 }
                );
            }

            await session.commitTransaction();

            return NextResponse.json({ message: 'Comment and related replies deleted' }, { status: 200 });
       
        } catch (error) {
            // rollback transaction if any error occurs
            await session.abortTransaction();
            throw error;
       
        } finally {
            session.endSession();
        };

    } catch (error) {
        console.error('Error removing comment:', error);
        return NextResponse.json(
            { error: 'Failed to remove comment' }, 
            { status: 500 }
        );
    }
}