"use client";
import { useState, useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import AuthModal from "@/components/AuthModal";

export default function LoginPage() {
  const [showModal, setShowModal] = useState(true);

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black to-gray-900 text-white">
      {showModal && <AuthModal onClose={() => setShowModal(false)} />}
    </div>
  );
}
