import React from "react";
import Reveal from "./Reveal";
import { LineChart } from "lucide-react";

export default function MarketsDashboard() {
  return (
    <Reveal
      as="section"
      className="bg-primary text-on-primary p-6 flex flex-col justify-center items-center text-center rounded-xl relative overflow-hidden"
    >
      <div className="absolute inset-0 opacity-10 bg-gradient-to-br from-accent to-transparent" />
      <LineChart size={44} className="mb-4 text-accent relative" />
      <h3 className="font-headline-md text-headline-md mb-2 relative">Markets Dashboard</h3>
      <p className="font-body-md text-body-md mb-6 relative" style={{ opacity: 0.8 }}>
        Live institutional market data, volume metrics, and premium index tracking coming soon.
      </p>
      <button className="border border-accent text-accent px-4 py-2 font-label-caps text-label-caps hover:bg-accent hover:text-on-accent transition-colors relative">
        Notify Me
      </button>
    </Reveal>
  );
}
