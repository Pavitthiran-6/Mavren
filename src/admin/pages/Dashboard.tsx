import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { 
  TrendingUp, 
  ShoppingBag, 
  ArrowUpRight, 
  Package,
  MousePointer2,
  MessageSquare,
  Layers,
  Inbox,
  Plus,
  Settings,
  Eye,
  BarChart3,
  Loader2,
  ExternalLink
} from 'lucide-react';
import { cn, formatCurrency } from '../../lib/utils';
import { motion } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState({
    products: 0,
    categories: 0,
    messages: 0,
    unreadMessages: 0,
    views: 0,
    clicks: 0
  });
  const [recentProducts, setRecentProducts] = useState<any[]>([]);
  const [recentMessages, setRecentMessages] = useState<any[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  async function fetchDashboardData() {
    setLoading(true);
    try {
      const [
        { count: productsCount },
        { count: categoriesCount },
        { count: messagesCount },
        { count: unreadCount },
        { count: viewsCount },
        { count: clicksCount },
        { data: latestProducts },
        { data: latestMessages }
      ] = await Promise.all([
        supabase.from('products').select('*', { count: 'exact', head: true }),
        supabase.from('categories').select('*', { count: 'exact', head: true }),
        supabase.from('contact_messages').select('*', { count: 'exact', head: true }),
        supabase.from('contact_messages').select('*', { count: 'exact', head: true }).eq('is_read', false),
        supabase.from('product_views').select('*', { count: 'exact', head: true }),
        supabase.from('product_clicks').select('*', { count: 'exact', head: true }),
        supabase.from('products').select('*').order('created_at', { ascending: false }).limit(5),
        supabase.from('contact_messages').select('*').order('created_at', { ascending: false }).limit(5)
      ]);

      setMetrics({
        products: productsCount || 0,
        categories: categoriesCount || 0,
        messages: messagesCount || 0,
        unreadMessages: unreadCount || 0,
        views: viewsCount || 0,
        clicks: clicksCount || 0
      });
      setRecentProducts(latestProducts || []);
      setRecentMessages(latestMessages || []);
    } catch (error) {
      console.error('Dashboard Fetch Error:', error);
    }
    setLoading(false);
  }

  const conversionRate = metrics.views > 0 ? ((metrics.clicks / metrics.views) * 100).toFixed(1) : '0';

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
      <Loader2 className="animate-spin text-accent" size={32} />
      <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-text-muted">Calibrating Analytics...</p>
    </div>
  );

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl lg:text-4xl font-display font-light tracking-tight text-text-base">System Overview</h1>
        <p className="text-[10px] uppercase font-bold tracking-[0.3em] text-accent">Real-Time Interaction Intelligence</p>
      </div>

      {/* Core Operational Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Artifacts', value: metrics.products, icon: Package, color: 'text-text-base' },
          { label: 'Market Segments', value: metrics.categories, icon: Layers, color: 'text-text-base' },
          { label: 'Total Inquiries', value: metrics.messages, icon: MessageSquare, color: 'text-text-base' },
          { label: 'Awaiting Review', value: metrics.unreadMessages, icon: Inbox, color: 'text-accent', highlight: true },
        ].map((card, i) => (
          <div key={i} className={cn(
            "bg-white p-8 rounded-[2rem] border border-border-base transition-all hover:border-accent/20 group shadow-sm hover:shadow-md",
            card.highlight && "border-accent/10"
          )}>
            <div className="flex justify-between items-start mb-6">
              <div className={cn(
                "h-10 w-10 rounded-xl flex items-center justify-center transition-all duration-500",
                card.highlight ? "bg-accent text-white" : "bg-surface text-text-muted group-hover:bg-text-base group-hover:text-white"
              )}>
                <card.icon size={18} />
              </div>
            </div>
            <h3 className="text-[9px] font-bold uppercase tracking-[0.2em] text-text-muted mb-2">{card.label}</h3>
            <p className={cn("text-4xl font-display font-light tracking-tight uppercase", card.color)}>{card.value}</p>
          </div>
        ))}
      </div>

      {/* Audience Engagement Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-accent p-10 rounded-[3rem] text-white flex flex-col justify-between min-h-[220px] shadow-xl shadow-accent/10">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-8 w-8 bg-white/20 rounded-full flex items-center justify-center">
                <TrendingUp size={16} />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest">Efficiency Flux</span>
            </div>
            <h2 className="text-4xl font-display font-light tracking-tight">{conversionRate}%</h2>
            <p className="text-[9px] uppercase font-bold tracking-widest opacity-60 mt-2">Average Click-Through Velocity</p>
          </div>
          <div className="h-1 bg-white/20 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(parseFloat(conversionRate) * 5, 100)}%` }}
              className="h-full bg-white" 
            />
          </div>
        </div>

        <div className="lg:col-span-1 bg-white p-10 rounded-[3rem] border border-border-base flex flex-col justify-between shadow-sm">
          <div className="flex items-center gap-4 mb-2">
            <Eye className="text-accent" size={20} />
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Product Impressions</h3>
          </div>
          <p className="text-5xl font-display font-light text-text-base tracking-tighter">{metrics.views}</p>
          <p className="text-[9px] font-bold uppercase tracking-widest text-accent mt-4 flex items-center gap-2">
            <ArrowUpRight size={12} /> Total System Views
          </p>
        </div>

        <div className="lg:col-span-1 bg-white p-10 rounded-[3rem] border border-border-base flex flex-col justify-between shadow-sm">
          <div className="flex items-center gap-4 mb-2">
            <MousePointer2 className="text-accent" size={20} />
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Engagement Clicks</h3>
          </div>
          <p className="text-5xl font-display font-light text-text-base tracking-tighter">{metrics.clicks}</p>
          <p className="text-[9px] font-bold uppercase tracking-widest text-accent mt-4 flex items-center gap-2">
            <ArrowUpRight size={12} /> External Traffic Sent
          </p>
        </div>
      </div>

      {/* Quick Actions & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Recent Activity */}
        <div className="lg:col-span-8 space-y-8">
          <div className="bg-white rounded-[3rem] border border-border-base overflow-hidden shadow-sm">
            <div className="p-10 border-b border-border-base bg-surface/50 flex justify-between items-center">
              <h2 className="text-xl font-display font-light tracking-tight text-text-base">Recent Catalog Entries</h2>
              <Link to="/admin/inventory" className="text-[9px] font-bold uppercase tracking-widest text-accent hover:text-text-base transition-colors">Comprehensive Archive</Link>
            </div>
            <div className="p-8 space-y-6">
              {recentProducts.map((prod) => (
                <div key={prod.id} className="flex items-center gap-6 p-4 rounded-3xl hover:bg-surface/30 transition-colors group">
                  <div className="h-14 w-14 rounded-2xl overflow-hidden bg-surface shrink-0 border border-border-base">
                    <img src={prod.cover_image_url || prod.image_url} className="h-full w-full object-cover" />
                  </div>
                  <div className="flex-grow">
                    <h4 className="text-text-base font-medium text-sm mb-1">{prod.title}</h4>
                    <p className="text-[9px] font-bold uppercase tracking-widest text-text-muted">{prod.category || 'Portfolio'}</p>
                  </div>
                  <button 
                    onClick={() => navigate(`/product/${prod.id}`)}
                    className="h-10 w-10 rounded-full flex items-center justify-center text-text-muted hover:text-accent hover:bg-accent/5 transition-all"
                  >
                    <ExternalLink size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-[3rem] border border-border-base overflow-hidden shadow-sm">
            <div className="p-10 border-b border-border-base bg-surface/50 flex justify-between items-center">
              <h2 className="text-xl font-display font-light tracking-tight text-text-base">Latest Inquiries</h2>
              <Link to="/admin/messages" className="text-[9px] font-bold uppercase tracking-widest text-accent hover:text-text-base transition-colors">Intelligence Inbox</Link>
            </div>
            <div className="p-8 space-y-6">
              {recentMessages.map((msg) => (
                <div key={msg.id} className="flex items-center gap-6 p-4 rounded-3xl hover:bg-surface/30 transition-colors">
                  <div className={cn(
                    "h-12 w-12 rounded-full flex items-center justify-center shrink-0",
                    msg.is_read ? "bg-surface text-text-muted" : "bg-accent/10 text-accent"
                  )}>
                    <MessageSquare size={16} />
                  </div>
                  <div className="flex-grow">
                    <h4 className="text-text-base font-medium text-sm mb-1">{msg.name}</h4>
                    <p className="text-[9px] font-bold uppercase tracking-widest text-text-muted truncate max-w-sm">{msg.message}</p>
                  </div>
                  <span className="text-[8px] font-bold uppercase tracking-widest text-text-muted">{new Date(msg.created_at).toLocaleDateString()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Commands */}
        <div className="lg:col-span-4 space-y-6">
          <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent ml-4">Command Center</h3>
          
          <button 
            onClick={() => navigate('/admin/inventory')}
            className="w-full bg-accent hover:bg-text-base text-white p-10 rounded-[3rem] flex flex-col gap-6 group transition-all shadow-lg shadow-accent/10"
          >
            <Plus size={24} className="group-hover:rotate-90 transition-transform duration-500" />
            <div className="text-left">
              <p className="text-[10px] font-bold uppercase tracking-widest opacity-60 mb-2">Operational Additive</p>
              <h4 className="text-2xl font-display font-light leading-none">Catalog Artifact</h4>
            </div>
          </button>

          <div className="grid grid-cols-1 gap-4">
            {[
              { label: 'Manage Segments', icon: Layers, path: '/admin/categories', detail: 'Taxonomy Control' },
              { label: 'System Settings', icon: Settings, path: '/admin/settings', detail: 'Framework Config' },
              { label: 'Editorial Grid', icon: BarChart3, path: '/admin/curation', detail: 'Spotlight Mgmt' },
            ].map((action, i) => (
              <button
                key={i}
                onClick={() => navigate(action.path)}
                className="w-full bg-white hover:bg-surface border border-border-base p-8 rounded-[2rem] flex items-center gap-6 group transition-all shadow-sm hover:shadow-md"
              >
                <div className="h-10 w-10 bg-surface rounded-xl flex items-center justify-center text-text-muted group-hover:text-accent transition-colors">
                  <action.icon size={18} />
                </div>
                <div className="text-left">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-text-base mb-1">{action.label}</p>
                  <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-text-muted">{action.detail}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
