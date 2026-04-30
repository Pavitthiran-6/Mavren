import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, User, MessageSquare, Send, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { cn } from '../lib/utils';

export default function Contact() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error: submitError } = await supabase
        .from('contact_messages')
        .insert([formData]);

      if (submitError) throw submitError;

      setSuccess(true);
      setFormData({ name: '', email: '', message: '' });
      
      // Reset success message after 5 seconds
      setTimeout(() => setSuccess(false), 5000);
    } catch (err: any) {
      console.error('Contact error:', err);
      setError(err.message || 'Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pb-32 px-6">
      <div className="max-w-4xl mx-auto pt-16">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-24"
        >
          <span className="text-accent text-[10px] font-bold uppercase tracking-[0.3em] mb-6 block">Direct Inquiry</span>
          <h1 className="text-5xl md:text-6xl font-display font-light mb-8 tracking-tight text-text-base leading-tight">Connect with the <br/>Editorial Team</h1>
            Project suggestions, collaboration requests, and technical inquiries. Our team reviews every artifact in our MAVREN collection.

        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-7"
          >
            <div className="bg-white border border-border-base rounded-[2.5rem] p-10 md:p-16 relative overflow-hidden shadow-sm">
              {success ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12"
                >
                  <div className="h-20 w-20 bg-accent/5 rounded-full flex items-center justify-center text-accent mx-auto mb-8">
                    <CheckCircle size={32} strokeWidth={1.5} />
                  </div>
                  <h2 className="text-2xl font-display font-medium mb-4">Transmission Received</h2>
                  <p className="text-[10px] uppercase tracking-widest font-bold text-text-muted mb-10">Editorial team will respond within 48h.</p>
                  <button 
                    onClick={() => setSuccess(false)}
                    className="text-text-base font-bold text-[10px] uppercase tracking-[0.2em] hover:text-accent transition-colors border-b border-border-base pb-1"
                  >
                    Send another dispatch
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-3">
                      <label className="text-[9px] uppercase tracking-[0.2em] font-bold text-text-base/40 ml-1">Identity</label>
                      <div className="relative group">
                        <User className="absolute left-0 top-1/2 -translate-y-1/2 text-text-base/20 group-focus-within:text-accent transition-colors" size={14} />
                        <input 
                          required
                          type="text"
                          placeholder="Your Name"
                          className="w-full bg-transparent border-b border-border-base pl-8 pr-4 py-4 text-xs font-bold uppercase tracking-widest focus:border-accent outline-none transition-all placeholder:text-text-base/20"
                          value={formData.name}
                          onChange={e => setFormData({...formData, name: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <label className="text-[9px] uppercase tracking-[0.2em] font-bold text-text-base/40 ml-1">Archive Email</label>
                      <div className="relative group">
                        <Mail className="absolute left-0 top-1/2 -translate-y-1/2 text-text-base/20 group-focus-within:text-accent transition-colors" size={14} />
                        <input 
                          required
                          type="email"
                          placeholder="email@example.com"
                          className="w-full bg-transparent border-b border-border-base pl-8 pr-4 py-4 text-xs font-bold uppercase tracking-widest focus:border-accent outline-none transition-all placeholder:text-text-base/20"
                          value={formData.email}
                          onChange={e => setFormData({...formData, email: e.target.value})}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[9px] uppercase tracking-[0.2em] font-bold text-text-base/40 ml-1">Project Details</label>
                    <div className="relative group">
                      <MessageSquare className="absolute left-0 top-6 text-text-base/20 group-focus-within:text-accent transition-colors" size={14} />
                      <textarea 
                        required
                        rows={5}
                        placeholder="Detail your inquiry for our editorial team..."
                        className="w-full bg-transparent border-b border-border-base pl-8 pr-4 py-4 text-xs font-medium focus:border-accent outline-none transition-all resize-none placeholder:text-text-base/20 leading-relaxed"
                        value={formData.message}
                        onChange={e => setFormData({...formData, message: e.target.value})}
                      />
                    </div>
                  </div>

                  {error && (
                    <div className="flex items-center gap-3 text-red-800 text-[10px] font-bold uppercase tracking-widest bg-red-50 p-4 rounded-xl">
                      <AlertCircle size={14} />
                      {error}
                    </div>
                  )}

                  <button 
                    disabled={loading}
                    className="w-full bg-text-base hover:bg-accent text-white py-5 rounded-full font-bold text-[10px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-4 disabled:opacity-50 active:scale-[0.98]"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="animate-spin" size={16} />
                        Dispatching...
                      </>
                    ) : (
                      <>
                        Send Dispatch
                        <Send size={14} />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-5 flex flex-col gap-8 lg:pt-16"
          >
            {[
              { label: "Digital Studio", value: "@mavren.studio" },
              { label: "Editorial Inquiries", value: "editorial@mavren.studio" },
              { label: "Availability", value: "24-48h RESPONSE TIME" }
            ].map((item, i) => (
              <div key={i} className="flex flex-col gap-2 group">
                <span className="text-[9px] uppercase tracking-[0.3em] font-bold text-text-base/30 group-hover:text-accent transition-colors">{item.label}</span>
                <p className="text-lg font-display font-light tracking-tight group-hover:translate-x-1 transition-transform">{item.value}</p>
              </div>
            ))}

            <div className="mt-12 pt-12 border-t border-border-base">
              <h3 className="text-[9px] uppercase tracking-[0.3em] font-bold text-text-base/30 mb-6 text-center lg:text-left">Global Editorial Bases</h3>
              <div className="flex justify-between lg:justify-start lg:gap-12 text-[10px] font-bold uppercase tracking-widest text-text-muted">
                <span>London</span>
                <span>Paris</span>
                <span>Tokyo</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
