import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import styles from '../styles/pages/favButton.module.css';

export default function FavButton({ poemId, JPRM }) {
    const { data: session } = useSession();
    const [isFav, setIsFav] = useState(false);
    const [user, setUser] = useState('');

    // get user
    const fetchUser = async () => {
        try {
            if (session) {
                const response = await fetch(`/api/user/me`);
                const data = await response.json();
                setUser(data._id);
                return data._id;
            }
            return null;
        } catch (error) {
            console.error('Error fetching user:', error);
            return null;
        }
    };
    

    useEffect(() => {
        const checkFav = async () => {
            if (session?.user) {
                try {
                    const userId = await fetchUser();
                    
                    if (userId) {
                        const response = await fetch(`/api/favPoem/check?poemId=${poemId}&userId=${userId}`);
                        if (response.ok) {
                            const { isFav } = await response.json();
                            setIsFav(isFav);
                        }
                    }
                } catch (error) {
                    console.error('Error checking fav status:', error);
                }
            }
        };
    
        checkFav();
    }, [session, poemId]);


    const handleClick = async () => {
        if(!session) {
            alert('Please sign in first')
            return;
        }
        
        // if the poem is not in fav, click will add it
        if(!isFav) {
            try {
                const response = await fetch(`/api/favPoem/addFav`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ userId: user, poemId, JPRM }),
                })

                if(response.ok) {
                    setIsFav(!isFav);
                }
            } catch (error) {
                console.error('Error adding fav poem:', error);
            }
        } else {
            // if the poem is already in fav, click will delete it
            try {
                const response = await fetch(`/api/favPoem/deleteFav`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ userId: user, poemId }),
                })

                if(response.ok) {
                    setIsFav(!isFav);
                }
            } catch (error) {
                console.error('Error deleting fav poem:', error);
            }
        }
    }

    return (
        session &&
        <button
            onClick={handleClick}
            className={`${styles.favButton} 
                      ${isFav ? styles.favorited : styles.unfavorited}`}
            title={isFav ? "Remove from favorites" : "Add to favorites"}
        >
            {isFav ? '★' : '☆'}
            
        </button>
    )
}