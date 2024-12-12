//import { getServerSession } from "next-auth";
import { auth } from "../../../../auth.prod";
import client from "../../../../lib/db.prod";
import { NextResponse } from "next/server"; 

// api to get full user list
// used in contribution system to mark contributor
export async function GET(req) {
  const session = await auth();

  // for user who is not logged in should also be able to call this api
  // if(!session || session.user.role != 'admin') {
  //   return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  // }

  try {
    const db = await client.db("user");
    // only get _id, name, email, googlename, google avatar
    const userList = await db.collection("info")
                            .find(
                              {}, 
                              { 
                                projection: {
                                  role: 0,
                                  password: 0
                                } 
                              }
                            )
                            .toArray();

    if (!userList || userList.length === 0) {
      return NextResponse.json({ message: "No user in db" }, { status: 404 });
    };

    return NextResponse.json({users: userList}, { status: 200 });
  } catch (error) {
      console.error('Error fetching user data:', error);
      return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

