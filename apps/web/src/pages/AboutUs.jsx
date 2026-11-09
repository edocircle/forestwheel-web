import { useState, useEffect } from 'react';

export default function AboutUs() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

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
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch settings:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <main className="pt-24 min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
      </main>
    );
  }

  // Fallbacks in case settings are empty
  const s = settings || {};
  const mapAddress = s.contact_address || 'Beverly Hills, CA 90210';

  return (
    <main className="pt-20">
      {/* Hero: Our Story */}
      <section className="relative h-[716px] flex items-center overflow-hidden">
        <img alt="Showroom" className="absolute inset-0 w-full h-full object-cover" src="https://res.cloudinary.com/demqmcqky/image/upload/v1777649808/11_erase_awjnvu.jpg" />
        <div className="absolute inset-0 bg-white/70"></div>
        <div className="relative max-w-7xl mx-auto px-8 w-full">
          <div className="max-w-2xl">
            <div className="w-12 h-1 bg-[#F68E13] mb-6"></div>
            <h1 className="font-headline text-6xl md:text-8xl font-black tracking-tighter text-on-surface mb-6">
              {s.about_hero_title || 'Our Story'}
            </h1>
            <p className="text-xl text-on-surface-variant leading-relaxed max-w-lg whitespace-pre-line">
              {s.about_hero_text || 'At Forest Wheel, we curate automotive experiences that ignite the soul of driving.'}
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision: Bento-style */}
      <section className="py-24 bg-surface px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-surface-container-lowest p-12 rounded-xl">
            <span className="material-symbols-outlined text-[#F68E13] text-4xl mb-6">rocket_launch</span>
            <h3 className="font-headline text-3xl font-bold mb-4">Our Mission</h3>
            <p className="text-on-surface-variant leading-relaxed font-body whitespace-pre-line">
              {s.about_mission || 'To redefine the premium automotive journey.'}
            </p>
          </div>
          <div className="bg-[#F68E13] text-white p-12 rounded-xl shadow-none">
            <span className="material-symbols-outlined text-white text-4xl mb-6">visibility</span>
            <h3 className="font-headline text-3xl font-bold mb-4">Our Vision</h3>
            <p className="text-white/90 leading-relaxed font-body whitespace-pre-line">
              {s.about_vision || 'To become the global gold standard for luxury vehicle acquisitions.'}
            </p>
          </div>
        </div>
      </section>

      {/* Narrative: Meet the Founder */}
      <section className="py-24 bg-surface-container-low px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-5 relative">
            <div className="aspect-[4/5] rounded-xl overflow-hidden shadow-2xl">
              <img alt="Founder" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" src="https://res.cloudinary.com/demqmcqky/image/upload/v1779986411/FW_About_Us_001_claxgw.jpg" />
            </div>
            <div className="absolute -bottom-6 -right-6 bg-surface-container-lowest p-8 rounded-xl shadow-lg max-w-xs">
              <p className="font-headline font-black text-[#F68E13] italic text-lg leading-tight">
                "{s.about_founder_quote || 'The drive isn\'t about the destination, it\'s about the ignition of the spirit.'}"
              </p>
            </div>
          </div>
          <div className="lg:col-span-7">
            <h4 className="font-label text-sm uppercase tracking-widest text-[#F68E13] font-bold mb-4">The Visionary</h4>
            <h2 className="font-headline text-5xl font-black tracking-tighter mb-8">{s.about_founder_name || 'Founder'}</h2>
            <div className="space-y-6 text-on-surface-variant text-lg leading-relaxed whitespace-pre-line">
              <p>{s.about_founder_bio || 'Founder biography goes here.'}</p>
              <div className="pt-4">
                <div className="w-16 h-px bg-outline-variant mb-6"></div>
                <p className="font-headline font-bold text-on-surface">{s.about_founder_title || 'Founder & CEO'}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Stats: Minimalist Flex */}
      <section className="py-20 bg-surface px-8 border-y border-surface-variant/30">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
          <div>
            <p className="font-headline text-5xl font-black text-on-surface mb-2">{s.about_stat_years || '0'}</p>
            <p className="font-label text-xs uppercase tracking-widest text-on-surface-variant font-semibold">Years Experience</p>
          </div>
          <div>
            <p className="font-headline text-5xl font-black text-[#F68E13] mb-2">{s.about_stat_cars_sold || '0'}</p>
            <p className="font-label text-xs uppercase tracking-widest text-on-surface-variant font-semibold">Premium Cars Sold</p>
          </div>
          <div>
            <p className="font-headline text-5xl font-black text-on-surface mb-2">{s.about_stat_rating || '0.0'}</p>
            <p className="font-label text-xs uppercase tracking-widest text-on-surface-variant font-semibold">Customer Rating</p>
          </div>
          <div>
            <p className="font-headline text-5xl font-black text-on-surface mb-2">{s.about_stat_valuation || '0'}</p>
            <p className="font-label text-xs uppercase tracking-widest text-on-surface-variant font-semibold">Valuation Time</p>
          </div>
        </div>
      </section>

      {/* Location & Contact: High-End Split */}
      <section className="py-24 bg-surface px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm">
            <div className="lg:col-span-2 p-12 lg:p-16 flex flex-col justify-center">
              <h2 className="font-headline text-4xl font-black tracking-tighter mb-8">Visit the Forest Wheel</h2>
              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <span className="material-symbols-outlined text-[#F68E13]">location_on</span>
                  <div>
                    <p className="font-headline font-bold text-on-surface">Headquarters</p>
                    <p className="text-on-surface-variant leading-relaxed whitespace-pre-line">
                      {s.contact_address || '1200 Forest Wheel Dr.'}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <span className="material-symbols-outlined text-[#F68E13]">call</span>
                  <div>
                    <p className="font-headline font-bold text-on-surface">Whatsapp</p>
                    <p className="text-on-surface-variant">{s.contact_phone || '+1 (555) 012-3456'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <span className="material-symbols-outlined text-[#F68E13]">schedule</span>
                  <div>
                    <p className="font-headline font-bold text-on-surface">Showroom Hours</p>
                    <p className="text-on-surface-variant whitespace-pre-line">{s.contact_hours || 'Mon - Sun: 24/7'}</p>
                  </div>
                </div>
              </div>
              <a href="https://wa.me/6588191514?text=Hi%2C%20I%20would%20like%20to%20book%20a%20private%20viewing." target="_blank" rel="noopener noreferrer" className="mt-12 w-full py-4 rounded-lg border-2 border-[#F68E13] text-[#F68E13] font-headline font-bold hover:bg-[#F68E13] hover:text-white transition-all duration-300 text-center block">
                Book a Private Viewing
              </a>
            </div>
            <div className="lg:col-span-3 min-h-[400px] relative bg-surface-container">
              {/* Google Maps Iframe */}
              <iframe 
                width="100%" 
                height="100%" 
                frameBorder="0" 
                scrolling="no" 
                marginHeight="0" 
                marginWidth="0" 
                src={`https://maps.google.com/maps?q=${encodeURIComponent(mapAddress)}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
                className="absolute inset-0 w-full h-full border-0"
              ></iframe>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
