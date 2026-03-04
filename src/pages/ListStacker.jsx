import React, { useState, useMemo } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Plus, Search, Filter, Flame, ChevronDown, Trash2, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import UploadModal from '../components/listStacker/UploadModal';
import LeadRow from '../components/listStacker/LeadRow';
import StatsBar from '../components/listStacker/StatsBar';
import { createPageUrl } from '@/utils';

const LIST_TYPES = [
  'All Types',
  'Code Violations',
  'Water Shut-Off',
  'Water Lien',
  'Tax Delinquencies',
  'Tax Liens',
  'Evictions',
  'Pre-Foreclosures',
  'Fire Damaged',
  'Probates',
  'Arrest Records',
  'Other'
];

export default function ListStacker() {
  const [showUpload, setShowUpload] = useState(false);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('All Types');
  const [filterMotivation, setFilterMotivation] = useState('all');
  const [filterMarket, setFilterMarket] = useState('all');
  const queryClient = useQueryClient();

  const { data: leads = [], isLoading } = useQuery({
    queryKey: ['leads'],
    queryFn: async () => {
      const all = [];
      let page = 0;
      const pageSize = 500;
      while (true) {
        const batch = await base44.entities.Lead.list('-created_date', pageSize, page * pageSize);
        all.push(...batch);
        if (batch.length < pageSize) break;
        page++;
      }
      return all;
    },
  });

  const markets = useMemo(() => {
    const m = [...new Set(leads.map(l => l.market).filter(Boolean))];
    return m;
  }, [leads]);

  const filtered = useMemo(() => {
    let list = leads;
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(l =>
        l.address?.toLowerCase().includes(q) ||
        l.city?.toLowerCase().includes(q) ||
        l.market?.toLowerCase().includes(q)
      );
    }
    if (filterType !== 'All Types') {
      list = list.filter(l => l.tags?.includes(filterType));
    }
    if (filterMarket !== 'all') {
      list = list.filter(l => l.market === filterMarket);
    }
    if (filterMotivation === 'high') {
      list = list.filter(l => (l.tags?.length || 0) >= 3);
    } else if (filterMotivation === 'medium') {
      list = list.filter(l => (l.tags?.length || 0) === 2);
    } else if (filterMotivation === 'stacked') {
      list = list.filter(l => (l.tags?.length || 0) >= 2);
    }
    // Sort by motivation (most tags first)
    return [...list].sort((a, b) => (b.tags?.length || 0) - (a.tags?.length || 0));
  }, [leads, search, filterType, filterMotivation, filterMarket]);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <a href={createPageUrl('Home')} className="text-slate-400 hover:text-white text-sm transition-colors">← Back to Directory</a>
              </div>
              <h1 className="text-2xl font-bold">List Stacker</h1>
              <p className="text-slate-400 text-sm mt-1">Upload lead lists and automatically stack duplicates by property address.</p>
            </div>
            <Button
              onClick={() => setShowUpload(true)}
              className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white gap-2 w-full md:w-auto"
            >
              <Plus className="w-4 h-4" />
              Add Leads
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        {/* Stats */}
        <StatsBar leads={leads} />

        {/* Filters */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm mb-4 p-4">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                className="pl-9"
                placeholder="Search by address, city, or market..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by list type" />
              </SelectTrigger>
              <SelectContent>
                {LIST_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={filterMotivation} onValueChange={setFilterMotivation}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by motivation" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Motivation Levels</SelectItem>
                <SelectItem value="stacked">Stacked (2+ lists)</SelectItem>
                <SelectItem value="medium">Medium (2 lists)</SelectItem>
                <SelectItem value="high">High (3+ lists)</SelectItem>
              </SelectContent>
            </Select>
            {markets.length > 0 && (
              <Select value={filterMarket} onValueChange={setFilterMarket}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Filter by market" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Markets</SelectItem>
                  {markets.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                </SelectContent>
              </Select>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
            <p className="text-sm text-slate-600">
              <span className="font-semibold text-slate-900">{filtered.length.toLocaleString()}</span> leads
              {filtered.length !== leads.length && ` (filtered from ${leads.length.toLocaleString()})`}
            </p>
            <div className="flex items-center gap-1 text-xs text-slate-400">
              <Flame className="w-3 h-3 text-red-400" />
              Sorted by motivation
            </div>
          </div>

          {isLoading ? (
            <div className="py-20 text-center text-slate-400">Loading leads...</div>
          ) : leads.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-20 text-center">
              <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500 font-medium">No leads yet</p>
              <p className="text-slate-400 text-sm mt-1">Upload your first CSV list to get started</p>
              <Button onClick={() => setShowUpload(true)} className="mt-4 bg-emerald-500 hover:bg-emerald-600 text-white gap-2">
                <Plus className="w-4 h-4" /> Add Leads
              </Button>
            </motion.div>
          ) : filtered.length === 0 ? (
            <div className="py-20 text-center text-slate-400">No leads match your filters.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="py-3 px-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide w-12">#</th>
                    <th className="py-3 px-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Property Address</th>
                    <th className="py-3 px-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Market</th>
                    <th className="py-3 px-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">List Tags</th>
                    <th className="py-3 px-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Motivation</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((lead, i) => (
                    <LeadRow key={lead.id} lead={lead} index={i} />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <UploadModal
        isOpen={showUpload}
        onClose={() => setShowUpload(false)}
        onUploaded={() => queryClient.invalidateQueries({ queryKey: ['leads'] })}
      />
    </div>
  );
}