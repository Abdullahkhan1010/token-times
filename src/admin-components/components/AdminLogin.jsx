import React, { useState } from "react";
import { Lock, User, Eye, EyeOff, ShieldCheck, ArrowRight, ArrowLeft, AlertCircle, CheckCircle2, Loader2, Shield } from "lucide-react";
import { login } from "../../services/auth.service";

export default function AdminLogin({ onLoginSuccess }) {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    if (!identifier.trim()) {
      setError("Please enter your admin email or username.");
      return;
    }

    if (!password) {
      setError("Please enter your password.");
      return;
    }

    setIsLoading(true);

    try {
      const result = await login({
        emailOrUsername: identifier.trim(),
        password,
        rememberMe,
      });
      if (result.success) {
        console.log("Login successful:", result);
        setSuccessMsg("Credentials authenticated. Launching workspace...");

        setTimeout(() => {
          if (onLoginSuccess) {
            onLoginSuccess(result.user);
          }
        }, 400);
      } else {
        console.log("Login failed:", result);
        setError("Authentication failed. Please verify your credentials.");
        setIsLoading(false);
      }
    } catch (err) {
      setError(err?.message || "Authentication failed. Please verify your credentials.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F0EB] text-[#0C133D] flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden font-body-md selection:bg-[#D4AF37] selection:text-[#0C133D]">
      {/* Background Decorative Ambient Layers */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none -mr-48 -mt-48" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#121A4B]/5 rounded-full blur-3xl pointer-events-none -ml-48 -mb-48" />
      <div className="absolute inset-0 bg-[radial-gradient(#0C133D_1px,transparent_1px)] [background-size:32px_32px] opacity-[0.03] pointer-events-none" />

      {/* Main Login Card Container */}
      <div className="w-full max-w-md relative z-10 animate-fade-up">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#0C133D] border border-[#D4AF37] shadow-lg shadow-[#0C133D]/10 mb-3 ring-4 ring-[#D4AF37]/20">
            <ShieldCheck className="w-7 h-7 text-[#D4AF37]" />
          </div>
          <h1 className="font-headline-lg text-3xl font-extrabold tracking-tight text-[#0C133D]">
            Token Times
          </h1>
          <div className="inline-flex items-center gap-2 mt-1.5 px-3 py-0.5 rounded-full bg-[#0C133D] text-[#D4AF37] border border-[#D4AF37]/40 text-[10px] font-bold uppercase tracking-wider">
            <span>Admin Editorial Gateway</span>
          </div>
          <p className="text-xs text-[#5C525A] mt-2 font-medium">
            Financial Intelligence & Digital Asset Management
          </p>
        </div>

        {/* Card Body */}
        <div className="bg-white border border-[#E2D4CB] rounded-2xl p-7 sm:p-8 shadow-xl shadow-[#0C133D]/5">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-[#0C133D]">Administrator Sign In</h2>
            <p className="text-xs text-[#5C525A] mt-0.5">
              Enter your credentials to access editorial tools, drafts, and system data.
            </p>
          </div>

          {/* Feedback Alerts */}
          {error && (
            <div className="mb-5 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-3.5 text-xs text-red-800 animate-fade-up">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <div className="flex-1 font-medium">{error}</div>
            </div>
          )}

          {successMsg && (
            <div className="mb-5 flex items-start gap-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3.5 text-xs text-emerald-800 animate-fade-up">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div className="flex-1 font-medium">{successMsg}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username / Email Field */}
            <div>
              <label className="block text-xs font-bold text-[#0C133D] uppercase tracking-wider mb-1.5">
                Admin Username or Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#7F707A]">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="admin@tokentimes.com"
                  autoComplete="username"
                  disabled={isLoading}
                  className="w-full bg-[#F2E7E1]/50 border border-[#E2D4CB] focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] rounded-lg pl-10 pr-4 py-2.5 text-sm text-[#0C133D] placeholder-[#7F707A] outline-none transition-all disabled:opacity-50 font-medium"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-[#0C133D] uppercase tracking-wider">
                  Password
                </label>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#7F707A]">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  autoComplete="current-password"
                  disabled={isLoading}
                  className="w-full bg-[#F2E7E1]/50 border border-[#E2D4CB] focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] rounded-lg pl-10 pr-11 py-2.5 text-sm text-[#0C133D] placeholder-[#7F707A] outline-none transition-all disabled:opacity-50 font-medium"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#7F707A] hover:text-[#0C133D] transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me / Session */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  disabled={isLoading}
                  className="w-4 h-4 rounded bg-white border-[#E2D4CB] text-[#0C133D] focus:ring-[#D4AF37] accent-[#0C133D]"
                />
                <span className="text-xs text-[#5C525A] font-medium">Keep me signed in</span>
              </label>

              <span className="text-[11px] text-[#B8860B] font-semibold flex items-center gap-1">
                <Shield className="w-3 h-3" />
                JWT Auth Ready
              </span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 bg-[#0C133D] hover:bg-[#121A4B] text-white font-semibold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-all duration-200 shadow-md shadow-[#0C133D]/10 hover:shadow-lg hover:shadow-[#0C133D]/20 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed font-label-caps"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-[#D4AF37]" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>Access Dashboard</span>
                  <ArrowRight className="w-4 h-4 text-[#D4AF37]" />
                </>
              )}
            </button>
          </form>

          {/* Security Banner Footer */}
          <div className="mt-6 pt-5 border-t border-[#E2D4CB] flex items-center justify-between text-[11px] text-[#5C525A]">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-medium">Encrypted Administrator Session</span>
            </div>
            <span className="font-semibold text-[#0C133D]">Token Times System</span>
          </div>
        </div>

        {/* Back to Live Site Link */}
        <div className="mt-6 text-center">
          <a
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#5C525A] hover:text-[#0C133D] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Live Publication</span>
          </a>
        </div>
      </div>
    </div>
  );
}
