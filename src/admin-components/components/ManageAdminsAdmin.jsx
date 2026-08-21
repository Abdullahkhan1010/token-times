import React, { useState, useEffect } from "react";
import { UserPlus, Shield, ShieldAlert, ShieldCheck, Trash2, Key, Mail, User, CheckCircle2, AlertCircle, RefreshCw, Eye, EyeOff, Sparkles, Copy, Check } from "lucide-react";
import PageHeader from "./PageHeader";
import { getAdminUsers, createAdminUser, deleteAdminUser } from "../../services/auth.service";

const ROLES = [
  { value: "Super Admin", label: "Super Admin", desc: "Full permissions: team provisioning, system configs, & data feeds" },
  { value: "Senior Editor", label: "Senior Editor", desc: "Publishing authority: AI queue approval, draft editing & scheduling" },
  { value: "Research Analyst", label: "Research Analyst", desc: "Manage research papers, market stats, & regulatory frameworks" },
  { value: "Staff Writer", label: "Staff Writer", desc: "Create and submit article drafts for editorial review" },
];

export default function ManageAdminsAdmin() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null);

  // Form State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const loadAdmins = async () => {
    setLoading(true);
    try {
      const serverUsers = await getAdminUsers();
      if (Array.isArray(serverUsers)) {
        setAdmins(serverUsers);
      }
    } catch (err) {
      console.warn("Could not load /auth/getAdmins from backend", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdmins();
  }, []);

  const generateRandomPassword = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%^&*";
    let gen = "";
    for (let i = 0; i < 12; i++) {
      gen += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPassword(gen);
    setShowPassword(true);
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    if (!email.trim() || !password) {
      setMessage({ type: "error", text: "Please complete all required fields." });
      return;
    }

    setSubmitting(true);

    const newAdminData = {
      email: email.trim().toLowerCase(),
      password: password,
    };

    try {
      await createAdminUser(newAdminData);
      setMessage({
        type: "success",
        text: `Administrator account for ${newAdminData.email} provisioned successfully.`
      });

      // Reset form
      setEmail("");
      setPassword("");

      // Re-fetch live list from /users
      await loadAdmins();
    } catch (err) {
      setMessage({
        type: "error",
        text: err?.message || `Failed to create administrator account.`
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, adminemail) => {
    if (!window.confirm(`Are you sure you want to remove administrator "${adminemail}"?`)) {
      return;
    }

    try {
      await deleteAdminUser(id);
      setMessage({ type: "success", text: `Administrator account removed.` });
      await loadAdmins();
    } catch (err) {
      setMessage({ type: "error", text: err?.message || "Failed to remove administrator account." });
    }
  };

  return (
    <div className="space-y-8 animate-fade-up">
      <PageHeader
        badge="System Security & Access"
        title="Admin Team Management"
        subtitle="Provision administrator credentials, assign editorial permissions, and manage credentials stored in the system database."
        message={message}
        onDismissMessage={() => setMessage(null)}
      >
        <button
          onClick={loadAdmins}
          disabled={loading}
          className="inline-flex items-center gap-2 px-3 py-2 bg-white border border-[#E2D4CB] hover:bg-[#F2E7E1] rounded-lg text-xs font-semibold text-[#0C133D] transition-colors shadow-sm disabled:opacity-50"
        >
          <RefreshCw size={14} className={loading ? "animate-spin text-[#D4AF37]" : "text-[#0C133D]"} />
          <span>Refresh List</span>
        </button>
      </PageHeader>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Add New Admin Form */}
        <div className="lg:col-span-1">
          <form
            onSubmit={handleSubmit}
            className="bg-white border border-[#E2D4CB] rounded-2xl p-6 shadow-sm space-y-4 sticky top-6"
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#E2D4CB]">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-[#0C133D] text-[#D4AF37]">
                  <UserPlus size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#0C133D]">Add New Admin</h3>
                  <p className="text-[11px] text-[#5C525A]">Assign login credentials</p>
                </div>
              </div>
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-xs font-bold text-[#0C133D] uppercase tracking-wider mb-1">
                Email Address <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#7F707A]">
                  <Mail size={14} />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="farhan@tokentimes.com"
                  className="w-full pl-9 pr-3 py-2 bg-[#F2E7E1]/50 border border-[#E2D4CB] focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] rounded-lg text-xs text-[#0C133D] outline-none font-medium"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-[#0C133D] uppercase tracking-wider">
                  Password <span className="text-rose-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={generateRandomPassword}
                  className="inline-flex items-center gap-1 text-[10px] font-bold text-[#B8860B] hover:text-[#0C133D] transition-colors"
                >
                  <Sparkles size={11} />
                  <span>Auto-Generate</span>
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#7F707A]">
                  <Key size={14} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-10 py-2 bg-[#F2E7E1]/50 border border-[#E2D4CB] focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] rounded-lg text-xs text-[#0C133D] outline-none font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#7F707A] hover:text-[#0C133D]"
                >
                  {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>


            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full mt-2 bg-[#0C133D] hover:bg-[#121A4B] text-white font-semibold py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-all shadow-md shadow-[#0C133D]/10 hover:shadow-lg disabled:opacity-50 text-xs uppercase tracking-wider font-label-caps"
            >
              <UserPlus size={15} className="text-[#D4AF37]" />
              <span>{submitting ? "Provisioning..." : "Provision Admin Account"}</span>
            </button>
          </form>
        </div>

        {/* Right Column: Existing Administrators Table */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white border border-[#E2D4CB] rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#E2D4CB]">
              <div className="flex items-center gap-2">
                <ShieldCheck size={20} className="text-[#D4AF37]" />
                <h3 className="text-sm font-bold text-[#0C133D]">
                  Registered Administrators ({admins.length})
                </h3>
              </div>
              <span className="text-[11px] font-semibold text-[#5C525A] bg-[#F2E7E1] px-2.5 py-1 rounded-full border border-[#E2D4CB]">
                Database: <code className="text-[#0C133D]">/users</code>
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#E2D4CB] text-[11px] font-bold text-[#5C525A] uppercase tracking-wider">

                    <th className="py-3 px-3">Email</th>
                    <th className="py-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2D4CB]/60 text-xs">
                  {admins.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-10 text-center text-[#5C525A]">
                        <Shield className="w-8 h-8 mx-auto text-[#7F707A]/40 mb-2" />
                        <p className="font-bold text-xs text-[#0C133D]">No Additional Administrators</p>
                        <p className="text-[11px] text-[#5C525A] mt-0.5">
                          Accounts registered in the database will appear here. You can provision new administrators using the form.
                        </p>
                      </td>
                    </tr>
                  ) : (
                    admins.map((admin) => {
                      const adminId = admin.id;


                      return (
                        <tr key={adminId} className="hover:bg-[#F2E7E1]/30 transition-colors">


                          <td className="py-3.5 px-3">
                            <div className="flex items-center gap-1.5 text-[#0C133D] font-medium">
                              <span className="truncate max-w-[300px]">{admin.email}</span>
                              <button
                                onClick={() => handleCopy(admin.email, adminId)}
                                className="text-[#7F707A] hover:text-[#0C133D] p-1 rounded"
                                title="Copy Email"
                              >
                                <Check size={13} className="text-emerald-600" />
                              </button>
                            </div>
                          </td>

                          <td className="py-3.5 px-3 text-right">
                            <button
                              onClick={() => handleDelete(adminId, admin.email)}
                              className="p-1.5 text-[#7F707A] hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                              title="Remove Administrator"
                              aria-label={`Remove administrator ${admin.email}`}
                            >
                              <Trash2 size={15} />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Footer Summary Notice */}
            <div className="mt-6 pt-4 border-t border-[#E2D4CB] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-[#5C525A]">
              <div className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-[#D4AF37]" />
                <span>Credentials submitted to database endpoint <code className="text-[#0C133D] font-mono">/auth</code></span>
              </div>
              <span className="font-semibold text-[#0C133D]">JWT Authentication Ready</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
