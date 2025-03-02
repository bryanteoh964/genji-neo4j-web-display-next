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


        const transSession = client.startSession();
        transSession.startTransaction();

        try {

            // Get all reply IDs first (to delete their notifications later)
            const replies = await db.collection('reply').find({
                baseCommentId: _id
            }).toArray({ session: transSession });
            
            const replyIds = replies.map(reply => reply._id.toString());
            // delete related replies first
            await db.collection('reply').deleteMany({
                baseCommentId: _id
            }, { transSession});

            // Delete notifications related to replies
            if (replyIds.length > 0) {
                await db.collection('notification').deleteMany({
                    relatedItem: { $in: replyIds }
                }, { session: transSession });
            }

            // Delete notifications related to the comment itself
            await db.collection('notification').deleteMany({
                relatedItem: _id
            }, { session: transSession });


            const commentRes = await db.collection('discussion').findOneAndDelete({ 
                _id: new ObjectId(_id),
                version: version || 0 
            }, { transSession });

            // if comment has been modified by another admin rollback transaction
            if (!commentRes) {
                await transSession.abortTransaction();
                transSession.endSession();
                return NextResponse.json({ 
                        message: 'Comment has been deleted by another admin, refresh and try again', 
                        errorType: 'versionConflict'
                    }, { status: 409 }
                );
            }

            await transSession.commitTransaction();

            return NextResponse.json({ message: 'Comment and related replies deleted' }, { status: 200 });
       
        } catch (error) {
            // rollback transaction if any error occurs
            await transSession.abortTransaction();
            throw error;
       
        } finally {
            transSession.endSession();
        };

    } catch (error) {
        console.error('Error removing comment:', error);
        return NextResponse.json(
            { error: 'Failed to remove comment' }, 
            { status: 500 }
        );
    }
}