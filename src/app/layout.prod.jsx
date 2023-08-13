'use client'

import '../styles/globals.css';

import Header from '../components/Header.prod';
import Nav from '../components/Nav.prod';
import { usePathname } from 'next/navigation';

export const metadata = {
	title: 'The Tale of Genji Poem Database',
	description: 'The Tale of Genji Poem Database Website',
}

const Layout = ({ children }) => {
	const router = usePathname();
	const showHeader = router === '/password-protect' ? false : true;

	return (
		<html className="html" lang="en">
			<body className="main">				
				{ showHeader ? (
						<div className="top">
							<Header />
							<Nav />
						</div>
					) : (
						<></>
					)
				}
				<main className="bottom">
					{children}
				</main>
			</body>
		</html>
	)
}

export default Layout