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
        const { poemId } = await req.json()

        const db = await client.db('user');
        
        await db.collection('favPoem').deleteOne({
            userId: session.user.id,
            poemId: poemId,
        });

        return NextResponse.json({ message: "deleted from favPoems" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to deleted from favPoems' }, { status: 500 });
    }
}