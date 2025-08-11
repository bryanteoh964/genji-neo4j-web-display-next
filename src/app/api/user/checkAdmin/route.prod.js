import { auth } from "../../../../auth.prod";
import client from "../../../../lib/db.prod";

export async function GET() {
    try {
        const session = await auth();

        if (!session || !session.user?.email) {
            return new Response(JSON.stringify({ isAdmin: false }), { status: 200 });
        }

        const db = await client.db(); // or db('your-db-name') if needed

        const user = await db.collection("users").findOne({ email: session.user.email });
        const isAdmin = user?.isAdmin === true || session.user.role === "admin";

        return new Response(JSON.stringify({ isAdmin }), { status: 200 });
    } catch (error) {
        console.error("Error checking admin:", error);
        return new Response(JSON.stringify({ isAdmin: false, error: error.message }), { status: 500 });
    }
}
