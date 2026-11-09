import { useState } from 'react';

export default function SellCar() {
  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    email: '',
    vehicleMake: '',
    vehicleModel: '',
    vehicleYear: '',
    vehicleMileage: '',
    registrationDate: '',
    carPlate: '',
    accessCode: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [successData, setSuccessData] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.fullName || !form.email || !form.vehicleMake || !form.vehicleModel) {
      alert('Please fill out all required fields.');
      return;
    }
    setSubmitting(true);
    const API_BASE = import.meta.env.VITE_API_URL || '';
    try {
      const res = await fetch(`${API_BASE}/api/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          vehicleYear: form.vehicleYear ? parseInt(form.vehicleYear, 10) : undefined,
          vehicleMileage: form.vehicleMileage ? parseInt(form.vehicleMileage, 10) : undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to submit valuation request');
      setSuccessData(data);
      // Clear form
      setForm({
        fullName: '', phone: '', email: '',
        vehicleMake: '', vehicleModel: '', vehicleYear: '',
        vehicleMileage: '', registrationDate: '', carPlate: '', accessCode: '',
      });
    } catch (err) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="pt-32 pb-24 px-6 max-w-4xl mx-auto">
      {/* Hero Title Section */}
      <div className="mb-16 text-center">
        <h1 className="font-headline text-5xl md:text-6xl font-extrabold tracking-tighter text-on-surface mb-4 animate-fade-in">
          Ignite Your Sale.
        </h1>
        <div className="w-16 h-1 bg-primary-container mx-auto mb-6"></div>
        <p className="text-on-surface-variant text-lg max-w-xl mx-auto">
          Singapore's premium automotive curation. Receive a competitive, fair market valuation for your vehicle within 24 hours.
        </p>
      </div>

      {/* Trust Markers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12 animate-fade-in">
        <div className="flex items-center gap-4 bg-surface-container-lowest p-6 rounded-xl border-l-4 border-primary-container shadow-sm">
          <span className="material-symbols-outlined text-primary text-3xl" data-icon="timer">timer</span>
          <div>
            <h3 className="font-headline font-bold text-on-surface">Get a fair valuation in 24 hours</h3>
            <p className="text-xs text-on-surface-variant uppercase tracking-wider font-label">Rapid Response Guaranteed</p>
          </div>
        </div>
        <div className="flex items-center gap-4 bg-surface-container-lowest p-6 rounded-xl border-l-4 border-secondary shadow-sm">
          <span className="material-symbols-outlined text-secondary text-3xl" data-icon="verified_user">verified_user</span>
          <div>
            <h3 className="font-headline font-bold text-on-surface">Transparent Process</h3>
            <p className="text-xs text-on-surface-variant uppercase tracking-wider font-label">No Hidden Fees Or Gimmicks</p>
          </div>
        </div>
      </div>

      {/* Multi-Step Form Container */}
      <div className="bg-surface-container-lowest rounded-xl p-8 md:p-12 shadow-sm border border-outline-variant/30 relative">
        <form className="space-y-12" onSubmit={handleSubmit}>
          {/* Step 1: Your Information */}
          <section>
            <div className="flex items-center gap-3 mb-8">
              <span className="w-8 h-8 rounded-full bg-[#f68e13] text-white flex items-center justify-center font-bold text-sm">1</span>
              <h2 className="font-headline text-2xl font-bold tracking-tight">Your Information</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant font-label ml-1">Full Name *</label>
                <input name="fullName" value={form.fullName} onChange={handleChange} required className="w-full px-4 py-4 rounded-lg bg-surface-container-low border-none focus:ring-2 focus:ring-[#f68e13] focus:bg-surface-container-lowest transition-all text-on-surface placeholder:text-outline-variant" placeholder="John Tan" type="text" />
              </div>
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant font-label ml-1">Mobile Number</label>
                <input name="phone" value={form.phone} onChange={handleChange} className="w-full px-4 py-4 rounded-lg bg-surface-container-low border-none focus:ring-2 focus:ring-[#f68e13] focus:bg-surface-container-lowest transition-all text-on-surface placeholder:text-outline-variant" placeholder="+65 8888 8888" type="tel" />
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant font-label ml-1">Email Address *</label>
                <input name="email" value={form.email} onChange={handleChange} required className="w-full px-4 py-4 rounded-lg bg-surface-container-low border-none focus:ring-2 focus:ring-[#f68e13] focus:bg-surface-container-lowest transition-all text-on-surface placeholder:text-outline-variant" placeholder="john.tan@example.com" type="email" />
              </div>
            </div>
          </section>

          <div className="h-px bg-surface-container-high w-full"></div>

          {/* Step 2: Vehicle Details */}
          <section>
            <div className="flex items-center gap-3 mb-8">
              <span className="w-8 h-8 rounded-full bg-[#f68e13] text-white flex items-center justify-center font-bold text-sm">2</span>
              <h2 className="font-headline text-2xl font-bold tracking-tight">Vehicle Details</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant font-label ml-1">Vehicle Make *</label>
                <input name="vehicleMake" value={form.vehicleMake} onChange={handleChange} required className="w-full px-4 py-4 rounded-lg bg-surface-container-low border-none focus:ring-2 focus:ring-[#f68e13] focus:bg-surface-container-lowest transition-all text-on-surface placeholder:text-outline-variant" placeholder="e.g. Mercedes-Benz" type="text" />
              </div>
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant font-label ml-1">Model Name *</label>
                <input name="vehicleModel" value={form.vehicleModel} onChange={handleChange} required className="w-full px-4 py-4 rounded-lg bg-surface-container-low border-none focus:ring-2 focus:ring-[#f68e13] focus:bg-surface-container-lowest transition-all text-on-surface placeholder:text-outline-variant" placeholder="e.g. C200 AMG Line" type="text" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant font-label ml-1">Year of MFR</label>
                  <input name="vehicleYear" value={form.vehicleYear} onChange={handleChange} className="w-full px-4 py-4 rounded-lg bg-surface-container-low border-none focus:ring-2 focus:ring-[#f68e13] focus:bg-surface-container-lowest transition-all text-on-surface placeholder:text-outline-variant" placeholder="2022" type="number" />
                </div>
                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant font-label ml-1">Mileage (km)</label>
                  <input name="vehicleMileage" value={form.vehicleMileage} onChange={handleChange} className="w-full px-4 py-4 rounded-lg bg-surface-container-low border-none focus:ring-2 focus:ring-[#f68e13] focus:bg-surface-container-lowest transition-all text-on-surface placeholder:text-outline-variant" placeholder="15000" type="number" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant font-label ml-1">Registration Date</label>
                <input name="registrationDate" value={form.registrationDate} onChange={handleChange} className="w-full px-4 py-4 rounded-lg bg-surface-container-low border-none focus:ring-2 focus:ring-[#f68e13] focus:bg-surface-container-lowest transition-all text-on-surface cursor-pointer text-secondary" type="date" />
              </div>
            </div>
          </section>

          <div className="h-px bg-surface-container-high w-full"></div>

          {/* Step 3: Verification */}
          <section>
            <div className="flex items-center gap-3 mb-8">
              <span className="w-8 h-8 rounded-full bg-[#f68e13] text-white flex items-center justify-center font-bold text-sm">3</span>
              <h2 className="font-headline text-2xl font-bold tracking-tight">Verification</h2>
            </div>
            <div className="bg-surface-container-low p-6 rounded-xl border-2 border-dashed border-outline-variant/30">
              <div className="space-y-4 max-w-sm">
                {/* Car Plate */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant font-label ml-1">Car Plate Number *</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline" data-icon="directions_car">directions_car</span>
                    <input name="carPlate" value={form.carPlate} onChange={handleChange} required className="w-full pl-12 pr-4 py-4 rounded-lg bg-surface-container-lowest border-none focus:ring-2 focus:ring-[#f68e13] transition-all text-on-surface placeholder:text-outline-variant uppercase font-bold" placeholder="e.g. SJA1234A" type="text" />
                  </div>
                </div>

                {/* Access Code */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant font-label ml-1">Access Code</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline" data-icon="lock">lock</span>
                    <input name="accessCode" value={form.accessCode} onChange={handleChange} className="w-full pl-12 pr-4 py-4 rounded-lg bg-surface-container-lowest border-none focus:ring-2 focus:ring-[#f68e13] transition-all text-on-surface placeholder:text-outline-variant" placeholder="Enter mandatory access code" type="text" />
                  </div>
                  <p className="text-[10px] text-outline tracking-wider uppercase font-medium mt-2">Required for Singapore market security clearance</p>
                </div>
              </div>
            </div>
          </section>

          {/* Final Action */}
          <div className="pt-8">
            <button disabled={submitting} className="w-full bg-[#f68e13] text-white py-5 rounded-lg font-headline font-black text-xl uppercase tracking-widest hover:scale-[0.98] transition-transform shadow-xl shadow-[#f68e13]/20 disabled:opacity-50 cursor-pointer" type="submit">
              {submitting ? 'Submitting Valuation...' : 'Submit Valuation Request'}
            </button>
            <p className="text-center text-on-surface-variant text-sm mt-6 font-medium">
              By submitting, you agree to our <a className="underline hover:text-[#f68e13]" href="#">Data Privacy Policy</a>
            </p>
          </div>
        </form>
      </div>

      {/* Featured Image Card (Asymmetric Layout) */}
      <div className="mt-24 grid grid-cols-1 md:grid-cols-12 items-center gap-12">
        <div className="md:col-span-7 rounded-2xl overflow-hidden aspect-[16/9] shadow-2xl">
          <img alt="Luxury Car Showroom" className="w-full h-full object-cover" data-alt="Modern high-end luxury car dealership showroom in Singapore with sleek architectural lines and soft ambient lighting reflecting on polished floors" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD4UbvPOgGwxBjzgnpQIzGQWWB5uerWgChulkTffzBO8anRXYDtBJC4oD86QcHRjm_XN9YU1dGpn2XHpR4-V9sMaOM9KAbJAFtGXVhcf9F_b7kyPiaBoXQhExlehiiCDW7ifbsGWS7HeNIIR33GSCik330TRu4yUjREhVGfsPjLJwpHOVK8ePPt3HZsB24QCt_HXELeenbL7fhEr2iItJmGZpRNbqUMs0HRCZFPUcVaBZEaW4sMt1_5FKYf-n9prtQRPnTQ5DSJ4KK6" />
        </div>
        <div className="md:col-span-5 text-left md:-ml-16 bg-surface-container-lowest p-8 md:p-12 rounded-2xl shadow-lg relative z-10 border-t-4 border-[#f68e13]">
          <span className="text-[#f68e13] font-bold text-xs uppercase tracking-widest block mb-4">Expert Curators</span>
          <h3 className="font-headline text-3xl font-extrabold tracking-tight mb-4">Why Sell to Forest Wheel?</h3>
          <ul className="space-y-4">
            <li className="flex items-start gap-3">
              <span className="material-symbols-outlined text-[#f68e13] text-xl" data-icon="check_circle">check_circle</span>
              <span className="text-sm text-on-surface-variant">Instant full payment via PayNow or Bank Transfer</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="material-symbols-outlined text-[#f68e13] text-xl" data-icon="check_circle">check_circle</span>
              <span className="text-sm text-on-surface-variant">Full handling of LTA ownership transfer paperwork</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="material-symbols-outlined text-[#f68e13] text-xl" data-icon="check_circle">check_circle</span>
              <span className="text-sm text-on-surface-variant">Complimentary professional car appraisal at your location</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Success Modal Overlay */}
      {successData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md select-none transition-all duration-300">
          <div className="bg-white max-w-lg w-full rounded-2xl p-8 border border-black/5 shadow-2xl relative overflow-hidden text-center animate-fade-in">
            {/* Elegant Orange/Gold Accent top border */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-[#f68e13]"></div>

            {/* Animating Success Checkmark */}
            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600 shadow-inner">
              <span className="material-symbols-outlined text-4xl animate-pulse">verified</span>
            </div>

            <h3 className="font-headline text-3xl font-extrabold tracking-tight text-on-surface uppercase mb-3">Valuation Submitted</h3>
            <p className="text-sm text-secondary font-medium tracking-wide uppercase mb-6">Singapore Market Security Cleared</p>
            
            <div className="bg-surface-container-low p-6 rounded-xl mb-6 space-y-4 text-left border border-outline-variant/30">
              <p className="text-on-surface-variant text-sm leading-relaxed text-center font-medium">
                We have received your valuation request! Our expert automotive curators are already compiling a competitive, fair-market quote for your vehicle.
              </p>
              <div className="h-px bg-surface-container-high w-full"></div>
              <div className="flex justify-between items-center text-xs font-bold text-on-surface-variant uppercase">
                <span>Inquiry Reference:</span>
                <span className="text-[#f68e13] font-black font-headline text-sm tracking-wider">{successData.inquiryNumber}</span>
              </div>
            </div>

            <p className="text-xs text-secondary font-medium mb-8 leading-relaxed">
              A Forest Wheel representative will contact you via mobile or email with your custom quotation within <strong className="text-on-surface font-bold text-sm">24 Hours</strong>.
            </p>

            <button
              onClick={() => setSuccessData(null)}
              className="w-full bg-primary text-white py-4 rounded-xl font-headline font-black text-sm uppercase tracking-widest hover:brightness-110 active:scale-[0.98] transition-all shadow-lg shadow-primary/20 cursor-pointer"
            >
              Acknowledge & Close
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
