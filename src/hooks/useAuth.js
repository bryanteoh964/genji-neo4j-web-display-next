import { useSession } from 'next-auth/react';

/**
 * Custom hook for authentication and authorization
 */
export function useAuth() {
    const { data: session, status } = useSession();

    const isLoading = status === 'loading';
    const isAuthenticated = !!session?.user;
    const isAdmin = session?.user?.role === 'admin';

    return {
        session,
        status,
        isLoading,
        isAuthenticated,
        isAdmin,
        user: session?.user || null
    };
}

/**
 * Hook specifically for admin checking
 */
export function useIsAdmin() {
    const { isAdmin, isLoading } = useAuth();
    return { isAdmin, isLoading };
}
