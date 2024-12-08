import { auth } from "../../../../auth.prod";
import client from "../../../../lib/db.prod";
import { NextResponse } from "next/server";

// api to check if the current poem is in user's favourite ones
export async function GET(req) {
    const session = await auth();

    if(!session) {
        return NextResponse.json({ message: 'Unauthorized'}, { status: 401 });
    }
    
    // get poemId from url
    const { searchParams } = new URL(req.url);
    const poemId = searchParams.get('poemId');

    try {
        const db = await client.db('user');
        const fav = await db.collection('favPoem').findOne({
            poemId: poemId, 
            userIds: session.user.id
        });
        
        // if no record in db return false
        if(fav === null) {
            return NextResponse.json({ isFav: false }, { status: 200 });
        }
        
        return NextResponse.json({ isFav: true }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to check favpoem status' }, { status: 500 });
    }
}