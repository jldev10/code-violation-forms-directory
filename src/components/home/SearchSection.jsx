import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, ExternalLink, MapPin } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function SearchSection({ allCities }) {
  const [query, setQuery] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  
  const searchResults = useMemo(() => {
    if (!query.trim()) return [];
    return allCities
      .filter(city => city.name.toLowerCase().includes(query.toLowerCase()))
      .slice(0, 6);
  }, [query, allCities]);
  
  const handleSearch = () => {
    setHasSearched(true);
  };
  
  return (
    <section className="py-20 bg-gradient-to-br from-slate-900 to-slate-800 relative overflow-hidden" id="search">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }} />
      </div>
      
      <div className="max-w-3xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="text-3xl font-bold text-white mb-4">Search for a Specific City</h2>
          <p className="text-slate-300">Find code violation forms for any municipality in our database.</p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex gap-3"
        >
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input
              value={query}
              onChange={e => {
                setQuery(e.target.value);
                setHasSearched(false);
              }}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
              placeholder="Enter city name (e.g., Phoenix, Austin, Louisville)..."
              className="pl-12 py-6 text-lg bg-white border-0"
            />
          </div>
          <Button
            onClick={handleSearch}
            className="px-8 py-6 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
          >
            <Search className="w-5 h-5" />
          </Button>
        </motion.div>
        
        {/* Search Results */}
        {hasSearched && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6"
          >
            {searchResults.length > 0 ? (
              <div className="grid gap-3">
                {searchResults.map((city, index) => (
                  <motion.div
                    key={`${city.state}-${city.name}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-white rounded-xl p-4 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                        <MapPin className="w-5 h-5 text-emerald-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-900">{city.name}</h4>
                        <p className="text-sm text-slate-500">{city.state}</p>
                      </div>
                    </div>
                    <a
                      href={city.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-sm font-medium rounded-lg hover:shadow-md transition-shadow"
                    >
                      <ExternalLink className="w-4 h-4" />
                      View Form
                    </a>
                  </motion.div>
                ))}
                {allCities.filter(c => c.name.toLowerCase().includes(query.toLowerCase())).length > 6 && (
                  <p className="text-center text-slate-400 text-sm mt-2">
                    + {allCities.filter(c => c.name.toLowerCase().includes(query.toLowerCase())).length - 6} more results. Try a more specific search.
                  </p>
                )}
              </div>
            ) : query.trim() ? (
              <div className="bg-white/10 backdrop-blur rounded-xl p-8 text-center">
                <Search className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">No cities found</h3>
                <p className="text-slate-300">Try a different city name or check the state directories above.</p>
              </div>
            ) : null}
          </motion.div>
        )}
      </div>
    </section>
  );
}