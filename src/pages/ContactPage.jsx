import React, { useState } from "react";
import SEOHead from "../components/SEOHead";
import Breadcrumbs from "../components/Breadcrumbs";
import Reveal from "../components/Reveal";
import { Mail, Phone, MapPin, Send, CheckCircle2 } from "lucide-react";

export default function ContactPage({ onNavigate }) {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4">
      <SEOHead pageKey="Contact" />

      <Breadcrumbs currentPage="Contact" onNavigate={onNavigate} />

      <Reveal as="div" className="border-b border-outline-variant pb-6 space-y-2">
        <span className="font-label-caps text-xs text-[#D4AF37] font-extrabold uppercase tracking-widest block">
          CONTACT & NEWSROOM
        </span>
        <h1 className="font-display-lg text-3xl md:text-5xl font-bold text-[#0C133D]">
          Get in Touch
        </h1>
        <p className="text-base text-on-surface-variant leading-relaxed">
          Have a news tip, regulatory inquiry, research pitch, or press release? Connect directly with the Token Times newsroom.
        </p>
      </Reveal>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Contact Info */}
        <div className="lg:col-span-5 space-y-4">
          <Reveal as="div" className="bg-surface-container-lowest border border-outline-variant p-6 rounded-xl space-y-4">
            <h3 className="text-lg font-bold text-[#0C133D] border-b border-[#D4AF37]/40 pb-2">
              Newsroom Contacts
            </h3>

            <div className="space-y-3 text-xs md:text-sm text-on-surface-variant">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#D4AF37]" />
                <div>
                  <p className="font-semibold text-[#0C133D]">Editorial Tips</p>
                  <p className="text-xs text-on-surface-variant">editor@tokenstimes.com</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-[#D4AF37]" />
                <div>
                  <p className="font-semibold text-[#0C133D]">Press & Media Desk</p>
                  <p className="text-xs text-on-surface-variant">+92 (21) 111-TOKENS (865367)</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-[#D4AF37]" />
                <div>
                  <p className="font-semibold text-[#0C133D]">Headquarters</p>
                  <p className="text-xs text-on-surface-variant">Financial District, Islamabad / Karachi, Pakistan</p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Form */}
        <div className="lg:col-span-7">
          <Reveal as="div" className="bg-surface-container-lowest border border-outline-variant p-6 rounded-xl space-y-4">
            <h3 className="text-lg font-bold text-[#0C133D]">Send a Message</h3>

            {submitted ? (
              <div className="bg-[#D4AF37]/20 border border-[#D4AF37]/40 rounded-xl p-4 flex items-center gap-3 text-xs text-[#0C133D]">
                <CheckCircle2 className="w-5 h-5 text-[#D4AF37] flex-shrink-0" />
                <div>
                  <p className="font-semibold">Message Received</p>
                  <p className="text-on-surface-variant text-[11px]">Thank you! Our newsroom team will review your inquiry shortly.</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3 text-xs">
                <div>
                  <label htmlFor="contact-fullname" className="block font-semibold text-[#0C133D] mb-1">Full Name</label>
                  <input id="contact-fullname" required type="text" placeholder="Your name..." className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded-lg focus:outline-none focus:border-[#D4AF37]" />
                </div>
                <div>
                  <label htmlFor="contact-email" className="block font-semibold text-[#0C133D] mb-1">Email Address</label>
                  <input id="contact-email" required type="email" placeholder="Your email..." className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded-lg focus:outline-none focus:border-[#D4AF37]" />
                </div>
                <div>
                  <label htmlFor="contact-subject" className="block font-semibold text-[#0C133D] mb-1">Subject</label>
                  <input id="contact-subject" required type="text" placeholder="News Tip / Media Inquiry..." className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded-lg focus:outline-none focus:border-[#D4AF37]" />
                </div>
                <div>
                  <label htmlFor="contact-message" className="block font-semibold text-[#0C133D] mb-1">Message</label>
                  <textarea id="contact-message" required rows={4} placeholder="Details of your message..." className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded-lg focus:outline-none focus:border-[#D4AF37]" />
                </div>
                <button type="submit" className="w-full py-2.5 bg-[#0C133D] text-[#D4AF37] font-bold rounded-lg hover:bg-[#D4AF37] hover:text-[#0C133D] transition-colors flex items-center justify-center gap-2">
                  <span>Submit Message</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
          </Reveal>
        </div>
      </div>
    </div>
  );
}
