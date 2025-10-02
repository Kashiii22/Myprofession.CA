"use client";

import { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Image from "next/image";
import AOS from "aos";
import "aos/dist/aos.css";

export default function AboutUs() {
  useEffect(() => {
    AOS.init({ duration: 1200, once: true });
  }, []);

  const highlights = [
    {
      title: "Trusted by Professionals",
      description: "Over 10,000+ professionals and businesses trust MyProfession.CA to grow their careers and business.",
      icon: "/icons/trusted.svg",
    },
    {
      title: "Expert Guidance",
      description: "Career consultations, business support, and mentorship programs for every stage of your professional journey.",
      icon: "/icons/guidance.svg",
    },
    {
      title: "Innovative Platform",
      description: "Cutting-edge tools and resources to help you make informed decisions and stay ahead in a competitive world.",
      icon: "/icons/innovation.svg",
    },
    {
      title: "Global Networking",
      description: "Connect with like-minded professionals, mentors, and businesses to expand your opportunities.",
      icon: "/icons/network.svg",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-gray-200">
      <Header />

      <main className="flex-grow px-6 py-16 md:px-20 md:py-24">
        {/* Hero Section */}
        <section className="text-center max-w-3xl mx-auto mb-20" data-aos="fade-up">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
            About MyProfession.CA
          </h1>
          <p className="text-lg md:text-xl text-gray-300">
            Empowering professionals and businesses with the right opportunities, tools, and guidance to grow and succeed in their careers.
          </p>
        </section>

        {/* What We Do */}
        <section className="max-w-5xl mx-auto mb-20 grid md:grid-cols-2 gap-12 items-center">
          <div data-aos="fade-right">
            <h2 className="text-3xl font-semibold mb-4 text-white">What We Do</h2>
            <p className="text-gray-300 mb-4">
              At <strong>MyProfession.CA</strong>, we connect professionals with opportunities tailored to their skills and ambitions. 
              We provide resources, tools, and expert guidance to help you advance in your career or grow your business.
            </p>
            <p className="text-gray-300 mb-4">
              From career consultations to business development support, we ensure every professional has access to the network and tools needed to thrive in today’s competitive world.
            </p>
            <p className="text-gray-300">
              Our platform fosters learning, networking, and mentorship opportunities, helping you make informed career decisions.
            </p>
          </div>
          <div className="flex justify-center" data-aos="fade-left">
            <Image 
              src="/images/what-we-do.jpg" 
              alt="What we do" 
              width={500} 
              height={350} 
              className="rounded-lg shadow-xl"
            />
          </div>
        </section>

        {/* Founder Section */}
        <section className="max-w-5xl mx-auto mb-20 grid md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1 flex justify-center" data-aos="zoom-in">
            <Image 
              src="/images/founder.jpg" 
              alt="Mr. Abhishek Bhatia" 
              width={350} 
              height={350} 
              className="rounded-full shadow-xl"
            />
          </div>
          <div className="order-1 md:order-2" data-aos="fade-left">
            <h2 className="text-3xl font-semibold mb-4 text-white">Our Founder</h2>
            <p className="text-gray-300 mb-4">
              MyProfession.CA was founded by <strong>Mr. Abhishek Bhatia</strong>, a visionary entrepreneur passionate about empowering professionals. 
              With years of experience in career development and business consulting, he envisioned a platform bridging talent and opportunity.
            </p>
            <p className="text-gray-300 mb-4">
              Under his guidance, MyProfession.CA continues to innovate and provide meaningful resources, connecting individuals and businesses to achieve their full potential.
            </p>
          </div>
        </section>

        {/* Highlights / Innovative Section */}
        <section className="max-w-5xl mx-auto mb-20">
          <h2 className="text-3xl font-semibold mb-12 text-white text-center" data-aos="fade-up">Why Choose Us</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {highlights.map((item, idx) => (
              <div 
                key={idx} 
                className="bg-gray-800 p-6 rounded-xl shadow-lg flex flex-col items-center text-center hover:scale-105 transition-transform duration-300"
                data-aos="fade-up" 
                data-aos-delay={idx * 200}
              >
                <Image src={item.icon} alt={item.title} width={60} height={60} className="mb-4" />
                <h3 className="text-xl font-semibold mb-2 text-white">{item.title}</h3>
                <p className="text-gray-300">{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Our Mission & Vision */}
        <section className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 text-center">
          <div className="bg-gray-800 p-8 rounded-lg shadow-lg" data-aos="fade-up">
            <h3 className="text-2xl font-semibold mb-4 text-white">Our Mission</h3>
            <p className="text-gray-300">
              To empower professionals and businesses with tools, guidance, and opportunities that foster growth, innovation, and success.
            </p>
          </div>
          <div className="bg-gray-800 p-8 rounded-lg shadow-lg" data-aos="fade-up" data-aos-delay="200">
            <h3 className="text-2xl font-semibold mb-4 text-white">Our Vision</h3>
            <p className="text-gray-300">
              To become the leading platform where talent meets opportunity, helping professionals realize their potential and businesses thrive in a dynamic world.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
