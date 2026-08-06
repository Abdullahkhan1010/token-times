import React, { useState } from "react";
import logo from "../assets/TokenTimesLogo.svg";
import { ROUTE_PATH_MAP } from "../data/seoData";
import {
  ArrowUp,
  Mail,
  Send,
  CheckCircle2,
  Globe,
  ShieldCheck,
  FileText,
  TrendingUp,
  Lock
} from "lucide-react";

export default function Footer({ setActivePage }) {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setTimeout(() => {
        setSubscribed(false);
        setEmail("");
      }, 4000);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNavClick = (pageName) => (e) => {
    e.preventDefault();
    if (setActivePage) {
      setActivePage(pageName);
    }
    scrollToTop();
  };

  return (
    <footer className="bg-[#0C133D] text-white w-full border-t border-white/10 relative" role="contentinfo">
      {/* Top Header Block & Newsletter Subscription */}
      <div className="px-4 md:px-12 py-8 border-b border-white/10 bg-gradient-to-b from-[#0C133D] to-[#080E2E]">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-6">
          {/* Brand Info */}
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-3">
              <img src={logo} alt="Token Times logo" loading="lazy" decoding="async" className="w-10 h-10 shrink-0" />
              <h2 className="font-headline-lg text-2xl font-bold text-white tracking-tight">
                Token Times
              </h2>
            </div>
            <p className="text-xs text-white/70 leading-relaxed font-sans">
              Pakistan's Digital Assets & Sovereign Financial Platform. Real-time news, regulatory tracking, and Web3 insights.
            </p>

            {/* Social Connect */}
            <div className="flex items-center gap-2 pt-1">
              <span className="text-xs text-white/50 font-medium mr-1">Connect:</span>
              {[
                { label: "X / Twitter", icon: "𝕏", href: "https://twitter.com/TokenTimesIO" },
                { label: "Telegram", icon: "✈", href: "https://t.me/tokentimes" },
                { label: "LinkedIn", icon: "in", href: "https://linkedin.com/company/tokentimes" },
              ].map((s, idx) => (
                <a
                  key={idx}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  title={s.label}
                  className="w-7 h-7 rounded-full bg-white/5 hover:bg-[#D4AF37] hover:text-[#0C133D] text-white/80 transition-all flex items-center justify-center text-xs font-bold border border-white/10"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Clean Newsletter Box */}
          <div className="w-full lg:w-auto bg-white/5 border border-white/10 rounded-xl p-4 sm:p-5 max-w-md">
            <div className="flex items-center gap-2 mb-1.5">
              <Mail className="w-4 h-4 text-[#D4AF37]" />
              <h3 className="font-semibold text-xs text-white uppercase tracking-wider">
                Daily Token Times Dispatch
              </h3>
            </div>
            <p className="text-[11px] text-white/70 mb-3">
              Get essential daily crypto market analysis & regulatory updates in your inbox.
            </p>

            {subscribed ? (
              <div className="bg-[#D4AF37]/20 border border-[#D4AF37]/40 rounded-lg p-2.5 flex items-center gap-2 text-xs text-[#D4AF37]">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                <span className="font-medium text-[11px]">Subscribed successfully! Welcome aboard.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email address..."
                  aria-label="Email address for daily newsletter"
                  required
                  className="bg-[#0C133D] border border-white/20 rounded-lg px-3 py-2 text-xs text-white placeholder-white/40 focus:outline-none focus:border-[#D4AF37] flex-grow"
                />
                <button
                  type="submit"
                  className="bg-[#D4AF37] hover:bg-[#F3CF55] text-[#0C133D] font-bold px-4 py-2 rounded-lg text-xs flex items-center gap-1.5 transition-all"
                >
                  <span>Subscribe</span>
                  <Send className="w-3 h-3" />
                </button>
              </form>
            )}
            <p className="text-[10px] text-white/40 mt-2 flex items-center gap-1">
              <Lock className="w-3 h-3 text-white/40" /> No spam. Unsubscribe anytime.
            </p>
          </div>
        </div>
      </div>

      {/* Main 3-Column Navigation Grid */}
      <div className="px-4 md:px-12 py-8 border-b border-white/10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8 text-xs">
          {/* Column 1: Publication */}
          <div className="space-y-3">
            <h4 className="font-bold text-[#D4AF37] uppercase tracking-wider border-b border-[#D4AF37]/30 pb-1.5 flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5" />
              Publication
            </h4>
            <ul className="space-y-2 text-white/80">
              <li>
                <a href={ROUTE_PATH_MAP["Home"]} onClick={handleNavClick("Home")} className="hover:text-[#D4AF37] transition-colors">
                  Home Overview
                </a>
              </li>
              <li>
                <a href={ROUTE_PATH_MAP["News"]} onClick={handleNavClick("News")} className="hover:text-[#D4AF37] transition-colors">
                  Latest News & Stream
                </a>
              </li>
              <li>
                <a href={ROUTE_PATH_MAP["Regulations"]} onClick={handleNavClick("Regulations")} className="hover:text-[#D4AF37] transition-colors">
                  SBP & SECP Regulations
                </a>
              </li>
              <li>
                <a href={ROUTE_PATH_MAP["REIT"]} onClick={handleNavClick("REIT")} className="hover:text-[#D4AF37] transition-colors">
                  REITs & Asset Tokenization
                </a>
              </li>
              <li>
                <a href={ROUTE_PATH_MAP["Research"]} onClick={handleNavClick("Research")} className="hover:text-[#D4AF37] transition-colors">
                  Research Papers & Whitepapers
                </a>
              </li>
              <li>
                <a href={ROUTE_PATH_MAP["Magazine"]} onClick={handleNavClick("Magazine")} className="hover:text-[#D4AF37] transition-colors">
                  Print & Digital Magazine
                </a>
              </li>
            </ul>
          </div>

          {/* Column 2: Resources & Technology */}
          <div className="space-y-3">
            <h4 className="font-bold text-[#D4AF37] uppercase tracking-wider border-b border-[#D4AF37]/30 pb-1.5 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5" />
              Resources & Tech
            </h4>
            <ul className="space-y-2 text-white/80">
              <li>
                <a href={ROUTE_PATH_MAP["Knowledge Hub"]} onClick={handleNavClick("Knowledge Hub")} className="hover:text-[#D4AF37] transition-colors">
                  Knowledge Hub & Glossary
                </a>
              </li>
              <li>
                <a href={ROUTE_PATH_MAP["Technologies"]} onClick={handleNavClick("Technologies")} className="hover:text-[#D4AF37] transition-colors">
                  Web3 & Blockchain Tech
                </a>
              </li>
              <li>
                <a href={ROUTE_PATH_MAP["Events"]} onClick={handleNavClick("Events")} className="hover:text-[#D4AF37] transition-colors">
                  Industry Events & Summits
                </a>
              </li>
              <li>
                <a href={ROUTE_PATH_MAP["Resources"]} onClick={handleNavClick("Resources")} className="hover:text-[#D4AF37] transition-colors">
                  Data Resources & Tools
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: About & Legal */}
          <div className="space-y-3">
            <h4 className="font-bold text-[#D4AF37] uppercase tracking-wider border-b border-[#D4AF37]/30 pb-1.5 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5" />
              Company & Legal
            </h4>
            <ul className="space-y-2 text-white/80">
              <li>
                <a href={ROUTE_PATH_MAP["About"]} onClick={handleNavClick("About")} className="hover:text-[#D4AF37] transition-colors">
                  About Token Times
                </a>
              </li>
              <li>
                <a href={ROUTE_PATH_MAP["Contact"]} onClick={handleNavClick("Contact")} className="hover:text-[#D4AF37] transition-colors">
                  Contact & Newsroom Desk
                </a>
              </li>
              <li>
                <a href={ROUTE_PATH_MAP["Privacy Policy"]} onClick={handleNavClick("Privacy Policy")} className="hover:text-[#D4AF37] transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href={ROUTE_PATH_MAP["Terms of Service"]} onClick={handleNavClick("Terms of Service")} className="hover:text-[#D4AF37] transition-colors">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Financial Disclaimer */}
      <div className="px-4 md:px-12 py-4 bg-[#080D2E] border-b border-white/5">
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-[11px] text-white/50 leading-normal">
          <ShieldCheck className="w-4 h-4 text-[#D4AF37] flex-shrink-0" />
          <p>
            <strong className="text-white/70">Disclaimer:</strong> Token Times provides financial news and regulatory intelligence for informational purposes only. Content should not be construed as investment or financial advice.
          </p>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="px-4 md:px-12 py-5 bg-[#05081E]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/60">
          <div className="flex items-center gap-3">
            <p>© {new Date().getFullYear()} Token Times. All rights reserved.</p>
            <span className="text-white/20">|</span>
            <span className="text-white/80 font-medium">🇵🇰 Pakistan Edition</span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <a
              href="/admin"
              title="Admin Panel"
              className="flex items-center gap-1.5 bg-white/5 hover:bg-[#D4AF37] hover:text-[#0C133D] text-white/80 px-3 py-1.5 rounded-full text-xs font-medium border border-white/10 transition-all"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Admin Dashboard</span>
            </a>
            
            {/* Smooth Scroll Back to Top */}
            <button
              onClick={scrollToTop}
              title="Back to Top"
              aria-label="Back to Top"
              className="flex items-center gap-1.5 bg-white/5 hover:bg-[#D4AF37] hover:text-[#0C133D] text-white/80 px-3 py-1.5 rounded-full text-xs font-medium border border-white/10 transition-all"
            >
              <span>Back to Top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
