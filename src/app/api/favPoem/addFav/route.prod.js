import { auth } from "../../../../auth.prod";
import client from "../../../../lib/db.prod";
import { NextResponse } from "next/server";

// api to mark a poem as favourite one for a user
// used when click the fav button
export async function POST(req) {
    const session = await auth();

    if(!session) {
        return NextResponse.json({ message: 'Unauthorized'}, { status: 401 });
    }

    try {
        const { poemId, JPRM } = await req.json();
        
        const db = await client.db('user');

        await db.collection('favPoem').insertOne({
            userId: session.user.id,
            poemId: poemId,
            jprm: JPRM,

            createdAt: new Date()
        });

        return NextResponse.json({ message: "Added to favorites" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to add favorite' }, { status: 500 });
    }
}