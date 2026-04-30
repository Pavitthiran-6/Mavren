import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Home, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background-base text-white flex flex-col items-center justify-center px-6 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative mb-8"
      >
        {/* Glow Background */}
        <div className="absolute inset-0 bg-accent/20 blur-[100px] rounded-full" />
        
        <h1 className="text-[12rem] md:text-[16rem] font-bold leading-none tracking-tighter text-gradient opacity-10 select-none">
          404
        </h1>
        
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="bg-accent/10 border border-accent/20 p-4 rounded-2xl mb-6 backdrop-blur-sm"
          >
            <Search className="text-accent" size={40} />
          </motion.div>
          <motion.h2 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-3xl md:text-5xl font-display font-bold mb-4"
          >
            Artifact Not Found
          </motion.h2>
        </div>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="text-text-muted max-w-md mb-12 text-lg leading-relaxed"
      >
        It seems you've wandered off the MAVREN path. This specific piece either doesn't exist or has been removed from the collection.
      </motion.p>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="flex flex-col sm:flex-row gap-4"
      >
        <Link 
          to="/" 
          className="flex items-center gap-2 bg-accent hover:bg-accent-hover text-white px-10 py-3.5 rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(124,58,237,0.3)] hover:shadow-[0_0_30px_rgba(124,58,237,0.5)]"
        >
          <Home size={20} />
          Return to Discovery
        </Link>
      </motion.div>
    </div>
  );
}
