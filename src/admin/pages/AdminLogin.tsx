import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Loader2, ArrowRight, ShieldAlert, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';
import { supabase } from '../../lib/supabase';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
        setLoading(false);
      } else {
        // Initial delay for smooth UX transition
        setTimeout(() => {
          navigate('/admin/dashboard');
        }, 500);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6 py-20 overflow-hidden relative">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[28rem]"
      >
        <div className="bg-white p-10 md:p-16 rounded-[3rem] border border-border-base shadow-lg shadow-text-base/5 relative overflow-hidden">
          <div className="text-center mb-16">
            <div className="h-20 w-20 bg-text-base text-white rounded-full flex items-center justify-center mx-auto mb-10 group hover:bg-accent transition-colors duration-500">
              <ShieldCheck size={36} strokeWidth={1} />
            </div>
            <h1 className="text-4xl font-display font-light mb-4 tracking-tight text-text-base">Authenticated Access</h1>
            <p className="text-[10px] uppercase font-bold tracking-[0.3em] text-text-muted">Digital Curator Protocol</p>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-red-50 text-red-800 text-[10px] uppercase tracking-widest p-5 rounded-2xl mb-10 font-bold flex items-center gap-4 border border-red-100"
            >
              <ShieldAlert size={16} />
              {error}
            </motion.div>
          )}

          <form onSubmit={handleAdminLogin} className="space-y-12">
            <div className="space-y-10">
              <div className="relative group">
                <label className="absolute -top-3 left-0 text-[8px] uppercase tracking-[0.3em] font-bold text-text-base/30 group-focus-within:text-accent transition-colors">Identity</label>
                <Mail className="absolute left-0 top-1/2 -translate-y-1/2 text-text-base/20 group-focus-within:text-accent transition-colors" size={14} />
                <input 
                  required
                  type="email"
                  placeholder="admin@mavren.com"
                  className="w-full bg-transparent border-b border-border-base pl-8 pr-4 py-4 text-xs font-bold uppercase tracking-widest focus:border-accent outline-none transition-all placeholder:text-text-base/10"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </div>
              <div className="relative group">
                <label className="absolute -top-3 left-0 text-[8px] uppercase tracking-[0.3em] font-bold text-text-base/30 group-focus-within:text-accent transition-colors">Security Key</label>
                <Lock className="absolute left-0 top-1/2 -translate-y-1/2 text-text-base/20 group-focus-within:text-accent transition-colors" size={14} />
                <input 
                  required
                  type="password"
                  placeholder="••••••••"
                  className="w-full bg-transparent border-b border-border-base pl-8 pr-4 py-4 text-xs font-bold uppercase tracking-widest focus:border-accent outline-none transition-all placeholder:text-text-base/10"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button 
              disabled={loading}
              className="w-full bg-text-base hover:bg-accent text-white h-16 rounded-full font-bold text-[10px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-4 shadow-xl shadow-text-base/10 active:scale-[0.98]"
            >
              {loading ? <Loader2 className="animate-spin" size={16} /> : (
                <>
                  Establish Connection
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <Link 
            to="/" 
            className="mt-16 block text-center text-[9px] font-bold text-text-muted hover:text-accent transition-all uppercase tracking-[0.3em] border-t border-border-base pt-8"
          >
            &larr; Return to Public Records
          </Link>
        </div>

        <p className="mt-12 text-center text-[9px] text-text-base/20 uppercase tracking-[0.4em] font-bold">
          MAVREN EDITORIAL SYSTEM v2.0
        </p>
      </motion.div>
    </div>
  );
}
