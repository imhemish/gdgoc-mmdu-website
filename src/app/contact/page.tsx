"use client";
import React, { useState, FormEvent } from "react";
import { Send, CheckCircle, AlertTriangle } from "lucide-react";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      setSubmitStatus("success");

      setFormData({
        name: "",
        email: "",
        message: "",
      });
    } catch (error) {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="relative bg-gradient-to-b from-[#0a0a0a] to-[#1e1e1e] min-h-screen w-full py-12 sm:py-16 lg:py-20 overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-[0.02] bg-[size:40px_40px] bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)]"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-2xl relative z-10">
        <div className="bg-neutral-900/80 backdrop-blur-lg border border-gray-800/50 shadow-2xl p-8 sm:p-10 lg:p-12 rounded-3xl">
          <div className="text-center mb-8 sm:mb-10">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-200 to-gray-500 mb-3">
              Get In Touch
            </h1>
            <p className="text-gray-400 max-w-xl mx-auto">
              Have a question or want to collaborate? Fill out the form below
              and we'll get back to you as soon as possible.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              {/* Name Input */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full bg-neutral-800/50 border border-gray-700/50 rounded-xl px-4 py-3 text-white 
                      focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300
                      placeholder-gray-500"
                    placeholder="Your Full Name"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                  </span>
                </div>
              </div>

              {/* Email Input */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full bg-neutral-800/50 border border-gray-700/50 rounded-xl px-4 py-3 text-white 
                      focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300
                      placeholder-gray-500"
                    placeholder="your.email@example.com"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                      <polyline points="22,6 12,13 2,6"></polyline>
                    </svg>
                  </span>
                </div>
              </div>

              {/* Message Textarea */}
              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full bg-neutral-800/50 border border-gray-700/50 rounded-xl px-4 py-3 text-white 
                    focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300
                    placeholder-gray-500"
                  placeholder="Share your thoughts..."
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="w-full text-center mt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`
                  group relative w-full sm:w-auto px-8 py-3 rounded-full transition-all duration-300
                  ${
                    isSubmitting
                      ? "bg-gray-700 cursor-not-allowed"
                      : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                  }
                  flex items-center justify-center gap-3
                `}
              >
                {isSubmitting ? "Sending..." : "Send Message"}
                <Send
                  size={20}
                  className={`
                    transition-transform duration-300
                    ${isSubmitting ? "opacity-50" : "group-hover:translate-x-1"}
                  `}
                />
              </button>
            </div>

            {/* Status Messages */}
            {submitStatus === "success" && (
              <div className="flex items-center justify-center gap-3 bg-green-600/10 border border-green-500/30 text-green-400 px-4 py-3 rounded-xl text-center mt-4">
                <CheckCircle size={24} />
                <span>
                  Message sent successfully! We'll get back to you soon.
                </span>
              </div>
            )}

            {submitStatus === "error" && (
              <div className="flex items-center justify-center gap-3 bg-red-600/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl text-center mt-4">
                <AlertTriangle size={24} />
                <span>Failed to send message. Please try again later.</span>
              </div>
            )}
          </form>
        </div>
      </div>
    </main>
  );
};

export default Contact;
