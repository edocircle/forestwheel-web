import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../lib/api';

export default function InventoryForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [images, setImages] = useState([]);
  const [form, setForm] = useState({
    make: '', model: '', variant: '', year: new Date().getFullYear(),
    mileage: 0, mileageUnit: 'KM', price: '', currency: 'SGD',
    status: 'AVAILABLE', chassisNumber: '', engine: '', transmission: '',
    horsepower: '', torque: '', driveType: '', fuelEconomy: '',
    driverAssist: '', infotainment: '', soundSystem: '', connectivity: '',
    color: '', description: '', editorialBy: '', youtubeUrl: '',
    featured: false, inquiriesEnabled: true,
    fuelType: '', owners: '', registrationDate: '', coeExpiry: '',
  });

  useEffect(() => {
    if (isEdit) {
      api.get(`/inventory/${id}`)
        .then((res) => {
          const v = res.data;
          setForm({
            make: v.make, model: v.model, variant: v.variant || '',
            year: v.year, mileage: v.mileage, mileageUnit: v.mileageUnit,
            price: parseFloat(v.price), currency: v.currency, status: v.status,
            chassisNumber: v.chassisNumber || '', engine: v.engine || '',
            transmission: v.transmission || '', horsepower: v.horsepower || '',
            torque: v.torque || '', driveType: v.driveType || '',
            fuelEconomy: v.fuelEconomy || '', driverAssist: v.driverAssist || '',
            infotainment: v.infotainment || '', soundSystem: v.soundSystem || '',
            connectivity: v.connectivity || '',
            color: v.color || '', description: v.description || '',
            editorialBy: v.editorialBy || '',
            youtubeUrl: v.youtubeUrl || '', featured: v.featured,
            inquiriesEnabled: v.inquiriesEnabled,
            fuelType: v.fuelType || '',
            owners: v.owners || '',
            registrationDate: v.registrationDate ? new Date(v.registrationDate).toISOString().split('T')[0] : '',
            coeExpiry: v.coeExpiry ? new Date(v.coeExpiry).toISOString().split('T')[0] : '',
          });
          setImages(v.images || []);
        })
        .catch(() => navigate('/inventory'))
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    const payload = {
      ...form,
      year: parseInt(form.year, 10),
      mileage: parseInt(form.mileage, 10),
      price: parseFloat(form.price),
      owners: form.owners ? parseInt(form.owners, 10) : null,
      registrationDate: form.registrationDate ? new Date(form.registrationDate).toISOString() : null,
      coeExpiry: form.coeExpiry ? new Date(form.coeExpiry).toISOString() : null,
      fuelType: form.fuelType || null,
    };

    try {
      if (isEdit) {
        await api.put(`/inventory/${id}`, payload);
      } else {
        await api.post('/inventory', payload);
      }
      if (window.history.length > 1) {
        navigate(-1);
      } else {
        navigate('/inventory');
      }
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to save vehicle');
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (e) => {
    const files = e.target.files;
    if (!files.length || !id) return;

    const formData = new FormData();
    for (const file of files) formData.append('images', file);

    try {
      const res = await api.post(`/inventory/${id}/images`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setImages(res.data);
    } catch (err) {
      alert('Failed to upload images');
    }
  };

  const handleSetPrimaryImage = async (imageId) => {
    try {
      const res = await api.patch(`/inventory/${id}/images/${imageId}/primary`);
      setImages(res.data);
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to set primary image');
    }
  };

  const handleDeleteImage = async (imageId) => {
    try {
      const res = await api.delete(`/inventory/${id}/images/${imageId}`);
      if (res.data?.images) {
        setImages(res.data.images);
      } else {
        setImages((imgs) => imgs.filter((i) => i.id !== imageId));
      }
    } catch (err) {
      alert('Failed to delete image');
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
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-12 flex justify-between items-end">
        <div>
          <nav className="flex items-center gap-2 text-xs font-bold tracking-widest text-primary uppercase mb-4">
            <a href="/inventory" className="hover:underline">Inventory</a>
            <span className="material-symbols-outlined text-[10px]">chevron_right</span>
            <span className="text-secondary">{isEdit ? 'Edit' : 'New'} Listing</span>
          </nav>
          <h2 className="text-5xl font-black font-headline tracking-tighter text-on-surface">
            {isEdit ? `${form.make} ${form.model}` : 'New Vehicle Listing'}
          </h2>
        </div>
        <div className="flex gap-4 pb-2">
          <button 
            onClick={() => {
              if (window.history.length > 1) {
                navigate(-1);
              } else {
                navigate('/inventory');
              }
            }} 
            className="px-8 py-3 rounded-lg text-xs font-bold uppercase tracking-widest text-secondary hover:bg-surface-container transition-colors"
          >
            Cancel
          </button>
          <button onClick={handleSubmit} disabled={saving} className="px-8 py-3 rounded-lg text-xs font-bold uppercase tracking-widest bg-primary text-white shadow-lg shadow-primary/20 hover:brightness-110 active:scale-95 transition-all disabled:opacity-50">
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-12 gap-6">
          {/* Main Form */}
          <div className="col-span-8 space-y-6">
            {/* Basic Info */}
            <section className="bg-white p-8 rounded-xl shadow-sm border border-outline-variant/30 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-primary/30"></div>
              <h3 className="text-xs font-bold tracking-widest text-secondary uppercase mb-8 flex items-center">
                <span className="material-symbols-outlined text-sm mr-2">info</span> Essential Details
              </h3>
              <div className="grid grid-cols-2 gap-6">
                <div className="relative bg-surface-container-low p-4 pt-8 rounded-lg border-b-2 border-transparent focus-within:border-primary transition-all">
                  <label className="absolute top-2 left-4 text-[10px] uppercase font-bold tracking-widest text-primary">Make</label>
                  <input name="make" value={form.make} onChange={handleChange} required className="w-full bg-transparent border-none p-0 text-lg font-bold focus:ring-0 text-on-surface" placeholder="e.g. Porsche" />
                </div>
                <div className="relative bg-surface-container-low p-4 pt-8 rounded-lg border-b-2 border-transparent focus-within:border-primary transition-all">
                  <label className="absolute top-2 left-4 text-[10px] uppercase font-bold tracking-widest text-primary">Model</label>
                  <input name="model" value={form.model} onChange={handleChange} required className="w-full bg-transparent border-none p-0 text-lg font-bold focus:ring-0 text-on-surface" placeholder="e.g. 911 GT3" />
                </div>
                <div className="relative bg-surface-container-low p-4 pt-8 rounded-lg border-b-2 border-transparent focus-within:border-primary transition-all">
                  <label className="absolute top-2 left-4 text-[10px] uppercase font-bold tracking-widest text-primary">Price ({form.currency})</label>
                  <input name="price" type="number" step="0.01" value={form.price} onChange={handleChange} required className="w-full bg-transparent border-none p-0 text-lg font-bold focus:ring-0 text-on-surface" placeholder="245000" />
                </div>
                <div className="relative bg-surface-container-low p-4 pt-8 rounded-lg border-b-2 border-transparent focus-within:border-primary transition-all">
                  <label className="absolute top-2 left-4 text-[10px] uppercase font-bold tracking-widest text-primary">Status</label>
                  <select name="status" value={form.status} onChange={handleChange} className="w-full bg-transparent border-none p-0 text-lg font-bold focus:ring-0 text-on-surface appearance-none cursor-pointer">
                    <option value="AVAILABLE">Available</option>
                    <option value="RESERVED">Reserved</option>
                    <option value="SOLD">Sold</option>
                  </select>
                </div>
                <div className="relative bg-surface-container-low p-4 pt-8 rounded-lg border-b-2 border-transparent focus-within:border-primary transition-all">
                  <label className="absolute top-2 left-4 text-[10px] uppercase font-bold tracking-widest text-primary">Year</label>
                  <input name="year" type="number" value={form.year} onChange={handleChange} required className="w-full bg-transparent border-none p-0 text-lg font-bold focus:ring-0 text-on-surface" />
                </div>
                <div className="relative bg-surface-container-low p-4 pt-8 rounded-lg border-b-2 border-transparent focus-within:border-primary transition-all">
                  <label className="absolute top-2 left-4 text-[10px] uppercase font-bold tracking-widest text-primary">Mileage</label>
                  <div className="flex gap-2 items-center">
                    <input name="mileage" type="number" value={form.mileage} onChange={handleChange} className="flex-1 bg-transparent border-none p-0 text-lg font-bold focus:ring-0 text-on-surface" />
                    <select name="mileageUnit" value={form.mileageUnit} onChange={handleChange} className="bg-transparent border-none text-sm font-bold focus:ring-0 text-secondary">
                      <option value="KM">KM</option>
                      <option value="MI">MI</option>
                    </select>
                  </div>
                </div>
                <div className="relative bg-surface-container-low p-4 pt-8 rounded-lg border-b-2 border-transparent focus-within:border-primary transition-all">
                  <label className="absolute top-2 left-4 text-[10px] uppercase font-bold tracking-widest text-primary">Variant</label>
                  <input name="variant" value={form.variant} onChange={handleChange} className="w-full bg-transparent border-none p-0 text-lg font-bold focus:ring-0 text-on-surface" placeholder="e.g. Weissach Package" />
                </div>
                <div className="relative bg-surface-container-low p-4 pt-8 rounded-lg border-b-2 border-transparent focus-within:border-primary transition-all">
                  <label className="absolute top-2 left-4 text-[10px] uppercase font-bold tracking-widest text-primary">Color</label>
                  <input name="color" value={form.color} onChange={handleChange} className="w-full bg-transparent border-none p-0 text-lg font-bold focus:ring-0 text-on-surface" placeholder="e.g. Shark Blue" />
                </div>
              </div>
            </section>

            {/* Description */}
            <section className="bg-white p-8 rounded-xl shadow-sm border border-outline-variant/30">
              <h3 className="text-xs font-bold tracking-widest text-secondary uppercase mb-6 flex items-center">
                <span className="material-symbols-outlined text-sm mr-2">auto_awesome</span> Editorial Description
              </h3>
              <textarea
                name="description" value={form.description} onChange={handleChange} rows={5}
                className="w-full bg-surface-container-low p-4 rounded-lg border-none text-on-surface resize-none focus:ring-2 focus:ring-primary/20"
                placeholder="Write a compelling description..."
              />
              <div className="relative bg-surface-container-low p-4 pt-8 rounded-lg border-b-2 border-transparent focus-within:border-primary transition-all mt-4">
                <label className="absolute top-2 left-4 text-[10px] uppercase font-bold tracking-widest text-primary">Editorial By</label>
                <input name="editorialBy" value={form.editorialBy} onChange={handleChange} className="w-full bg-transparent border-none p-0 text-sm font-semibold focus:ring-0 text-on-surface" placeholder="e.g. Edward Suryajaya" />
              </div>
            </section>

            {/* Specs */}
            <section className="bg-white p-8 rounded-xl shadow-sm border border-outline-variant/30">
              <h3 className="text-xs font-bold tracking-widest text-secondary uppercase mb-6 flex items-center">
                <span className="material-symbols-outlined text-sm mr-2">precision_manufacturing</span> Technical Specifications
              </h3>
              <div className="grid grid-cols-4 gap-4">
                {[
                  { name: 'engine', label: 'Engine', placeholder: '4.0L Flat-Six' },
                  { name: 'transmission', label: 'Transmission', placeholder: '7-Speed PDK' },
                  { name: 'fuelType', label: 'Fuel Type', placeholder: 'e.g. Petrol / Hybrid' },
                  { name: 'horsepower', label: 'Horsepower', placeholder: '502 HP' },
                  { name: 'torque', label: 'Torque', placeholder: '346 lb-ft' },
                  { name: 'driveType', label: 'Drive Type', placeholder: 'Rear Wheel Drive' },
                  { name: 'fuelEconomy', label: 'Fuel Economy', placeholder: '16 City / 24 Hwy' },
                  { name: 'driverAssist', label: 'Driver Assist', placeholder: 'Adaptive Cruise...' },
                  { name: 'infotainment', label: 'Infotainment', placeholder: '10.9-in. Touchscreen' },
                  { name: 'soundSystem', label: 'Sound System', placeholder: 'BOSE® Surround' },
                  { name: 'connectivity', label: 'Connectivity', placeholder: 'Apple CarPlay & Android Auto' },
                  { name: 'chassisNumber', label: 'Chassis Number', placeholder: 'WP0AC2A9...' },
                ].map((field) => (
                  <div key={field.name} className="bg-surface-container-low p-4 rounded-lg">
                    <p className="text-[10px] uppercase font-bold tracking-widest text-primary mb-1">{field.label}</p>
                    <input name={field.name} value={form[field.name]} onChange={handleChange} className="w-full bg-transparent border-none p-0 text-sm font-semibold focus:ring-0 text-on-surface" placeholder={field.placeholder} />
                  </div>
                ))}
              </div>
            </section>

            {/* Ownership & Registration Section */}
            <section className="bg-white p-8 rounded-xl shadow-sm border border-outline-variant/30">
              <h3 className="text-xs font-bold tracking-widest text-secondary uppercase mb-6 flex items-center">
                <span className="material-symbols-outlined text-sm mr-2">badge</span> Ownership & Registration
              </h3>
              <div className="grid grid-cols-3 gap-6">
                <div className="bg-surface-container-low p-4 rounded-lg">
                  <p className="text-[10px] uppercase font-bold tracking-widest text-primary mb-1">No. Of Owners</p>
                  <input name="owners" type="number" min="0" value={form.owners} onChange={handleChange} className="w-full bg-transparent border-none p-0 text-sm font-semibold focus:ring-0 text-on-surface" placeholder="e.g. 1" />
                </div>
                <div className="bg-surface-container-low p-4 rounded-lg">
                  <p className="text-[10px] uppercase font-bold tracking-widest text-primary mb-1">Registration Date</p>
                  <input name="registrationDate" type="date" value={form.registrationDate} onChange={handleChange} className="w-full bg-transparent border-none p-0 text-sm font-semibold focus:ring-0 text-on-surface cursor-pointer text-secondary" />
                </div>
                <div className="bg-surface-container-low p-4 rounded-lg">
                  <p className="text-[10px] uppercase font-bold tracking-widest text-primary mb-1">COE Expiry Date</p>
                  <input name="coeExpiry" type="date" value={form.coeExpiry} onChange={handleChange} className="w-full bg-transparent border-none p-0 text-sm font-semibold focus:ring-0 text-on-surface cursor-pointer text-secondary" />
                </div>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="col-span-4 space-y-6">
            {/* Image Upload (edit mode only) */}
            {isEdit && (
              <section className="bg-white p-6 rounded-xl shadow-sm border border-outline-variant/30">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xs font-bold tracking-widest text-secondary uppercase flex items-center">
                    <span className="material-symbols-outlined text-sm mr-2">photo_library</span> Media Assets
                  </h3>
                  <span className="text-[10px] text-secondary">Hover image to set primary</span>
                </div>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <label className="aspect-square rounded-lg bg-surface-container-low flex items-center justify-center border-2 border-dashed border-outline-variant hover:border-primary/50 transition-colors cursor-pointer group">
                    <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageUpload} />
                    <div className="text-center">
                      <span className="material-symbols-outlined text-secondary group-hover:text-primary transition-colors">add_photo_alternate</span>
                      <p className="text-[8px] uppercase font-bold tracking-tighter text-secondary mt-1">Upload</p>
                    </div>
                  </label>
                  {images.map((img) => (
                    <div
                      key={img.id}
                      className={`aspect-square rounded-lg overflow-hidden group relative ${
                        img.isPrimary ? 'ring-2 ring-primary ring-offset-2' : ''
                      }`}
                    >
                      <img src={img.url.startsWith('http') ? img.url : `/uploads/${img.url}`} alt={img.altText} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2">
                        {!img.isPrimary && (
                          <button
                            type="button"
                            onClick={() => handleSetPrimaryImage(img.id)}
                            className="flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-primary text-white text-[10px] font-bold uppercase tracking-wider hover:brightness-110 transition-all shadow"
                            title="Set as Primary Image"
                          >
                            <span className="material-symbols-outlined text-xs">star</span>
                            Set Primary
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleDeleteImage(img.id)}
                          className="p-1.5 rounded-full bg-red-500/20 hover:bg-red-500/40 text-red-400 transition-colors"
                          title="Delete Image"
                        >
                          <span className="material-symbols-outlined text-lg">delete</span>
                        </button>
                      </div>
                      {img.isPrimary && (
                        <span className="absolute top-1.5 left-1.5 bg-primary text-white text-[9px] px-2 py-0.5 rounded font-bold flex items-center gap-1 shadow">
                          <span className="material-symbols-outlined text-[11px]">star</span>
                          PRIMARY
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* YouTube Link */}
            <section className="bg-white p-6 rounded-xl shadow-sm border border-outline-variant/30">
              <h3 className="text-xs font-bold tracking-widest text-secondary uppercase mb-4">Video Link</h3>
              <input name="youtubeUrl" value={form.youtubeUrl} onChange={handleChange} className="w-full bg-surface-container-low p-3 rounded-lg border-none text-sm focus:ring-2 focus:ring-primary/20" placeholder="https://youtube.com/watch?v=..." />
            </section>

            {/* Gallery Options */}
            <div className="p-6 rounded-xl border border-outline-variant/30 bg-white shadow-sm">
              <h4 className="text-[10px] font-bold text-secondary uppercase tracking-widest mb-4">Gallery Options</h4>
              <div className="space-y-4">
                <label className="flex items-center justify-between cursor-pointer group">
                  <span className="text-xs font-bold text-secondary group-hover:text-on-surface transition-colors">Feature on Homepage</span>
                  <input type="checkbox" name="featured" checked={form.featured} onChange={handleChange} className="w-5 h-5 text-primary rounded focus:ring-primary/20 border-outline-variant" />
                </label>
                <label className="flex items-center justify-between cursor-pointer group">
                  <span className="text-xs font-bold text-secondary group-hover:text-on-surface transition-colors">Enable Inquiries</span>
                  <input type="checkbox" name="inquiriesEnabled" checked={form.inquiriesEnabled} onChange={handleChange} className="w-5 h-5 text-primary rounded focus:ring-primary/20 border-outline-variant" />
                </label>
              </div>
            </div>

            {/* Save button (mobile) */}
            <button type="submit" disabled={saving} className="w-full py-4 bg-primary text-white rounded-xl font-bold text-sm uppercase tracking-widest shadow-lg shadow-primary/20 hover:brightness-110 active:scale-95 transition-all disabled:opacity-50 md:hidden">
              {saving ? 'Saving...' : isEdit ? 'Save Changes' : 'Create Listing'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
