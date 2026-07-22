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
      className="mb-8 bg-surface-container-high p-8 md:p-12 text-center"
      style={{ borderTop: "4px solid #0E7C61" }}
    >
      <h2 className="font-display-lg text-display-lg text-primary mb-4">Intelligence Delivered.</h2>
      <p className="font-body-lg text-body-lg text-on-surface-variant mb-8 max-w-2xl mx-auto">
        Join 15,000+ professionals receiving our daily briefings on policy shifts, market movements, and
        technological breakthroughs in the regional digital asset space.
      </p>
      {submitted ? (
        <p className="font-label-caps text-label-caps text-accent">Thanks — check your inbox to confirm.</p>
      ) : (
        <form className="flex flex-col sm:flex-row justify-center max-w-xl mx-auto gap-2" onSubmit={handleSubmit}>
          <input
            className="flex-grow px-4 py-3 border border-outline-variant focus:border-accent bg-surface-container-lowest font-body-md text-on-surface transition-colors"
            placeholder="Enter your professional email address"
            required
            type="email"
          />
          <button
            className="bg-accent text-on-accent px-8 py-3 font-label-caps text-label-caps hover:bg-accent-dark transition-colors whitespace-nowrap"
            type="submit"
          >
            Subscribe Free
          </button>
        </form>
      )}
      <span className="font-data-tabular text-data-tabular text-on-surface-variant mt-4 block text-xs">
        By subscribing, you agree to our Terms of Service and Privacy Policy.
      </span>
    </Reveal>
  );
}
