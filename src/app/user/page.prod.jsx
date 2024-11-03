'use client'
import "../../styles/globals.css";
import UserInfo from '../../components/auth/UserInfo.prod';
import FavList from "../../components/UserFavPoemList.prod";
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';


const page = () => {

  // check auth
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/api/auth/signin')
    }
  }, [status, router])

  if (status === 'loading') {
    return <div>Loading...</div>
  }

  if (!session) {
    return null
  }

  return (
    <div>
      <section className="section_frame">
          <div className="section_container">
              <h1 className="main-title">User Page</h1>
          </div>


      </section>

      <UserInfo />
      <FavList />

    </div>
  )
}

export default page