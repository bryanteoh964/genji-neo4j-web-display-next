import { auth } from "../../../../auth.prod";
import client from "../../../../lib/db.prod";
import { NextResponse } from "next/server";

// api to delete a contributor from the current page
export async function DELETE(req) {
    const session = await auth();

    if(!session || session.user.role != 'admin') {
        return NextResponse.json({ message: 'Unauthorized'}, { status: 401 });
    }

    try {
        const { pageType, identifier, userId } = await req.json();
        
        const db = await client.db('user');

        const currRecord= await db.collection('contribution').findOne({ pageType, identifier });

        // if there is no contributor left, delete the whole record
        if (currRecord?.contributors?.length === 1 && currRecord.contributors[0] === userId) {
            await db.collection('contribution').deleteOne({ pageType, identifier });
            return NextResponse.json(
                { message: 'Record deleted' }, 
                { status: 200 }
            );
        }

        // delete userId from the list
        const result = await db.collection('contribution').findOneAndUpdate(
            { pageType, identifier },
            { 
                $pull: { contributors: userId },
                $set: { updatedAt: new Date() }
            },
            { 
                returnDocument: 'after'
            }
        );

        if (!result) {
            return NextResponse.json(
                { message: 'Contribution record not found' }, 
                { status: 404 }
            );
        }

        return NextResponse.json({ contribution: result }, { status: 200 });

    } catch (error) {
        console.error('Error removing contributor:', error);
        return NextResponse.json(
            { error: 'Failed to remove contributor' }, 
            { status: 500 }
        );
    }
}