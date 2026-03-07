import React from 'react';
import { Users, Layers, Flame, TrendingUp } from 'lucide-react';

export default function StatsBar({ leads }) {
  const total = leads.length;
  const stacked = leads.filter(l => (l.tags?.length || 0) >= 2).length;
  const highMotivation = leads.filter(l => (l.tags?.length || 0) >= 3).length;

  // Count by tag
  const tagCounts = {};
  leads.forEach(l => (l.tags || []).forEach(t => { tagCounts[t] = (tagCounts[t] || 0) + 1; }));
  const topTag = Object.entries(tagCounts).sort((a, b) => b[1] - a[1])[0];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      {[
        { label: 'Total Leads', value: total.toLocaleString(), icon: Users, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        { label: 'Stacked (2 lists)', value: stacked.toLocaleString(), icon: Layers, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'High Motivation (3+)', value: highMotivation.toLocaleString(), icon: Flame, color: 'text-red-600', bg: 'bg-red-50' },
        { label: 'Top List Type', value: topTag ? topTag[0] : '—', icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-50', small: true },
      ].map(({ label, value, icon: Icon, color, bg, small }) => (
        <div key={label} className="bg-white rounded-xl border border-slate-200 p-4 flex items-center gap-3 shadow-sm">
          <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
            <Icon className={`w-5 h-5 ${color}`} />
          </div>
          <div>
            <p className="text-xs text-slate-500">{label}</p>
            <p className={`font-bold text-slate-900 ${small ? 'text-sm' : 'text-xl'}`}>{value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}