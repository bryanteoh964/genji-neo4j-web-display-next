import { auth } from '../auth.prod';

/**
 * Server-side utility to check if the current user is an admin
 * Use this in API routes that require admin access
 * @returns {Promise<{isAdmin: boolean, session: object | null}>}
 */
export async function checkServerSideAdmin() {
    try {
        const session = await auth();
        
        if (!session || !session.user?.email) {
            return { isAdmin: false, session: null };
        }

        const isAdmin = session.user.role === 'admin';
        return { isAdmin, session };
    } catch (error) {
        console.error("Error checking server-side admin:", error);
        return { isAdmin: false, session: null };
    }
}

/**
 * Middleware function to protect API routes that require admin access
 * Returns an error response if user is not admin
 * @param {Function} handler - The actual API handler function
 * @returns {Function} - Wrapped handler with admin protection
 */
export function withAdminAuth(handler) {
    return async function(request, ...args) {
        const { isAdmin, session } = await checkServerSideAdmin();
        
        if (!isAdmin) {
            return new Response(
                JSON.stringify({ error: 'Unauthorized. Admin access required.' }), 
                { status: 403, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // Pass the session to the handler if needed
        return handler(request, session, ...args);
    };
}
