import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Product } from '../../types';
import { 
  Search, 
  Check, 
  Plus,
  ArrowLeft,
  Loader2
} from 'lucide-react';
import { cn, formatCurrency } from '../../lib/utils';
import { Link } from 'react-router-dom';

export default function HomeSections() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'new-arrivals' | 'under-999'>('all');

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    setLoading(true);
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (data) setProducts(data);
    setLoading(false);
  }

  const toggleSection = async (product: Product, section: 'is_new_arrival' | 'is_under_999') => {
    const newValue = !product[section];
    
    // Validation for New Arrivals Limit
    if (section === 'is_new_arrival' && newValue) {
      const currentNewArrivalsCount = products.filter(p => p.is_new_arrival).length;
      if (currentNewArrivalsCount >= 10) {
        alert("MAVREN LIMIT REACHED: Maximum 10 artifacts can be designated as New Arrivals simultaneously.");
        return;
      }
    }

    // Validation for Under 999
    if (section === 'is_under_999' && newValue && product.price > 999) {
      alert("Product valuation must be ₹999 or less for this section.");
      return;
    }

    const { error } = await supabase
      .from('products')
      .update({ [section]: newValue })
      .eq('id', product.id);

    if (!error) {
      setProducts(prev => prev.map(p => p.id === product.id ? { ...p, [section]: newValue } : p));
    }
  };

  const filteredProducts = products.filter(p => {
    const title = p.title || '';
    const category = p.category || '';
    const matchesSearch = title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          category.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeTab === 'new-arrivals') return matchesSearch && !!p.is_new_arrival;
    if (activeTab === 'under-999') return matchesSearch && !!p.is_under_999;
    return matchesSearch;
  });

  return (
    <div className="p-8 sm:p-12 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16">
        <div>
          <Link to="/admin/inventory" className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-text-muted hover:text-accent mb-4 transition-colors">
            <ArrowLeft size={12} />
            Back to Inventory
          </Link>
          <h1 className="text-4xl font-display font-light tracking-tight">Home Curation</h1>
          <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-text-muted mt-2">Manage Homepage Collections</p>
        </div>

        <div className="relative w-full md:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
          <input 
            type="text"
            placeholder="Search Artifacts..."
            className="w-full bg-surface border border-border-base rounded-full py-3 pl-12 pr-6 text-[11px] font-bold uppercase tracking-widest outline-none focus:border-accent transition-all"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="flex gap-8 border-b border-border-base mb-12">
        {(['all', 'new-arrivals', 'under-999'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "pb-6 text-[10px] font-bold uppercase tracking-[0.2em] transition-all relative",
              activeTab === tab ? "text-accent" : "text-text-muted hover:text-text-base"
            )}
          >
            {tab.replace('-', ' ')}
            {activeTab === tab && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent" />
            )}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-32">
          <Loader2 className="animate-spin text-accent" size={32} />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredProducts.map(product => (
            <div key={product.id} className="bg-white border border-border-base rounded-[2rem] p-6 flex flex-col sm:flex-row items-center justify-between gap-8 hover:shadow-sm transition-all group w-full">
              <div className="flex flex-col sm:flex-row items-center gap-6 flex-grow min-w-0 w-full">
                <div className="h-20 w-20 rounded-2xl overflow-hidden bg-surface shrink-0 border border-border-base mx-auto sm:mx-0 shadow-sm transition-transform duration-500 group-hover:scale-105">
                  <img src={product.cover_image_url || product.image_url} className="h-full w-full object-cover" />
                </div>
                <div className="min-w-0 text-center sm:text-left w-full">
                  <h3 className="font-display text-xl truncate mb-1 text-text-base">{product.title || "Untitled Artifact"}</h3>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted break-words">
                    {formatCurrency(product.price || 0)} • {product.category || "Uncategorized"}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-center sm:justify-end gap-10 shrink-0 w-full sm:w-auto mt-4 sm:mt-0 pt-6 sm:pt-0 border-t sm:border-t-0 border-border-base/50">
                {/* New Arrival Toggle */}
                <button
                  disabled={!product.is_new_arrival && products.filter(p => p.is_new_arrival).length >= 10}
                  onClick={() => toggleSection(product, 'is_new_arrival')}
                  className={cn(
                    "flex flex-col items-center gap-3 transition-all",
                    product.is_new_arrival ? "text-accent" : "text-text-muted opacity-40 grayscale hover:grayscale-0 hover:opacity-100",
                    (!product.is_new_arrival && products.filter(p => p.is_new_arrival).length >= 10) && "cursor-not-allowed opacity-5"
                  )}
                >
                  <div className={cn(
                    "h-12 w-12 rounded-full border flex items-center justify-center transition-all",
                    product.is_new_arrival ? "bg-accent/5 border-accent/20" : "border-border-base"
                  )}>
                    <Plus size={20} />
                  </div>
                  <span className="text-[9px] font-bold uppercase tracking-widest whitespace-nowrap">
                    {!product.is_new_arrival && products.filter(p => p.is_new_arrival).length >= 10 ? 'Limit Reached' : 'Arrivals'}
                  </span>
                </button>

                {/* Under 999 Toggle */}
                <button
                  disabled={product.price > 999}
                  onClick={() => toggleSection(product, 'is_under_999')}
                  className={cn(
                    "flex flex-col items-center gap-3 transition-all",
                    product.is_under_999 ? "text-emerald-600" : "text-text-muted opacity-40 grayscale hover:grayscale-0 hover:opacity-100",
                    product.price > 999 && "cursor-not-allowed opacity-10"
                  )}
                >
                  <div className={cn(
                    "h-12 w-12 rounded-full border flex items-center justify-center transition-all",
                    product.is_under_999 ? "bg-emerald-600/5 border-emerald-600/20" : "border-border-base"
                  )}>
                    <Check size={20} />
                  </div>
                  <span className="text-[9px] font-bold uppercase tracking-widest whitespace-nowrap">Under 999</span>
                </button>
              </div>
            </div>
          ))}

          {filteredProducts.length === 0 && (
            <div className="py-24 text-center">
              <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted">No artifacts found in this collection segment.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
