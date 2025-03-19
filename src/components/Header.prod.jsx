'use client'

import styles from '../styles/Header.module.css'
import { SignIn } from '../components/auth/signin-button.prod';

const Header = () => {
    return  (
        
            <div className={styles.header_img}>
                
                <div className={styles.SignIn}>
                    <SignIn />
                </div>

                {/* <div className={styles.container}>
                    <div className={styles.boundary}>
                        <h1>The Tale of Genji Poem Database</h1>
                        <h3>Epsilon Version</h3>
                    </div>
                </div> */}
            </div>        
    )
}

export default Header