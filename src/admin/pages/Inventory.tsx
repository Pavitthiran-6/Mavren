import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Product, Category } from '../../types';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit2, 
  Trash2, 
  X,
  Upload,
  Check
} from 'lucide-react';
import { cn, formatCurrency } from '../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import Dropdown from '../../components/Dropdown';

export default function AdminInventory() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    discount_price: '',
    category: '',
    affiliate_link: '',
    is_featured: false,
    curator_rating: 5,
    curator_verdict: '',
    tags: '',
    highs: '',
    lows: '',
    pros: '',
    cons: '',
    is_new_arrival: false,
    is_under_999: false,
  });
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    const { data: prodData, error: prodErr } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    const { data: catData, error: catErr } = await supabase.from('categories').select('*');
    if (prodErr) console.error('Products Fetch Error:', prodErr);
    if (catErr) console.error('Categories Fetch Error:', catErr);
    if (prodData) setProducts(prodData);
    if (catData) setCategories(catData);
    setLoading(false);
  }

  const handleOpenModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        title: product.title,
        description: product.description,
        price: product.price.toString(),
        discount_price: (product as any).discount?.toString() || '',
        category: (product as any).category_id || '',
        affiliate_link: product.affiliate_link,
        is_featured: product.is_featured,
        curator_rating: product.curator_rating || 5,
        curator_verdict: product.curator_verdict || '',
        tags: Array.isArray(product.tags) ? product.tags.join(', ') : (product.tags || ''),
        highs: Array.isArray(product.highs) ? product.highs.join(', ') : (product.highs || ''),
        lows: Array.isArray(product.lows) ? product.lows.join(', ') : (product.lows || ''),
        pros: Array.isArray(product.pros) ? product.pros.join(', ') : (product.pros || ''),
        cons: Array.isArray(product.cons) ? product.cons.join(', ') : (product.cons || ''),
        is_new_arrival: !!product.is_new_arrival,
        is_under_999: !!product.is_under_999,
      });
    } else {
      setEditingProduct(null);
      setFormData({
        title: '',
        description: '',
        price: '',
        discount_price: '',
        category: '',
        affiliate_link: '',
        is_featured: false,
        curator_rating: 5,
        curator_verdict: '',
        tags: '',
        highs: '',
        lows: '',
        pros: '',
        cons: '',
        is_new_arrival: false,
        is_under_999: false,
      });
    }
    setCoverFile(null);
    setGalleryFiles([]);
    setIsModalOpen(true);
  };

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert("Cover image exceeds 5MB limit.");
      return;
    }
    setCoverFile(file);
  };

  const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []) as File[];
    const validFiles = files.filter(file => {
      if (file.size > 5 * 1024 * 1024) {
        alert(`${file.name} exceeds 5MB and was skipped.`);
        return false;
      }
      return true;
    });
    setGalleryFiles(prev => [...prev, ...validFiles]);
  };

  const removeGalleryFile = (index: number) => {
    setGalleryFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    console.time('Syncing Artifacts');

    try {
      let finalCoverUrl = editingProduct?.cover_image_url || editingProduct?.image_url || '';
      let finalGalleryUrls = editingProduct?.gallery_images ? editingProduct.gallery_images.split(',').filter(Boolean) : [];

      // 1. Handle Cover Upload
      if (coverFile) {
        const fileName = `public/cover-${Date.now()}-${coverFile.name}`;
        const { error: uploadError } = await supabase.storage.from("product-images").upload(fileName, coverFile);
        if (uploadError) throw uploadError;
        const { data: { publicUrl } } = supabase.storage.from("product-images").getPublicUrl(fileName);
        finalCoverUrl = publicUrl;
      }

      // 2. Handle Gallery Uploads
      if (galleryFiles.length > 0) {
        const uploadPromises = galleryFiles.map(async (file) => {
          const fileName = `public/gallery-${Date.now()}-${file.name}`;
          const { error } = await supabase.storage.from("product-images").upload(fileName, file);
          if (error) throw error;
          const { data: { publicUrl } } = supabase.storage.from("product-images").getPublicUrl(fileName);
          return publicUrl;
        });
        const newGalleryUrls = await Promise.all(uploadPromises);
        finalGalleryUrls = [...finalGalleryUrls, ...newGalleryUrls];
      }

      const productPayload = {
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price),
        discount: formData.discount_price ? parseFloat(formData.discount_price) : null,
        category_id: formData.category,
        affiliate_link: formData.affiliate_link,
        is_featured: formData.is_featured,
        curator_rating: formData.curator_rating,
        curator_verdict: formData.curator_verdict,
        tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
        highs: formData.highs.split(',').map(t => t.trim()).filter(Boolean),
        lows: formData.lows.split(',').map(t => t.trim()).filter(Boolean),
        pros: formData.pros.split(',').map(t => t.trim()).filter(Boolean),
        cons: formData.cons.split(',').map(t => t.trim()).filter(Boolean),
        is_new_arrival: formData.is_new_arrival,
        is_under_999: formData.is_under_999,
        image_url: finalCoverUrl, // For backward compatibility
        cover_image_url: finalCoverUrl,
        gallery_images: finalGalleryUrls.join(','),
      };

      let updatedProduct: Product | null = null;
      if (editingProduct) {
        const { data, error } = await supabase.from('products').update(productPayload).eq('id', editingProduct.id).select().single();
        if (error) throw error;
        updatedProduct = data;
      } else {
        const { data, error } = await supabase.from('products').insert([productPayload]).select().single();
        if (error) throw error;
        updatedProduct = data;
      }

      // Optimistic UI
      if (updatedProduct) {
        if (editingProduct) setProducts(prev => prev.map(p => p.id === updatedProduct!.id ? updatedProduct! : p));
        else setProducts(prev => [updatedProduct!, ...prev]);
      }

      setIsModalOpen(false);
      console.timeEnd('Syncing Artifacts');
    } catch (err) {
      console.error('Save error:', err);
      alert('Failed to save. Check console.');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this curation?')) return;
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (!error) fetchData();
  };

  return (
    <div className="space-y-12 max-w-full overflow-x-hidden">
      <div className="flex flex-wrap lg:flex-nowrap justify-between items-start lg:items-end gap-10">
        <div className="w-full lg:w-auto">
          <h1 className="text-3xl lg:text-4xl font-display font-light tracking-tight text-text-base mb-2 text-center lg:text-left">Artifact Management</h1>
          <p className="text-[10px] uppercase font-bold tracking-[0.3em] text-text-muted text-center lg:text-left">Global Digital Inventory & Provenance</p>
        </div>
        <div className="flex flex-wrap sm:flex-nowrap gap-4 w-full lg:w-auto">
          <button className="h-14 w-14 bg-white text-text-muted flex items-center justify-center rounded-full border border-border-base shrink-0 hover:text-accent transition-all active:scale-[0.98]">
            <Filter size={18} />
          </button>
          <button 
            onClick={() => handleOpenModal()}
            className="h-14 flex-grow sm:flex-grow-0 bg-text-base hover:bg-accent text-white px-10 rounded-full flex items-center justify-center gap-3 text-[10px] font-bold uppercase tracking-[0.2em] transition-all whitespace-nowrap active:scale-[0.98]"
          >
            <Plus size={18} />
            <span>Document New Piece</span>
          </button>
        </div>
      </div>

      {/* Product List - Mobile Cards */}
      <div className="grid grid-cols-1 gap-8 md:hidden">
        {loading ? (
          <div className="bg-white p-20 rounded-[3rem] text-center text-[10px] font-bold uppercase tracking-widest text-text-muted border border-border-base/50 animate-pulse">Scanning Archive...</div>
        ) : products.length === 0 ? (
          <div className="bg-white p-20 rounded-[3rem] text-center text-[10px] font-bold uppercase tracking-widest text-text-muted border border-dashed border-border-base">Archive Empty</div>
        ) : products.map(product => (
          <div key={product.id} className="bg-white rounded-[2.5rem] border border-border-base p-6 space-y-6 shadow-sm">
            <div className="flex items-center gap-6">
              <div className="h-20 w-20 bg-surface rounded-2xl p-3 border border-border-base/50 shrink-0">
                <img src={product.image_url} alt="" className="h-full w-full object-contain" />
              </div>
              <div className="min-w-0">
                <p className="font-bold text-[11px] uppercase tracking-widest text-text-base mb-2 line-clamp-2">{product.title}</p>
                <div className="flex items-center gap-3">
                  <span className="text-[9px] text-text-muted uppercase tracking-[0.2em] font-bold">{product.category}</span>
                  {product.is_featured && (
                    <span className="text-[8px] bg-accent/5 text-accent border border-accent/20 px-2 py-0.5 rounded font-bold uppercase tracking-widest">Featured</span>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex justify-between items-center pt-6 border-t border-border-base/30">
              <span className="text-lg font-light tracking-tight">{formatCurrency(product.price)}</span>
              <div className="flex gap-3">
                <button 
                  onClick={() => handleOpenModal(product)}
                  className="h-12 w-12 bg-surface rounded-full flex items-center justify-center text-text-muted hover:text-accent transition-all active:scale-[0.95]"
                >
                  <Edit2 size={16} />
                </button>
                <button 
                  onClick={() => handleDelete(product.id)}
                  className="h-12 w-12 bg-surface rounded-full flex items-center justify-center text-text-muted hover:text-red-600 transition-all active:scale-[0.95]"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Product List - Desktop Table */}
      <div className="hidden md:block bg-white rounded-[3rem] border border-border-base overflow-hidden shadow-sm">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="border-b border-border-base bg-surface/30">
                <th className="p-8 text-[9px] uppercase tracking-[0.3em] font-bold text-text-muted/60">Product Artifact</th>
                <th className="p-8 text-[9px] uppercase tracking-[0.3em] font-bold text-text-muted/60">Classification</th>
                <th className="p-8 text-[9px] uppercase tracking-[0.3em] font-bold text-text-muted/60">Valuation</th>
                <th className="p-8 text-[9px] uppercase tracking-[0.3em] font-bold text-text-muted/60 text-center">Status</th>
                <th className="p-8 text-[9px] uppercase tracking-[0.3em] font-bold text-text-muted/60 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} className="p-32 text-center text-[10px] uppercase font-bold tracking-[0.3em] text-text-muted animate-pulse">Scanning Digital Catalog...</td></tr>
              ) : products.length === 0 ? (
                <tr><td colSpan={5} className="p-32 text-center text-[10px] uppercase font-bold tracking-[0.3em] text-text-muted italic">Digital vault remains empty.</td></tr>
              ) : products.map(product => (
                <tr key={product.id} className="border-b border-border-base/50 hover:bg-surface/20 transition-all group">
                  <td className="p-8">
                    <div className="flex items-center gap-6">
                      <div className="h-14 w-14 bg-surface rounded-xl p-2 border border-border-base/50 group-hover:scale-110 transition-transform duration-500">
                        <img src={product.image_url} alt="" className="h-full w-full object-contain" />
                      </div>
                      <div>
                        <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-text-base mb-1 group-hover:text-accent transition-colors line-clamp-2">{product.title}</p>
                        <p className="text-[8px] text-text-muted uppercase tracking-widest font-bold">ARC-ID: {product.id.slice(0, 8)}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-8">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-text-muted">
                      {categories.find(c => c.id === product.category_id)?.name || 'General'}
                    </span>
                  </td>
                  <td className="p-8">
                    <span className="text-base font-light tracking-tight">{formatCurrency(product.price)}</span>
                  </td>
                  <td className="p-8 text-center">
                    {product.is_featured ? (
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/5 text-accent text-[8px] font-bold uppercase tracking-widest border border-accent/20">
                        <Check size={10} /> Primed
                      </div>
                    ) : (
                      <span className="text-[8px] text-text-muted/40 uppercase font-bold tracking-widest">Archived</span>
                    )}
                  </td>
                  <td className="p-8">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => handleOpenModal(product)}
                        className="p-3 text-text-muted hover:text-accent transition-all hover:bg-surface rounded-full"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(product.id)}
                        className="p-3 text-text-muted hover:text-red-600 transition-all hover:bg-surface rounded-full"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal / Overlay */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 sm:p-6 lg:p-12 overflow-y-auto">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="fixed inset-0 bg-text-base/20 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.98, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: 10 }}
              className="relative w-full h-full sm:h-auto sm:max-h-[92vh] max-w-5xl bg-white sm:rounded-[3rem] shadow-2xl overflow-hidden flex flex-col border border-border-base"
            >
              <div className="p-8 sm:p-12 border-b border-border-base flex justify-between items-center shrink-0">
                <div className="flex flex-col gap-2">
                  <h2 className="text-3xl font-display font-light tracking-tight">
                    {editingProduct ? 'Update Editorial' : 'Document New Piece'}
                  </h2>
                  <p className="text-[9px] uppercase font-bold tracking-widest text-text-muted">MAVREN Certification Protocol</p>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="h-12 w-12 bg-surface rounded-full flex items-center justify-center text-text-muted hover:text-accent transition-all">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-8 sm:p-12 overflow-y-auto space-y-12 flex-grow custom-scrollbar">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 sm:gap-16">
                  <div className="lg:col-span-5 space-y-8">
                    {/* Cover Asset */}
                    <div className="space-y-4">
                      <label className="block text-[9px] uppercase tracking-[0.2em] font-bold text-accent ml-1">Primary Cover Asset</label>
                      <div className="aspect-square rounded-[2rem] border-2 border-dashed border-border-base bg-surface/30 relative overflow-hidden flex items-center justify-center cursor-pointer hover:border-accent/40 transition-all p-8">
                        {coverFile || (editingProduct && (editingProduct.cover_image_url || editingProduct.image_url)) ? (
                          <img 
                            src={coverFile ? URL.createObjectURL(coverFile) : (editingProduct?.cover_image_url || editingProduct?.image_url)} 
                            className="w-full h-full object-contain" 
                          />
                        ) : (
                          <div className="text-center">
                            <Upload size={24} className="mx-auto mb-4 text-accent/40" />
                            <p className="text-[9px] font-bold uppercase tracking-widest">Select Cover</p>
                          </div>
                        )}
                        <input type="file" accept="image/*" onChange={handleCoverChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                      </div>
                    </div>

                    {/* Gallery Artifacts */}
                    <div className="space-y-4">
                      <label className="block text-[9px] uppercase tracking-[0.2em] font-bold text-text-base/40 ml-1">Gallery Artifacts</label>
                      <div className="grid grid-cols-3 gap-4">
                        {/* Existing/Pending Gallery Previews */}
                        {editingProduct?.gallery_images?.split(',').filter(Boolean).map((url, i) => (
                          <div key={`existing-${i}`} className="aspect-square rounded-xl bg-surface border border-border-base overflow-hidden">
                            <img src={url} className="h-full w-full object-cover opacity-50" />
                          </div>
                        ))}
                        {galleryFiles.map((file, i) => (
                          <div key={`new-${i}`} className="aspect-square rounded-xl bg-accent/5 border border-accent/20 overflow-hidden relative group">
                            <img src={URL.createObjectURL(file)} className="h-full w-full object-cover" />
                            <button 
                              type="button"
                              onClick={() => removeGalleryFile(i)}
                              className="absolute inset-0 bg-accent/80 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        ))}
                        {/* Add More Button */}
                        <div className="aspect-square rounded-xl border-2 border-dashed border-border-base flex items-center justify-center relative hover:bg-surface transition-all">
                          <Plus size={16} className="text-text-muted" />
                          <input type="file" multiple accept="image/*" onChange={handleGalleryChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Essentials */}
                  <div className="lg:col-span-7 space-y-10">
                    <div className="space-y-4">
                      <label className="block text-[9px] uppercase tracking-[0.2em] font-bold text-text-base/40 ml-1">Editorial Title</label>
                      <input 
                        required
                        className="w-full bg-transparent border-b border-border-base px-0 py-4 text-xs font-bold uppercase tracking-widest focus:border-accent outline-none transition-all placeholder:text-text-base/10" 
                        placeholder="DESIGNATION NAME"
                        value={formData.title}
                        onChange={e => setFormData({...formData, title: e.target.value})}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-10">
                      <div className="space-y-4">
                        <label className="block text-[9px] uppercase tracking-[0.2em] font-bold text-text-base/40 ml-1">Valuation (INR)</label>
                        <input 
                          required
                          type="number"
                          className="w-full bg-transparent border-b border-border-base px-0 py-4 text-lg font-light tracking-tight focus:border-accent outline-none transition-all" 
                          placeholder="00.00"
                          value={formData.price}
                          onChange={e => setFormData({...formData, price: e.target.value})}
                        />
                      </div>
                      <div className="space-y-4">
                        <label className="block text-[9px] uppercase tracking-[0.2em] font-bold text-text-base/40 ml-1">Reference Pricing</label>
                        <input 
                          type="number"
                          className="w-full bg-transparent border-b border-border-base px-0 py-4 text-lg font-light tracking-tight opacity-40 focus:border-accent outline-none transition-all" 
                          placeholder="00.00"
                          value={formData.discount_price}
                          onChange={e => setFormData({...formData, discount_price: e.target.value})}
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <label className="block text-[9px] uppercase tracking-[0.2em] font-bold text-text-base/40 ml-1">Editorial Classification</label>
                      <Dropdown 
                        className="w-full"
                        placeholder="Select MAVREN Category"
                        value={formData.category}
                        onChange={(val) => setFormData({...formData, category: val})}
                        options={categories.map(cat => ({ label: cat.name, value: cat.id }))}
                      />
                    </div>

                    <div className="space-y-4">
                      <label className="block text-[9px] uppercase tracking-[0.2em] font-bold text-text-base/40 ml-1">Affiliate Destination</label>
                      <input 
                        required
                        className="w-full bg-transparent border-b border-border-base px-0 py-4 text-[10px] font-mono tracking-widest text-text-muted focus:border-accent outline-none transition-all" 
                        placeholder="HTTPS://SOURCE.COM/..."
                        value={formData.affiliate_link}
                        onChange={e => setFormData({...formData, affiliate_link: e.target.value})}
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-6">
                      <label className="flex items-center gap-4 cursor-pointer group bg-surface/50 p-4 rounded-2xl border border-transparent hover:border-accent/20 transition-all">
                        <div className={cn(
                          "h-6 w-6 rounded-full border transition-all flex items-center justify-center shrink-0",
                          formData.is_featured ? "bg-accent border-accent text-white" : "border-border-base group-hover:border-accent"
                        )}>
                          {formData.is_featured && <Check size={12} strokeWidth={3} />}
                        </div>
                        <input 
                          type="checkbox" 
                          className="hidden"
                          checked={formData.is_featured}
                          onChange={e => setFormData({...formData, is_featured: e.target.checked})}
                        />
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-base leading-tight">Pin to Editorial Hero</span>
                      </label>
                      
                      <label className={cn(
                        "flex items-center gap-4 group p-4 rounded-2xl border transition-all bg-surface/50",
                        (products.filter(p => p.is_new_arrival && p.id !== editingProduct?.id).length >= 10 && !formData.is_new_arrival) 
                          ? "opacity-30 cursor-not-allowed border-transparent" 
                          : "cursor-pointer border-transparent hover:border-accent/20"
                      )}>
                        <div className={cn(
                          "w-6 h-6 rounded-full border flex items-center justify-center transition-all shrink-0",
                          formData.is_new_arrival ? "bg-accent border-accent text-white" : "border-border-base text-text-base/20 group-hover:border-accent/40"
                        )}>
                          <Plus size={14} />
                        </div>
                        <input 
                          type="checkbox" 
                          className="hidden"
                          disabled={products.filter(p => p.is_new_arrival && p.id !== editingProduct?.id).length >= 10 && !formData.is_new_arrival}
                          checked={formData.is_new_arrival}
                          onChange={e => {
                            const isChecking = e.target.checked;
                            if (isChecking) {
                              const currentCount = products.filter(p => p.is_new_arrival && p.id !== editingProduct?.id).length;
                              if (currentCount >= 10) {
                                alert("MAVREN LIMIT REACHED: Maximum 10 artifacts can be designated as New Arrivals simultaneously.");
                                return;
                              }
                            }
                            setFormData({...formData, is_new_arrival: isChecking});
                          }}
                        />
                        <div className="flex flex-col">
                          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-base leading-tight">New Arrival Section</span>
                          {(products.filter(p => p.is_new_arrival && p.id !== editingProduct?.id).length >= 10 && !formData.is_new_arrival) && (
                            <span className="text-[8px] text-red-500 font-bold uppercase tracking-widest mt-1">Limit Reached</span>
                          )}
                        </div>
                      </label>

                      <label className={cn(
                        "flex items-center gap-4 group p-4 rounded-2xl border transition-all bg-surface/50",
                        parseFloat(formData.price) > 999 ? "opacity-30 cursor-not-allowed border-transparent" : "cursor-pointer border-transparent hover:border-emerald-600/20"
                      )}>
                        <div className={cn(
                          "w-6 h-6 rounded-full border flex items-center justify-center transition-all shrink-0",
                          formData.is_under_999 ? "bg-emerald-600 border-emerald-600 text-white" : "border-border-base text-text-base/20 group-hover:border-emerald-600/40"
                        )}>
                          <Check size={14} />
                        </div>
                        <input 
                          type="checkbox" 
                          className="hidden"
                          disabled={parseFloat(formData.price) > 999}
                          checked={formData.is_under_999}
                          onChange={e => {
                            if (parseFloat(formData.price) > 999) {
                              alert("Product price must be ₹999 or less to feature in this section.");
                              return;
                            }
                            setFormData({...formData, is_under_999: e.target.checked});
                          }}
                        />
                        <div className="flex flex-col">
                          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-base leading-tight">Under ₹999 Section</span>
                          {parseFloat(formData.price) > 999 && <span className="text-[8px] text-red-500 font-bold uppercase tracking-widest mt-1">Price too high</span>}
                        </div>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="space-y-12 pt-12 border-t border-border-base/50">
                  <div className="space-y-4">
                    <label className="block text-[9px] uppercase tracking-[0.2em] font-bold text-text-base/40 ml-1">Editorial Abstract</label>
                    <textarea 
                      required
                      rows={2}
                      className="w-full bg-transparent border-b border-border-base px-0 py-4 text-xs font-medium focus:border-accent outline-none transition-all resize-none leading-relaxed placeholder:text-text-base/10" 
                      placeholder="Brief conceptual summary..."
                      value={formData.description}
                      onChange={e => setFormData({...formData, description: e.target.value})}
                    />
                  </div>

                  <div className="space-y-4">
                    <label className="block text-[9px] uppercase tracking-[0.2em] font-bold text-text-base/40 ml-1">The Curator's Verdict</label>
                    <textarea 
                      rows={5}
                      className="w-full bg-transparent border-b border-border-base px-0 py-4 text-sm font-medium focus:border-accent outline-none transition-all resize-none leading-relaxed placeholder:text-text-base/10" 
                      placeholder="Comprehensive editorial review and quality assessment..."
                      value={formData.curator_verdict}
                      onChange={e => setFormData({...formData, curator_verdict: e.target.value})}
                    />
                  </div>
                  
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                      <div className="space-y-4">
                        <label className="block text-[9px] uppercase tracking-[0.2em] font-bold text-accent ml-1">Design Highs (Metadata)</label>
                        <input 
                          className="w-full bg-transparent border-b border-accent/20 px-0 py-4 text-[10px] font-bold uppercase tracking-widest focus:border-accent outline-none transition-all" 
                          placeholder="MATERIALITY, FORM, FUNCTION"
                          value={formData.highs}
                          onChange={e => setFormData({...formData, highs: e.target.value})}
                        />
                      </div>
                      <div className="space-y-4">
                        <label className="block text-[9px] uppercase tracking-[0.2em] font-bold text-text-base/30 ml-1">Design Lows (Metadata)</label>
                        <input 
                          className="w-full bg-transparent border-b border-border-base px-0 py-4 text-[10px] font-bold uppercase tracking-widest focus:border-accent outline-none transition-all text-text-base/40" 
                          placeholder="LIMITATIONS, FRICTION"
                          value={formData.lows}
                          onChange={e => setFormData({...formData, lows: e.target.value})}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                      <div className="space-y-4">
                        <label className="block text-[9px] uppercase tracking-[0.2em] font-bold text-emerald-600 ml-1">Pros (Comma Separated)</label>
                        <input 
                          className="w-full bg-transparent border-b border-emerald-600/20 px-0 py-4 text-[10px] font-bold uppercase tracking-widest focus:border-emerald-600 outline-none transition-all" 
                          placeholder="ADAVANTAGE 1, ADVANTAGE 2"
                          value={formData.pros}
                          onChange={e => setFormData({...formData, pros: e.target.value})}
                        />
                      </div>
                      <div className="space-y-4">
                        <label className="block text-[9px] uppercase tracking-[0.2em] font-bold text-red-600/40 ml-1">Cons (Comma Separated)</label>
                        <input 
                          className="w-full bg-transparent border-b border-border-base px-0 py-4 text-[10px] font-bold uppercase tracking-widest focus:border-red-600 outline-none transition-all text-text-base/40" 
                          placeholder="DRAWBACK 1, DRAWBACK 2"
                          value={formData.cons}
                          onChange={e => setFormData({...formData, cons: e.target.value})}
                        />
                      </div>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-end gap-6 pt-10 border-t border-border-base/50">
                  <button 
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="w-full sm:w-auto px-12 py-5 rounded-full font-bold text-[10px] uppercase tracking-[0.2em] bg-surface text-text-muted hover:text-text-base transition-all"
                  >
                    Discard Changes
                  </button>
                  <button 
                    disabled={uploading}
                    className="w-full sm:w-auto px-16 py-5 rounded-full font-bold text-[10px] uppercase tracking-[0.2em] bg-text-base hover:bg-accent text-white shadow-xl shadow-accent/10 transition-all disabled:opacity-50 active:scale-[0.98] flex items-center justify-center gap-3"
                  >
                    {uploading ? 'Archiving...' : (editingProduct ? 'Commit Metadata' : 'Authenticate & Publish')}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
