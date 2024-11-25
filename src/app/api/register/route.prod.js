import bcrypt from 'bcryptjs';
import client from '../../../lib/db.prod';
import { NextResponse } from 'next/server'

// api to manually register a user account
// may be deleted since google OAUTH is deployed
export async function POST(req) {
    try {
        const {email, password} = await req.json()

        const db = await client.db("user");
        const collection = db.collection("info");

        const existingUser = await collection.findOne({email});

        if (existingUser ) {
            // handle email already regitered via google OAuth
            if (!existingUser.password) {
                return NextResponse.json({ message: "Email is already registered with Google. Try to use Google to log in." }, { status: 400 });
            }
            return NextResponse.json({ message: "Email already exists" }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await collection.insertOne({
            name: '',
            email,
            role: 'user',
            password: hashedPassword,
            createdAt: new Date()
        })

        return NextResponse.json({ message: "User created", userEmail: result.email }, { status: 201 });
    } catch (error) {
        console.error("registration has error:", error);
        return NextResponse.json({ message: "registration api error"}, { status: 500 });
    }
}