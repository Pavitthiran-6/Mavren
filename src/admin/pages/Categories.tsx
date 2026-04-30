import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Category } from '../../types';
import { Plus, Trash2, Edit2, X, Check } from 'lucide-react';

export default function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [newCatName, setNewCatName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    setLoading(true);
    const { data, error } = await supabase.from('categories').select('*').order('name');
    if (data) setCategories(data);
    setLoading(false);
  }

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    const { error } = await supabase.from('categories').insert({ name: newCatName });
    if (!error) {
      setNewCatName('');
      fetchCategories();
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId || !editName.trim()) return;
    const { error } = await supabase.from('categories').update({ name: editName }).eq('id', editingId);
    if (!error) {
      setEditingId(null);
      fetchCategories();
    }
  };

  const startEdit = (cat: Category) => {
    setEditingId(cat.id);
    setEditName(cat.name);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('All products in this category will become un-categorized. Continue?')) return;
    const { error } = await supabase.from('categories').delete().eq('id', id);
    if (!error) fetchCategories();
  };

  return (
    <div className="max-w-5xl space-y-16 px-6 py-10 pb-20">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl lg:text-4xl font-display font-light tracking-tight text-text-base">Taxonomy Core</h1>
        <p className="text-[10px] uppercase font-bold tracking-[0.3em] text-text-muted">Archival Classification & Structuring</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="bg-white p-8 md:p-12 rounded-[3.5rem] border border-border-base h-fit shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
            <h2 className="text-2xl font-display font-light tracking-tight">Active Records</h2>
            <span className="text-[10px] font-bold uppercase tracking-widest text-text-muted bg-surface px-4 py-1.5 rounded-full border border-border-base/50">{categories.length} Total</span>
          </div>
          <div className="space-y-4">
            {loading ? (
              <p className="text-[10px] uppercase font-bold tracking-widest text-text-muted animate-pulse">Scanning Archive Taxonomy...</p>
            ) : categories.length === 0 ? (
              <p className="text-[10px] uppercase font-bold tracking-widest text-text-muted italic">No records found.</p>
            ) : (
              categories.map(cat => (
                <div key={cat.id} className="flex flex-col sm:flex-row justify-between sm:items-center p-6 bg-surface/30 rounded-[2rem] border border-border-base transition-all group gap-6">
                  {editingId === cat.id ? (
                    <form onSubmit={handleUpdate} className="flex-grow flex flex-col sm:flex-row gap-4 w-full">
                      <input
                        autoFocus
                        className="flex-grow bg-white border border-accent rounded-full px-6 py-4 text-[11px] font-bold uppercase tracking-widest outline-none focus:ring-0 shadow-lg shadow-accent/5 w-full"
                        value={editName}
                        onChange={e => setEditName(e.target.value)}
                      />
                      <div className="flex gap-2 justify-center sm:justify-end">
                        <button type="submit" className="h-12 w-12 flex items-center justify-center bg-accent text-white rounded-full hover:bg-black transition-all shadow-md shadow-accent/10"><Check size={18} /></button>
                        <button type="button" onClick={() => setEditingId(null)} className="h-12 w-12 flex items-center justify-center bg-white text-text-muted rounded-full hover:text-red-600 transition-all shadow-sm"><X size={18} /></button>
                      </div>
                    </form>
                  ) : (
                    <>
                      <span className="font-bold text-[12px] sm:text-[11px] uppercase tracking-[0.15em] text-text-base transition-colors group-hover:text-accent text-center sm:text-left break-words">{cat.name}</span>
                      <div className="flex gap-2 justify-center sm:justify-end border-t sm:border-t-0 border-border-base/50 pt-4 sm:pt-0">
                        <button
                          onClick={() => startEdit(cat)}
                          className="h-12 w-12 sm:h-10 sm:w-10 flex items-center justify-center bg-white text-text-muted hover:text-accent rounded-full shadow-sm hover:shadow-md transition-all active:scale-95"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(cat.id)}
                          className="h-12 w-12 sm:h-10 sm:w-10 flex items-center justify-center bg-white text-text-muted hover:text-red-600 rounded-full shadow-sm hover:shadow-md transition-all active:scale-95"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        <div className="space-y-12">
          <div className="bg-white p-6 sm:p-10 md:p-12 rounded-[3.5rem] border border-border-base shadow-sm">
            <h2 className="text-2xl font-display font-light tracking-tight mb-10">Define New Piece</h2>
            <form onSubmit={handleAdd} className="space-y-10">
              <div className="space-y-4">
                <label className="block text-[9px] uppercase tracking-[0.3em] font-bold text-text-base/40 ml-1">Classification Name</label>
                <input
                  required
                  className="w-full bg-transparent border-b border-border-base px-0 py-4 text-[11px] font-bold uppercase tracking-widest focus:border-accent outline-none transition-all placeholder:text-text-base/10"
                  placeholder="E.G. CHRONOGRAPHS"
                  value={newCatName}
                  onChange={e => setNewCatName(e.target.value)}
                />
              </div>
              <button className="w-full bg-text-base hover:bg-accent text-white h-14 sm:h-16 rounded-full font-bold text-[9px] sm:text-[10px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 shadow-xl shadow-text-base/10 active:scale-95 whitespace-nowrap px-4 sm:px-6 outline-none focus:ring-2 focus:ring-accent ring-offset-2">
                <Plus size={16} className="shrink-0 hidden sm:block" />
                <span>Validate & Register</span>
              </button>
            </form>
          </div>

          <div className="bg-surface p-10 md:p-12 rounded-[3rem] border border-border-base/50">
            <h3 className="text-[10px] font-bold text-accent uppercase tracking-[0.3em] mb-4">Structural Directive</h3>
            <p className="text-[11px] text-text-muted leading-relaxed uppercase tracking-wider font-medium">Maintain broad and conceptual classifications. A high-impact archive thrives on 6-12 core taxonomy groups for optimal artifact discovery.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
