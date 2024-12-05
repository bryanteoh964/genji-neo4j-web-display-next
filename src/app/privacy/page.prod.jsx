'use client'
import { useState } from 'react'
import "../../styles/globals.css";

export default function PrivacyPolicy() {
  const [lastUpdated] = useState('December 5, 2024')

  return (
    <section className="section_frame">
        <div className="section_container">
        <h1>Privacy Policy</h1>
        <p>Last updated: {lastUpdated}</p>

        <section id="introduction">
          <h2>1. Introduction</h2>
          <p>Welcome to The Tale of Genji Poem Database (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;). We are committed to protecting your privacy and personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website and services.</p>
        </section>

        <section id="information-collection">
          <h2>2. Information We Collect</h2>
          
          <h3>2.1 Information from Google Authentication</h3>
          <p>When you sign in using Google OAuth, we collect:</p>
          <ul>
            <li>Email address</li>
            <li>Name</li>
            <li>Profile picture</li>
            <li>Google Account ID</li>
          </ul>

          <h3>2.2 User-Provided Information</h3>
          <p>We collect information that you voluntarily provide:</p>
          <ul>
            <li>Profile information</li>
            <li>Public display preferences</li>
            <li>Favorite poems and related content</li>
            <li>Comments and feedback about literary characters</li>
            <li>Other content you choose to share</li>
          </ul>

          <h3>2.3 Usage Information</h3>
          <p>We automatically collect:</p>
          <ul>
            <li>Log data</li>
            <li>Device information</li>
            <li>Browser type</li>
            <li>Access times</li>
            <li>Pages viewed</li>
          </ul>
        </section>

        <section id="information-use">
          <h2>3. How We Use Your Information</h2>
          <p>We use the collected information for:</p>
          <ul>
            <li>Providing and maintaining our services</li>
            <li>Personalizing your experience</li>
            <li>Displaying user-selected content preferences</li>
            <li>Managing your account and preferences</li>
            <li>Analyzing usage patterns to improve our services</li>
            <li>Communicating with you about updates or changes</li>
          </ul>
        </section>

        <section id="information-sharing">
          <h2>4. Information Sharing and Disclosure</h2>
          <p>We do not sell your personal information. We may share your information in the following circumstances:</p>
          <ul>
            <li>With your consent</li>
            <li>To comply with legal obligations</li>
            <li>To protect our rights or property</li>
            <li>In connection with a business transfer or merger</li>
          </ul>
        </section>

        <section id="public-display">
          <h2>5. Public Display of Information</h2>
          <p>Some information may be publicly displayed:</p>
          <ul>
            <li>Your profile information (based on your privacy settings)</li>
            <li>Your favorite poems</li>
            <li>Comments and feedback you choose to make public</li>
          </ul>
        </section>

        <section id="security">
          <h2>6. Data Security</h2>
          <p>We implement reasonable security measures to protect your information. However, no method of transmission over the Internet is 100% secure.</p>
        </section>

        <section id="rights">
          <h2>7. Your Rights</h2>
          <p>You have the right to:</p>
          <ul>
            <li>Access your personal information</li>
            <li>Correct inaccurate information</li>
            <li>Delete your account and associated data</li>
            <li>Adjust your privacy settings</li>
            <li>Opt-out of certain data collection</li>
          </ul>
        </section>

        <section id="changes">
          <h2>8. Changes to This Policy</h2>
          <p>We may update this Privacy Policy periodically. We will notify you of any material changes through our website or email.</p>
        </section>

        <section id="contact">
          <h2>9. Contact Us</h2>
          <p>If you have questions about this Privacy Policy, please contact us at genjidbproject@gmail.com.</p>
        </section>
      </div>
    </section>
  )
}