import { auth } from "../../../../auth.prod";
import client from "../../../../lib/db.prod";
import { NextResponse } from "next/server";

// api to delete a favourite poem for a user
// used when click the fav button
export async function DELETE(req) {
    const session = await auth();

    if(!session) {
        return NextResponse.json({ message: 'Unauthorized'}, { status: 401 });
    }

    try {
        const { userId, poemId } = await req.json();

        const db = await client.db('user');
        const currRecord = await db.collection('favPoem').findOne({ poemId: poemId });

        // if there is no userId left, delete the whole record
        if (currRecord?.userIds?.length === 1 && currRecord.userIds[0] === userId) {
            await db.collection('favPoem').deleteOne({ poemId: poemId });
            return NextResponse.json(
                { message: 'Record deleted' }, 
                { status: 200 }
            );
        }

        // delete userId from the list
        const result = await db.collection('favPoem').findOneAndUpdate(
            { poemId: poemId },
            { 
                $pull: { userIds: userId },
                $set: { updatedAt: new Date() }
            },
            { 
                returnDocument: 'after'
            }
        );

        if (!result) {
            return NextResponse.json(
                { message: 'fav poem record not found' }, 
                { status: 404 }
            );
        }

        return NextResponse.json({ message: "deleted from favPoems" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to deleted from favPoems' }, { status: 500 });
    }
}