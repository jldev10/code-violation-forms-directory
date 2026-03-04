import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';
import MarketAutocomplete from './MarketAutocomplete';

const LIST_TYPES = [
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

function parseCSV(text) {
  const lines = text.trim().split('\n');
  if (lines.length < 2) return [];
  const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/"/g, ''));
  return lines.slice(1).map(line => {
    const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
    const obj = {};
    headers.forEach((h, i) => { obj[h] = values[i] || ''; });
    return obj;
  }).filter(r => Object.values(r).some(v => v));
}

function extractAddress(row) {
  // Try common address field names
  const addressFields = ['address', 'property address', 'street', 'street address', 'addr', 'property'];
  for (const f of addressFields) {
    if (row[f]) return row[f];
  }
  // Fallback: first non-empty value
  return Object.values(row)[0] || '';
}

function extractField(row, candidates) {
  for (const f of candidates) {
    if (row[f]) return row[f];
  }
  return '';
}

export default function UploadModal({ isOpen, onClose, onUploaded }) {
  const [listType, setListType] = useState('');
  const [market, setMarket] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(null);
  const fileRef = useRef();

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setFile(f);
    const reader = new FileReader();
    reader.onload = (ev) => {
      const rows = parseCSV(ev.target.result);
      setPreview({ rows, raw: ev.target.result });
    };
    reader.readAsText(f);
  };

  const handleUpload = async () => {
    if (!listType || !market || !file || !preview) {
      toast.error('Please fill in all fields and select a file.');
      return;
    }
    setUploading(true);
    try {
      // Load existing leads to check for duplicates
      const existing = await base44.entities.Lead.list();
      const existingMap = {};
      existing.forEach(l => {
        const key = l.address?.toLowerCase().trim();
        if (key) existingMap[key] = l;
      });

      let created = 0, updated = 0;
      for (const row of preview.rows) {
        const address = extractAddress(row);
        if (!address) continue;
        const key = address.toLowerCase().trim();
        const city = extractField(row, ['city', 'city name']);
        const state = extractField(row, ['state', 'st']);
        const zip = extractField(row, ['zip', 'zip code', 'postal code']);

        if (existingMap[key]) {
          // Update existing lead — add tag if not already present
          const lead = existingMap[key];
          const tags = lead.tags || [];
          if (!tags.includes(listType)) {
            tags.push(listType);
            const tag_dates = lead.tag_dates || {};
            tag_dates[listType] = date;
            await base44.entities.Lead.update(lead.id, { tags, tag_dates, market: market || lead.market });
            updated++;
          }
        } else {
          const newLead = {
            address,
            city,
            state,
            zip,
            market,
            tags: [listType],
            tag_dates: { [listType]: date }
          };
          const created_lead = await base44.entities.Lead.create(newLead);
          existingMap[key] = created_lead;
          created++;
        }
      }
      toast.success(`Uploaded! ${created} new leads added, ${updated} leads updated with new tag.`);
      onUploaded();
      onClose();
      setFile(null);
      setPreview(null);
      setListType('');
      setMarket('');
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
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 z-10"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-900">Upload Lead List</h2>
              <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

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
                <Label>Market / Area</Label>
                <Input value={market} onChange={e => setMarket(e.target.value)} placeholder="e.g. Fort Worth, TX" />
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
                  <p className="text-xs text-slate-400 mt-1">Must include an address column</p>
                </div>
                <input ref={fileRef} type="file" accept=".csv" className="hidden" onChange={handleFileChange} />
              </div>

              {preview && (
                <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-lg p-3">
                  <FileText className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span className="text-sm text-emerald-700 font-medium">{preview.rows.length} rows detected</span>
                </div>
              )}
            </div>

            <div className="flex gap-3 mt-6">
              <Button variant="outline" onClick={onClose} className="flex-1">Cancel</Button>
              <Button
                onClick={handleUpload}
                disabled={uploading}
                className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white"
              >
                {uploading ? 'Uploading...' : 'Upload List'}
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}