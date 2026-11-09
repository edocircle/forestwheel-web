import { useState, useEffect } from 'react';

export default function TrustStrip() {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    const API_BASE = import.meta.env.VITE_API_URL || '';
    fetch(`${API_BASE}/api/settings`)
      .then(res => res.json())
      .then(data => {
        const vals = {};
        Object.entries(data).forEach(([k, v]) => {
          vals[k] = v.value;
        });
        setSettings(vals);
      })
      .catch(err => {
        console.error('Failed to fetch settings:', err);
      });
  }, []);

  const s = settings || {};

  return (
    <section className="bg-surface-container-low py-10 border-y border-outline-variant/30">
      <div className="max-w-7xl mx-auto px-8 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div className="flex flex-col items-center md:items-start">
          <span className="text-[#F68E13] font-headline font-black text-4xl">{s.about_stat_cars_sold || '500+'}</span>
          <span className="text-on-surface-variant font-label uppercase tracking-widest text-xs mt-1">Vehicles Sold</span>
        </div>
        <div className="flex flex-col items-center md:items-start border-l border-outline-variant/30 md:pl-8">
          <div className="flex items-center gap-1">
            <span className="text-[#F68E13] font-headline font-black text-4xl">{s.about_stat_rating || '4.9'}</span>
            <span className="material-symbols-outlined text-[#F68E13]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
          </div>
          <span className="text-on-surface-variant font-label uppercase tracking-widest text-xs mt-1">Google Rating</span>
        </div>
        <div className="flex flex-col items-center md:items-start border-l border-outline-variant/30 md:pl-8">
          <span className="text-[#F68E13] font-headline font-black text-4xl">{s.about_stat_years || '15+'}</span>
          <span className="text-on-surface-variant font-label uppercase tracking-widest text-xs mt-1">Years Experience</span>
        </div>
        <div className="flex flex-col items-center md:items-start border-l border-outline-variant/30 md:pl-8">
          <span className="text-[#F68E13] font-headline font-black text-4xl">{s.about_stat_valuation || '24h'}</span>
          <span className="text-on-surface-variant font-label uppercase tracking-widest text-xs mt-1">Valuation Time</span>
        </div>
      </div>
    </section>
  )
}
