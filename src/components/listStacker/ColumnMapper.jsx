import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// The fields we care about mapping
const REQUIRED_FIELDS = [
  { key: 'address', label: 'Property Address', required: true },
  { key: 'city', label: 'City', required: false },
  { key: 'state', label: 'State', required: false },
  { key: 'zip', label: 'Zip Code', required: false },
];

export default function ColumnMapper({ csvHeaders, sampleRows, onConfirm, onBack }) {
  const [mapping, setMapping] = useState(() => {
    // Auto-detect common column names
    const auto = {};
    const h = csvHeaders.map(c => c.toLowerCase());
    REQUIRED_FIELDS.forEach(f => {
      const candidates = {
        address: ['address', 'property address', 'street address', 'addr', 'street', 'property addr', 'situs address', 'site address'],
        city: ['city', 'city name', 'mailing city', 'situs city'],
        state: ['state', 'st', 'mailing state', 'situs state', 'state code'],
        zip: ['zip', 'zip code', 'postal code', 'zipcode', 'zip5', 'mailing zip', 'situs zip'],
      };
      const match = candidates[f.key]?.find(c => h.includes(c));
      if (match) auto[f.key] = csvHeaders[h.indexOf(match)];
    });
    return auto;
  });

  const canProceed = mapping['address']; // address is the only true requirement

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex flex-col h-full"
    >
      <div className="flex items-center gap-3 mb-6">
        <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
          <ArrowLeft className="w-4 h-4 text-slate-500" />
        </button>
        <div>
          <h2 className="text-lg font-bold text-slate-900">Map Your Columns</h2>
          <p className="text-sm text-slate-500">Match your CSV columns to the fields below. Only Address is required.</p>
        </div>
      </div>

      <div className="border border-slate-200 rounded-xl overflow-hidden mb-6">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="py-3 px-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Field</th>
              <th className="py-3 px-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Your CSV Column</th>
              <th className="py-3 px-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide hidden md:table-cell">Sample Data</th>
            </tr>
          </thead>
          <tbody>
            {REQUIRED_FIELDS.map((field, i) => {
              const selectedCol = mapping[field.key];
              const sample = selectedCol && sampleRows[0] ? sampleRows[0][selectedCol] : null;
              const isMapped = !!selectedCol;
              return (
                <tr key={field.key} className={`border-b border-slate-100 last:border-0 ${i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}`}>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      {isMapped
                        ? <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                        : <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 ${field.required ? 'border-red-300' : 'border-slate-300'}`} />
                      }
                      <span className="font-medium text-slate-800 text-sm">{field.label}</span>
                      {field.required && <span className="text-red-400 text-xs">*</span>}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <Select
                      value={mapping[field.key] || '__none__'}
                      onValueChange={val => {
                        setMapping(prev => ({ ...prev, [field.key]: val === '__none__' ? undefined : val }));
                      }}
                    >
                      <SelectTrigger className="h-8 text-sm w-full max-w-xs">
                        <SelectValue placeholder="(none)" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="__none__">(none)</SelectItem>
                        {csvHeaders.map(h => (
                          <SelectItem key={h} value={h}>{h}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="py-3 px-4 hidden md:table-cell">
                    <span className="text-xs text-slate-400 font-mono truncate max-w-[180px] block">
                      {sample || '—'}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="text-xs text-slate-400 mb-4">* Address is required. City, State, and Zip are optional but recommended.</div>

      <Button
        onClick={() => onConfirm(mapping)}
        disabled={!canProceed}
        className="w-full h-11 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold text-sm"
      >
        OK to Process
      </Button>
    </motion.div>
  );
}