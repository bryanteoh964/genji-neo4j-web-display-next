'use client'

import '../styles/globals.css';
// import Header from '../components/Header.prod';
import Nav from '../components/Nav.prod';
import { usePathname } from 'next/navigation';
import Script from 'next/script';
import Footer from '../components/Footer.prod'
import { SessionProvider } from 'next-auth/react'

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
      <SessionProvider>
      {!isLoginPage && (
        <div className="top">
          {/* <Header /> */}
          <Nav />
        </div>
       )}
        <main className="bottom">{children}</main>
        <Footer />
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
        <Script
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=G-4N5VNJMQSS"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-4N5VNJMQSS');
          `}
        </Script>
        </SessionProvider>
      </body>
    </html>
  );
};

export default Layout;