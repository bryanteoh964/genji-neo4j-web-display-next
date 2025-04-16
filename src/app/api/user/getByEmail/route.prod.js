//import { getServerSession } from "next-auth";
import { auth } from "../../../../auth.prod";
import client from "../../../../lib/db.prod";
import { NextResponse } from "next/server";
import { ObjectId } from 'mongodb'; 

// api to get user info by email
export async function GET(req) {
  const session = await auth();

  // if(!session) {
  //   return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  //  }

  const { searchParams } = new URL(req.url);
  const email = searchParams.get('email');

  if (!email) {
    return new Response(JSON.stringify({ message: 'Email is required' }), { status: 400 });
  }

  try {
    const db = await client.db("user");
    const user = await db.collection("info").findOne({ email: email });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Get id and name
    const { _id, name } = user;

    return NextResponse.json({ _id, name }, { status: 200 });
  } catch (error) {
      console.error('Error fetching user data:', error);
      return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

