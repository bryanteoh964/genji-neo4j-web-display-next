import { auth } from "../../../../auth.prod";
import client from "../../../../lib/db.prod";
import { NextResponse } from "next/server";

// api to add a contributor for the current page
export async function POST(req) {
    const session = await auth();

    if(!session || session.user.role != 'admin') {
        return NextResponse.json({ message: 'Unauthorized'}, { status: 401 });
    }

    try {
        const { pageType, identifier, userId } = await req.json();
        
        const db = await client.db('user');

        let contribution = await db.collection('contribution').findOne( { pageType, identifier } )
        if(!contribution) {
            contribution = await db.collection('contribution').insertOne( 
                                                             { 
                                                                pageType: pageType, 
                                                                identifier: identifier,
                                                                contributors: [userId],
                                                                createdAt: new Date(),
                                                                updatedAt: new Date()
                                                             } )
        } else {
            contribution = await db.collection('contribution').findOneAndUpdate(
                { pageType, identifier },
                { 
                  $addToSet: { contributors: userId },
                  $set: { updatedAt: new Date() }
                },
                { 
                  new: true
                }
              );
        }

        return NextResponse.json({ contribution }, { status: 200 });
    } catch (error) {
        console.error('Error adding contributor:', error);
        return NextResponse.json({ error: 'Failed to add contributor' }, { status: 500 });
    }
}