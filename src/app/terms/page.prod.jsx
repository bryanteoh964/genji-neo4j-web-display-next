'use client'
import { useState } from 'react'
import "../../styles/globals.css";

export default function PrivacyPolicy() {
  const [lastUpdated] = useState('December 5, 2024')

  return (
    <section className="section_frame">
        <div className="section_container">
        <h1>Terms of Service</h1>
        <p>Last updated: {lastUpdated}</p>

        <section>
          <h2>1. Agreement to Terms</h2>
          <p>By accessing or using The Tale of Genji Poem Database, you agree to be bound by these Terms of Service. If you disagree with any part of these terms, you may not access the Service.</p>
        </section>

        <section>
          <h2>2. Intellectual Property Rights</h2>
          <p>The Service and its original content, features, and functionality are owned by The Tale of Genji Poem Database and are protected by international copyright, trademark, patent, trade secret, and other intellectual property or proprietary rights laws.</p>
          
          <h3>2.1 User Content</h3>
          <p>By posting, uploading, or sharing content through our Service, you grant us a non-exclusive, worldwide, royalty-free license to use, modify, publicly display, reproduce, and distribute such content on and through our Service.</p>
        </section>

        <section>
          <h2>3. User Account</h2>

          <h3>3.1 Account Creation</h3>
          <p>To use certain features of our Service, you must register for an account using Google OAuth authentication. You agree to:</p>
          <ul>
            <li>Provide accurate and complete information</li>
            <li>Maintain the security of your account</li>
            <li>Promptly update any information as needed</li>
            <li>Accept responsibility for all activities that occur under your account</li>
          </ul>

          <h3>3.2 Account Termination</h3>
          <p>We reserve the right to suspend or terminate your account if you violate these Terms or for any other reason at our sole discretion. You may also delete your account at any time.</p>
        </section>

        <section>
          <h2>4. Acceptable Use</h2>
          
          <h3>4.1 Permitted Use</h3>
          <p>You agree to use our Service only for:</p>
          <ul>
            <li>Accessing and interacting with literary content</li>
            <li>Creating and managing your profile</li>
            <li>Saving and organizing favorite poems</li>
            <li>Participating in literary discussions</li>
            <li>Other activities explicitly permitted by the Service</li>
          </ul>

          <h3>4.2 Prohibited Activities</h3>
          <p>You agree not to:</p>
          <ul>
            <li>Use the Service for any illegal purpose</li>
            <li>Harass, abuse, or harm other users</li>
            <li>Post inappropriate, false, or misleading content</li>
            <li>Attempt to gain unauthorized access to the Service</li>
            <li>Interfere with or disrupt the Service</li>
            <li>Collect user information without consent</li>
          </ul>
        </section>

        <section>
          <h2>5. Content Guidelines</h2>
          <p>Users must ensure their content:</p>
          <ul>
            <li>Is accurate and not misleading</li>
            <li>Respects intellectual property rights</li>
            <li>Does not contain harmful or malicious code</li>
            <li>Does not violate any applicable laws or regulations</li>
            <li>Is appropriate for a general audience</li>
          </ul>
        </section>

        <section>
          <h2>6. Limitation of Liability</h2>
          <p>To the maximum extent permitted by law, The Tale of Genji Poem Database shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use or inability to use the Service.</p>
        </section>

        <section>
          <h2>7. Disclaimers</h2>
          <p>The Service is provided &quot;as is&quot; and &quot;as available&quot; without any warranties of any kind, either express or implied. We do not guarantee that the Service will be uninterrupted, secure, or error-free.</p>
        </section>

        <section>
          <h2>8. Changes to Terms</h2>
          <p>We reserve the right to modify or replace these Terms at any time. Significant changes will be notified to users. Your continued use of the Service after such modifications constitutes acceptance of the updated Terms.</p>
        </section>

        <section>
          <h2>9. Privacy Policy</h2>
          <p>Your use of the Service is also governed by our Privacy Policy. Please review our Privacy Policy to understand our practices.</p>
        </section>

        <section>
          <h2>10. Governing Law</h2>
          <p>Any disputes arising from these Terms or related to our Service shall be subject to the exclusive jurisdiction of the state and federal courts located in Suffolk County, Massachusetts.</p>
        </section>

        <section>
          <h2>11. Contact Information</h2>
          <p>For any questions about these Terms, please contact us at genjidbproject@gmail.com.</p>
        </section>
      </div>
    </section>
  )
}