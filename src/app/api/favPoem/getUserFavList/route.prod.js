import { auth } from "../../../../auth.prod";
import client from "../../../../lib/db.prod";
import { NextResponse } from "next/server";

export async function GET(req) {
    const session = await auth();

    if(!session) {
        return NextResponse.json({ message: 'Unauthorized'}, { status: 401 });
    }

    try {
        
        const db = await client.db('user');

        const fav = await db.collection('favPoem')
                    .find({
                        userId: session.user.id,
                    })
                    .sort({ createdAt: -1 })
                    .toArray();

        return NextResponse.json({ fav }, { status: 200 });
    } catch (error) {
        console.log('Error fetching favPoem list:', error)
        return NextResponse.json({ error: 'Failed to get favPoem list' }, { status: 500 });
    }
}