import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Flame } from 'lucide-react';

const TAG_COLORS = {
  'Code Violations': 'bg-orange-100 text-orange-700 border-orange-200',
  'Water Shut-Off': 'bg-blue-100 text-blue-700 border-blue-200',
  'Water Lien': 'bg-cyan-100 text-cyan-700 border-cyan-200',
  'Tax Delinquencies': 'bg-yellow-100 text-yellow-700 border-yellow-200',
  'Tax Liens': 'bg-amber-100 text-amber-700 border-amber-200',
  'Evictions': 'bg-red-100 text-red-700 border-red-200',
  'Pre-Foreclosures': 'bg-rose-100 text-rose-700 border-rose-200',
  'Fire Damaged': 'bg-red-200 text-red-800 border-red-300',
  'Probates': 'bg-purple-100 text-purple-700 border-purple-200',
  'Arrest Records': 'bg-slate-100 text-slate-700 border-slate-200',
  'Other': 'bg-gray-100 text-gray-700 border-gray-200',
};

export default function LeadRow({ lead, index }) {
  const tagCount = lead.tags?.length || 0;
  const motivation = tagCount >= 3 ? 'high' : tagCount === 2 ? 'medium' : 'low';

  return (
    <tr className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
      <td className="py-3 px-4 text-sm text-slate-500 w-12">{index + 1}</td>
      <td className="py-3 px-4">
        <div>
          <p className="text-sm font-medium text-slate-900">{lead.address}</p>
          {(lead.city || lead.state || lead.zip) && (
            <p className="text-xs text-slate-400">{[lead.city, lead.state, lead.zip].filter(Boolean).join(', ')}</p>
          )}
        </div>
      </td>
      <td className="py-3 px-4 text-sm text-slate-600">{lead.market || '—'}</td>
      <td className="py-3 px-4">
        <div className="flex flex-wrap gap-1">
          {(lead.tags || []).map(tag => (
            <span key={tag} className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${TAG_COLORS[tag] || TAG_COLORS['Other']}`}>
              {tag}
            </span>
          ))}
        </div>
      </td>
      <td className="py-3 px-4">
        <div className="flex items-center gap-1">
          {Array.from({ length: tagCount }).map((_, i) => (
            <Flame key={i} className={`w-4 h-4 ${motivation === 'high' ? 'text-red-500' : motivation === 'medium' ? 'text-orange-400' : 'text-slate-300'}`} />
          ))}
          <span className={`text-xs ml-1 font-medium ${motivation === 'high' ? 'text-red-600' : motivation === 'medium' ? 'text-orange-500' : 'text-slate-400'}`}>
            {tagCount} {tagCount === 1 ? 'list' : 'lists'}
          </span>
        </div>
      </td>
    </tr>
  );
}