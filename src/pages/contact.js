import React, { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { motion } from "framer-motion";
import { FaInstagram, FaYoutube, FaEnvelope, FaRocket, FaGraduationCap, FaUsers, FaChalkboardTeacher } from "react-icons/fa";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const BENEFITS = [
  { icon: <FaRocket />, title: "Accelerate Growth", desc: "Fast-track your professional journey with expert guidance and structured learning." },
  { icon: <FaGraduationCap />, title: "Learn From Experts", desc: "Access courses, workshops, and mentorship from industry leaders." },
  { icon: <FaUsers />, title: "Connect With Peers", desc: "Build your network with like-minded professionals and grow together." },
  { icon: <FaChalkboardTeacher />, title: "Practical Learning", desc: "Hands-on knowledge, real-world scenarios, and actionable insights." },
];

export default function ContactUs() {
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    setSubmitted(true);
    setFormData({ name: "", email: "", phone: "", message: "" });
  };

  return (
    <div className="min-h-screen bg-[#0e0e10] text-gray-200 font-sans">
      <Header />

      {/* HERO: Next is You */}
      <section className="relative py-24 px-6 text-center bg-gradient-to-b from-black via-gray-900 to-black overflow-hidden">
        <motion.h1 
          className="text-5xl md:text-6xl font-extrabold text-white mb-6"
          initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}
        >
          Next is <span className="text-blue-500">You</span>
        </motion.h1>
        <motion.p 
          className="text-gray-300 max-w-3xl mx-auto text-lg md:text-xl mb-16"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.2 }}
        >
          Take the first step to transform your career with MyProfession.CA. Learn, connect, and grow with our tailored mentorship and courses.
        </motion.p>

        <div className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {BENEFITS.map((b, i) => (
            <motion.div 
              key={i}
              className="bg-gray-900/70 p-6 rounded-3xl shadow-2xl text-center hover:scale-105 hover:shadow-blue-500/50 transition-transform duration-300"
              data-aos="fade-up"
              data-aos-delay={i * 150}
              whileHover={{ scale: 1.08 }}
            >
              <div className="text-5xl mb-4 text-blue-500">{b.icon}</div>
              <h3 className="text-xl font-bold mb-2">{b.title}</h3>
              <p className="text-gray-300">{b.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* GET IN TOUCH FORM */}
      <section className="py-20 px-6 md:px-20 border-t border-gray-800">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-start">
          <motion.div 
            className="bg-gray-900/70 p-12 rounded-3xl shadow-2xl"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
          >
            <h2 className="text-3xl font-bold mb-6 text-white">Get in Touch</h2>
            {submitted && <p className="text-green-400 mb-4">Thank you! We'll get back to you shortly.</p>}
            <form onSubmit={handleSubmit} className="space-y-6">
              {["name","email","phone"].map((field,i)=>(
                <div key={i} className="relative">
                  <input 
                    type={field==="email"?"email":field==="phone"?"tel":"text"} 
                    name={field} placeholder=" " value={formData[field]} onChange={handleChange}
                    className="w-full p-4 rounded-xl bg-gray-800 border border-gray-700 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 peer transition"
                    required={field!=="phone"}
                  />
                  <label className="absolute left-4 top-4 text-gray-400 text-sm peer-placeholder-shown:top-4 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-sm peer-focus:-top-2 peer-focus:text-blue-500 peer-focus:text-xs transition-all">
                    {field==="name"?"Full Name":field==="email"?"Email":"Phone Number"}
                  </label>
                </div>
              ))}
              <div className="relative">
                <textarea 
                  name="message" placeholder=" " rows="5" value={formData.message} onChange={handleChange}
                  className="w-full p-4 rounded-xl bg-gray-800 border border-gray-700 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 peer transition"
                  required
                />
                <label className="absolute left-4 top-4 text-gray-400 text-sm peer-placeholder-shown:top-4 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-sm peer-focus:-top-2 peer-focus:text-blue-500 peer-focus:text-xs transition-all">
                  Your Message
                </label>
              </div>
              <button 
                type="submit"
                className="w-full py-4 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg shadow-lg hover:shadow-blue-500/50 hover:scale-105 transition transform"
              >
                Send Message
              </button>
            </form>
          </motion.div>

          <motion.div 
            className="flex flex-col gap-8"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <h2 className="text-3xl font-bold mb-6 text-white">Next Steps for You</h2>
            <ol className="list-decimal list-inside space-y-4 text-gray-300">
              <li>Fill out the contact form with your details.</li>
              <li>Our team will reach out to understand your goals and needs.</li>
              <li>We’ll schedule a personalized session to get you started.</li>
              <li>Begin your journey with expert guidance and resources tailored to your career.</li>
            </ol>
          </motion.div>
        </div>
      </section>

      {/* SOCIAL LINKS */}
      <section className="py-12 px-6 md:px-20 border-t border-gray-800">
        <h2 className="text-3xl font-bold text-center mb-8" data-aos="fade-up">Connect With Us</h2>
        <div className="flex justify-center gap-8 text-3xl">
          <motion.a href="https://instagram.com" target="_blank" className="hover:text-pink-500 transition" whileHover={{ scale: 1.2 }}>
            <FaInstagram />
          </motion.a>
          <motion.a href="https://youtube.com" target="_blank" className="hover:text-red-600 transition" whileHover={{ scale: 1.2 }}>
            <FaYoutube />
          </motion.a>
          <motion.a href="mailto:contact@myprofession.ca" className="hover:text-blue-400 transition" whileHover={{ scale: 1.2 }}>
            <FaEnvelope />
          </motion.a>
        </div>
      </section>

      <Footer />
    </div>
  );
}
