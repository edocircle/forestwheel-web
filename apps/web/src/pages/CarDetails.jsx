import { Link, useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';

/**
 * Extract YouTube video ID from various URL formats
 */
function getYouTubeId(url) {
  if (!url) return null;
  const regExp = /^.*(?:youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[1].length === 11 ? match[1] : null;
}

/**
 * Format ISO Date string to clean Singapore-style date (e.g. 15 Dec 2023)
 */
function formatDate(dateString) {
  if (!dateString) return 'N/A';
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return 'N/A';
    return d.toLocaleDateString('en-SG', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  } catch {
    return 'N/A';
  }
}

export default function CarDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedVehicles, setRelatedVehicles] = useState([]);
  const relatedRef = useRef(null);
  const [lightbox, setLightbox] = useState({ isOpen: false, activeIndex: 0 });

  // Lightbox Keyboard Navigation Listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!lightbox.isOpen || !vehicle?.images?.length) return;
      if (e.key === 'ArrowRight') {
        setLightbox((prev) => ({ ...prev, activeIndex: (prev.activeIndex + 1) % vehicle.images.length }));
      } else if (e.key === 'ArrowLeft') {
        setLightbox((prev) => ({
          ...prev,
          activeIndex: (prev.activeIndex - 1 + vehicle.images.length) % vehicle.images.length,
        }));
      } else if (e.key === 'Escape') {
        setLightbox((prev) => ({ ...prev, isOpen: false }));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightbox.isOpen, vehicle?.images]);

  useEffect(() => {
    const API_BASE = import.meta.env.VITE_API_URL || '';
    fetch(`${API_BASE}/api/inventory/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to load vehicle');
        return res.json();
      })
      .then(data => {
        setVehicle(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  // Fetch latest 7 vehicles for Related section (extra 1 in case current is included)
  useEffect(() => {
    const API_BASE = import.meta.env.VITE_API_URL || '';
    fetch(`${API_BASE}/api/inventory?limit=7&sortBy=createdAt&sortOrder=desc`)
      .then(res => res.json())
      .then(data => {
        const all = data.vehicles || [];
        // Exclude the current vehicle
        const filtered = all.filter(v => v.id !== id).slice(0, 6);
        setRelatedVehicles(filtered);
      })
      .catch(err => console.error('Failed to fetch related:', err));
  }, [id]);

  const scrollRelated = (direction) => {
    if (!relatedRef.current) return;
    const scrollAmount = 420;
    relatedRef.current.scrollBy({
      left: direction === 'next' ? scrollAmount : -scrollAmount,
      behavior: 'smooth',
    });
  };

  if (loading) {
    return (
      <main className="pt-24 pb-20 px-4 md:px-12 max-w-[1600px] mx-auto min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
      </main>
    );
  }

  if (!vehicle) {
    return (
      <main className="pt-24 pb-20 px-4 md:px-12 max-w-[1600px] mx-auto min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-3xl font-black font-headline text-on-surface mb-4">Vehicle Not Found</h1>
        <Link to="/inventory" className="text-primary hover:underline font-bold">Return to Inventory</Link>
      </main>
    );
  }

  const getImgSrc = (url) => url.startsWith('http') ? url : `/uploads/${url}`;
  const mainImage = vehicle.images?.[0]?.url ? getImgSrc(vehicle.images[0].url) : null;
  const otherImages = vehicle.images?.slice(1) || [];
  const ytId = getYouTubeId(vehicle.youtubeUrl);

  const statusColor = (status) => {
    if (status === 'AVAILABLE') return 'text-tertiary';
    if (status === 'RESERVED') return 'text-blue-600';
    return 'text-error';
  };

  const statusDotColor = (status) => {
    if (status === 'AVAILABLE') return 'bg-[#10b981] animate-pulse';
    if (status === 'RESERVED') return 'bg-blue-500 animate-pulse';
    return 'bg-error';
  };

  return (
    <main className="pt-24 pb-20 px-4 md:px-12 max-w-[1600px] mx-auto min-h-screen">
      {/* Header Section */}
      <header className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => {
              if (window.history.length > 1) {
                navigate(-1);
              } else {
                navigate('/inventory');
              }
            }} 
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white text-on-surface border border-black/5 hover:bg-surface-container transition-colors shadow-sm cursor-pointer"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h1 className="text-4xl md:text-5xl font-black font-headline tracking-tighter uppercase text-on-surface">{vehicle.year} {vehicle.make} {vehicle.model}</h1>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-outline-variant hover:bg-surface-container transition-colors text-sm font-medium text-on-surface">
            <span className="material-symbols-outlined text-sm">share</span>
            Share
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-outline-variant hover:bg-surface-container transition-colors text-sm font-medium text-on-surface">
            <span className="material-symbols-outlined text-sm">favorite</span>
            Save
          </button>
        </div>
      </header>

      {/* Main Gallery & Specs Side-by-Side */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Gallery Section */}
        <div className="lg:col-span-8 space-y-4">
          <div className="relative rounded-2xl overflow-hidden bg-surface-container border border-black/5 shadow-sm aspect-[16/9]">
            {mainImage ? (
              <img onClick={() => setLightbox({ isOpen: true, activeIndex: 0 })} alt={`${vehicle.make} Hero`} className="w-full h-full object-cover cursor-zoom-in" src={mainImage} />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="material-symbols-outlined text-outline text-6xl">directions_car</span>
              </div>
            )}
            <div className="absolute top-4 right-4">
              <span className={`px-4 py-1.5 rounded-full bg-white/90 backdrop-blur-md font-bold text-xs uppercase tracking-widest border border-black/5 shadow-sm ${statusColor(vehicle.status)}`}>{vehicle.status}</span>
            </div>
          </div>
          {otherImages.length > 0 && (
            <div className="grid grid-cols-4 gap-4">
              {otherImages.slice(0, 4).map((img, idx) => (
                <div key={img.id} onClick={() => setLightbox({ isOpen: true, activeIndex: idx + 1 })} className={`aspect-square rounded-xl overflow-hidden bg-surface-container group cursor-pointer border ${idx === 3 && otherImages.length > 4 ? 'relative' : 'border-black/5'} shadow-sm`}>
                  <img alt={`Thumb ${idx}`} className={`w-full h-full object-cover group-hover:scale-105 transition-transform ${idx === 3 && otherImages.length > 4 ? 'brightness-50' : ''}`} src={getImgSrc(img.url)} />
                  {idx === 3 && otherImages.length > 4 && (
                    <div className="absolute inset-0 flex items-center justify-center font-bold text-lg text-white">+{otherImages.length - 3}</div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Sticky Specs Panel */}
        <div className="lg:col-span-4 sticky top-24">
          <div className="bg-white rounded-2xl p-8 border border-black/5 shadow-sm space-y-8">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className={`w-2 h-2 rounded-full ${statusDotColor(vehicle.status)}`}></span>
                <span className="text-xs font-bold text-tertiary uppercase tracking-widest font-label">{vehicle.status}</span>
              </div>
              <h2 className="text-5xl font-black font-headline tracking-tighter text-on-surface">${parseFloat(vehicle.price).toLocaleString()}</h2>
              <p className="text-on-surface-variant text-sm mt-1">Excluding taxes & licensing</p>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-black/5">
                <span className="text-on-surface-variant font-medium">Mileage</span>
                <span className="font-bold text-on-surface">{parseFloat(vehicle.mileage).toLocaleString()} {vehicle.mileageUnit || 'KM'}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-black/5">
                <span className="text-on-surface-variant font-medium">Engine</span>
                <span className="font-bold text-on-surface uppercase">{vehicle.engine || 'N/A'}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-black/5">
                <span className="text-on-surface-variant font-medium">Transmission</span>
                <span className="font-bold text-on-surface uppercase">{vehicle.transmission || 'N/A'}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-black/5">
                <span className="text-on-surface-variant font-medium">Exterior</span>
                <span className="font-bold text-on-surface uppercase">{vehicle.color || 'N/A'}</span>
              </div>
            </div>

            <div className="space-y-3">
              <a href={`https://wa.me/6588191514?text=${encodeURIComponent(`Hi, I would like to inquire about the ${vehicle.year} ${vehicle.make} ${vehicle.model}.\n\n${window.location.href}`)}`} target="_blank" rel="noopener noreferrer" className="w-full bg-primary text-white py-4 rounded-xl font-bold text-lg hover:scale-[1.02] transition-transform flex items-center justify-center gap-2 shadow-lg shadow-primary/20">
                <span className="material-symbols-outlined">mail</span>
                Inquire About This Car
              </a>
              <a href={`https://wa.me/6588191514?text=${encodeURIComponent(`Hi, I would like to schedule a test drive for the ${vehicle.year} ${vehicle.make} ${vehicle.model}.\n\n${window.location.href}`)}`} target="_blank" rel="noopener noreferrer" className="w-full bg-surface-container text-on-surface py-4 rounded-xl font-bold text-lg hover:bg-surface-container-high transition-colors text-center block">
                Schedule a Test Drive
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Video & Full Specs Section */}
      <section className="mt-20 grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-7 space-y-12">
          {/* Video Walkthrough — only show if YouTube URL is set */}
          {ytId && (
            <div>
              <h3 className="text-2xl font-black font-headline uppercase mb-6 flex items-center gap-3 text-on-surface">
                <span className="w-8 h-1 bg-primary"></span>
                Video Walkthrough
              </h3>
              <div className="aspect-video rounded-2xl overflow-hidden bg-surface-container border border-black/5 shadow-sm">
                <iframe
                  className="w-full h-full"
                  src={`https://www.youtube.com/embed/${ytId}`}
                  title="Vehicle Video Walkthrough"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          )}

          {/* Technical Specifications — dynamic from DB */}
          <div>
            <h3 className="text-2xl font-black font-headline uppercase mb-6 flex items-center gap-3 text-on-surface">
              <span className="w-8 h-1 bg-primary"></span>
              Technical Specifications
            </h3>
            <div className="bg-white rounded-2xl overflow-hidden border border-black/5 shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-3">
                {/* Performance Section */}
                <div className="p-6 space-y-4 border-b md:border-b-0 md:border-r border-black/5">
                  <h4 className="text-primary font-bold uppercase text-xs tracking-widest font-label">Performance</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm"><span className="text-on-surface-variant">Fuel Type</span><span className="text-on-surface font-medium capitalize">{vehicle.fuelType || 'N/A'}</span></div>
                    <div className="flex justify-between text-sm"><span className="text-on-surface-variant">Horsepower</span><span className="text-on-surface font-medium">{vehicle.horsepower || 'N/A'}</span></div>
                    <div className="flex justify-between text-sm"><span className="text-on-surface-variant">Torque</span><span className="text-on-surface font-medium">{vehicle.torque || 'N/A'}</span></div>
                    <div className="flex justify-between text-sm"><span className="text-on-surface-variant">Drive Type</span><span className="text-on-surface font-medium">{vehicle.driveType || 'N/A'}</span></div>
                    <div className="flex justify-between text-sm"><span className="text-on-surface-variant">Fuel Economy</span><span className="text-on-surface font-medium">{vehicle.fuelEconomy || 'N/A'}</span></div>
                  </div>
                </div>

                {/* Safety & Tech Section */}
                <div className="p-6 space-y-4 border-b md:border-b-0 md:border-r border-black/5">
                  <h4 className="text-primary font-bold uppercase text-xs tracking-widest font-label">Safety & Tech</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm"><span className="text-on-surface-variant">Driver Assist</span><span className="text-on-surface font-medium">{vehicle.driverAssist || 'N/A'}</span></div>
                    <div className="flex justify-between text-sm"><span className="text-on-surface-variant">Infotainment</span><span className="text-on-surface font-medium">{vehicle.infotainment || 'N/A'}</span></div>
                    <div className="flex justify-between text-sm"><span className="text-on-surface-variant">Sound System</span><span className="text-on-surface font-medium">{vehicle.soundSystem || 'N/A'}</span></div>
                    <div className="flex justify-between text-sm"><span className="text-on-surface-variant">Connectivity</span><span className="text-on-surface font-medium">{vehicle.connectivity || 'N/A'}</span></div>
                  </div>
                </div>

                {/* Ownership Section */}
                <div className="p-6 space-y-4">
                  <h4 className="text-primary font-bold uppercase text-xs tracking-widest font-label">Ownership</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm"><span className="text-on-surface-variant">No. of Owners</span><span className="text-on-surface font-medium">{vehicle.owners !== null && vehicle.owners !== undefined ? vehicle.owners : 'N/A'}</span></div>
                    <div className="flex justify-between text-sm"><span className="text-on-surface-variant">Registration Date</span><span className="text-on-surface font-medium">{formatDate(vehicle.registrationDate)}</span></div>
                    <div className="flex justify-between text-sm"><span className="text-on-surface-variant">COE Expiry Date</span><span className="text-on-surface font-medium">{formatDate(vehicle.coeExpiry)}</span></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Side: Forest Wheel's Perspective (Editorial Description) — only show if description exists */}
        {vehicle.description && (
          <div className="lg:col-span-5">
            <div className="p-8 bg-surface-container rounded-2xl border-l-4 border-primary shadow-sm">
              <h4 className="text-xl font-black font-headline uppercase mb-4 text-on-surface">Forest Wheel's Perspective</h4>
              <p className="text-on-surface-variant leading-relaxed italic mb-6 whitespace-pre-line">
                {vehicle.description}
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-primary/10 border border-black/5 flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary text-xl">person</span>
                </div>
                <div>
                  <p className="font-bold text-on-surface">{vehicle.editorialBy || 'Forest Wheel Team'}</p>
                  <p className="text-xs text-primary uppercase font-label">Editorial Review</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Related Vehicles Carousel — dynamic from API */}
      {relatedVehicles.length > 0 && (
        <section className="mt-24">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-primary font-bold uppercase text-xs tracking-[0.2em] mb-2 font-label">Curated Selection</p>
              <h3 className="text-4xl font-black font-headline uppercase tracking-tighter text-on-surface">Related Vehicles</h3>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => scrollRelated('prev')}
                className="w-12 h-12 rounded-full border border-black/10 bg-white flex items-center justify-center hover:bg-surface-container transition-colors shadow-sm text-on-surface"
              >
                <span className="material-symbols-outlined">chevron_left</span>
              </button>
              <button
                onClick={() => scrollRelated('next')}
                className="w-12 h-12 rounded-full border border-black/10 bg-white flex items-center justify-center hover:bg-surface-container transition-colors shadow-sm text-on-surface"
              >
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
            </div>
          </div>

          <div ref={relatedRef} className="flex gap-6 overflow-x-auto no-scrollbar pb-8">
            {relatedVehicles.map(rv => (
              <Link
                key={rv.id}
                to={`/inventory/${rv.id}`}
                className="min-w-[320px] md:min-w-[400px] bg-white rounded-2xl overflow-hidden group border border-black/5 shadow-sm block hover:-translate-y-1 transition-transform"
              >
                <div className="aspect-[16/10] overflow-hidden relative">
                  {rv.images?.[0] ? (
                    <img
                      alt={`${rv.make} ${rv.model}`}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      src={rv.images[0].url.startsWith('http') ? rv.images[0].url : `/uploads/${rv.images[0].url}`}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-surface-container">
                      <span className="material-symbols-outlined text-outline text-5xl">directions_car</span>
                    </div>
                  )}
                  <div className="absolute top-3 right-3 px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-[10px] font-bold uppercase tracking-widest text-on-surface border border-black/5 shadow-sm">
                    {rv.status}
                  </div>
                </div>
                <div className="p-6">
                  <h4 className="text-xl font-bold font-headline mb-1 text-on-surface">{rv.year} {rv.make} {rv.model}</h4>
                  <p className="text-on-surface-variant text-sm mb-4">{parseFloat(rv.mileage).toLocaleString()} {rv.mileageUnit || 'KM'} • {rv.color || rv.variant || 'N/A'}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-black font-headline text-primary">${parseFloat(rv.price).toLocaleString()}</span>
                    <span className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-on-surface group-hover:bg-primary group-hover:text-white transition-colors">
                      <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
            {/* Lightbox Modal */}
            {lightbox.isOpen && vehicle.images?.[lightbox.activeIndex] && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md select-none transition-all duration-300">
                {/* Close button */}
                <button
                  onClick={() => setLightbox({ isOpen: false, activeIndex: 0 })}
                  className="absolute top-6 right-6 w-12 h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-2xl">close</span>
                </button>

                {/* Left Arrow */}
                <button
                  onClick={() =>
                    setLightbox((prev) => ({
                      ...prev,
                      activeIndex: (prev.activeIndex - 1 + vehicle.images.length) % vehicle.images.length,
                    }))
                  }
                  className="absolute left-6 w-14 h-14 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer animate-fade-in"
                >
                  <span className="material-symbols-outlined text-3xl">chevron_left</span>
                </button>

                {/* Image */}
                <div className="max-w-[90vw] max-h-[80vh] flex flex-col items-center">
                  <img
                    src={getImgSrc(vehicle.images[lightbox.activeIndex].url)}
                    alt={`Slide ${lightbox.activeIndex}`}
                    className="max-w-full max-h-[75vh] object-contain rounded-lg shadow-2xl"
                  />
                  {/* Counter */}
                  <div className="mt-4 text-white/60 font-bold text-xs uppercase tracking-widest font-label">
                    Image {lightbox.activeIndex + 1} of {vehicle.images.length}
                  </div>
                </div>

                {/* Right Arrow */}
                <button
                  onClick={() =>
                    setLightbox((prev) => ({
                      ...prev,
                      activeIndex: (prev.activeIndex + 1) % vehicle.images.length,
                    }))
                  }
                  className="absolute right-6 w-14 h-14 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer animate-fade-in"
                >
                  <span className="material-symbols-outlined text-3xl">chevron_right</span>
                </button>
              </div>
            )}
          </section>
        )}
      </main>
    );
  }
