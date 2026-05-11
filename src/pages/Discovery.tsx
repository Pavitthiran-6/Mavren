import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Product, Category } from '../types';
import { Filter, ChevronDown, Check, Star, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn, formatCurrency } from '../lib/utils';
import { useWishlist } from '../context/WishlistContext';
import Dropdown from '../components/Dropdown';

export default function Discovery() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();

  useEffect(() => {
    if (isFilterOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isFilterOpen]);

  // Filters
  const categoryFilter = searchParams.get('category') || 'All';
  const sort = searchParams.get('sort') || 'latest';
  const maxPrice = searchParams.get('maxPrice') || '1000000';

  useEffect(() => {
    async function fetchInitialData() {
      const { data: catData } = await supabase.from('categories').select('*');
      if (catData) setCategories(catData);
    }
    fetchInitialData();
  }, []);

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      let query = supabase.from('products').select('*');

      if (categoryFilter !== 'All') {
        const selectedCat = categories.find(c => c.name === categoryFilter);
        if (selectedCat) {
          query = query.eq('category_id', selectedCat.id);
        }
      }

      if (maxPrice) {
        query = query.lte('price', parseInt(maxPrice));
      }

      if (sort === 'price-low') {
        query = query.order('price', { ascending: true });
      } else if (sort === 'price-high') {
        query = query.order('price', { ascending: false });
      } else {
        query = query.order('created_at', { ascending: false });
      }

      const { data } = await query;
      if (data) setProducts(data);
      setLoading(false);
    }
    fetchProducts();
  }, [categoryFilter, sort, maxPrice]);

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const newParams = new URLSearchParams(searchParams);
    newParams.set('maxPrice', value);
    setSearchParams(newParams);
  };

  const handleSortChange = (value: string) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('sort', value);
    setSearchParams(newParams);
  };

  const toggleCategory = (cat: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (categoryFilter === cat) {
      newParams.delete('category');
    } else {
      newParams.set('category', cat);
    }
    setSearchParams(newParams);
  };

  return (
    <div className="pt-32 px-6 pb-24 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row gap-8 justify-between items-baseline mb-20 border-b border-border-base pb-10">
        <div className="max-w-2xl">
          <h1 className="text-5xl font-display font-light tracking-tight mb-4">Discovery</h1>
          <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-text-muted">Filtered Collections / MAVREN select</p>
        </div>

        <div className="flex items-center gap-6 w-full md:w-auto">
          <Dropdown 
            className="w-full md:w-64"
            labelPrefix="Sort"
            value={sort}
            onChange={handleSortChange}
            options={[
              { label: 'Latest', value: 'latest' },
              { label: 'Price: Low to High', value: 'price-low' },
              { label: 'Price: High to Low', value: 'price-high' }
            ]}
          />
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className={cn(
              "p-3 rounded-full border border-border-base transition-all md:hidden",
              isFilterOpen ? "bg-accent border-accent text-white" : "bg-white text-text-muted"
            )}
          >
            <Filter size={18} />
          </button>
        </div>
      </div>

      <div className="flex gap-16">
        {/* Sidebar Filters */}
        <aside className={cn(
          "fixed inset-0 z-[110] bg-white p-10 overflow-y-auto md:static md:block md:w-72 md:p-0 md:overflow-visible transition-all duration-500 md:translate-x-0 shrink-0",
          isFilterOpen ? "translate-y-0 opacity-100" : "translate-y-full opacity-0 md:translate-y-0 md:opacity-100"
        )}>
          <div className="flex md:hidden justify-between items-center mb-12">
            <span className="text-[10px] uppercase tracking-widest font-bold">Filters</span>
            <button onClick={() => setIsFilterOpen(false)}><X size={20} /></button>
          </div>

          <div className="flex flex-col gap-12 md:sticky md:top-36">
            <div>
              <h4 className="text-[10px] uppercase tracking-[0.2em] font-bold mb-6 text-text-base/30">Collections</h4>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => toggleCategory('All')}
                  className={cn(
                    "flex items-center justify-between text-[11px] font-bold uppercase tracking-widest px-4 py-3 rounded-lg transition-all text-left",
                    categoryFilter === 'All' ? "bg-accent/5 text-accent" : "text-text-muted hover:text-text-base hover:bg-surface"
                  )}
                >
                  All Collections
                  {categoryFilter === 'All' && <Check size={12} />}
                </button>
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => toggleCategory(cat.name)}
                    className={cn(
                      "flex items-center justify-between text-[11px] font-bold uppercase tracking-widest px-4 py-3 rounded-lg transition-all text-left",
                      categoryFilter === cat.name ? "bg-accent/5 text-accent" : "text-text-muted hover:text-text-base hover:bg-surface"
                    )}
                  >
                    {cat.name}
                    {categoryFilter === cat.name && <Check size={12} />}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-8 border-t border-border-base">
              <h4 className="text-[10px] uppercase tracking-[0.2em] font-bold mb-6 text-text-base/30">Investment Range</h4>
              <input
                type="range"
                min="0"
                max="100000"
                step="500"
                value={maxPrice}
                onChange={handlePriceChange}
                className="w-full accent-accent bg-surface h-1 rounded-full mb-6 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-bold text-text-base uppercase tracking-widest">
                <span className="text-text-muted">{formatCurrency(0)}</span>
                <span>{formatCurrency(parseInt(maxPrice))}</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Grid */}
        <div className="flex-grow">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex flex-col gap-6 animate-pulse">
                  <div className="aspect-[3/4] bg-surface rounded-2xl" />
                  <div className="h-4 w-3/4 bg-surface rounded-full" />
                  <div className="h-3 w-1/4 bg-surface rounded-full" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
              <AnimatePresence mode="popLayout">
                {products.length > 0 ? products.map((product) => (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="group"
                  >
                    <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-surface mb-6 border border-border-base/50 transition-all duration-500 group-hover:shadow-md">
                      <Link to={`/product/${product.id}`} className="block h-full">
                        <img
                          src={(product as any).cover_image_url || product.image_url}
                          alt={product.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                      </Link>

                      <button
                        onClick={() => isInWishlist(product.id) ? removeFromWishlist(product.id) : addToWishlist(product.id)}
                        className={cn(
                          "absolute top-5 right-5 h-9 w-9 rounded-full bg-white/60 backdrop-blur-md border border-border-base flex items-center justify-center transition-all hover:bg-white",
                          isInWishlist(product.id) ? "border-accent/40 text-accent" : "text-text-muted hover:text-accent"
                        )}
                      >
                        <Heart size={16} fill={isInWishlist(product.id) ? "currentColor" : "none"} strokeWidth={isInWishlist(product.id) ? 0 : 2} />
                      </button>
                    </div>

                    <div>
                      <Link to={`/product/${product.id}`} className="block mb-4">
                        <span className="text-[9px] text-text-muted uppercase font-bold tracking-[0.2em] mb-2 block">
                          {categories.find(c => c.id === product.category_id)?.name || 'General Selection'}
                        </span>
                        <h3 className="text-sm font-medium text-text-base group-hover:text-accent transition-colors line-clamp-2">
                          {product.title}
                        </h3>
                      </Link>
                      <div className="flex items-center justify-between border-t border-border-base/30 pt-4">
                        <span className="text-sm font-light tracking-wide">{formatCurrency(product.price)}</span>
                        <div className="flex items-center gap-1.5 text-accent/60">
                          <Star size={10} fill="currentColor" />
                          <span className="text-[10px] font-bold tracking-tighter text-text-base">{(product.curator_rating || 5).toFixed(1)}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )) : (
                  <div className="col-span-full py-32 text-center border border-dashed border-border-base rounded-3xl">
                    <p className="text-[10px] uppercase tracking-widest font-bold text-text-muted">No artifacts match the current criteria.</p>
                  </div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const X = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);
