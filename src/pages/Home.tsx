import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Product } from '../types';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Star, ShieldCheck, Gem, Truck, Heart } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectFade } from 'swiper/modules';
import { cn, formatCurrency } from '../lib/utils';
import { useWishlist } from '../context/WishlistContext';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

export default function Home() {
  const [featured, setFeatured] = useState<Product[]>([]);
  const [latest, setLatest] = useState<Product[]>([]);
  const [under999, setUnder999] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();

  useEffect(() => {
    async function fetchData() {
      const { data: featuredData } = await supabase
        .from('products')
        .select('*')
        .eq('is_featured', true)
        .limit(5);

      const { data: latestData } = await supabase
        .from('products')
        .select('*')
        .eq('is_new_arrival', true)
        .order('created_at', { ascending: false })
        .limit(10);

      const { data: under999Data } = await supabase
        .from('products')
        .select('*')
        .eq('is_under_999', true)
        .lte('price', 999)
        .limit(4);

      if (featuredData) setFeatured(featuredData);
      if (latestData) setLatest(latestData);
      if (under999Data) setUnder999(under999Data);
      setLoading(false);
    }
    fetchData();
  }, []);

  return (
    <div className="flex flex-col gap-32 pb-24">
      {/* Hero Swiper */}
      <section className="max-w-7xl mx-auto w-full px-6 pt-2">
        <div className="h-[500px] md:h-[520px] rounded-[2.5rem] overflow-hidden border border-border-base relative group shadow-sm">
          {featured.length > 0 ? (
            <Swiper
              modules={[Autoplay, Pagination, EffectFade]}
              effect="fade"
              fadeEffect={{ crossFade: true }}
              speed={1000}
              autoplay={{ delay: 6000, disableOnInteraction: false }}
              pagination={{ clickable: true }}
              className="h-full w-full bg-surface"
            >
              {featured.map((product) => (
                <SwiperSlide key={product.id}>
                  {({ isActive }) => (
                    <div className="h-full w-full relative">
                      {/* Mobile View: Immersive Overlay */}
                      <Link 
                        to={`/product/${product.id}`}
                        className="md:hidden block relative h-full w-full overflow-hidden"
                      >
                        <motion.img
                          initial={{ scale: 1.1 }}
                          animate={{ scale: isActive ? 1 : 1.1 }}
                          transition={{ duration: 10, ease: "linear" }}
                          src={product.image_url}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                        
                        <div className="absolute bottom-16 left-8 right-8">
                          <motion.span 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 10 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="text-[10px] font-bold tracking-[0.3em] uppercase mb-4 block text-accent/90"
                          >
                            MAVREN Editorial
                          </motion.span>
                          <motion.h1 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 20 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            className="text-3xl font-display font-light mb-3 leading-tight tracking-tight text-white line-clamp-2"
                          >
                            {product.title}
                          </motion.h1>
                          <motion.p 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 20 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            className="text-xs text-white/70 max-w-xs leading-relaxed"
                          >
                            A definitive statement in modern design and functional excellence. 
                          </motion.p>
                        </div>
                      </Link>

                      {/* Desktop View: Editorial Flex */}
                      <motion.div 
                        className="hidden md:flex relative h-full w-full flex-row items-center px-20 gap-20"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: isActive ? 1 : 0 }}
                        transition={{ duration: 0.8 }}
                      >
                        {/* Desktop Text Content */}
                        <div className="w-1/2 text-left">
                          <motion.span 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 10 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="text-[10px] font-bold tracking-[0.3em] uppercase mb-6 block text-accent"
                          >
                            MAVREN Editorial
                          </motion.span>
                          <motion.h1 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 20 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            className="text-4xl lg:text-6xl font-display font-light mb-6 leading-[1.1] tracking-tight text-text-base line-clamp-2"
                          >
                            {product.title}
                          </motion.h1>
                          <motion.p 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 20 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            className="text-sm text-text-muted mb-8 max-w-sm leading-relaxed"
                          >
                            A definitive statement in modern design and functional excellence. 
                          </motion.p>
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 20 }}
                            transition={{ duration: 0.6, delay: 0.5 }}
                          >
                            <Link
                              to={`/product/${product.id}`}
                              className="bg-text-base hover:bg-accent text-white px-12 py-4 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all inline-block active:scale-95"
                            >
                              Explore Selection
                            </Link>
                          </motion.div>
                        </div>

                        {/* Desktop Image Container */}
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: isActive ? 1 : 0, scale: isActive ? 1 : 0.95 }}
                          transition={{ duration: 0.8, delay: 0.2 }}
                          className="w-1/2 flex justify-end"
                        >
                          <div className="w-[420px] h-[420px] bg-white rounded-[2.5rem] border border-border-base shadow-sm overflow-hidden group-hover:scale-105 transition-transform duration-700">
                            <img
                              src={product.image_url}
                              alt=""
                              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                            />
                          </div>
                        </motion.div>
                      </motion.div>
                    </div>
                  )}
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <div className="h-full w-full flex items-center justify-center bg-surface">
              <p className="text-[10px] uppercase tracking-widest font-bold text-text-muted animate-pulse">Initializing Collection...</p>
            </div>
          )}
        </div>
      </section>

      {/* Curated Artifacts Grid */}
      <section className="max-w-7xl mx-auto w-full px-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-baseline gap-6 mb-12">
          <div>
            <h2 className="text-3xl font-display font-light tracking-tight mb-2">New Arrivals</h2>
            <p className="text-[10px] uppercase tracking-widest font-bold text-text-muted">Spring / Summer MAVREN</p>
          </div>
          <Link to="/products" className="text-[10px] font-bold tracking-widest uppercase text-text-base hover:text-accent transition-colors flex items-center gap-2">
            View All Collections &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8 auto-rows-[200px] md:auto-rows-[240px] grid-flow-dense">
          {latest.map((product, index) => {
            // Masonry Logic
            const isLarge = index === 0;
            const isTall = index === 2;
            const isWide = index === 5;
            const isLast = index === latest.length - 1;
            
            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={cn(
                  "group relative rounded-3xl overflow-hidden border border-border-base/50 bg-white transition-all duration-500 hover:shadow-2xl hover:shadow-text-base/5",
                  (isLarge || isLast) && "col-span-2 row-span-1 lg:row-span-2",
                  isTall && "row-span-2",
                  isWide && "lg:col-span-2"
                )}
              >
                <Link to={`/product/${product.id}`} className="block h-full w-full">
                  <div className="relative h-full w-full overflow-hidden">
                    <img
                      src={(product as any).cover_image_url || product.image_url}
                      alt={product.title}
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>

                  <div className="absolute inset-x-0 bottom-0 p-6 md:p-8 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <div className="flex flex-col gap-1">
                      <span className="text-[8px] md:text-[9px] text-white/60 uppercase font-bold tracking-[0.2em]">
                        Latest Arrival
                      </span>
                      <h3 className={cn(
                        "text-white font-display font-light tracking-tight leading-tight line-clamp-2",
                        isLarge ? "text-2xl md:text-3xl" : "text-lg md:text-xl"
                      )}>
                        {product.title}
                      </h3>
                      <span className="text-white/90 text-sm font-light tracking-wide mt-2">
                        {formatCurrency(product.price)}
                      </span>
                    </div>
                  </div>
                </Link>

                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    isInWishlist(product.id) ? removeFromWishlist(product.id) : addToWishlist(product.id);
                  }}
                  className={cn(
                    "absolute top-5 right-5 h-10 w-10 md:h-12 md:w-12 rounded-full backdrop-blur-md border flex items-center justify-center transition-all duration-300 z-10",
                    isInWishlist(product.id) 
                      ? "bg-accent border-accent text-white" 
                      : "bg-white/20 border-white/30 text-white hover:bg-white hover:text-accent hover:border-white"
                  )}
                >
                  <Heart size={18} fill={isInWishlist(product.id) ? "currentColor" : "none"} strokeWidth={isInWishlist(product.id) ? 0 : 2} />
                </button>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Value-First Under 999 Section */}
      <section className="bg-surface py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-baseline gap-8 mb-16 underline-offset-8">
            <div className="max-w-xl">
              <h2 className="text-4xl font-display font-light tracking-tight mb-4">Under ₹999</h2>
              <p className="text-sm text-text-muted leading-relaxed">Democratic design. High-quality essentials selected for the discerning digital nomad.</p>
            </div>
            <Link to="/products?maxPrice=999" className="text-[10px] font-bold uppercase tracking-widest hover:text-accent transition-all flex items-center gap-2">
              DISCOVER ESSENTIALS <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="aspect-[4/5] bg-white animate-pulse rounded-2xl border border-border-base" />
              ))
            ) : under999.length === 0 ? (
              <div className="col-span-full py-10 text-center text-xs text-text-muted italic tracking-widest font-bold">
                Archive currently empty for this tier.
              </div>
            ) : (
              under999.map(product => (
                <Link to={`/product/${product.id}`} key={product.id} className="group flex flex-col items-center text-center">
                  <div className="w-full aspect-square bg-white rounded-full overflow-hidden mb-6 border border-border-base transition-all duration-500 group-hover:border-accent/20 group-hover:shadow-lg">
                    <img
                      src={product.image_url}
                      alt={product.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>
                  <h4 className="text-xs font-semibold uppercase tracking-widest mb-2 px-4 group-hover:text-accent transition-colors line-clamp-2">{product.title}</h4>
                  <p className="text-[10px] text-text-muted font-bold tracking-widest">{formatCurrency(product.price)}</p>
                </Link>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="max-w-7xl mx-auto w-full px-6 py-12">
        <div className="flex flex-col items-center text-center mb-24">
          <h2 className="text-3xl font-display font-light tracking-tight mb-4">Our Commitment</h2>
          <div className="w-12 h-px bg-text-base/20" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
          {[
            {
              icon: ShieldCheck,
              title: "Verified Authenticity",
              desc: "Every object in our collection undergoes a rigorous vetting process for design integrity and performance."
            },
            {
              icon: Gem,
              title: "Timeless Curation",
              desc: "We focus on artifacts that transcend seasonal trends, favoring minimal aesthetics and lasting quality."
            },
            {
              icon: Truck,
              title: "Priority Concierge",
              desc: "Insured, worldwide logistics handled with white-glove precision from our studio to your space."
            }
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center text-center gap-6">
              <div className="h-10 w-10 text-text-base/40">
                <item.icon size={32} strokeWidth={1} />
              </div>
              <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-text-base">{item.title}</h3>
              <p className="text-xs text-text-muted leading-loose max-w-[280px]">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
