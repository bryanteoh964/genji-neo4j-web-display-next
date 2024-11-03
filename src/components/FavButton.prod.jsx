import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
//import styles from

export default function FavButton({ poemId, JPRM }) {
    const { data: session } = useSession();
    const [isFav, setIsFav] = useState(false);

    useEffect(() => {
        const checkFav = async () => {
            if(session?.user) {
                try {
                    // check fav status
                    const response = await fetch(`/api/favPoem/check?poemId=${poemId}`);
                    if(response.ok) {
                        const { isFav } = await response.json();
                        setIsFav(isFav);
                        //console.log('isFav', isFav)
                    }
                } catch (error) {
                    console.error('Error checking fav status: ', error);
                }
            }
        }

        checkFav();
    }, [session, poemId])


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
                    body: JSON.stringify({ poemId, JPRM }),
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
                    body: JSON.stringify({ poemId }),
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
        <button
            onClick={handleClick}
            //className=""
        >

            {isFav ? '★' : '☆'}

        </button>
    )
}