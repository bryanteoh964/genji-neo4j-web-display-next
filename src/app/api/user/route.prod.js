//import { getServerSession } from "next-auth";
import { auth } from "../../../auth.prod";
import client from "../../../lib/db.prod";
import { NextResponse } from "next/server";

export async function GET(req) {
    const session = await auth();

    if(!session) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        const db = await client.db("user");
        const user = await db.collection("info").findOne({ email: session.user.email });
    
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

