"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";

// A simple reusable component for policy sections
// We've removed the specific text colors to let 'prose-invert' handle styling.
const PolicySection = ({ title, children }) => (
  <section className="mb-8">
    <h2 className="text-2xl font-bold mb-4">{title}</h2>
    <div className="space-y-4">{children}</div>
  </section>
);

export default function PrivacyPolicyPage() {
  return (
    // Switched to dark theme
    <div className="bg-gray-900 text-gray-300">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 py-12 md:py-20">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
            Privacy Policy
          </h1>
          <p className="text-lg text-gray-400">
            Last Updated: November 6, 2025
          </p>
        </div>

        {/* Added 'prose-invert' to style all text for a dark background.
          Adjusted link and border colors to match the dark theme.
        */}
        <div className="prose prose-lg max-w-none prose-invert prose-h2:border-b prose-h2:border-gray-700 prose-a:text-blue-400 hover:prose-a:underline">
          <PolicySection title="1. Introduction">
            <p>
              Welcome to Myprofession.CA ("we," "our," or "us"). We are committed to
              protecting your privacy. This Privacy Policy explains how we
              collect, use, disclose, and safeguard your information when you
              visit our website, use our services, or engage in our mentorship
              programs.
            </p>
            <p>
              By using our platform, you agree to the collection and use of
              information in accordance with this policy.
            </p>
          </PolicySection>

          <PolicySection title="2. Information We Collect">
            <p>We may collect information about you in several ways:</p>
            
            <h3>A. Personal Data You Provide to Us</h3>
            <ul>
              <li>
                <strong>User Account Information:</strong> When you register as a
                user, we collect your full name, phone number, and a hashed
                password. If you sign up using Google, we may receive your name,
                email address, and profile picture.
              </li>
              <li>
                <strong>Expert (Mentor) Profile Information:</strong> If you
                register as an expert, we require a valid user account (and its
                token) and may collect additional professional information,
                including your qualifications, areas of expertise, and other
                details to build your public profile.
              </li>
              <li>
                <strong>Communication Data:</strong> We may collect information
                you provide when you participate in Q&A sections, contact us for
                support, or communicate with mentors.
              </li>
            </ul>

            <h3>B. Payment Information</h3>
            <p>
              When you make a purchase (such as for a consultation or course),
              we use a third-party payment processor, **Razorpay**. We do not
              store or collect your full payment card details. This information
              is provided directly to Razorpay, whose use of your personal
              information is governed by their privacy policy.
            </p>

            <h3>C. Data We Collect Automatically</h3>
            <ul>
              <li>
                <strong>Cookies and Usage Data:</strong> We use cookies to manage
                your session and keep you logged in (e.g., your "token"). We may
                also collect usage data like your IP address, browser type, and
                pages visited to improve our service.
              </li>
            </ul>
          </PolicySection>

          <PolicySection title="3. How We Use Your Information">
            <p>
              We use the information we collect to:
            </p>
            <ul>
              <li>Create and manage your account and secure your access.</li>
              <li>
                Facilitate the core services, including connecting mentors with
                users for 1:1 consultations.
              </li>
              <li>
                Display your profile to other users (if you are a mentor).
              </li>
              <li>
                Provide, maintain, and improve our content, courses, and
                services.
              </li>
              <li>Process your payments through Razorpay.</li>
              <li>
                Communicate with you, including sending service updates or
                responding to your inquiries.
              </li>
            </ul>
          </PolicySection>

          <PolicySection title="4. How We Share Your Information">
            <p>We do not sell your personal data. We may share information with:</p>
            <ul>
              <li>
                <strong>Mentors and Users:</strong> To facilitate mentorship,
                we share necessary profile information between the mentor and
                the user who books a session.
              </li>
              <li>
                <strong>Service Providers:</strong> With third-party vendors
                that perform services for us, such as payment processing
                (Razorpay), cloud hosting (DigitalOcean), and file storage
                (Cloudinary).
              </li>
              <li>
                <strong>Legal Requirements:</strong> We may disclose your
                information if required to do so by law or in response to valid
                requests by public authorities.
              </li>
            </ul>
          </PolicySection>

          <PolicySection title="5. Data Security">
            <p>
              We use administrative, technical, and physical security measures
              to help protect your personal information. While we have taken
              reasonable steps to secure the data you provide to us, please be
              aware that no security system is impenetrable.
            </p>
          </PolicySection>

          <PolicySection title="6. Your Data Rights">
            <p>
              In accordance with India's Digital Personal Data Protection
              (DPDP) Act, 2023, you have rights over your personal data. You
              may review, change, or delete the information in your account by
              logging into your profile settings or by contacting us.
            </p> 
            {/* ✅ --- FIX was here: Changed </V> to </p> --- */}
          </PolicySection>

          <PolicySection title="7. Children's Privacy">
            <p>
              Our services are not directed to anyone under the age of 18. We
              do not knowingly collect personally identifiable information from
              children.
            </p>
          </PolicySection>

          <PolicySection title="8. Changes to This Policy">
            <p>
              We may update this Privacy Policy from time to time. We will
              notify you of any changes by posting the new policy on this page
              and updating the "Last Updated" date.
            </p>
          </PolicySection>

          <PolicySection title="9. Contact Us">
            <p>
              If you have any questions or concerns about this Privacy Policy,
              please contact us at:
            </p>
            <p>
              <strong>Email:</strong> support@myprofession.ca
            </p>
          </PolicySection>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}