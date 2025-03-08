import { auth } from "../../../../auth.prod";
import client from "../../../../lib/db.prod";
import { NextResponse } from "next/server";
import { ObjectId } from 'mongodb';

// handle trans deletion
// only admin can delete
export async function DELETE(req) {
    const session = await auth();

    if (!session) {
        return NextResponse.json({ message: 'Unauthorized'}, { status: 401 });
    }

    try {
        const { _id, userId, version } = await req.json();
        
        const db = await client.db('user');

        const trans = await db.collection('translation').findOne({  _id: new ObjectId(_id) });


        if (!trans) {
            return NextResponse.json(
                { message: 'trans not found' }, 
                { status: 404 }
            );
        }

        if (session.user.role !== 'admin') {
            return NextResponse.json({ message: 'Unauthorized'}, { status: 401 });
        }


        const transSession = client.startSession();
        transSession.startTransaction();

        try {

            // Delete notifications related to the trans itself
            await db.collection('notification').deleteMany({
                relatedItem: _id
            }, { session: transSession });


            const transRes = await db.collection('translation').findOneAndDelete({ 
                _id: new ObjectId(_id),
                version: version || 0 
            }, { transSession });

            // if trans has been modified by another admin rollback transaction
            if (!transRes) {
                await transSession.abortTransaction();
                transSession.endSession();
                return NextResponse.json({ 
                        message: 'Translation has been deleted by another admin, refresh and try again', 
                        errorType: 'versionConflict'
                    }, { status: 409 }
                );
            }

            await transSession.commitTransaction();

            return NextResponse.json({ message: 'translation and related notifications deleted' }, { status: 200 });
       
        } catch (error) {
            // rollback transaction if any error occurs
            await transSession.abortTransaction();
            throw error;
       
        } finally {
            transSession.endSession();
        };

    } catch (error) {
        console.error('Error removing trans:', error);
        return NextResponse.json(
            { error: 'Failed to remove trans' }, 
            { status: 500 }
        );
    }
}