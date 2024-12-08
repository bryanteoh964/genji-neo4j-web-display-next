'use client'
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

export default function FavPoemList() {
    const [role, setRole] = useState('');
    const { data: session } = useSession();

    useEffect(() => {
        if (session?.user?.role) {
            setRole(session.user.role);
        }
    }, [session]);

    return (
        <div>
            <h1>role: {role}</h1>
        </div>
    )
}