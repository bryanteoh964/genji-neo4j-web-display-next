import '../styles/globals.css';

import Header from '../components/header';
import Nav from '../components/nav';

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