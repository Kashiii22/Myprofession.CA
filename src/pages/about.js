import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";

// Sample Services
const SERVICES = [
  { icon: "💬", title: "Mentorship Programs", desc: "Connect directly with CA experts for personalized guidance." },
  { icon: "📚", title: "GST & Income Tax Guidance", desc: "Practical knowledge and up-to-date tax information." },
  { icon: "📰", title: "Articles & Tutorials", desc: "Stay ahead with the latest CA insights and trends." },
  { icon: "🎓", title: "Courses & Workshops", desc: "Learn from industry experts with hands-on sessions." },
  { icon: "❓", title: "Queries & Support", desc: "Get your questions answered quickly by professionals." },
];

// Upcoming Workshops
const WORKSHOPS = [
  { title: "GST Filing Masterclass", date: "15th Oct 2025", desc: "Hands-on workshop for GST filing." },
  { title: "Income Tax Planning 101", date: "25th Oct 2025", desc: "Basics to advanced tax planning." },
  { title: "Audit Essentials", date: "1st Nov 2025", desc: "Everything about audits in practice." },
];

// How it Works Steps
const STEPS = [
  { step: "1", title: "Sign Up", desc: "Create your free account in minutes." },
  { step: "2", title: "Select Course/Content", desc: "Browse our wide range of CA resources." },
  { step: "3", title: "Connect / Learn", desc: "Attend sessions or learn at your own pace." },
  { step: "4", title: "Achieve Goal", desc: "Apply knowledge & grow your CA career." },
];

// FAQ
const FAQS = [
  { q: "Who can use MyProfession.CA?", a: "Any aspiring or working CA professional seeking guidance, courses, and mentorship." },
  { q: "How can I connect with mentors?", a: "Simply navigate to the mentorship section and book a 1:1 session." },
  { q: "Are courses and materials free?", a: "Some are free, others are premium – check the specific course for details." },
];

export default function AboutUs() {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  return (
    <div className="min-h-screen bg-[#0e0e10] text-gray-200 font-sans">
      <Header />

      {/* HERO */}
      <section className="relative h-[60vh] flex flex-col items-center justify-center text-center px-6 bg-gradient-to-b from-black via-gray-900 to-black overflow-hidden">
        <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight">
          Empowering <span className="text-blue-500">Professionals</span> <br /> With Expert Guidance
        </h1>
        <p className="mt-6 text-gray-300 text-lg md:text-xl max-w-2xl mx-auto">
          Your one-stop platform for mentorship, courses, and practical knowledge in taxation, audit, and accounting.
        </p>
      </section>

      {/* VIDEO SECTION */}
      <section className="py-20 px-6 md:px-20 border-t border-gray-800 bg-gradient-to-br from-[#111216] to-[#1b1f25]">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-white" data-aos="fade-up">
            Watch how MyProfession.CA can transform your career
          </h2>
          <div
            className="relative w-full h-64 md:h-96 rounded-2xl overflow-hidden shadow-2xl cursor-pointer group"
            data-aos="zoom-in"
          >
            {/* Placeholder Video Thumbnail */}
            <img
              src="/video-thumbnail.jpg"
              alt="Platform Overview"
              className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 bg-blue-600/80 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="white"
                  viewBox="0 0 24 24"
                  className="w-10 h-10 ml-1"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES - Interactive */}
      <section className="py-20 px-6 md:px-20 border-t border-gray-800">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12" data-aos="fade-up">What We Offer</h2>
        <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
          {SERVICES.map((service, i) => (
            <motion.div
              key={i}
              className="bg-gray-900/70 p-6 rounded-2xl shadow-lg text-center hover:scale-105 hover:shadow-2xl transition-transform duration-300"
              whileHover={{ rotateY: 5, scale: 1.05 }}
              data-aos="fade-up"
              data-aos-delay={i * 150}
            >
              <div className="text-5xl mb-4">{service.icon}</div>
              <h3 className="text-xl font-semibold text-white">{service.title}</h3>
              <p className="text-gray-300 mt-2">{service.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* UPCOMING WORKSHOPS */}
     

      {/* HOW IT WORKS */}
      <section className="py-20 px-6 md:px-20 border-t border-gray-800">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12" data-aos="fade-up">How It Works</h2>
        <div className="grid md:grid-cols-4 gap-10 max-w-6xl mx-auto">
          {STEPS.map((step, i) => (
            <motion.div
              key={i}
              className="bg-gray-900/70 p-6 rounded-2xl shadow-lg text-center hover:scale-105 transition-transform duration-300"
              whileHover={{ y: -5 }}
              data-aos="fade-up"
              data-aos-delay={i * 150}
            >
              <div className="text-4xl font-bold text-blue-500 mb-3">{step.step}</div>
              <h3 className="text-xl font-semibold text-white">{step.title}</h3>
              <p className="text-gray-300 mt-2">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-6 md:px-20 border-t border-gray-800">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12" data-aos="fade-up">Frequently Asked Questions</h2>
        <div className="max-w-4xl mx-auto space-y-6">
          {FAQS.map((faq, i) => (
            <details key={i} className="bg-gray-900/70 p-5 rounded-2xl shadow-lg cursor-pointer" data-aos="fade-up" data-aos-delay={i*100}>
              <summary className="text-lg font-semibold">{faq.q}</summary>
              <p className="mt-2 text-gray-300">{faq.a}</p>
            </details>
          ))}
        </div>
      </section>

     {/* CTA */}
<section className="py-20 px-6 md:px-20 bg-gradient-to-r from-blue-800 to-indigo-900 text-center rounded-t-3xl mt-20">
  <h2 className="text-3xl md:text-4xl font-bold text-white mb-6" data-aos="fade-up">
    Ready to elevate your CA journey?
  </h2>
  <p className="text-white/90 mb-8" data-aos="fade-up" data-aos-delay={150}>
    Join thousands of learners and start your transformation today.
  </p>
 <Link href="/" passHref>
    <button className="px-8 py-4 rounded-full bg-white text-blue-900 font-semibold text-lg shadow-lg hover:scale-105 transition transform">
      Get Started
    </button>
  </Link>
</section>


      <Footer />
    </div>
  );
}
