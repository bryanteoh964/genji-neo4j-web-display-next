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
        const { userId, poemId, JPRM } = await req.json();
        
        const db = await client.db('user');

        let fav = await db.collection('favPoem').findOne({ poemId: poemId });

        if(!fav) {
            fav = await db.collection('favPoem').insertOne({
                poemId: poemId,
                jprm: JPRM,
                userIds: [userId],
                createdAt: new Date(),
                updatedAt: new Date()
            });
        } else {
            fav = await db.collection('favPoem').findOneAndUpdate(
                { poemId: poemId },
                {
                    $addToSet: { userIds: userId },
                    $set: { updatedAt: new Date() }
                },
                { 
                  new: true
                }
            );
        }

        return NextResponse.json({ message: "Added to favorites" }, { status: 200 });
    } catch (error) {
        console.error('Error adding favorite:', error);
        return NextResponse.json({ error: 'Failed to add favorite' }, { status: 500 });
    }
}