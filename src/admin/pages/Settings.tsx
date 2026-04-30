import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import {
  Shield,
  Mail,
  Lock,
  Check,
  AlertCircle,
  Loader2,
  X,
  User as UserIcon,
  ShieldCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';
import { useNavigate } from 'react-router-dom';

export default function AdminSettings() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Password State
  const [passwords, setPasswords] = useState({ new: '', confirm: '' });
  const [passErrors, setPassErrors] = useState<string[]>([]);

  // Email State
  const [newEmail, setNewEmail] = useState('');

  const validatePassword = (pass: string) => {
    const errors = [];
    if (pass.length < 8) errors.push('Minimum 8 characters');
    if (!/[A-Z]/.test(pass)) errors.push('At least 1 uppercase letter');
    if (!/[a-z]/.test(pass)) errors.push('At least 1 lowercase letter');
    if (!/[0-9]/.test(pass)) errors.push('At least 1 number');
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(pass)) errors.push('At least 1 special character');
    return errors;
  };

  const handleCredentialsUpdate = async (type: 'email' | 'password') => {
    setLoading(true);
    setSuccessMsg(null);
    setErrorMsg(null);

    // Initial delay for smooth UX
    await new Promise(resolve => setTimeout(resolve, 500));

    // After success, wait a bit then logout
    setTimeout(async () => {
      localStorage.removeItem('admin_session');
      await signOut();
      navigate('/admin/login');
    }, 3000);
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassErrors([]);

    const errors = validatePassword(passwords.new);
    if (passwords.new !== passwords.confirm) errors.push('Passwords do not match');

    if (errors.length > 0) {
      setPassErrors(errors);
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password: passwords.new });

    if (error) {
      setErrorMsg(error.message);
      setLoading(false);
    } else {
      setSuccessMsg('Security credentials updated. Logging out for security...');
      handleCredentialsUpdate('password');
    }
  };

  const handleEmailUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.updateUser({ email: newEmail });

    if (error) {
      setErrorMsg(error.message);
      setLoading(false);
    } else {
      setSuccessMsg('Verification email sent. Please confirm to update email. Logging out...');
      handleCredentialsUpdate('email');
    }
  };

  return (
    <div className="max-w-5xl space-y-12 pb-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-2"
      >
        <h1 className="text-3xl lg:text-4xl font-display font-light tracking-tight text-text-base">System Preferences</h1>
        <p className="text-[10px] uppercase font-bold tracking-[0.3em] text-text-muted">Security Protocols & Editorial Access</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Card 1: Account Info (Read-only) */}
        <section className="bg-white rounded-[3rem] border border-border-base p-10 md:p-12 flex flex-col justify-between shadow-sm">
          <div>
            <h2 className="text-2xl font-display font-light tracking-tight mb-10 flex items-center gap-4">
              <UserIcon className="text-text-base" size={24} strokeWidth={1} />
              Curation Identity
            </h2>
            <div className="space-y-8">
              <div className="space-y-4">
                <label className="block text-[9px] uppercase tracking-[0.3em] font-bold text-text-base/40 ml-1">Archive Login ID</label>
                <div className="relative group">
                  <Mail className="absolute left-0 top-1/2 -translate-y-1/2 text-text-base/20" size={14} />
                  <input
                    readOnly
                    type="email"
                    className="w-full bg-transparent border-b border-border-base pl-8 pr-4 py-4 text-xs font-bold uppercase tracking-widest text-text-muted outline-none cursor-default"
                    value={user?.email || ''}
                  />
                </div>
              </div>
              <div className="flex items-center gap-5 p-6 bg-surface rounded-[2rem] border border-border-base/50">
                <ShieldCheck className="text-accent shrink-0" size={24} strokeWidth={1} />
                <div className="min-w-0">
                  <p className="text-[9px] font-bold uppercase tracking-widest text-accent mb-1">Encrypted Access</p>
                  <p className="text-[10px] text-text-muted font-medium uppercase tracking-wider">Session authenticated via global protocol.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Card 2: Change Email */}
        <section className="bg-white rounded-[3rem] border border-border-base p-10 md:p-12 shadow-sm">
          <h2 className="text-2xl font-display font-light tracking-tight mb-10 flex items-center gap-4">
            <Mail className="text-text-base" size={24} strokeWidth={1} />
            Identity Update
          </h2>
          <form onSubmit={handleEmailUpdate} className="space-y-10">
            <div className="space-y-4">
              <label className="block text-[9px] uppercase tracking-[0.3em] font-bold text-text-base/40 ml-1">New Identity Email</label>
              <div className="relative group">
                <Mail className="absolute left-0 top-1/2 -translate-y-1/2 text-text-base/20 group-focus-within:text-accent transition-colors" size={14} />
                <input
                  required
                  type="email"
                  placeholder="IDENTITY@ARCHIVE.COM"
                  className="w-full bg-transparent border-b border-border-base pl-8 pr-4 py-4 text-xs font-bold uppercase tracking-widest focus:border-accent outline-none transition-all placeholder:text-text-base/10"
                  value={newEmail}
                  onChange={e => setNewEmail(e.target.value)}
                />
              </div>
            </div>
            <button
              disabled={loading || !newEmail || newEmail === user?.email}
              className="w-full bg-text-base hover:bg-accent text-white h-14 rounded-full font-bold text-[10px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 disabled:opacity-50 active:scale-[0.98]"
            >
              {loading ? <Loader2 className="animate-spin" size={16} /> : 'Establish New Identity'}
            </button>
          </form>
        </section>

        {/* Card 3: Change Password */}
        <section className="lg:col-span-2 bg-white rounded-[3.5rem] border border-border-base p-10 md:p-16 shadow-sm">
          <h2 className="text-2xl font-display font-light tracking-tight mb-12 flex items-center gap-4">
            <Shield className="text-text-base" size={24} strokeWidth={1} />
            Security Core Override
          </h2>
          <form onSubmit={handlePasswordChange} className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            <div className="lg:col-span-7 space-y-12">
              <div className="space-y-10">
                <div className="space-y-4">
                  <label className="block text-[9px] uppercase tracking-[0.3em] font-bold text-text-base/40 ml-1">New Security Key</label>
                  <div className="relative group">
                    <Lock className="absolute left-0 top-1/2 -translate-y-1/2 text-text-base/20 group-focus-within:text-accent transition-colors" size={14} />
                    <input
                      required
                      type="password"
                      className="w-full bg-transparent border-b border-border-base pl-8 pr-4 py-4 text-xs font-bold uppercase tracking-widest focus:border-accent outline-none transition-all placeholder:text-text-base/10"
                      placeholder="••••••••"
                      value={passwords.new}
                      onChange={e => setPasswords({ ...passwords, new: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <label className="block text-[9px] uppercase tracking-[0.3em] font-bold text-text-base/40 ml-1">Confirm New Key</label>
                  <div className="relative group">
                    <Lock className="absolute left-0 top-1/2 -translate-y-1/2 text-text-base/20 group-focus-within:text-accent transition-colors" size={14} />
                    <input
                      required
                      type="password"
                      className="w-full bg-transparent border-b border-border-base pl-8 pr-4 py-4 text-xs font-bold uppercase tracking-widest focus:border-accent outline-none transition-all placeholder:text-text-base/10"
                      placeholder="••••••••"
                      value={passwords.confirm}
                      onChange={e => setPasswords({ ...passwords, confirm: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <button
                disabled={loading}
                className="w-full lg:w-auto px-16 bg-text-base hover:bg-accent text-white h-16 rounded-full font-bold text-[10px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 active:scale-[0.98] shadow-xl shadow-text-base/10"
              >
                {loading ? <Loader2 className="animate-spin" size={16} /> : 'Authenticate Key Revision'}
              </button>
            </div>

            <div className="lg:col-span-5 space-y-8 glass-card border border-border-base/50 p-10 rounded-[2.5rem] bg-surface/30">
              <h3 className="text-[10px] uppercase tracking-[0.4em] font-bold text-text-base/30 mb-8 border-b border-border-base pb-6">Protocol Requirements</h3>
              <div className="space-y-5">
                {[
                  { label: '8+ Characters Cluster', met: passwords.new.length >= 8 },
                  { label: 'Uppercase Character Set', met: /[A-Z]/.test(passwords.new) },
                  { label: 'Lowercase Character Set', met: /[a-z]/.test(passwords.new) },
                  { label: 'Numeral Requirement', met: /[0-9]/.test(passwords.new) },
                  { label: 'Special Character Encoding', met: /[!@#$%^&*(),.?":{}|<>]/.test(passwords.new) },
                ].map((req, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className={cn(
                      "h-6 w-6 rounded-full flex items-center justify-center border transition-all duration-500",
                      req.met ? "bg-accent/10 border-accent/20 text-accent scale-110" : "bg-white border-border-base text-text-base/10"
                    )}>
                      <Check size={12} strokeWidth={3} />
                    </div>
                    <span className={cn(
                      "text-[9px] font-bold uppercase tracking-[0.2em] transition-colors duration-500",
                      req.met ? "text-text-base" : "text-text-base/20"
                    )}>{req.label}</span>
                  </div>
                ))}
              </div>

              {passErrors.length > 0 && (
                <div className="bg-red-50 border border-red-100 rounded-2xl p-6 space-y-2 mt-10">
                  {passErrors.map((err, i) => (
                    <p key={i} className="text-[9px] text-red-800 flex items-center gap-3 font-bold uppercase tracking-widest">
                      <AlertCircle size={14} /> {err}
                    </p>
                  ))}
                </div>
              )}
            </div>
          </form>
        </section>
      </div>

      {/* Status Messages */}
      <AnimatePresence>
        {(successMsg || errorMsg) && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className={cn(
              "fixed bottom-12 right-12 p-8 rounded-[2.5rem] shadow-2xl flex items-center gap-6 z-50 border backdrop-blur-md",
              successMsg ? "bg-white/90 border-accent/20 text-accent" : "bg-white/90 border-red-100 text-red-800"
            )}
          >
            <div className={cn(
              "h-12 w-12 rounded-full flex items-center justify-center shrink-0",
              successMsg ? "bg-accent/10" : "bg-red-50"
            )}>
              {successMsg ? <ShieldCheck size={24} strokeWidth={1.5} /> : <AlertCircle size={24} strokeWidth={1.5} />}
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[10px] uppercase font-bold tracking-widest opacity-40">{successMsg ? 'Confirmed' : 'Restriction'}</span>
              <span className="text-xs font-bold tracking-wide uppercase">{successMsg || errorMsg}</span>
            </div>
            <button onClick={() => { setSuccessMsg(null); setErrorMsg(null); }} className="ml-6 h-10 w-10 bg-surface rounded-full flex items-center justify-center text-text-muted hover:text-text-base transition-all">
              <X size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
