import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

interface Option {
  label: string;
  value: string;
}

interface DropdownProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  labelPrefix?: string;
}

export default function Dropdown({ 
  options, 
  value, 
  onChange, 
  placeholder = "Select option", 
  className,
  labelPrefix
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(opt => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={cn("relative", className)} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full h-full flex items-center justify-between bg-white border border-border-base rounded-full px-6 py-3.5 text-[10px] font-bold uppercase tracking-widest transition-all hover:border-accent/30 hover:shadow-sm focus:outline-none"
      >
        <span className="truncate mr-4">
          {labelPrefix ? <span className="text-text-muted mr-1">{labelPrefix}:</span> : ''}
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="text-text-muted shrink-0"
        >
          <ChevronDown size={14} />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 4, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute top-full left-0 right-0 z-[100] mt-2 bg-white border border-border-base rounded-[1.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] overflow-hidden py-3 px-2"
          >
            <div className="max-h-[300px] overflow-y-auto custom-scrollbar flex flex-col gap-1">
              {options.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  className={cn(
                    "w-full flex items-center justify-between px-5 py-3.5 text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all text-left",
                    value === option.value 
                      ? "bg-accent/5 text-accent" 
                      : "text-text-muted hover:text-text-base hover:bg-surface"
                  )}
                >
                  {option.label}
                  {value === option.value && <Check size={12} strokeWidth={3} />}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
