//import { getServerSession } from "next-auth";
import Email from "next-auth/providers/email";
import { auth } from "../../../../auth.prod";
import client from "../../../../lib/db.prod";
import { NextResponse } from "next/server";

export async function PUT(req) {
    const session = await auth()

    if(!session) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { username } = await req.json();

    if (!username) {
      return NextResponse.json({ message: 'Username is required' }, { status: 400 });
    }

    try {
        const db = await client.db("user");
        const result = await db.collection("info").updateOne(
            { email: session.user.email },
            { $set: { name: username } }
        )
      
        if (result.matchedCount === 0) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }
      
        if (result.modifiedCount === 0) {
            return NextResponse.json({ message: 'Username is the same, no update performed' }, { status: 200 });
        }
      
        return NextResponse.json({ message: 'Username updated successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error updating username:', error)
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
