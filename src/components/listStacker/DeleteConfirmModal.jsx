import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function DeleteConfirmModal({ isOpen, count, onConfirm, onCancel }) {
  const [typed, setTyped] = useState('');
  const canDelete = typed === 'DELETE';

  const handleConfirm = () => {
    if (canDelete) {
      onConfirm();
      setTyped('');
    }
  };

  const handleCancel = () => {
    setTyped('');
    onCancel();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50"
            onClick={handleCancel}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative bg-white rounded-xl shadow-2xl w-full max-w-md p-6 z-10"
          >
            <h2 className="text-lg font-bold text-slate-900 mb-3">Type DELETE to continue</h2>
            <p className="text-sm text-slate-600 mb-2">
              This will permanently delete {count} {count === 1 ? 'lead' : 'leads'} and all related data.{' '}
              <span className="font-bold">This cannot be undone.</span>
            </p>
            <p className="text-sm text-slate-600 mb-4">
              Once deleted, this action is irreversible. Make sure you have exported any data you need before proceeding.
            </p>

            <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
              <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
              <span className="text-sm text-amber-700 font-medium">This cannot be undone.</span>
            </div>

            <input
              type="text"
              value={typed}
              onChange={e => setTyped(e.target.value)}
              placeholder="DELETE"
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-300 mb-4"
            />

            <div className="flex flex-col gap-2">
              <Button
                onClick={handleConfirm}
                disabled={!canDelete}
                className={`w-full h-10 font-semibold transition-all ${
                  canDelete
                    ? 'bg-red-600 hover:bg-red-700 text-white'
                    : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                }`}
              >
                Permanently Delete
              </Button>
              <Button variant="ghost" onClick={handleCancel} className="w-full h-10 text-slate-600">
                Cancel
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}