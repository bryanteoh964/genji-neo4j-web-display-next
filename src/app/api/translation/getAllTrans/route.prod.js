import { auth } from "../../../../auth.prod";
import client from "../../../../lib/db.prod";
import { NextResponse } from "next/server";
import { ObjectId } from 'mongodb';

// get all comments for a page including the user info for each comment
export async function GET(req) {

    try {
        const { searchParams } = new URL(req.url);
        const pageType = searchParams.get('pageType');
        const identifier = searchParams.get('identifier');

        const db = await client.db('user');

        const trans = await db.collection('translation')
            .find({ pageType, identifier })
            .sort({ createdAt: -1 })
            .toArray();
            
        if (!trans || trans.length === 0) {
            return NextResponse.json({ trans: [] }, { status: 200 });
        }

        return NextResponse.json({ trans }, { status: 200 });

    } catch (error) {
        console.error('Error getting comments:', error);
        return NextResponse.json(
            { error: 'Failed to get comments' }, 
            { status: 500 }
        );
    }


}