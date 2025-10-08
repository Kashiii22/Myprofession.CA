"use client";

import { useState, useRef, useEffect } from "react";
import { FaRobot, FaTimes } from "react-icons/fa";
import { useRouter } from "next/navigation";

export default function Chatbot() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const [messages, setMessages] = useState([
    { sender: "bot", text: "👋 Hi there! How can I help you today?" },
  ]);
  const [formData, setFormData] = useState({
    email: "",
    message: "",
    name: "",
    org: "",
  });
  const [currentStep, setCurrentStep] = useState("");
  const [showOptions, setShowOptions] = useState(true);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Reset chat each time user opens it
  const handleOpen = () => {
    setIsOpen(true);
    setFadeOut(false);
    setMessages([
      { sender: "bot", text: "👋 Hi there! How can I help you today?" },
    ]);
    setFormData({ email: "", message: "", name: "", org: "" });
    setCurrentStep("");
    setShowOptions(true);
  };

  const handleInputChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleUserSelection = (step) => {
    setMessages((prev) => [...prev, { sender: "user", text: step }]);
    setShowOptions(false);
    switch (step) {
      case "Have Query":
        setMessages((prev) => [
          ...prev,
          { sender: "bot", text: "Please enter your email and query below:" },
        ]);
        setCurrentStep("havequery");
        break;
      case "Feedback":
        setMessages((prev) => [
          ...prev,
          { sender: "bot", text: "Please enter your email and feedback below:" },
        ]);
        setCurrentStep("feedback");
        break;
      case "Content & Files":
        setMessages((prev) => [
          ...prev,
          { sender: "bot", text: "Here are the available content categories:" },
        ]);
        setCurrentStep("contentfiles");
        break;
      case "Offer for Us":
        setMessages((prev) => [
          ...prev,
          {
            sender: "bot",
            text: "Please fill your details and offer message below:",
          },
        ]);
        setCurrentStep("offer");
        break;
      default:
        break;
    }
  };

  const handleSubmit = (type) => {
    if (
      (type === "havequery" || type === "feedback") &&
      (!formData.email || !formData.message)
    )
      return;
    if (
      type === "offer" &&
      (!formData.name || !formData.email || !formData.message)
    )
      return;

    const userText =
      type === "offer"
        ? `${formData.name}: ${formData.message}`
        : formData.message;
    setMessages((prev) => [...prev, { sender: "user", text: userText }]);
    setMessages((prev) => [
      ...prev,
      { sender: "bot", text: "✅ Thank you! We will reach you shortly." },
    ]);
    setShowOptions(false);
    setCurrentStep("");
    setFormData({ email: "", message: "", name: "", org: "" });

    // Fade out, then close and reset
    setTimeout(() => setFadeOut(true), 1500);
    setTimeout(() => {
      setIsOpen(false);
      setFadeOut(false);
    }, 3000);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!isOpen ? (
        <button
          onClick={handleOpen}
          className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-4 rounded-full shadow-lg hover:scale-110 transition-all"
        >
          <FaRobot size={24} />
        </button>
      ) : (
        <div
          className={`bg-[#1a1a1e] border border-blue-700 rounded-2xl w-80 h-96 shadow-2xl flex flex-col transition-opacity duration-700 ${
            fadeOut ? "opacity-0" : "opacity-100"
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between bg-gradient-to-r from-blue-600 to-indigo-700 px-4 py-3 rounded-t-2xl">
            <span className="font-semibold text-white">Chat with CA Bot</span>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:scale-110 transition"
            >
              <FaTimes />
            </button>
          </div>

          {/* Chat Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`p-2 rounded-lg max-w-[75%] ${
                  msg.sender === "bot"
                    ? "bg-blue-700 text-white self-start"
                    : "bg-gray-700 text-gray-100 self-end ml-auto"
                }`}
              >
                {msg.text}
              </div>
            ))}

            {/* Bot options */}
            {showOptions &&
              currentStep === "" &&
              messages[messages.length - 1]?.sender === "bot" && (
                <div className="flex flex-col space-y-2 mt-2">
                  {[
                    "Have Query",
                    "Feedback",
                    "Content & Files",
                    "Offer for Us",
                  ].map((option) => (
                    <button
                      key={option}
                      onClick={() => handleUserSelection(option)}
                      className="bg-blue-700 hover:bg-blue-800 text-white py-2 px-3 rounded-lg shadow-md transition self-start"
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}

            {/* Forms */}
            {(currentStep === "havequery" || currentStep === "feedback") && (
              <div className="flex flex-col space-y-3 mt-2">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Your Email"
                  className="px-3 py-2 rounded-lg bg-gray-800 border border-gray-600 text-white focus:outline-none"
                />
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder={
                    currentStep === "havequery"
                      ? "Enter your query..."
                      : "Enter your feedback..."
                  }
                  className="px-3 py-2 rounded-lg bg-gray-800 border border-gray-600 text-white focus:outline-none resize-none"
                />
                <button
                  onClick={() => handleSubmit(currentStep)}
                  className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg shadow-md self-start"
                >
                  Submit
                </button>
              </div>
            )}

            {currentStep === "offer" && (
              <div className="flex flex-col space-y-3 mt-2">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Your Name"
                  className="px-3 py-2 rounded-lg bg-gray-800 border border-gray-600 text-white focus:outline-none"
                />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Your Email"
                  className="px-3 py-2 rounded-lg bg-gray-800 border border-gray-600 text-white focus:outline-none"
                />
                <input
                  type="text"
                  name="org"
                  value={formData.org}
                  onChange={handleInputChange}
                  placeholder="Organization (Optional)"
                  className="px-3 py-2 rounded-lg bg-gray-800 border border-gray-600 text-white focus:outline-none"
                />
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Your Offer / Message"
                  className="px-3 py-2 rounded-lg bg-gray-800 border border-gray-600 text-white focus:outline-none resize-none"
                />
                <button
                  onClick={() => handleSubmit("offer")}
                  className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg shadow-md self-start"
                >
                  Submit
                </button>
              </div>
            )}

            {/* Content & Files Options */}
            {currentStep === "contentfiles" && (
              <div className="flex flex-col space-y-2 mt-2">
                {[
                  { name: "Income Tax", path: "/category/income-tax" },
                  { name: "GST", path: "/category/gst" },
                  { name: "Accounting", path: "/category/accounting" },
                  { name: "Audit", path: "/category/audit" },
                ].map((item) => (
                  <button
                    key={item.name}
                    onClick={() => router.push(item.path)}
                    className="bg-blue-700 hover:bg-blue-800 text-white py-2 px-3 rounded-lg shadow-md transition self-start"
                  >
                    {item.name}
                  </button>
                ))}
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>
      )}
    </div>
  );
}
