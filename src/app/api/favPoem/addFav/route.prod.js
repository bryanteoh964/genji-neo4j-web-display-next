import { auth } from "../../../../auth.prod";
import client from "../../../../lib/db.prod";
import { NextResponse } from "next/server";

export async function POST(req) {
    const session = await auth();

    if(!session) {
        return NextResponse.json({ message: 'Unauthorized'}, { status: 401 });
    }

    try {
        const { poemId } = await req.json()
        
        const db = await client.db('user');

        await db.collection('favPoem').insertOne({
            userId: session.user.id,
            poemId: poemId,
            createdAt: new Date()
        });

        return NextResponse.json({ message: "Added to favorites" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to add favorite' }, { status: 500 });
    }
}