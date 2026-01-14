import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Circle, Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

const statusConfig = {
  neutral: { icon: Circle, color: 'text-slate-400', bg: 'bg-slate-100', border: 'border-slate-300' },
  pending: { icon: Clock, color: 'text-amber-500', bg: 'bg-amber-100', border: 'border-amber-400' },
  completed: { icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-100', border: 'border-emerald-400' },
  resubmit: { icon: AlertTriangle, color: 'text-rose-500', bg: 'bg-rose-100', border: 'border-rose-400' }
};

export default function CityCard({ city, onStatusChange, index }) {
  const config = statusConfig[city.status] || statusConfig.neutral;
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.02, duration: 0.2 }}
      className="bg-white rounded-xl border border-slate-200 p-4 hover:border-emerald-300 hover:shadow-md transition-all duration-200"
    >
      {/* City name and status */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <h4 className="font-semibold text-slate-800 leading-tight">{city.name}</h4>
        
        {/* Status selector */}
        <div className="flex gap-1.5 flex-shrink-0">
          {Object.entries(statusConfig).map(([status, cfg]) => {
            const Icon = cfg.icon;
            const isActive = city.status === status;
            return (
              <button
                key={status}
                onClick={() => onStatusChange(status)}
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-200",
                  isActive 
                    ? `${cfg.bg} ${cfg.border} ${cfg.color}` 
                    : "border-slate-200 text-slate-300 hover:border-slate-300 hover:text-slate-400"
                )}
                title={status.charAt(0).toUpperCase() + status.slice(1)}
              >
                <Icon className="w-4 h-4" />
              </button>
            );
          })}
        </div>
      </div>
      
      {/* View form button */}
      <a
        href={city.url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-sm font-medium rounded-lg hover:shadow-md hover:shadow-emerald-200 transition-all duration-200"
      >
        <ExternalLink className="w-4 h-4" />
        View Form
      </a>
    </motion.div>
  );
}