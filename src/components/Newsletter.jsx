import React, { useState } from "react";
import Reveal from "./Reveal";

export default function Newsletter() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <Reveal
      as="section"
      className="mb-8 bg-surface-container-lowest border border-outline-variant border-t-4 border-t-[#D4AF37] p-8 md:p-12 text-center rounded-xl shadow-sm"
    >
      <h2 className="font-display-lg text-2xl md:text-4xl font-bold text-[#0C133D] mb-3">Intelligence Delivered.</h2>
      <p className="font-body-lg text-xs md:text-sm text-on-surface-variant mb-6 max-w-2xl mx-auto leading-relaxed">
        Join 15,000+ professionals receiving our daily briefings on policy shifts, market movements, and
        technological breakthroughs in the regional digital asset space.
      </p>
      {submitted ? (
        <p className="font-label-caps text-xs text-[#D4AF37] font-bold">Thanks — check your inbox to confirm.</p>
      ) : (
        <form className="flex flex-col sm:flex-row justify-center max-w-xl mx-auto gap-2" onSubmit={handleSubmit}>
          <input
            className="flex-grow px-4 py-3 border border-outline-variant focus:border-[#D4AF37] bg-surface-container-low font-body-md text-xs text-on-surface transition-colors rounded-lg"
            placeholder="Enter your professional email address"
            required
            type="email"
          />
          <button
            className="bg-[#0C133D] text-[#F7F0EB] border border-[#D4AF37]/60 px-8 py-3 font-label-caps text-xs font-extrabold hover:bg-[#D4AF37] hover:text-[#0C133D] transition-all whitespace-nowrap rounded-lg shadow-sm"
            type="submit"
          >
            Subscribe Free →
          </button>
        </form>
      )}
      <span className="font-data-tabular text-on-surface-variant mt-4 block text-[11px]">
        By subscribing, you agree to our Terms of Service and Privacy Policy.
      </span>
    </Reveal>

  );
}

