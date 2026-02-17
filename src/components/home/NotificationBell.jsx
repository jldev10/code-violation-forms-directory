import React from 'react';
import { Bell } from 'lucide-react';
import { motion } from 'framer-motion';

export default function NotificationBell({ count, onClick }) {
  const displayCount = count > 9 ? '9+' : count;
  
  return (
    <button
      onClick={onClick}
      className="relative p-2 hover:bg-slate-100 rounded-lg transition-colors"
    >
      <Bell className="w-6 h-6 text-slate-700" />
      {count > 0 && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center"
        >
          <span className="text-white text-xs font-bold">{displayCount}</span>
        </motion.div>
      )}
    </button>
  );
}