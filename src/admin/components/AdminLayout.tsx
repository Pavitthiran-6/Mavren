import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, 
  PackageSearch, 
  Layers, 
  PenTool, 
  Settings, 
  LogOut, 
  Bell, 
  User as UserIcon,
  Plus,
  Menu,
  X,
  MessageSquare,
  Check
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import { cn } from '../../lib/utils';

export default function AdminLayout() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Fetch unread messages count
  const fetchUnreadCount = async () => {
    const { count, error } = await supabase
      .from('contact_messages')
      .select('*', { count: 'exact', head: true })
      .eq('is_read', false);
    
    if (!error && count !== null) setUnreadCount(count);
  };

  React.useEffect(() => {
    fetchUnreadCount();
    
    // Subscribe to real-time changes
    const channel = supabase
      .channel('contact_messages_changes')
      .on('postgres_changes', { event: '*', table: 'contact_messages', schema: 'public' }, () => {
        fetchUnreadCount();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleLogout = async () => {
    localStorage.removeItem('admin_session');
    await signOut();
    navigate('/admin/login');
  };

  const navItems = [
    { name: 'Analytics', icon: LayoutDashboard, path: '/admin/dashboard' },
    { name: 'Collection Manager', icon: PackageSearch, path: '/admin/inventory' },
    { name: 'Featured Curation', icon: PenTool, path: '/admin/curation' },
    { name: 'Home Curation', icon: Check, path: '/admin/home-sections' },
    { name: 'Taxonomy', icon: Layers, path: '/admin/categories' },
    { name: 'Inquiries', icon: MessageSquare, path: '/admin/messages' },
    { name: 'Preferences', icon: Settings, path: '/admin/settings' },
  ];

  return (
    <div className="min-h-screen flex bg-background-base text-text-base overflow-x-hidden">
      {/* Sidebar Mobile Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 bg-text-base/20 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-border-base flex flex-col transition-transform duration-300 lg:translate-x-0",
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-8 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="h-8 w-8 bg-accent text-white rounded-full flex items-center justify-center font-display font-bold group-hover:bg-text-base transition-colors shadow-lg shadow-accent/20">M</div>
            <span className="font-display font-bold tracking-[0.2em] text-lg uppercase">
              <span className="text-accent">MAV</span><span className="text-text-base">REN</span>
            </span>
          </Link>
          <button 
            className="lg:hidden text-text-muted hover:text-accent"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        <div className="px-6 mb-10">
          <div className="bg-surface p-5 rounded-2xl flex items-center gap-4 border border-border-base/50">
            <div className="h-10 w-10 bg-text-base text-white rounded-full flex items-center justify-center group-hover:bg-accent transition-colors">
              <UserIcon size={18} />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest font-bold text-text-base mb-1">MAVREN Base</p>
              <p className="text-[9px] text-text-muted uppercase tracking-widest leading-none font-bold">Admin Privileges</p>
            </div>
          </div>
        </div>

        <nav className="flex-grow px-4 space-y-1 overflow-y-auto custom-scrollbar">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={() => setIsMobileMenuOpen(false)}
              className={({ isActive }) => cn(
                "flex items-center gap-3 px-4 py-3.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all group",
                isActive 
                  ? "bg-accent text-white shadow-md shadow-accent/10" 
                  : "text-text-muted hover:bg-surface hover:text-text-base"
              )}
            >
              <item.icon size={16} />
              <span className="flex-grow">{item.name}</span>
              {item.name === 'Inquiries' && unreadCount > 0 && (
                <span className={cn(
                  "text-[9px] font-bold px-2 py-0.5 rounded-full",
                  location.pathname === item.path ? "bg-white/20 text-white" : "bg-accent/10 text-accent"
                )}>
                  {unreadCount}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="p-6 border-t border-border-base space-y-2">
          <button 
            onClick={() => {
              navigate('/admin/inventory?add=true');
              setIsMobileMenuOpen(false);
            }}
            className="w-full bg-text-base hover:bg-accent text-white py-4 rounded-full flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-widest mb-6 transition-all active:scale-[0.98]"
          >
            <Plus size={16} />
            Add Artifact
          </button>
          
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2 text-[9px] font-bold uppercase tracking-widest text-text-muted hover:text-accent w-full transition-colors"
          >
            <LogOut size={16} />
            Terminate Session
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-72 flex-grow min-h-screen">
        <header className="h-20 border-b border-border-base flex items-center justify-between px-6 lg:px-12 bg-white/80 backdrop-blur-md sticky top-0 z-30">
          <div className="flex items-center gap-6 lg:flex-grow lg:max-w-xl">
            <button 
              className="lg:hidden p-2 -ml-2 text-text-muted hover:text-accent"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu size={20} />
            </button>
            <div className="relative hidden lg:block lg:flex-grow">
              <PackageSearch className="absolute left-0 top-1/2 -translate-y-1/2 text-text-muted/60" size={14} />
              <input 
                type="text" 
                placeholder="Search collection catalog..."
                className="w-full bg-transparent border-none rounded-none pl-6 pr-4 py-2 text-[10px] uppercase font-bold tracking-widest focus:ring-0 transition-all placeholder:text-text-muted/40"
              />
            </div>
          </div>

          <div className="lg:hidden absolute left-1/2 -translate-x-1/2">
            <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent">
              {navItems.find(item => item.path === location.pathname)?.name || 'Admin'}
            </h2>
          </div>
          
          <div className="flex items-center gap-6 ml-auto">
            <button 
              onClick={() => navigate('/admin/messages')}
              className="text-text-muted hover:text-accent hidden sm:block relative transition-colors"
            >
              <Bell size={18} />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 h-2 w-2 bg-accent rounded-full border-2 border-white" />
              )}
            </button>
            <div className="flex items-center gap-4 shrink-0 border-l border-border-base pl-6">
              <div className="text-right hidden xl:block">
                <p className="text-[9px] font-bold uppercase tracking-widest text-text-base leading-none mb-1 max-w-[120px] truncate">{user?.email}</p>
                <p className="text-[8px] text-text-muted font-bold uppercase tracking-widest leading-none">Global Curator</p>
              </div>
              <div className="h-9 w-9 rounded-full bg-surface border border-border-base flex items-center justify-center text-text-base hover:text-accent transition-colors">
                <UserIcon size={16} />
              </div>
            </div>
          </div>
        </header>

        <div className="p-6 lg:p-12">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
