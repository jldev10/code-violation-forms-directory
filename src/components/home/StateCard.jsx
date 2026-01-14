import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, ChevronRight } from 'lucide-react';

export default function StateCard({ state, onClick, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      onClick={onClick}
      className="group relative bg-white rounded-2xl border border-slate-200 overflow-hidden cursor-pointer hover:border-emerald-300 hover:shadow-xl hover:shadow-emerald-100/50 transition-all duration-300"
    >
      {/* Top accent bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-500" />
      
      {/* Header */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 px-5 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
              <MapPin className="w-5 h-5 text-emerald-400" />
            </div>
            <h3 className="text-lg font-semibold text-white">{state.name}</h3>
          </div>
          <div className="px-3 py-1 rounded-full bg-white/10 text-sm text-emerald-300 font-medium">
            {state.cityCount} cities
          </div>
        </div>
      </div>
      
      {/* Body */}
      <div className="p-5">
        <p className="text-slate-500 text-sm mb-4 line-clamp-2">
          Access public records request forms for {state.cityCount} municipalities across {state.name}.
        </p>
        
        <button className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-medium rounded-xl group-hover:shadow-lg group-hover:shadow-emerald-200 transition-all duration-300">
          View Cities & Forms
          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </motion.div>
  );
}