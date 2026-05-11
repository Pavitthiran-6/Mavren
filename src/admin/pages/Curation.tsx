import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Product } from '../../types';
import { 
  GripVertical, 
  Trash2, 
  Plus, 
  Search, 
  Monitor,
  Check,
  Circle
} from 'lucide-react';
import { Reorder } from 'motion/react';
import { cn } from '../../lib/utils';

// --- Admin Curation ---
export default function AdminCuration() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [inventory, setInventory] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    const { data: featured } = await supabase
      .from('products')
      .select('*')
      .eq('is_featured', true)
      .order('created_at', { ascending: false });

    const { data: all } = await supabase
      .from('products')
      .select('*')
      .eq('is_featured', false)
      .limit(20);

    if (featured) setFeaturedProducts(featured);
    if (all) setInventory(all);
    setLoading(false);
  }

  const toggleFeatured = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from('products')
      .update({ is_featured: !currentStatus })
      .eq('id', id);
    
    if (!error) fetchData();
  };

  return (
    <div className="space-y-16 pb-20">
      <div className="flex flex-col sm:flex-row justify-between items-start gap-10">
        <div className="max-w-xl flex flex-col gap-2">
          <h1 className="text-3xl lg:text-4xl font-display font-light tracking-tight text-text-base">Featured Portfolio</h1>
          <p className="text-[10px] uppercase font-bold tracking-[0.3em] text-text-muted">Global Showcase Sequence & Artifact Selection</p>
        </div>
        <button className="w-full sm:w-auto bg-accent hover:bg-black text-white px-12 h-14 rounded-full font-bold text-[10px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 shadow-xl shadow-accent/20 active:scale-95">
          <Check size={18} strokeWidth={3} />
          Synchronize Sequence
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Active Sequence & Calibration */}
        <div className="lg:col-span-12 space-y-12">
          <div className="bg-white rounded-[3.5rem] border border-border-base p-10 md:p-14 shadow-sm relative overflow-hidden">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
              <h2 className="text-2xl font-display font-light tracking-tight">Active Sequence</h2>
              <div className="flex items-center gap-3 bg-surface/50 px-5 py-2 rounded-full border border-border-base">
                <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-text-muted">{featuredProducts.length} / 6 ARCHIVE SLOTS</span>
              </div>
            </div>

            <Reorder.Group 
              axis="y" 
              values={featuredProducts} 
              onReorder={setFeaturedProducts}
              className="space-y-6"
            >
              {featuredProducts.map((product) => (
                <Reorder.Item 
                  key={product.id} 
                  value={product}
                  className="bg-white p-6 rounded-[2rem] border border-border-base flex flex-col sm:flex-row gap-6 sm:items-center group cursor-move hover:border-text-base transition-all select-none shadow-sm hover:shadow-md w-full"
                >
                  <div className="flex items-center justify-center p-2 sm:p-0">
                    <GripVertical className="text-text-base/10 group-hover:text-text-base/30 transition-colors" size={20} />
                  </div>
                  
                  <div className="h-20 w-20 rounded-2xl overflow-hidden shrink-0 border border-border-base shadow-sm mx-auto sm:mx-0">
                    <img src={product.image_url} alt="" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                  </div>
                  
                  <div className="flex-grow text-center sm:text-left min-w-0 max-w-full">
                    <div className="flex flex-col sm:flex-row items-center sm:items-baseline gap-3 mb-2 justify-center sm:justify-start">
                      <p className="font-bold text-[11px] uppercase tracking-widest text-text-base leading-none break-words line-clamp-1">{product.title}</p>
                      <span className="text-[8px] font-bold uppercase px-2 py-0.5 rounded-full bg-accent/5 text-accent border border-accent/10 tracking-widest leading-none shrink-0 italic">Spotlight</span>
                    </div>
                    <p className="text-[9px] text-text-muted font-bold uppercase tracking-[0.2em] break-words">{product.category} • Record {product.id.substring(0, 4)}</p>
                  </div>
                  
                  <div className="flex justify-center sm:justify-end sm:ml-auto">
                    <button 
                      onClick={() => toggleFeatured(product.id, true)}
                      className="h-12 w-12 sm:h-10 sm:w-10 flex items-center justify-center bg-surface text-text-muted hover:text-red-700 hover:bg-red-50 rounded-full transition-all duration-300"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </Reorder.Item>
              ))}
              {featuredProducts.length === 0 && (
                <div className="py-24 text-center border-2 border-dashed border-border-base rounded-[3rem] bg-surface/20">
                   <Monitor className="mx-auto text-text-base/5 mb-6" size={48} strokeWidth={0.5} />
                  <p className="text-[9px] uppercase font-bold tracking-[0.3em] text-text-muted">No artifacts in spotlight sequence.</p>
                </div>
              )}
            </Reorder.Group>
          </div>

          <div className="bg-white rounded-[3rem] border border-border-base p-10 md:p-12 shadow-sm">
            <h2 className="text-2xl font-display font-light tracking-tight mb-10">Sequence Calibration</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-6">
                <label className="block text-[9px] uppercase tracking-[0.3em] font-bold text-text-base/40 ml-1">Transition Latency (Sec)</label>
                <div className="flex items-center gap-6">
                  <input type="range" className="flex-grow accent-black bg-surface h-1 rounded-full cursor-pointer" min="2" max="10" />
                  <span className="text-[10px] font-bold text-text-base border border-border-base px-3 py-1 rounded-lg bg-surface">5.0</span>
                </div>
              </div>
              <div className="flex items-center justify-between p-6 bg-surface/50 rounded-3xl border border-border-base/50">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-base">Autonomous Progression</span>
                <div className="h-6 w-12 bg-black rounded-full relative p-1 cursor-pointer transition-colors duration-500">
                  <div className="h-4 w-4 bg-white rounded-full absolute right-1" />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[3.5rem] border border-border-base p-10 md:p-12 shadow-sm">
            <h2 className="text-2xl font-display font-light tracking-tight mb-10">Append to Sequence</h2>
            <div className="relative mb-10 group">
              <Search className="absolute left-0 top-1/2 -translate-y-1/2 text-text-base/20 group-focus-within:text-accent transition-colors" size={16} />
              <input 
                type="text" 
                placeholder="SEARCH ARCHIVAL INVENTORY..."
                className="w-full bg-transparent border-b border-border-base pl-8 pr-4 py-4 text-[10px] font-bold uppercase tracking-[0.3em] focus:border-accent transition-all outline-none placeholder:text-text-base/10"
              />
            </div>
            
            <div className="space-y-4">
              {inventory.slice(0, 4).map(prod => (
                <div key={prod.id} className="flex flex-col sm:flex-row items-center gap-6 p-6 rounded-[2rem] hover:bg-surface/50 border border-transparent hover:border-border-base transition-all group w-full">
                  <div className="h-20 w-20 rounded-2xl overflow-hidden bg-white shrink-0 border border-border-base group-hover:grayscale-0 grayscale transition-all duration-700 mx-auto sm:mx-0 shadow-sm">
                    <img src={prod.cover_image_url || prod.image_url} alt="" className="w-full h-full object-cover" />
                  </div>
                  
                  <div className="flex-grow text-center sm:text-left w-full min-w-0">
                    <p className="font-bold text-[10px] uppercase tracking-widest text-text-base mb-2 break-words line-clamp-1">{prod.title}</p>
                    <p className="text-[8px] text-text-muted font-bold uppercase tracking-[0.2em] break-words">{prod.category} • In Stock</p>
                  </div>
                  
                  <div className="flex justify-center sm:justify-end w-full sm:w-auto mt-2 sm:mt-0">
                    <button 
                      onClick={() => toggleFeatured(prod.id, false)}
                      className="h-12 w-12 sm:h-10 sm:w-10 rounded-full border border-border-base flex items-center justify-center text-text-muted group-hover:bg-accent group-hover:border-accent group-hover:text-white transition-all duration-500 shadow-sm"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-10 text-[9px] font-bold uppercase tracking-[0.3em] text-text-muted hover:text-text-base transition-colors py-4 border-t border-border-base">
              Expand Search Results
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
