import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { ContactMessage } from '../../types';
import { 
  Mail, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  ChevronRight, 
  Search, 
  Filter, 
  RefreshCcw,
  User,
  ExternalLink,
  Circle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';

export default function AdminMessages() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);

  const fetchMessages = async () => {
    setLoading(true);
    let query = supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false });

    if (filter === 'unread') query = query.eq('is_read', false);
    if (filter === 'read') query = query.eq('is_read', true);

    const { data, error } = await query;

    if (!error && data) {
      setMessages(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMessages();
  }, [filter]);

  // Automatically mark as read when selecting an unread message
  useEffect(() => {
    if (selectedMessage && !selectedMessage.is_read) {
      markAsRead(selectedMessage.id);
    }
  }, [selectedMessage?.id]);

  const markAsRead = async (id: string) => {
    const { error } = await supabase
      .from('contact_messages')
      .update({ is_read: true })
      .eq('id', id);

    if (!error) {
      setMessages(messages.map(m => m.id === id ? { ...m, is_read: true } : m));
      if (selectedMessage?.id === id) {
        setSelectedMessage({ ...selectedMessage, is_read: true });
      }
    }
  };

  const deleteMessage = async (id: string) => {
    if (!confirm('Are you sure you want to delete this inquiry?')) return;
    
    const { error } = await supabase
      .from('contact_messages')
      .delete()
      .eq('id', id);

    if (!error) {
      setMessages(messages.filter(m => m.id !== id));
      if (selectedMessage?.id === id) setSelectedMessage(null);
    }
  };

  const filteredMessages = messages.filter(m => 
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.message.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-full pb-20">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10 mb-16">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl lg:text-4xl font-display font-light tracking-tight text-text-base">Inquiry Archive</h1>
          <p className="text-[10px] uppercase font-bold tracking-[0.3em] text-text-muted">Global Communication & Feedback Protocol</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative flex-grow sm:flex-grow-0">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-base/20" size={14} />
            <input 
              type="text"
              placeholder="Filter by name, email, or content..."
              className="bg-white border border-border-base rounded-full pl-10 pr-6 py-3.5 text-[10px] font-bold uppercase tracking-widest focus:border-accent outline-none w-full sm:w-72 transition-all placeholder:text-text-base/10 shadow-sm shadow-text-base/5"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
          <button 
            onClick={fetchMessages}
            className="h-12 w-12 bg-white border border-border-base rounded-full hover:bg-surface transition-all text-text-muted flex items-center justify-center shadow-sm shadow-text-base/5 active:scale-95"
          >
            <RefreshCcw size={16} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* List Panel */}
        <div className={cn(
          "lg:col-span-4 space-y-8",
          selectedMessage && "hidden lg:block"
        )}>
          <div className="flex p-1.5 bg-white border border-border-base rounded-full shadow-sm shadow-text-base/5">
            {(['all', 'unread', 'read'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  "flex-1 py-3 text-[9px] font-bold uppercase tracking-[0.2em] rounded-full transition-all duration-300",
                  filter === f ? "bg-text-base text-white shadow-md shadow-text-base/20" : "text-text-muted hover:text-text-base"
                )}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="space-y-4 overflow-y-auto max-h-[calc(100vh-320px)] custom-scrollbar pr-3">
            {loading ? (
              Array(5).fill(0).map((_, i) => (
                <div key={i} className="h-32 bg-white rounded-[2rem] border border-border-base animate-pulse opacity-50" />
              ))
            ) : filteredMessages.length === 0 ? (
              <div className="text-center py-24 bg-white rounded-[3rem] border border-dashed border-border-base shadow-sm">
                <Mail className="mx-auto text-text-base/5 mb-6" size={48} strokeWidth={1} />
                <p className="text-[10px] text-text-muted font-bold uppercase tracking-[0.3em]">No items in archive</p>
              </div>
            ) : (
              filteredMessages.map((msg) => (
                <button
                  key={msg.id}
                  onClick={() => setSelectedMessage(msg)}
                  className={cn(
                    "w-full text-left p-6 rounded-[2.5rem] border transition-all duration-500 group relative",
                    selectedMessage?.id === msg.id 
                      ? "bg-white border-accent shadow-md shadow-accent/5" 
                      : "bg-white border-border-base hover:border-text-base shadow-sm shadow-text-base/5"
                  )}
                >
                  {!msg.is_read && (
                    <div className="absolute top-6 right-8 h-2 w-2 bg-accent rounded-full animate-pulse shadow-glow shadow-accent/50" />
                  )}
                  <div className="flex justify-between items-start mb-4">
                    <p className={cn(
                      "font-bold text-[11px] uppercase tracking-widest truncate pr-6 transition-colors",
                      selectedMessage?.id === msg.id ? "text-accent" : "text-text-base"
                    )}>{msg.name}</p>
                    <time className="text-[9px] font-bold text-text-muted/40 uppercase tracking-widest shrink-0">
                      {new Date(msg.created_at).toLocaleDateString()}
                    </time>
                  </div>
                  <p className="text-[10px] font-bold text-text-muted uppercase tracking-[0.1em] mb-2 truncate">{msg.email}</p>
                  <p className="text-[11px] text-text-muted italic line-clamp-1 leading-relaxed">"{msg.message}"</p>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Content Panel */}
        <div className="lg:col-span-8">
          <AnimatePresence mode="wait">
            {selectedMessage ? (
              <motion.div
                key={selectedMessage.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                className="bg-white border border-border-base rounded-[3.5rem] p-10 md:p-16 relative flex flex-col shadow-sm shadow-text-base/5 min-h-[600px]"
              >
                <div className="flex justify-between items-center mb-16">
                   <button 
                    onClick={() => setSelectedMessage(null)}
                    className="lg:hidden h-12 w-12 flex items-center justify-center bg-surface rounded-full text-text-muted"
                   >
                     <ChevronRight className="rotate-180" size={18} />
                   </button>
                   
                   <div className="flex items-center gap-4 ml-auto">
                      {!selectedMessage.is_read && (
                        <button 
                          onClick={() => markAsRead(selectedMessage.id)}
                          className="flex items-center gap-3 px-6 py-2.5 bg-accent/5 text-accent border border-accent/20 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-accent hover:text-white transition-all duration-500"
                        >
                          <CheckCircle2 size={14} /> Validate Piece
                        </button>
                      )}
                      <button 
                        onClick={() => deleteMessage(selectedMessage.id)}
                        className="h-12 w-12 flex items-center justify-center bg-surface text-text-muted hover:text-red-600 border border-border-base rounded-full transition-all duration-300 active:scale-90"
                      >
                        <Trash2 size={16} />
                      </button>
                   </div>
                </div>

                <div className="space-y-16 flex-grow">
                  <div>
                    <h2 className="text-[9px] uppercase tracking-[0.4em] font-bold text-text-base/30 mb-10 block border-b border-border-base pb-6">Origin Metadata</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                       <div className="flex items-start gap-4 sm:gap-6 min-w-0 w-full">
                          <div className="h-10 w-10 sm:h-14 sm:w-14 bg-surface rounded-full flex items-center justify-center text-text-base border border-border-base/50 shrink-0">
                            <User size={18} strokeWidth={1.5} />
                          </div>
                          <div className="flex flex-col min-w-0 w-full">
                            <p className="text-[9px] uppercase tracking-widest font-bold text-text-muted mb-1">Authenticated Identity</p>
                            <p className="text-sm sm:text-base font-bold uppercase tracking-widest text-text-base leading-tight break-words line-clamp-2">{selectedMessage.name}</p>
                          </div>
                       </div>
                       <div className="flex items-start gap-4 sm:gap-6 min-w-0 w-full">
                          <div className="h-10 w-10 sm:h-14 sm:w-14 bg-surface rounded-full flex items-center justify-center text-text-base border border-border-base/50 shrink-0">
                            <Mail size={18} strokeWidth={1.5} />
                          </div>
                          <div className="flex flex-col min-w-0 w-full">
                            <p className="text-[9px] uppercase tracking-widest font-bold text-text-muted mb-1">Communication Protocol</p>
                            <p className="text-sm sm:text-base font-bold uppercase tracking-widest text-text-base truncate overflow-hidden whitespace-nowrap">{selectedMessage.email}</p>
                          </div>
                       </div>
                    </div>
                  </div>

                  <div className="flex flex-col flex-grow">
                     <h2 className="text-[9px] uppercase tracking-[0.4em] font-bold text-text-base/30 mb-10 block border-b border-border-base pb-6">Editorial Submission</h2>
                     <div className="bg-surface/30 border border-border-base rounded-[3rem] p-10 md:p-14 relative flex-grow flex flex-col justify-center">
                        <p className="text-sm md:text-base leading-relaxed text-text-base italic font-medium max-w-2xl mx-auto text-center">
                          "{selectedMessage.message}"
                        </p>
                        <div className="mt-12 flex items-center justify-center gap-3 text-[9px] font-bold text-text-muted uppercase tracking-[0.3em] opacity-40">
                          <Clock size={12} />
                          Documented At: {new Date(selectedMessage.created_at).toLocaleString()}
                        </div>
                     </div>
                  </div>
                </div>

                <div className="mt-16 pt-10 border-t border-border-base flex justify-center">
                   <a 
                    href={`mailto:${selectedMessage.email}?subject=Re: MAVREN Inquiry Response`}
                    className="group flex items-center gap-4 text-[10px] font-bold text-text-base hover:text-accent transition-all uppercase tracking-[0.3em]"
                   >
                     Initiate Correspondence 
                     <span className="h-10 w-10 flex items-center justify-center bg-surface group-hover:bg-accent group-hover:text-white rounded-full transition-all duration-500">
                      <ExternalLink size={14} />
                     </span>
                   </a>
                </div>
              </motion.div>
            ) : (
              <div className="hidden lg:flex flex-col h-full min-h-[600px] items-center justify-center bg-white rounded-[4rem] border border-dashed border-border-base text-text-muted p-20 text-center">
                <Circle className="text-text-base/5 mb-8 animate-pulse" size={64} strokeWidth={0.5} />
                <p className="text-[10px] uppercase font-bold tracking-[0.4em] leading-relaxed">
                  Select an archival protocol <br/> to initiate analysis.
                </p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
