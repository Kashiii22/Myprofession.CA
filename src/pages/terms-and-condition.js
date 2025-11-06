"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";

// A simple reusable component for policy sections
const PolicySection = ({ title, children }) => (
  <section className="mb-8">
    <h2 className="text-2xl font-bold mb-4">{title}</h2>
    <div className="space-y-4">{children}</div>
  </section>
);

export default function TermsAndConditionsPage() {
  return (
    <div className="bg-gray-900 text-gray-300">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 py-12 md:py-20">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
            Terms and Conditions
          </h1>
          <p className="text-lg text-gray-400">
            Last Updated: November 6, 2025
          </p>
        </div>

        <div className="prose prose-lg max-w-none prose-invert prose-h2:border-b prose-h2:border-gray-700 prose-a:text-blue-400 hover:prose-a:underline">
          <PolicySection title="1. Acceptance of Terms">
            <p>
              Welcome to Myprofession.CA ("we," "our," or "us"). These Terms and
              Conditions ("Terms") govern your use of our website, platform, and
              services (collectively, the "Platform").
            </p>
            <p>
              By accessing or using our Platform, you agree to be bound by these
              Terms and our <a href="/privacy-policy">Privacy Policy</a>. If you do not agree
              to these Terms, you must not use our Platform.
            </p>
          </PolicySection>

          <PolicySection title="2. User Accounts and Registration">
            <p>
              To access certain features, like booking a consultation or viewing
              locked content, you must register for an account. You agree to:
            </p>
            <ul>
              <li>Provide accurate, current, and complete information.</li>
              <li>
                Maintain the security of your password and accept all risks of
                unauthorized access to your account.
              </li>
              <li>
                Be at least 18 years old or the age of majority in your
                jurisdiction.
              </li>
            </ul>
            <p>
              <strong>Expert (Mentor) Accounts:</strong> Mentors are also Users
              of the Platform and are subject to these Terms. To register as an
              Expert, you must be a logged-in user and may be required to
              provide additional verification of your qualifications and
              expertise.
            </p>
          </PolicySection>

          <PolicySection title="3. Our Services">
            <h3>A. Mentorship Platform</h3>
            <p>
              Myprofession.CA is a platform that facilitates connections
              between users and independent Chartered Accountant professionals
              ("Mentors") for mentorship and consultation services.
            </p>
            <p>
              <strong>Mentors are independent contractors, not employees</strong> or agents of Myprofession.CA. We are not
              responsible for the advice, conduct, or any representations made
              by Mentors.
            </p>
            <p>
              <strong>Disclaimer:</strong> Advice and information provided by
              Mentors are for **informational and educational purposes only**.
              It is not, and should not be considered, a substitute for
              professional legal, financial, tax, or investment advice. You
              should always consult with a qualified professional for advice
              tailored to your specific situation.
            </p>

            <h3>B. Content and Courses</h3>
            <p>
              We provide articles, files, Q&A sections, and sell courses. This
              content is for informational purposes only. We grant you a
              limited, non-exclusive, non-transferable license to access and
              view this content for your personal, non-commercial use, subject
              to these Terms.
            </p>
          </PolicySection>

          <PolicySection title="4. Payments, Fees, and Refunds">
            <h3>A. Payments</h3>
            <p>
              You agree to pay all fees for services you purchase, such as
              consultations or courses. All payments are processed through our
              third-party payment provider, **Razorpay**. By making a payment,
              you agree to be bound by Razorpay's Terms of Service and Privacy
              Policy.
            </p>
            <h3>B. Refunds</h3>
            <p>
              Our policy regarding cancellations and refunds is detailed in our
              {' '}
              <a href="/refund-policy">Refund Policy</a>.
            </p>
          </PolicySection>

          <PolicySection title="5. User Conduct and Prohibited Activities">
            <p>You agree not to use the Platform to:</p>
            <ul>
              <li>
                Violate any local, state, national, or international law.
              </li>
              <li>
                Harass, abuse, or harm another person, including Mentors and
                other users.
              </li>
              <li>
                Circumvent any content-gating or paywall features (e..g.,
                accessing locked content without logging in or paying).
              </li>
              <li>
                Reproduce, duplicate, copy, sell, or resell any part of our
                service or content without our express written permission.
              </li>
              <li>
                Upload any viruses, malicious code, or other harmful software.
              </li>
            </ul>
          </PolicySection>

          <PolicySection title="6. Intellectual Property">
            <p>
              The Platform and its original content (excluding content provided
              by Mentors or users), features, and functionality are and will
              remain the exclusive property of Myprofession.CA and its
              licensors. Our trademarks may not be used in connection with any
              product or service without our prior written consent.
            </p>
          </PolicySection>

          <PolicySection title="7. Termination">
            <p>
              We may terminate or suspend your account and bar access to the
              Platform immediately, without prior notice or liability, at our
              sole discretion, for any reason whatsoever, including but not
              limited to a breach of these Terms.
            </p>
          </PolicySection>

          <PolicySection title="8. Disclaimer of Warranties">
            <p>
              The Platform is provided on an "AS IS" and "AS AVAILABLE" basis.
              We make no warranties, express or implied, that the Platform will
              be uninterrupted, secure, or error-free. We explicitly disclaim
              any warranties of merchantability, fitness for a particular
              purpose, and non-infringement.
            </p>
          </PolicySection>

          <PolicySection title="9. Limitation of Liability">
            <p>
              <strong>
                In no event shall Myprofession.CA, its directors, employees, or
                partners, be liable for any indirect, incidental, special, or
                consequential damages arising from your use of the Platform or
                from any advice, guidance, or information provided by a Mentor.
                Your sole remedy for dissatisfaction with the platform is to
                stop using it.
              </strong>
            </p>
          </PolicySection>

          <PolicySection title="10. Indemnification">
            <p>
              You agree to defend, indemnify, and hold harmless Myprofession.CA
              and its licensees and licensors, and their employees,
              contractors, agents, officers, and directors, from and against
              any and all claims, damages, obligations, losses, liabilities,
              costs or debt, and expenses (including but not limited to
              attorney's fees), resulting from or arising out of a) your use
              and access of the Platform, or b) a breach of these Terms.
            </p>
          </PolicySection>

          <PolicySection title="11. Governing Law">
            <p>
              These Terms shall be governed and construed in accordance with
              the laws of India, without regard to its conflict of law
_            provisions.
            </p>
          </PolicySection>

          <PolicySection title="12. Changes to These Terms">
            <p>
              We reserve the right, at our sole discretion, to modify or
              replace these Terms at any time. We will provide notice of
              changes by updating the "Last Updated" date at the top of this
              page.
            </p>
          </PolicySection>

          <PolicySection title="13. Contact Us">
            <p>
              If you have any questions about these Terms, please contact us
              at:
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