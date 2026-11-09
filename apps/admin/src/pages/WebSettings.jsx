import { useState, useEffect } from 'react';
import api from '../lib/api';

export default function WebSettings() {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState('');

  useEffect(() => {
    api.get('/settings')
      .then((res) => {
        setSettings(res.data);
        if (res.data.logo_url?.value) {
          setLogoPreview(`/uploads/${res.data.logo_url.value}`);
        }
      })
      .catch((err) => console.error('Failed to load settings:', err))
      .finally(() => setLoading(false));
  }, []);

  const getValue = (key) => settings[key]?.value || '';
  const setValue = (key, value) => {
    setSettings((prev) => ({
      ...prev,
      [key]: { value, type: prev[key]?.type || 'TEXT' },
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Upload logo first if selected
      if (logoFile) {
        const formData = new FormData();
        formData.append('logo', logoFile);
        const logoRes = await api.post('/settings/logo', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        setValue('logo_url', logoRes.data.logoUrl);
      }

      // Save all text settings
      const batch = {};
      Object.entries(settings).forEach(([key, val]) => {
        if (key !== 'logo_url') {
          batch[key] = { value: val.value, type: val.type || 'TEXT' };
        }
      });

      await api.put('/settings', { settings: batch });
      alert('Settings saved successfully!');
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleLogoSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-end mb-10">
        <div>
          <h1 className="text-5xl font-black font-headline tracking-tighter text-on-surface">Web Settings</h1>
          <p className="text-on-surface-variant text-lg mt-2">Configure your public website appearance and content.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-8 py-3 rounded-lg bg-primary text-white font-bold uppercase tracking-widest text-xs shadow-lg shadow-primary/20 hover:brightness-110 active:scale-95 transition-all disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save All Changes'}
        </button>
      </div>

      <div className="space-y-8">
        {/* Logo Section */}
        <section className="bg-white p-8 rounded-xl shadow-sm border border-outline-variant/30">
          <h3 className="text-xs font-bold tracking-widest text-secondary uppercase mb-6 flex items-center">
            <span className="material-symbols-outlined text-sm mr-2">image</span> Website Logo
          </h3>
          <div className="flex items-center gap-8">
            <div className="w-40 h-40 rounded-xl border-2 border-dashed border-outline-variant bg-surface-container-low flex items-center justify-center overflow-hidden">
              {logoPreview ? (
                <img src={logoPreview} alt="Logo" className="w-full h-full object-contain p-2" />
              ) : (
                <div className="text-center">
                  <span className="material-symbols-outlined text-3xl text-outline">add_photo_alternate</span>
                  <p className="text-[10px] text-secondary mt-1 uppercase tracking-widest font-bold">No Logo</p>
                </div>
              )}
            </div>
            <div>
              <label className="inline-flex items-center gap-2 px-6 py-3 bg-surface-container-low rounded-lg cursor-pointer hover:bg-surface-container transition-colors">
                <span className="material-symbols-outlined text-sm text-primary">upload</span>
                <span className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Upload Logo</span>
                <input type="file" accept="image/*" className="hidden" onChange={handleLogoSelect} />
              </label>
              <p className="text-[10px] text-outline mt-3">Recommended: PNG or SVG, at least 200x200px</p>
            </div>
          </div>
        </section>

        {/* Site Identity */}
        <section className="bg-white p-8 rounded-xl shadow-sm border border-outline-variant/30">
          <h3 className="text-xs font-bold tracking-widest text-secondary uppercase mb-6 flex items-center">
            <span className="material-symbols-outlined text-sm mr-2">badge</span> Site Identity
          </h3>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-[10px] uppercase font-bold tracking-widest text-primary mb-2">Site Name</label>
              <input value={getValue('site_name')} onChange={(e) => setValue('site_name', e.target.value)} className="w-full bg-surface-container-low border-none rounded-lg px-4 py-3 font-bold text-on-surface focus:ring-2 focus:ring-primary/20" />
            </div>
            <div>
              <label className="block text-[10px] uppercase font-bold tracking-widest text-primary mb-2">Tagline</label>
              <input value={getValue('site_tagline')} onChange={(e) => setValue('site_tagline', e.target.value)} className="w-full bg-surface-container-low border-none rounded-lg px-4 py-3 text-on-surface focus:ring-2 focus:ring-primary/20" />
            </div>
          </div>
        </section>

        {/* About Us Content */}
        <section className="bg-white p-8 rounded-xl shadow-sm border border-outline-variant/30">
          <h3 className="text-xs font-bold tracking-widest text-secondary uppercase mb-6 flex items-center">
            <span className="material-symbols-outlined text-sm mr-2">info</span> About Us Page Content
          </h3>
          <div className="space-y-6">
            <div>
              <label className="block text-[10px] uppercase font-bold tracking-widest text-primary mb-2">Hero Title</label>
              <input value={getValue('about_hero_title')} onChange={(e) => setValue('about_hero_title', e.target.value)} className="w-full bg-surface-container-low border-none rounded-lg px-4 py-3 text-xl font-bold text-on-surface focus:ring-2 focus:ring-primary/20" />
            </div>
            <div>
              <label className="block text-[10px] uppercase font-bold tracking-widest text-primary mb-2">Hero Description</label>
              <textarea value={getValue('about_hero_text')} onChange={(e) => setValue('about_hero_text', e.target.value)} rows={3} className="w-full bg-surface-container-low border-none rounded-lg px-4 py-3 text-on-surface focus:ring-2 focus:ring-primary/20 resize-none" />
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-[10px] uppercase font-bold tracking-widest text-primary mb-2">Mission</label>
                <textarea value={getValue('about_mission')} onChange={(e) => setValue('about_mission', e.target.value)} rows={4} className="w-full bg-surface-container-low border-none rounded-lg px-4 py-3 text-on-surface focus:ring-2 focus:ring-primary/20 resize-none" />
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold tracking-widest text-primary mb-2">Vision</label>
                <textarea value={getValue('about_vision')} onChange={(e) => setValue('about_vision', e.target.value)} rows={4} className="w-full bg-surface-container-low border-none rounded-lg px-4 py-3 text-on-surface focus:ring-2 focus:ring-primary/20 resize-none" />
              </div>
            </div>
          </div>
        </section>

        {/* Founder Section */}
        <section className="bg-white p-8 rounded-xl shadow-sm border border-outline-variant/30">
          <h3 className="text-xs font-bold tracking-widest text-secondary uppercase mb-6 flex items-center">
            <span className="material-symbols-outlined text-sm mr-2">person</span> Founder Details
          </h3>
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-[10px] uppercase font-bold tracking-widest text-primary mb-2">Founder Name</label>
                <input value={getValue('about_founder_name')} onChange={(e) => setValue('about_founder_name', e.target.value)} className="w-full bg-surface-container-low border-none rounded-lg px-4 py-3 font-bold text-on-surface focus:ring-2 focus:ring-primary/20" />
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold tracking-widest text-primary mb-2">Founder Title</label>
                <input value={getValue('about_founder_title')} onChange={(e) => setValue('about_founder_title', e.target.value)} className="w-full bg-surface-container-low border-none rounded-lg px-4 py-3 text-on-surface focus:ring-2 focus:ring-primary/20" />
              </div>
            </div>
            <div>
              <label className="block text-[10px] uppercase font-bold tracking-widest text-primary mb-2">Founder Bio</label>
              <textarea value={getValue('about_founder_bio')} onChange={(e) => setValue('about_founder_bio', e.target.value)} rows={5} className="w-full bg-surface-container-low border-none rounded-lg px-4 py-3 text-on-surface focus:ring-2 focus:ring-primary/20 resize-none" />
            </div>
            <div>
              <label className="block text-[10px] uppercase font-bold tracking-widest text-primary mb-2">Founder Quote</label>
              <input value={getValue('about_founder_quote')} onChange={(e) => setValue('about_founder_quote', e.target.value)} className="w-full bg-surface-container-low border-none rounded-lg px-4 py-3 italic text-on-surface focus:ring-2 focus:ring-primary/20" />
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="bg-white p-8 rounded-xl shadow-sm border border-outline-variant/30">
          <h3 className="text-xs font-bold tracking-widest text-secondary uppercase mb-6 flex items-center">
            <span className="material-symbols-outlined text-sm mr-2">bar_chart</span> About Page Stats
          </h3>
          <div className="grid grid-cols-4 gap-4">
            {[
              { key: 'about_stat_years', label: 'Years Experience' },
              { key: 'about_stat_cars_sold', label: 'Cars Sold' },
              { key: 'about_stat_rating', label: 'Rating' },
              { key: 'about_stat_valuation', label: 'Valuation Time' },
            ].map((stat) => (
              <div key={stat.key} className="bg-surface-container-low p-4 rounded-lg">
                <label className="block text-[10px] uppercase font-bold tracking-widest text-primary mb-2">{stat.label}</label>
                <input value={getValue(stat.key)} onChange={(e) => setValue(stat.key, e.target.value)} className="w-full bg-transparent border-none p-0 text-2xl font-black font-headline text-on-surface focus:ring-0" />
              </div>
            ))}
          </div>
        </section>

        {/* Contact Info */}
        <section className="bg-white p-8 rounded-xl shadow-sm border border-outline-variant/30">
          <h3 className="text-xs font-bold tracking-widest text-secondary uppercase mb-6 flex items-center">
            <span className="material-symbols-outlined text-sm mr-2">contact_page</span> Contact Information
          </h3>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-[10px] uppercase font-bold tracking-widest text-primary mb-2">Address</label>
              <textarea value={getValue('contact_address')} onChange={(e) => setValue('contact_address', e.target.value)} rows={3} className="w-full bg-surface-container-low border-none rounded-lg px-4 py-3 text-on-surface focus:ring-2 focus:ring-primary/20 resize-none" />
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] uppercase font-bold tracking-widest text-primary mb-2">Phone</label>
                <input value={getValue('contact_phone')} onChange={(e) => setValue('contact_phone', e.target.value)} className="w-full bg-surface-container-low border-none rounded-lg px-4 py-3 text-on-surface focus:ring-2 focus:ring-primary/20" />
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold tracking-widest text-primary mb-2">Hours</label>
                <textarea value={getValue('contact_hours')} onChange={(e) => setValue('contact_hours', e.target.value)} rows={2} className="w-full bg-surface-container-low border-none rounded-lg px-4 py-3 text-on-surface focus:ring-2 focus:ring-primary/20 resize-none" />
              </div>
            </div>
          </div>
        </section>

        {/* Footer Save */}
        <div className="text-right pb-8">
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-12 py-4 rounded-xl bg-primary text-white font-bold uppercase tracking-widest text-sm shadow-xl shadow-primary/20 hover:brightness-110 active:scale-95 transition-all disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save All Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}
