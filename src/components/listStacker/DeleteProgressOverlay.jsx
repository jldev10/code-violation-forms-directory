import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2 } from 'lucide-react';

export default function DeleteProgressOverlay({ isVisible, deleted, total }) {
  const percent = total > 0 ? Math.round((deleted / total) * 100) : 0;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm mx-4"
          >
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                <Trash2 className="w-6 h-6 text-red-600" />
              </div>
            </div>
            <h3 className="text-lg font-bold text-slate-900 text-center mb-1">Deleting Leads...</h3>
            <p className="text-sm text-slate-500 text-center mb-6">
              {deleted.toLocaleString()} / {total.toLocaleString()} leads deleted
            </p>

            <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden mb-2">
              <motion.div
                className="h-full bg-gradient-to-r from-red-500 to-red-600 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${percent}%` }}
                transition={{ ease: 'easeOut', duration: 0.3 }}
              />
            </div>
            <p className="text-xs text-slate-400 text-center">{percent}% complete</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}