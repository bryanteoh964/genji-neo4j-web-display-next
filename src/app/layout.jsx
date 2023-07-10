import '../styles/globals.css';

import Header from '../components/Header';
import Nav from '../components/Nav';

const layout = ({ children }) => {
  return (
    <html className="html" lang="en">
      <div className="main">
        <div className="top">
          <Header />
          <Nav />
        </div>
        <main className="bottom">
          {children}
        </main>
      </div>
    </html>
  )
}

export default layout