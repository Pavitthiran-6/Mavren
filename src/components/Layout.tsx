import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Search, User as UserIcon, Heart, Menu, X, ShoppingBag, MessageSquare } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { useWishlist } from '../context/WishlistContext';

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-background-base text-text-base overflow-x-hidden">
      <Navbar />
      <main className="flex-grow pt-28">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user, profile } = useAuth();
  const { wishlist } = useWishlist();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  const navLinks = [
    { name: 'Collections', path: '/products' },
    { name: 'Editorial', path: '#' },
    { name: 'Records', path: '#' },
  ];

  return (
    <nav 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-4",
        "bg-white/80 backdrop-blur-md border-b border-border-base/50",
        isScrolled ? "py-3 shadow-sm" : "py-4"
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-16 flex-1">
          <Link to="/" className="text-2xl font-display font-bold tracking-[0.3em] transition-colors group">
            <span className="text-accent">MAV</span><span className="text-text-base">REN</span>
          </Link>
          
          <div className="hidden lg:flex flex-1 max-w-md relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input 
              type="text" 
              placeholder="Search aesthetics, objects, artifacts..."
              className="w-full bg-surface border border-border-base rounded-full px-10 py-2 text-xs text-text-base focus:outline-none focus:border-accent/40 transition-colors"
            />
          </div>
        </div>

        <div className="flex items-center gap-6 transition-all">
          <div className="hidden md:flex items-center gap-8 mr-4">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                to={link.path}
                className={cn(
                  "text-[10px] font-bold uppercase tracking-[0.2em] transition-colors hover:text-accent",
                  location.pathname === link.path ? "text-accent" : "text-text-muted"
                )}
              >
                {link.name}
              </Link>
            ))}
          </div>
          
          <div className="flex items-center gap-4 md:gap-6">
            <Link to="/wishlist" className="text-text-muted hover:text-accent transition-colors relative">
              <Heart size={18} />
              {wishlist.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-accent text-white text-[8px] font-bold h-4 w-4 rounded-full flex items-center justify-center border-2 border-white">
                  {wishlist.length}
                </span>
              )}
            </Link>
            <Link 
              to="/contact" 
              className={cn(
                "hidden md:flex items-center gap-2 px-5 py-2 rounded-full border transition-all text-[10px] uppercase font-bold tracking-widest",
                location.pathname === '/contact' 
                  ? "bg-accent border-accent text-white" 
                  : "bg-text-base border-text-base text-white hover:bg-accent hover:border-accent"
              )}
            >
              Contact
            </Link>

            <button 
              className="md:hidden text-text-base flex items-center justify-center"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu size={22} />
            </button>
          </div>
        </div>
    </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-white flex flex-col p-8 h-screen w-screen overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-16">
              <span className="text-xs uppercase tracking-widest font-bold">Navigation</span>
              <button onClick={() => setMobileMenuOpen(false)}>
                <X size={20} />
              </button>
            </div>
            
            <div className="flex flex-col gap-8">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-4xl font-display font-light tracking-tight hover:text-accent transition-colors"
                >
                  {link.name}
                </Link>
              ))}
              <div className="h-px bg-border-base my-4" />
              <Link to="/wishlist" onClick={() => setMobileMenuOpen(false)} className="text-xl font-medium flex items-center gap-3">
                Wishlist 
                {wishlist.length > 0 && <span className="text-xs bg-accent text-white px-2 py-0.5 rounded-full">{wishlist.length}</span>}
              </Link>
              <Link to="/contact" onClick={() => setMobileMenuOpen(false)} className="text-xl font-medium text-accent">Contact</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

function Footer() {
  return (
    <footer className="bg-white pt-24 pb-12 px-6 border-t border-border-base">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
          <div className="col-span-1">
            <Link to="/" className="text-xl font-display font-bold tracking-[0.3em] mb-6 block">
              <span className="text-accent">MAV</span><span className="text-text-base">REN</span>
            </Link>
            <p className="text-xs text-text-muted leading-loose max-w-xs">
              Meticulously selected design artifacts for the modern home and digital lifestyle. Verified quality, editorial vision.
            </p>
          </div>
          
          <div>
            <h4 className="text-[10px] uppercase tracking-[0.2em] font-bold mb-8 text-text-base/30">Explore</h4>
            <ul className="flex flex-col gap-4 text-xs text-text-muted">
              <li><Link to="/products" className="hover:text-accent transition-colors">New Collections</Link></li>
              <li><Link to="/#" className="hover:text-accent transition-colors">The Editorial</Link></li>
              <li><Link to="/#" className="hover:text-accent transition-colors">Seasonal Selects</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] uppercase tracking-[0.2em] font-bold mb-8 text-text-base/30">Company</h4>
            <ul className="flex flex-col gap-4 text-xs text-text-muted">
              <li><Link to="/#" className="hover:text-accent transition-colors">Our Ethos</Link></li>
              <li><Link to="/#" className="hover:text-accent transition-colors">Privacy & Terms</Link></li>
              <li><Link to="/#" className="hover:text-accent transition-colors">Affiliate Policy</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] uppercase tracking-[0.2em] font-bold mb-8 text-text-base/30">Connect</h4>
            <ul className="flex flex-col gap-4 text-xs text-text-muted">
              <li><a href="#" className="hover:text-accent transition-colors">Instagram</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Twitter</a></li>
              <li><Link to="/contact" className="hover:text-accent transition-colors">Direct Inquiry</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-10 border-t border-border-base/50 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] text-text-muted tracking-widest font-medium uppercase">
            &copy; {new Date().getFullYear()} MAVREN. ALL RIGHTS RESERVED.
          </p>
          <div className="flex gap-8 text-[10px] text-text-base/40 uppercase tracking-widest">
            <span>London</span>
            <span>Paris</span>
            <span>New York</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
