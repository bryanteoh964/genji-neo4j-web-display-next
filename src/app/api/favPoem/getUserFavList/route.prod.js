import { auth } from "../../../../auth.prod";
import client from "../../../../lib/db.prod";
import { NextResponse } from "next/server";

// api to get the list of user's fav poems
// used in user page
export async function GET(req) {
    const session = await auth();

    if (!session) {
        return NextResponse.json({ message: 'Unauthorized'}, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    try {
        
        const db = await client.db('user');

        const fav = await db.collection('favPoem')
                    .find({
                        userIds: userId,
                    })
                    .sort({ createdAt: 1 })
                    .toArray();

        return NextResponse.json({ fav }, { status: 200 });
    } catch (error) {
        console.log('Error fetching favPoem list:', error)
        return NextResponse.json({ error: 'Failed to get favPoem list' }, { status: 500 });
    }
}