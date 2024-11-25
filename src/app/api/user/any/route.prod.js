//import { getServerSession } from "next-auth";
import { auth } from "../../../../auth.prod";
import client from "../../../../lib/db.prod";
import { NextResponse } from "next/server";
import { ObjectId } from 'mongodb'; 

// api to get user info
// used in userhome page for user id
export async function GET(req) {
  const session = await auth();

  if(!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const userid = searchParams.get('userid');

  if (!userid) {
    return new Response(JSON.stringify({ message: 'User id is required' }), { status: 400 });
  }

  try {
    const db = await client.db("user");
    const user = await db.collection("info").findOne({ _id: new ObjectId(userid) });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Remove sensitive information
    const { password, ...userInfo } = user;

    return NextResponse.json(userInfo, { status: 200 });
  } catch (error) {
      console.error('Error fetching user data:', error);
      return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

