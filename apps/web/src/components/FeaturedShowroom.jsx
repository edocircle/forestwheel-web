import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function FeaturedShowroom() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startIndex, setStartIndex] = useState(0);
  const perPage = 3;

  useEffect(() => {
    const API_BASE = import.meta.env.VITE_API_URL || '';
    fetch(`${API_BASE}/api/inventory?featured=true&limit=100`)
      .then(res => res.json())
      .then(data => {
        setCars(data.vehicles || []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch featured vehicles:', err);
        setLoading(false);
      });
  }, []);

  const getImgSrc = (url) => url?.startsWith('http') ? url : `/uploads/${url}`;

  const handlePrev = () => {
    setStartIndex(prev => Math.max(0, prev - perPage));
  };

  const handleNext = () => {
    setStartIndex(prev => {
      const next = prev + perPage;
      return next < cars.length ? next : prev;
    });
  };

  const visibleCars = cars.slice(startIndex, startIndex + perPage);
  const canGoPrev = startIndex > 0;
  const canGoNext = startIndex + perPage < cars.length;

  const statusColor = (status) => {
    if (status === 'AVAILABLE') return 'bg-[#F68E13]';
    if (status === 'RESERVED') return 'bg-blue-500';
    return 'bg-error';
  };

  if (loading) {
    return (
      <section className="py-24 bg-surface-container">
        <div className="max-w-7xl mx-auto px-8 flex justify-center">
          <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
        </div>
      </section>
    );
  }

  if (cars.length === 0) return null;

  return (
    <section className="py-24 bg-surface-container">
      <div className="max-w-7xl mx-auto px-8 mb-12 flex justify-between items-end">
        <div>
          <h2 className="font-headline font-bold text-4xl tracking-tight mb-2 text-on-surface">Featured Showroom</h2>
          <p className="text-on-surface-variant">The latest arrivals at the Forest Wheel.</p>
        </div>
        <div className="hidden md:flex gap-4">
          <button
            onClick={handlePrev}
            disabled={!canGoPrev}
            className="p-3 rounded-full border border-outline-variant hover:bg-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <button
            onClick={handleNext}
            disabled={!canGoNext}
            className="p-3 rounded-full border border-outline-variant hover:bg-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <span className="material-symbols-outlined">arrow_forward</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {visibleCars.map((car) => (
            <Link
              key={car.id}
              to={`/inventory/${car.id}`}
              className="group cursor-pointer bg-white p-4 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 block"
            >
              <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-surface-container-low mb-6">
                {car.images?.[0] ? (
                  <img
                    alt={`${car.make} ${car.model}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    src={getImgSrc(car.images[0].url)}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="material-symbols-outlined text-outline text-5xl">directions_car</span>
                  </div>
                )}
                <div className={`absolute top-4 right-4 ${statusColor(car.status)} px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-white`}>
                  {car.status}
                </div>
              </div>
              <div className="flex justify-between items-start px-2">
                <div>
                  <h3 className="font-headline font-bold text-2xl group-hover:text-[#F68E13] transition-colors text-on-surface">{car.make} {car.model}</h3>
                  <p className="text-on-surface-variant font-body">{car.year} • {parseFloat(car.mileage).toLocaleString()} {car.mileageUnit || 'KM'}</p>
                </div>
                <p className="text-xl font-bold font-headline text-on-surface">${parseFloat(car.price).toLocaleString()}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
