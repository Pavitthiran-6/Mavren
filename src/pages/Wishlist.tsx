import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Product } from '../types';
import { Link } from 'react-router-dom';
import { Trash2, ShoppingCart, ArrowRight, Heart } from 'lucide-react';
import { formatCurrency } from '../lib/utils';
import { useAuth } from '../context/AuthContext';

export default function Wishlist() {
  const { user } = useAuth();
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchWishlist();
    } else {
      setLoading(false);
    }
  }, [user]);

  async function fetchWishlist() {
    setLoading(true);
    const { data, error } = await supabase
      .from('wishlist')
      .select('products (*)')
      .eq('user_id', user?.id);

    if (data && !error) {
      setItems(data.map((item: any) => item.products).filter(Boolean));
    }
    setLoading(false);
  }

  const removeFromWishlist = async (id: string) => {
    const { error } = await supabase
      .from('wishlist')
      .delete()
      .eq('user_id', user?.id)
      .eq('product_id', id);
    
    if (!error) {
      setItems(prev => prev.filter(item => item.id !== id));
    }
  };

  if (!user) {
    return (
      <div className="pt-40 pb-32 px-6 flex flex-col items-center justify-center text-center">
        <div className="h-24 w-24 bg-surface rounded-full flex items-center justify-center text-accent/20 mb-10 border border-border-base/50">
          <Heart size={32} strokeWidth={1} />
        </div>
        <h1 className="text-4xl font-display font-light tracking-tight mb-6">MAVREN Access Denied</h1>
        <p className="text-sm text-text-muted mb-10 max-w-sm leading-relaxed font-medium">Please authenticate to manage your MAVREN collection of personal artifacts.</p>
        <Link to="/login" className="bg-text-base hover:bg-accent text-white px-12 py-4 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] transition-all active:scale-[0.98]">
          Authenticate
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-32 px-6 max-w-7xl mx-auto">
      <div className="flex flex-col items-center text-center mb-24 border-b border-border-base pb-16">
        <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-accent mb-6">Personal Collection</span>
        <h1 className="text-5xl md:text-6xl font-display font-light tracking-tight text-text-base">Saved Fragments</h1>
        <p className="text-sm text-text-muted mt-6 font-medium">A specialized selection of your future investments.</p>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-40">
          <p className="text-[10px] uppercase tracking-widest font-bold text-text-muted animate-pulse">Syncing with cloud records...</p>
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-40 border border-dashed border-border-base rounded-[3rem] bg-surface/30">
          <p className="text-[10px] uppercase tracking-widest font-bold text-text-muted mb-10">Your digital treasury is currently empty.</p>
          <Link to="/products" className="text-text-base font-bold text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:text-accent transition-all group">
            Begin discovery <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-20">
          {items.map(item => (
            <div key={item.id} className="group flex flex-col">
              <div className="aspect-[3/4] relative overflow-hidden rounded-2xl bg-surface mb-8 border border-border-base/50 transition-all duration-500 group-hover:shadow-md">
                <Link to={`/product/${item.id}`} className="block h-full">
                  <img src={item.image_url} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                </Link>
                <button 
                  onClick={() => removeFromWishlist(item.id)}
                  className="absolute top-6 right-6 h-10 w-10 bg-white/60 backdrop-blur-md border border-border-base rounded-full flex items-center justify-center text-text-muted hover:text-red-600 transition-all hover:bg-white active:scale-95"
                  title="Remove from collection"
                >
                  <Trash2 size={16} strokeWidth={1.5} />
                </button>
              </div>
              <div className="flex flex-col justify-between flex-grow">
                <div>
                  <span className="text-[9px] text-text-muted uppercase font-bold tracking-[0.2em] mb-2 block">
                    {item.category}
                  </span>
                  <Link to={`/product/${item.id}`}>
                    <h3 className="text-sm font-medium text-text-base group-hover:text-accent transition-colors mb-6 line-clamp-2">{item.title}</h3>
                  </Link>
                </div>
                <div className="flex items-center justify-between border-t border-border-base/30 pt-6">
                  <span className="text-sm font-light tracking-wide">{formatCurrency(item.price)}</span>
                  <a 
                    href={item.affiliate_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-text-base hover:text-accent transition-all pl-6 border-l border-border-base/30"
                  >
                    Acquire <ArrowRight size={12} />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
