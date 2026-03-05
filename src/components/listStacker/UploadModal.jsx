import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';
import MarketAutocomplete from './MarketAutocomplete';
import ColumnMapper from './ColumnMapper';

const LIST_TYPES = [
  'Code Violations','Water Shut-Off','Water Lien','Tax Delinquencies',
  'Tax Liens','Evictions','Pre-Foreclosures','Fire Damaged','Probates','Arrest Records','Other'
];

function parseCSV(text) {
  const lines = text.trim().split('\n');
  if (lines.length < 2) return { headers: [], rows: [] };
  const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
  const rows = lines.slice(1).map(line => {
    const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
    const obj = {};
    headers.forEach((h, i) => { obj[h] = values[i] || ''; });
    return obj;
  }).filter(r => Object.values(r).some(v => v));
  return { headers, rows };
}

export default function UploadModal({ isOpen, onClose, onUploaded }) {
  const [step, setStep] = useState('setup'); // 'setup' | 'mapping'
  const [listType, setListType] = useState('');
  const [market, setMarket] = useState('');
  const localToday = () => {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const d = String(now.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };
  const [date, setDate] = useState(localToday());
  const [file, setFile] = useState(null);
  const [parsed, setParsed] = useState(null); // { headers, rows }
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef();

  const handleClose = () => {
    setStep('setup');
    setFile(null);
    setParsed(null);
    setListType('');
    setMarket('');
    onClose();
  };

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setFile(f);
    const reader = new FileReader();
    reader.onload = (ev) => {
      setParsed(parseCSV(ev.target.result));
    };
    reader.readAsText(f);
  };

  const handleNext = () => {
    if (!listType || !file || !parsed) {
      toast.error('Please select a list type and upload a CSV file.');
      return;
    }
    setStep('mapping');
  };

  const handleProcess = async (mapping) => {
    setUploading(true);
    try {
      // Fetch ALL existing leads (paginated)
      const existingMap = {};
      let page = 0;
      const pageSize = 500;
      while (true) {
        const batch = await base44.entities.Lead.list('-created_date', pageSize, page * pageSize);
        batch.forEach(l => {
          const key = l.address?.toLowerCase().trim();
          if (key) existingMap[key] = l;
        });
        if (batch.length < pageSize) break;
        page++;
      }

      const toCreate = [];
      const toUpdate = [];

      for (const row of parsed.rows) {
        const address = mapping.address ? row[mapping.address] : '';
        if (!address) continue;
        const key = address.toLowerCase().trim();
        const city = mapping.city ? row[mapping.city] : '';
        const state = mapping.state ? row[mapping.state] : '';
        const zip = mapping.zip ? row[mapping.zip] : '';

        if (existingMap[key]) {
          const lead = existingMap[key];
          const tags = lead.tags || [];
          if (!tags.includes(listType)) {
            const newTags = [...tags, listType];
            const tag_dates = { ...(lead.tag_dates || {}), [listType]: date };
            toUpdate.push({ id: lead.id, tags: newTags, tag_dates, market: market || lead.market });
          }
        } else {
          toCreate.push({ address, city, state, zip, market, tags: [listType], tag_dates: { [listType]: date } });
          existingMap[key] = { address };
        }
      }

      // Bulk create in batches of 100
      const BATCH = 100;
      for (let i = 0; i < toCreate.length; i += BATCH) {
        await base44.entities.Lead.bulkCreate(toCreate.slice(i, i + BATCH));
      }

      // Update in parallel batches of 20
      const UPDATE_BATCH = 20;
      for (let i = 0; i < toUpdate.length; i += UPDATE_BATCH) {
        await Promise.all(
          toUpdate.slice(i, i + UPDATE_BATCH).map(u =>
            base44.entities.Lead.update(u.id, { tags: u.tags, tag_dates: u.tag_dates, market: u.market })
          )
        );
      }

      toast.success(`Done! ${toCreate.length} new leads added, ${toUpdate.length} leads updated.`);
      onUploaded();
      handleClose();
    } catch (err) {
      toast.error('Upload failed: ' + err.message);
    }
    setUploading(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={handleClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-xl p-6 z-10 max-h-[90vh] overflow-y-auto"
          >
            {/* Close button */}
            <button onClick={handleClose} className="absolute top-4 right-4 p-2 hover:bg-slate-100 rounded-lg">
              <X className="w-5 h-5 text-slate-500" />
            </button>

            {step === 'setup' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <h2 className="text-xl font-bold text-slate-900 mb-6">Upload Lead List</h2>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>List Type</Label>
                    <Select value={listType} onValueChange={setListType}>
                      <SelectTrigger><SelectValue placeholder="Select list type" /></SelectTrigger>
                      <SelectContent>
                        {LIST_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>List Date</Label>
                    <Input type="date" value={date} onChange={e => setDate(e.target.value)} />
                  </div>

                  <div className="space-y-2">
                    <Label>CSV File</Label>
                    <div
                      onClick={() => fileRef.current.click()}
                      className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center cursor-pointer hover:border-emerald-400 hover:bg-emerald-50 transition-colors"
                    >
                      <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                      {file ? (
                        <p className="text-sm text-emerald-600 font-medium">{file.name}</p>
                      ) : (
                        <p className="text-sm text-slate-500">Click to upload CSV file</p>
                      )}
                    </div>
                    <input ref={fileRef} type="file" accept=".csv" className="hidden" onChange={handleFileChange} />
                  </div>

                  {parsed && (
                    <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-lg p-3">
                      <FileText className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      <span className="text-sm text-emerald-700 font-medium">{parsed.rows.length.toLocaleString()} rows detected</span>
                    </div>
                  )}
                </div>

                <div className="flex gap-3 mt-6">
                  <Button variant="outline" onClick={handleClose} className="flex-1">Cancel</Button>
                  <Button
                    onClick={handleNext}
                    className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white"
                  >
                    Next: Map Columns →
                  </Button>
                </div>
              </motion.div>
            )}

            {step === 'mapping' && parsed && (
              <div className="relative">
                {uploading && (
                  <div className="absolute inset-0 bg-white/80 z-10 flex flex-col items-center justify-center rounded-xl">
                    <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-3" />
                    <p className="text-sm text-slate-600 font-medium">Processing leads...</p>
                  </div>
                )}
                <ColumnMapper
                  csvHeaders={parsed.headers}
                  sampleRows={parsed.rows.slice(0, 5)}
                  onConfirm={handleProcess}
                  onBack={() => setStep('setup')}
                />
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}