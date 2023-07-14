'use client'

import styles from '../styles/header.module.css'

const Header = () => {
    return  (
        <div className={styles.header_img}>
            <div className={styles.container}>
                <div className={styles.boundary}>
                    <h1>The Tale of Genji Poem Database</h1>
                    <h3>Epsilon Version</h3>
                </div>
            </div>
        </div>
    )
}

export default Header