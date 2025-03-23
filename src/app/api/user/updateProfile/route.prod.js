import { auth } from "../../../../auth.prod";
import client from "../../../../lib/db.prod";
import { NextResponse } from "next/server";
import { ObjectId } from 'mongodb';

// only the user self can update the profile
export async function POST(req) {
    const session = await auth();

    if (!session) {
        return NextResponse.json({ message: 'Unauthorized'}, { status: 401 });
    }

    try {
        const { bio, location, occupation, displayName, userId, version } = await req.json();
        
        const db = await client.db('user');

        const user = await db.collection("info").findOne({ email: session.user.email });
    
        if (!user) {
            return NextResponse.json(
                { message: "User not found" }, 
                { status: 404 }
            );
        }

        // console.log('id:', user._id.toString(), 'userId:', userId, 'version:', version);

        if (user._id.toString() !== userId) {
            return NextResponse.json({ message: 'Unauthorized'}, { status: 401 });
        }

        const res = await db.collection('info').findOneAndUpdate(
            {  
                _id: new ObjectId(userId),
                version: version 
            },    
            { 
                $set: { 
                    bio: bio,
                    location: location,
                    occupation: occupation,
                    name: displayName,
                    updatedAt: new Date()
                },
                $inc: { version: 1 }
            },
            { returnDocument: 'after' }
        );

        if (!res) {
            return NextResponse.json({ 
                    message: 'Profile update is out of date',
                    errorType: 'versionConflict'
                },{ status: 409 }
            );
        };

        return NextResponse.json({ message: 'Profile updated' }, { status: 200 });

    } catch (error) {
        console.error('Error updating profile:', error);
        return NextResponse.json(
            { error: 'Failed to update profile' }, 
            { status: 500 }
        );
    }
}