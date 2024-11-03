'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
//import styles from './FavPoemList.module.css'

export default function FavPoemList() {
  const [favList, setFav] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await fetch(`/api/favPoem/getUserFavList`);
        if (!response.ok) {
          throw new Error('Failed to fetch favorites');
        }
        const data = await response.json();
        setFav(data.fav);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchFavorites();
  }, [])

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div>
      <h2>Your Favorite Poems</h2>
      {favList.length === 0 ? (
        <p>No fav Poem yet</p>
      ) : (
        <ul>
          {favList.map((fav) => (
            <li key={fav._id}>
              
                <div>
                  <p>{fav.poemId}</p>
                  <p>{fav.jprm}</p>
                </div>

            </li>
          ))}
        </ul>
      )}
    </div>
  )
}