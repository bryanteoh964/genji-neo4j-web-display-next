'use client'

import '../styles/globals.css';

import Header from '../components/Header';
import Nav from '../components/Nav';
import { usePathname } from 'next/navigation';

const layout = ({ children }) => {
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

export default layout