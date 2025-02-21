import { auth } from "../../../../auth.prod";
import client from "../../../../lib/db.prod";
import { NextResponse } from "next/server";
import { ObjectId } from 'mongodb';

// only admin can hide reply from users
export async function POST(req) {
    const session = await auth();

    if (!session) {
        return NextResponse.json({ message: 'Unauthorized'}, { status: 401 });
    }

    try {
        const { _id, userId } = await req.json();
        
        const db = await client.db('user');

        const reply = await db.collection('reply').findOne({  _id: new ObjectId(_id) });


        if (!reply) {
            return NextResponse.json(
                { message: 'reply not found' }, 
                { status: 404 }
            );
        }

        if (!reply.like) {
            reply.like = [];
        }

        // add or remove user from like list
        if (reply.like.includes(userId)) {
            await db.collection('reply').findOneAndUpdate(
                { _id: new ObjectId(_id) },
                { 
                    $pull: { like: userId }
                }
            );

            return NextResponse.json({ message: 'User is pulled out of like list' }, { status: 200 });
            
        } else {

            await db.collection('reply').findOneAndUpdate(
                { _id: new ObjectId(_id) },
                { 
                    $addToSet: { like: userId }
                }
            );

            return NextResponse.json({ message: 'User is added into like list' }, { status: 200 });
        }

    } catch (error) {
        console.error('Error deal with like list:', error);
        return NextResponse.json(
            { error: 'Failed to deal with like list' }, 
            { status: 500 }
        );
    }
}
