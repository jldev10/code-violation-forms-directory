import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, MapPin, Circle, Clock, CheckCircle, AlertTriangle, Info } from 'lucide-react';
import { Input } from '@/components/ui/input';
import CityCard from './CityCard';

const statusFilters = [
  { key: 'all', label: 'All Cities', icon: null },
  { key: 'pending', label: 'Pending', icon: Clock, color: 'bg-amber-500' },
  { key: 'completed', label: 'Completed', icon: CheckCircle, color: 'bg-emerald-500' },
  { key: 'resubmit', label: 'Resubmit', icon: AlertTriangle, color: 'bg-rose-500' }
];

export default function CitiesModal({ isOpen, onClose, state, cities, onStatusChange }) {
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  
  const filteredCities = useMemo(() => {
    return cities.filter(city => {
      const matchesSearch = city.name.toLowerCase().includes(search.toLowerCase());
      const matchesFilter = activeFilter === 'all' || city.status === activeFilter;
      return matchesSearch && matchesFilter;
    });
  }, [cities, search, activeFilter]);
  
  const statusCounts = useMemo(() => ({
    pending: cities.filter(c => c.status === 'pending').length,
    completed: cities.filter(c => c.status === 'completed').length,
    resubmit: cities.filter(c => c.status === 'resubmit').length
  }), [cities]);
  
  if (!isOpen) return null;
  
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden shadow-2xl"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-900 to-slate-800 px-6 py-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">{state?.name}</h2>
                  <p className="text-slate-400 text-sm">Code Violation Forms Directory for Cities</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          {/* Controls */}
          <div className="px-6 py-4 bg-slate-50 border-b border-slate-200">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              {/* Status filters */}
              <div className="flex flex-wrap gap-2">
                {statusFilters.map(filter => (
                  <button
                    key={filter.key}
                    onClick={() => setActiveFilter(filter.key)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      activeFilter === filter.key
                        ? 'bg-slate-900 text-white'
                        : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    {filter.color && (
                      <span className={`w-2.5 h-2.5 rounded-full ${filter.color}`} />
                    )}
                    <span>{filter.label}</span>
                    {filter.key !== 'all' && (
                      <span className={`${activeFilter === filter.key ? 'text-slate-300' : 'text-slate-400'}`}>
                        {statusCounts[filter.key]}
                      </span>
                    )}
                  </button>
                ))}
              </div>
              
              {/* Search */}
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search cities..."
                  className="pl-10"
                />
              </div>
            </div>
            
            {/* CRM Instruction */}
            <div className="mt-4 flex items-start gap-3 p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
              <Info className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-emerald-800">
                <strong>Track your requests:</strong> Mark cities as pending when you submit a request. 
                When you receive the data, mark as completed. The system will remind you to resubmit after 30 days for fresh data.
              </p>
            </div>
          </div>
          
          {/* Cities grid */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-280px)]">
            {filteredCities.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredCities.map((city, index) => (
                  <CityCard
                    key={city.name}
                    city={city}
                    index={index}
                    onStatusChange={(status) => onStatusChange(city.name, status)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <Search className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-700 mb-2">No cities found</h3>
                <p className="text-slate-500">Try adjusting your search or filter criteria</p>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}