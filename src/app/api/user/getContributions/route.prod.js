import { auth } from "../../../../auth.prod";
import client from "../../../../lib/db.prod";
import { NextResponse } from "next/server";
import { ObjectId } from 'mongodb';

// get one user's all contributions
export async function GET(req) {
    const session = await auth();

    if (!session) {
        return NextResponse.json({ message: 'Unauthorized'}, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    try {
        const db = await client.db('user');

        const contributions = await db.collection('contribution')
            .find({ 
                contributors: userId
            })
            .sort({ updatedAt: -1 })
            .toArray();

        // console.log('userId:', userId);


        if (!contributions) {
            return NextResponse.json({ 
                    message: 'No contributions found for user'
                },{ status: 404 }
            );
        };

        return NextResponse.json({ contributions }, { status: 200 });

    } catch (error) {
        console.error('Error finding contributions:', error);
        return NextResponse.json(
            { error: 'Failed to find user contributions' }, 
            { status: 500 }
        );
    }
}