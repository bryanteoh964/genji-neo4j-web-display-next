import { auth } from "../../../../auth.prod";
import client from "../../../../lib/db.prod";
import { NextResponse } from "next/server";
import { ObjectId } from 'mongodb';

// get all comments for a page including the user info for each comment
export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const pageType = searchParams.get('pageType');
        const identifier = searchParams.get('identifier');

        const db = await client.db('user');

        // Get all translations for the page
        const translations = await db.collection('translation')
            .find({ pageType, identifier })
            .sort({ createdAt: -1 })
            .toArray();
            
        if (!translations || translations.length === 0) {
            return NextResponse.json({ trans: [] }, { status: 200 });
        }

        // Collect user IDs from translations that have a user field
        const userIds = [...new Set(translations.map(trans => trans.user))].map(id => new ObjectId(id))


        // Get user info if there are any user IDs
        let userMap = new Map();
        if (userIds.length > 0) {
            const users = await db.collection('info')
                .find({ _id: { $in: userIds } })
                .project({ _id: 1, name: 1, googleName: 1, image: 1 })
                .toArray();

            userMap = new Map(users.map(user => [user._id.toString(), user]));
        }

        // Add user info to translations
        const transWithUserInfo = translations.map(trans => {
    
            const user = userMap.get(trans.user.toString());
            if (user) {
                trans.userName = user.name || user.googleName;
                trans.userImage = user.image;
            }

            return trans;
        });

        return NextResponse.json({ trans: transWithUserInfo }, { status: 200 });

    } catch (error) {
        console.error('Error getting translations:', error);
        return NextResponse.json(
            { error: 'Failed to fetch translations' }, 
            { status: 500 }
        );
    }
}