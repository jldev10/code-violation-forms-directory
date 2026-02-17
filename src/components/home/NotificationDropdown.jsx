import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, AlertTriangle } from 'lucide-react';

export default function NotificationDropdown({ isOpen, notifications, onClose, onClearAll, onClearOne, onNotificationClick }) {
  if (!isOpen) return null;
  
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="absolute top-16 left-6 w-96 bg-white rounded-xl shadow-2xl border border-slate-200 z-50 overflow-hidden"
      >
        {/* Header */}
        <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <h3 className="font-semibold text-slate-900">Notifications</h3>
          <div className="flex items-center gap-2">
            {notifications.length > 0 && (
              <button
                onClick={onClearAll}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Clear all
              </button>
            )}
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        {/* Notifications list */}
        <div className="max-h-96 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="px-4 py-8 text-center text-slate-500">
              <Bell className="w-12 h-12 mx-auto mb-2 text-slate-300" />
              <p>No notifications</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className="flex items-start gap-3 px-4 py-3 hover:bg-slate-50 transition-colors cursor-pointer group"
                  onClick={() => onNotificationClick(notification)}
                >
                  <input
                    type="checkbox"
                    onChange={(e) => {
                      e.stopPropagation();
                      onClearOne(notification.id);
                    }}
                    className="mt-1 cursor-pointer"
                  />
                  {notification.isNew && (
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-2">
                      {notification.type === 'followup' ? (
                        <Clock className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-rose-500 mt-0.5 flex-shrink-0" />
                      )}
                      <p className="text-sm text-slate-700 group-hover:text-slate-900">
                        {notification.message}
                      </p>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">{notification.timeAgo}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}