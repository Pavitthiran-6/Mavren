import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';
import { Product } from '../types';

interface WishlistContextType {
  wishlist: string[];
  addToWishlist: (productId: string) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState<string[]>([]);

  useEffect(() => {
    if (user) {
      fetchWishlist();
    } else {
      setWishlist([]);
    }
  }, [user]);

  async function fetchWishlist() {
    const { data, error } = await supabase
      .from('wishlist')
      .select('product_id')
      .eq('user_id', user?.id);

    if (!error && data) {
      setWishlist(data.map(item => item.product_id));
    }
  }

  const addToWishlist = async (productId: string) => {
    if (!user) return;
    const { error } = await supabase
      .from('wishlist')
      .insert({ user_id: user.id, product_id: productId });
    
    if (!error) {
      setWishlist(prev => [...prev, productId]);
    }
  };

  const removeFromWishlist = async (productId: string) => {
    if (!user) return;
    const { error } = await supabase
      .from('wishlist')
      .delete()
      .eq('user_id', user.id)
      .eq('product_id', productId);
    
    if (!error) {
      setWishlist(prev => prev.filter(id => id !== productId));
    }
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  return (
    <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}
