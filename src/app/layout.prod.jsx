'use client'

import '../styles/globals.css';
import Header from '../components/Header.prod';
import Nav from '../components/Nav.prod';
import { usePathname } from 'next/navigation';
import Script from 'next/script';
import { SignIn } from '../components/auth/signin-button.prod';

export const metadata = {
  title: 'The Tale of Genji Poem Database',
  description: 'The Tale of Genji Poem Database Website',
};

const Layout = ({ children }) => {
  const pathname = usePathname();
  const isLoginPage = pathname === '/login';

  return (
    <html lang="en">
      <body className={`main ${isLoginPage ? 'login-page' : ''}`}>
      {!isLoginPage && (
        <div className="top">
          <Header />
          <Nav />

          {/* temperary position */}
          <SignIn />
           {/* temperary position */}
          <ul>
            <a href="/user">
              <span>User Home</span>
            </a>
          </ul>
        </div>

       )}
        <main className="bottom">{children}</main>
        <Script id="chatbot-config">
          {`
            window.difyChatbotConfig = {
              token: '${process.env.NEXT_PUBLIC_DIFY_CHATBOT_TOKEN}',
              baseUrl: '${process.env.NEXT_PUBLIC_DIFY_API_BASE_URL}',
         };
        `}
        </Script>
        <Script
          src={`${process.env.NEXT_PUBLIC_DIFY_API_BASE_URL}/embed.min.js`}
          id="dify-chatbot"
          defer
        />
      </body>
    </html>
  );
};

export default Layout;
