import { message } from "antd";
import { auth } from "../../../../auth.prod";
import client from "../../../../lib/db.prod";
import { NextResponse } from "next/server";

// api to get contributors for the current page
export async function GET(req) {
    const session = await auth();

    // for user who is not logged in should also be able to call this api
    // if(!session || session.user.role != 'admin') {
    //      return NextResponse.json({ message: 'Unauthorized'}, { status: 401 });
    // }

    try {
        const url = new URL(req.url);
        const pageType = url.searchParams.get('pageType');
        const identifier = url.searchParams.get('identifier');
        
        const db = await client.db('user');

        const contributor = await db.collection('contribution').findOne( { pageType, identifier } );

        if(!contributor|| contributor.length === 0) 
            return NextResponse.json({ message: 'no contributor' }, { status: 404 });

        const contributorObjects = contributor.contributors.map(id => ({
            contributor: id
        }));

        return NextResponse.json({ contributor: contributorObjects }, { status: 200 });

    } catch (error) {
        console.error('Error getting contributor:', error);
        return NextResponse.json({ error: 'Failed to get contributor' }, { status: 500 });
    }
}