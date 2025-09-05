'use client'

import { useParams } from 'next/navigation';
import UserHomePage from '../../../components/userpage/UserHomePage.prod';

// user homepage
export default function CharacterPage() {
    const params = useParams();
    const userid = params.userid;
    
    // use user id in db
    return <UserHomePage userid={decodeURIComponent(userid)} />;
}