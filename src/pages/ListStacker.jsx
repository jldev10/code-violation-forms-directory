import React, { useState, useMemo } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Plus, Search, Flame, Trash2, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import UploadModal from '../components/listStacker/UploadModal';
import LeadRow from '../components/listStacker/LeadRow';
import StatsBar from '../components/listStacker/StatsBar';
import DeleteConfirmModal from '../components/listStacker/DeleteConfirmModal';
import { createPageUrl } from '@/utils';
import { toast } from 'sonner';

const LIST_TYPES = [
  'All Types','Code Violations','Water Shut-Off','Water Lien','Tax Delinquencies',
  'Tax Liens','Evictions','Pre-Foreclosures','Fire Damaged','Probates','Arrest Records','Other'
];

const PAGE_SIZE_OPTIONS = [25, 50, 75, 100];

export default function ListStacker() {
  const [showUpload, setShowUpload] = useState(false);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('All Types');
  const [filterMotivation, setFilterMotivation] = useState('all');
  const [filterMarket, setFilterMarket] = useState('all');
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
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
    return [...new Set(leads.map(l => l.market).filter(Boolean))];
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
    if (filterType !== 'All Types') list = list.filter(l => l.tags?.includes(filterType));
    if (filterMarket !== 'all') list = list.filter(l => l.market === filterMarket);
    if (filterMotivation === 'high') list = list.filter(l => (l.tags?.length || 0) >= 3);
    else if (filterMotivation === 'medium') list = list.filter(l => (l.tags?.length || 0) === 2);
    else if (filterMotivation === 'stacked') list = list.filter(l => (l.tags?.length || 0) >= 2);
    return [...list].sort((a, b) => (b.tags?.length || 0) - (a.tags?.length || 0));
  }, [leads, search, filterType, filterMotivation, filterMarket]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // Reset to page 1 when filters change
  const handleFilterChange = (fn) => { fn(); setCurrentPage(1); };

  const toggleSelect = (id) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const selectAll = () => setSelectedIds(new Set(filtered.map(l => l.id)));
  const clearSelection = () => setSelectedIds(new Set());

  const handleDelete = async () => {
    const ids = [...selectedIds];
    await Promise.all(ids.map(id => base44.entities.Lead.delete(id)));
    toast.success(`${ids.length} ${ids.length === 1 ? 'lead' : 'leads'} deleted.`);
    clearSelection();
    setShowDeleteModal(false);
    queryClient.invalidateQueries({ queryKey: ['leads'] });
  };

  const selectedCount = selectedIds.size;
  const unselectedCount = filtered.length - selectedCount;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <a href={createPageUrl('Home')} className="text-slate-400 hover:text-white text-sm transition-colors">← Back to Directory</a>
              <h1 className="text-2xl font-bold mt-1">List Stacker</h1>
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
        <StatsBar leads={leads} />

        {/* Filters */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm mb-4 p-4">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input className="pl-9" placeholder="Search by address, city, or market..." value={search} onChange={e => handleFilterChange(() => setSearch(e.target.value))} />
            </div>
            <Select value={filterType} onValueChange={v => handleFilterChange(() => setFilterType(v))}>
              <SelectTrigger className="w-full md:w-48"><SelectValue /></SelectTrigger>
              <SelectContent>{LIST_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
            </Select>
            <Select value={filterMotivation} onValueChange={v => handleFilterChange(() => setFilterMotivation(v))}>
              <SelectTrigger className="w-full md:w-48"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Motivation Levels</SelectItem>
                <SelectItem value="stacked">Stacked (2+ lists)</SelectItem>
                <SelectItem value="medium">Medium (2 lists)</SelectItem>
                <SelectItem value="high">High (3+ lists)</SelectItem>
              </SelectContent>
            </Select>
            {markets.length > 0 && (
              <Select value={filterMarket} onValueChange={v => handleFilterChange(() => setFilterMarket(v))}>
                <SelectTrigger className="w-full md:w-48"><SelectValue /></SelectTrigger>
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
          {/* Table header bar */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 flex-wrap gap-2">
            <div className="text-sm text-slate-700">
              {selectedCount === 0 ? (
                <>
                  <span className="font-semibold text-slate-900">{filtered.length.toLocaleString()}</span> leads
                  {filtered.length !== leads.length && <span className="text-slate-400"> (filtered from {leads.length.toLocaleString()})</span>}
                </>
              ) : (
                <>
                  <span className="font-semibold text-slate-900">{selectedCount.toLocaleString()} {selectedCount === 1 ? 'lead' : 'leads'} selected.</span>
                  {' '}{unselectedCount.toLocaleString()} {unselectedCount === 1 ? 'lead' : 'leads'} currently unselected.{' '}
                  <button onClick={selectAll} className="font-bold text-slate-900 underline hover:no-underline">Select All</button>
                </>
              )}
            </div>
            <div className="flex items-center gap-3">
              {selectedCount > 0 && (
                <Button
                  onClick={() => setShowDeleteModal(true)}
                  variant="outline"
                  size="sm"
                  className="text-red-600 border-red-200 hover:bg-red-50 gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete Selected
                </Button>
              )}
              <div className="flex items-center gap-1 text-sm font-semibold text-slate-900">
                <Flame className="w-4 h-4 text-red-400" />
                Sorted by Motivation
              </div>
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
                    <th className="py-3 px-4 w-10">
                      <input
                        type="checkbox"
                        className="w-4 h-4 rounded border-slate-300 accent-emerald-500"
                        checked={selectedCount > 0 && selectedIds.size === paginated.length && paginated.every(l => selectedIds.has(l.id))}
                        onChange={() => {
                          const allPageSelected = paginated.every(l => selectedIds.has(l.id));
                          if (allPageSelected) {
                            setSelectedIds(prev => { const n = new Set(prev); paginated.forEach(l => n.delete(l.id)); return n; });
                          } else {
                            setSelectedIds(prev => { const n = new Set(prev); paginated.forEach(l => n.add(l.id)); return n; });
                          }
                        }}
                      />
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Property Address</th>
                    <th className="py-3 px-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Market</th>
                    <th className="py-3 px-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">List Tags</th>
                    <th className="py-3 px-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Motivation</th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.map((lead, i) => (
                    <LeadRow
                      key={lead.id}
                      lead={lead}
                      index={(currentPage - 1) * pageSize + i}
                      selected={selectedIds.has(lead.id)}
                      onSelect={toggleSelect}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination footer */}
          {filtered.length > 0 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100 flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 text-sm rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  ← Prev
                </button>
                <span className="text-sm text-slate-600">
                  Page <span className="font-semibold">{currentPage}</span> of <span className="font-semibold">{totalPages}</span>
                </span>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 text-sm rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Next →
                </button>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-500">Rows per page:</span>
                <Select value={String(pageSize)} onValueChange={v => { setPageSize(Number(v)); setCurrentPage(1); }}>
                  <SelectTrigger className="h-8 w-24 text-sm"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {PAGE_SIZE_OPTIONS.map(n => <SelectItem key={n} value={String(n)}>{n}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </div>
      </div>

      <UploadModal
        isOpen={showUpload}
        onClose={() => setShowUpload(false)}
        onUploaded={() => queryClient.invalidateQueries({ queryKey: ['leads'] })}
      />

      <DeleteConfirmModal
        isOpen={showDeleteModal}
        count={selectedCount}
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteModal(false)}
      />
    </div>
  );
}