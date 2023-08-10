import '../styles/globals.css';

import Header from '../components/Header.prod';
import Nav from '../components/Nav.prod';

const layout = ({ children }) => {
	return (
		<html className="html" lang="en">
			<body className="main">
			<div className="top">
				<Header />
				<Nav />
			</div>
			<main className="bottom">
				{children}
			</main>
			</body>
		</html>
	)
}

export default layout