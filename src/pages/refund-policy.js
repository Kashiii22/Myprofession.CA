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

export default function RefundPolicyPage() {
  return (
    <div className="bg-gray-900 text-gray-300">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 py-12 md:py-20">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
            Refund Policy
          </h1>
          <p className="text-lg text-gray-400">
            Last Updated: November 6, 2025
          </p>
        </div>

        <div className="prose prose-lg max-w-none prose-invert prose-h2:border-b prose-h2:border-gray-700 prose-a:text-blue-400 hover:prose-a:underline">
          <PolicySection title="1. Overview">
            <p>
              Thank you for choosing Myprofession.CA. We strive to provide the
              highest quality mentorship and content for the Chartered
              Accountant community. This policy outlines our terms regarding
              refunds for our services.
            </p>
            <p>
              By making a purchase on our Platform, you agree to this Refund
              Policy and our <a href="/terms-and-conditions">Terms & Conditions</a>.
            </p>
          </PolicySection>

          <PolicySection title="2. 1:1 Mentorship Sessions">
            <p>
              This section applies to all pre-booked mentorship and
              consultation sessions.
            </p>

            <h3>A. Cancellations by You (The User)</h3>
            <ul>
              <li>
                <strong>More than 24 hours notice:</strong> If you cancel your
                scheduled session at least 24 hours before the appointed time,
                you are eligible for a 100% refund.
              </li>
              <li>
                <strong>Less than 24 hours notice:</strong> Cancellations made
                within 24 hours of the scheduled session time are
                <strong>non-refundable</strong>. This is to compensate our
                Mentors for the time they have reserved for you.
              </li>
              <li>
                <strong>No-Show:</strong> If you fail to attend your
                scheduled session, you will not be eligible for a refund.
              </li>
            </ul>

            <h3>B. Cancellations by Mentor or Platform</h3>
            <ul>
              <li>
                <strong>Mentor No-Show:</strong> If your Mentor fails to
                attend a scheduled session, you are eligible for a 100% refund
                or a credit for a future session, at your option.
              </li>
              <li>
                <strong>Technical Failures:</strong> If a session is
                prevented from happening due to a verifiable technical failure
                on the Myprofession.CA platform (not related to your personal
                internet or hardware), we will issue a full refund.
              </li>
            </ul>
            
            <h3>C. Post-Session Dissatisfaction</h3>
            <p>
              Fees paid for mentorship sessions that have already been
              completed are <strong>non-refundable</strong>. We do not issue
              refunds based on your subjective satisfaction with the Mentor's
              advice, as this is an educational and guidance-based service.
            </p>
          </PolicySection>

          <PolicySection title="3. Digital Content & Courses">
            <p>
              Due to the digital nature of our products, all purchases for
              downloadable content, articles, files, and pre-recorded courses
              are <strong>final and non-refundable</strong>.
            </p>
            <p>
              We encourage you to review all course and content information
              before making a purchase.
            </p>
          </PolicySection>

          <PolicySection title="4. How to Request a Refund">
            <p>
              To request a refund, you must contact our support team within 7
              days of the scheduled (or missed) session.
            </p>
            <p>
              Please email{' '}
              <a href="mailto:support@myprofession.ca">
                support@myprofession.ca
              </a>{' '}
              with the following information:
            </p>
            <ul>
              <li>Your full name and registered phone number.</li>
              <li>The Razorpay order ID or transaction details.</li>
              <li>The name of the Mentor and the scheduled session time.</li>
              <li>A clear reason for the refund request (e.g., "Mentor did not attend").</li>
            </ul>
          </PolicySection>

          <PolicySection title="5. Refund Processing">
            <p>
              Once your refund request is received and approved, we will
              initiate a refund to your original method of payment via
              Razorpay.
            </p> 
            {/* ✅ --- FIX was here: Changed </Next> to </p> --- */}
            <p>
              Please allow <strong>5-10 business days</strong> for the refund
              to be processed and to reflect in your account.
            </p>
          </PolicySection>

          <PolicySection title="6. Contact Us">
            <p>
              If you have any questions about this Refund Policy, please
              contact us at:
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