import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Product } from '../types';
import { 
  Heart, 
  Share2, 
  Star, 
  ChevronLeft, 
  ExternalLink, 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  MessageSquare
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn, formatCurrency } from '../lib/utils';
import { useWishlist } from '../context/WishlistContext';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';

// Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();

  useEffect(() => {
    async function fetchProduct() {
      if (!id) return;
      setLoading(true);
      const { data } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();
      
      if (data) setProduct(data);
      setLoading(false);
    }
    fetchProduct();
  }, [id]);

  useEffect(() => {
    if (product) {
      // trackView (fire and forget)
      supabase.from('product_views').insert({ product_id: product.id }).then();
    }
  }, [product?.id]);

  const handleAffiliateClick = () => {
    if (product) {
      // trackClick (fire and forget)
      supabase.from('product_clicks').insert({ product_id: product.id }).then();
    }
  };

  if (loading) return (
    <div className="pt-40 text-center min-h-screen flex items-center justify-center">
      <div className="text-[10px] uppercase tracking-[0.3em] font-bold animate-pulse">Loading Collection...</div>
    </div>
  );
  if (!product) return <div className="pt-40 text-center text-[10px] uppercase font-bold tracking-widest text-text-muted">MAVREN Item Not Found.</div>;

  const isLiked = isInWishlist(product.id);

    const parseMeta = (val: any) => {
      if (Array.isArray(val)) return val;
      if (typeof val === 'string') return val.split(',').map((t: string) => t.trim()).filter(Boolean);
      return [];
    };

    const tags = parseMeta(product.tags);
    const highs = parseMeta(product.highs);
    const lows = parseMeta(product.lows);
    const pros = parseMeta((product as any).pros);
    const cons = parseMeta((product as any).cons);
    const gallery = parseMeta((product as any).gallery_images);
    
    // Combine images: Cover first, then gallery
    const displayImages = [
      (product as any).cover_image_url || product.image_url,
      ...gallery
    ].filter(Boolean);

    return (
      <div className="pt-2 md:pt-8 pb-32 px-8 md:px-12 max-w-[1400px] mx-auto w-full min-h-screen">
        <Link to="/products" className="inline-flex items-center gap-3 text-text-muted hover:text-text-base transition-all mb-6 group text-[10px] uppercase font-bold tracking-widest">
          <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          Return to catalog
        </Link>
  
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-start">
          {/* Left: Image Presentation */}
          <div className="w-full">
            <div className="aspect-square rounded-[2rem] overflow-hidden bg-surface mb-10 border border-border-base/50 relative group shadow-sm">
              <Swiper
                modules={[Autoplay, Pagination]}
                autoplay={{ delay: 5000, disableOnInteraction: false }}
                pagination={{ clickable: true }}
                className="h-full w-full"
              >
                {displayImages.map((img, i) => (
                  <SwiperSlide key={i}>
                    <img 
                      src={img} 
                      alt={`${product.title} - Visual ${i + 1}`}
                      className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
            {/* Metadata Tags */}
            <div className="flex flex-wrap gap-3">
              {tags.map((tag: string) => (
                <span key={tag} className="px-5 py-2 rounded-full bg-surface border border-border-base text-[9px] uppercase tracking-[0.2em] font-bold text-text-muted">
                  {tag}
                </span>
              ))}
            </div>
          </div>
  
          {/* Right: Editorial & Commerce */}
          <div className="flex flex-col">
            <div className="mb-10 lg:pl-12">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center gap-1 text-accent/60">
                  <Star size={10} fill="currentColor" />
                  <span className="text-[10px] font-bold tracking-tighter text-text-base">{(product.curator_rating || 5).toFixed(1)}</span>
                </div>
                <div className="w-1 h-1 bg-border-base rounded-full" />
                <span className="text-[9px] font-bold text-text-muted uppercase tracking-widest">Expert Verified</span>
              </div>
              
              <h1 className="text-5xl md:text-6xl font-display font-light mb-4 leading-[1.05] tracking-tight text-text-base">
                {product.title}
              </h1>
              <p className="text-sm font-bold uppercase tracking-[0.3em] text-text-base/40 mb-8">{product.category}</p>
              
              <div className="flex items-baseline gap-6 pb-10 border-b border-border-base">
                <span className="text-4xl font-light tracking-tight">{formatCurrency(product.price)}</span>
                {product.discount_price && (
                  <span className="text-lg text-text-muted line-through font-light tracking-wide">{formatCurrency(product.discount_price)}</span>
                )}
              </div>
            </div>
  
            <p className="text-sm text-text-muted leading-relaxed mb-12 font-medium">
              {product.description}
            </p>
  
            <div className="flex flex-col gap-4 mb-12">
              <a 
                href={product.affiliate_link}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleAffiliateClick}
                className="w-full bg-accent hover:bg-accent-hover text-white h-16 rounded-full font-bold text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all shadow-md active:scale-[0.98]"
              >
                Acquire Selection
                <ExternalLink size={14} />
              </a>
              <button 
                onClick={() => isLiked ? removeFromWishlist(product.id) : addToWishlist(product.id)}
                className={cn(
                  "w-full h-16 rounded-full font-bold text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all border",
                  isLiked 
                    ? "bg-text-base border-text-base text-white" 
                    : "bg-transparent border-border-base text-text-base hover:bg-surface"
                )}
              >
                {isLiked ? "Saved to Collection" : "Save to Wishlist"}
                <Heart size={14} fill={isLiked ? "currentColor" : "none"} strokeWidth={isLiked ? 0 : 2.5} />
              </button>
            </div>
  
            <div className="p-6 rounded-2xl bg-surface border border-border-base/50 flex items-center gap-5">
              <div className="h-10 w-10 shrink-0 bg-accent text-white flex items-center justify-center rounded-full">
                <ShieldCheck size={18} strokeWidth={2.5} />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-text-base">Editorial Guarantee</p>
                <p className="text-[10px] text-text-muted font-medium mt-1 uppercase tracking-wider">Provenance & Quality Verified</p>
              </div>
            </div>
          </div>
        </div>
  
        {/* Editorial Deep Dive */}
        <div className="mt-40 space-y-20">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-20">
            <div className="md:col-span-8">
              <div className="bg-white rounded-[2.5rem] p-10 md:p-20 border border-border-base">
                <div className="flex items-center gap-5 mb-12">
                  <div className="h-10 w-10 bg-text-base text-white flex items-center justify-center rounded-full">
                    <MessageSquare size={16} />
                  </div>
                  <h2 className="text-3xl font-display font-light tracking-tight">Editorial Review</h2>
                </div>
                <div className="prose prose-stone max-w-none text-text-muted leading-relaxed text-sm font-medium space-y-6">
                  {product.curator_verdict ? (
                    <p className="whitespace-pre-wrap leading-[1.8]">{product.curator_verdict}</p>
                  ) : (
                    <p className="italic uppercase tracking-widest text-[9px] font-bold">The curator is currently drafting the editorial review for this artifact.</p>
                  )}
                </div>
              </div>
            </div>
  
            <div className="md:col-span-4 flex flex-col gap-8">
              <div className="bg-surface p-10 rounded-[2rem] border border-border-base/50">
                <h3 className="flex items-center gap-3 text-[10px] uppercase tracking-[0.2em] font-bold mb-8 text-accent">
                  <CheckCircle2 size={16} />
                  Design Highs
                </h3>
                <ul className="space-y-6">
                  {highs.length > 0 ? (
                    highs.map((high: string, index: number) => (
                      <li key={index} className="flex gap-4 text-[10px] uppercase tracking-widest font-bold text-text-muted leading-loose">
                        <span className="text-accent">•</span>
                        {high}
                      </li>
                    ))
                  ) : (
                    <li className="text-[9px] text-text-muted italic font-bold uppercase tracking-widest">No metadata recorded.</li>
                  )}
                </ul>
              </div>
  
              <div className="bg-surface p-10 rounded-[2rem] border border-border-base/50">
                <h3 className="flex items-center gap-3 text-[10px] uppercase tracking-[0.2em] font-bold mb-8 text-text-base/30">
                  <XCircle size={16} />
                  Design Lows
                </h3>
                <ul className="space-y-6">
                  {lows.length > 0 ? (
                    lows.map((low: string, index: number) => (
                      <li key={index} className="flex gap-4 text-[10px] uppercase tracking-widest font-bold text-text-muted leading-loose">
                        <span className="text-text-base/30">•</span>
                        {low}
                      </li>
                    ))
                  ) : (
                    <li className="text-[9px] text-text-muted italic font-bold uppercase tracking-widest">No metadata recorded.</li>
                  )}
                </ul>
              </div>
            </div>
          </div>

          {(pros.length > 0 || cons.length > 0) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="bg-emerald-50/30 p-10 md:p-14 rounded-[3rem] border border-emerald-100/50">
                <h3 className="flex items-center gap-3 text-[10px] uppercase tracking-[0.4em] font-bold mb-10 text-emerald-700">
                  <CheckCircle2 size={18} className="text-emerald-500" />
                  Key Pros
                </h3>
                <ul className="grid grid-cols-1 gap-6">
                  {pros.map((item: string, index: number) => (
                    <li key={index} className="flex items-start gap-4 group">
                      <div className="h-5 w-5 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0 mt-0.5">
                        <CheckCircle2 size={10} className="text-emerald-600" />
                      </div>
                      <span className="text-xs font-semibold text-emerald-900/70 tracking-tight leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-red-50/20 p-10 md:p-14 rounded-[3rem] border border-red-100/30">
                <h3 className="flex items-center gap-3 text-[10px] uppercase tracking-[0.4em] font-bold mb-10 text-red-700/50">
                  <XCircle size={18} className="text-red-400" />
                  Key Cons
                </h3>
                <ul className="grid grid-cols-1 gap-6">
                  {cons.map((item: string, index: number) => (
                    <li key={index} className="flex items-start gap-4 group opacity-60">
                      <div className="h-5 w-5 rounded-full bg-red-400/10 flex items-center justify-center shrink-0 mt-0.5">
                        <XCircle size={10} className="text-red-500" />
                      </div>
                      <span className="text-xs font-semibold text-red-900/70 tracking-tight leading-relaxed italic">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    );
}
