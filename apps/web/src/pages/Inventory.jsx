import { Link, useSearchParams } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function Inventory() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  const [searchParams, setSearchParams] = useSearchParams();

  // Filter & Pagination States derived from search params
  const status = searchParams.get('status') || '';
  const make = searchParams.get('make') || '';
  const model = searchParams.get('model') || '';
  const sortBy = searchParams.get('sortBy') || 'createdAt';
  const sortOrder = searchParams.get('sortOrder') || 'desc';
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = 12;

  // Helper to update search params
  const updateParams = (updates) => {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);
      Object.entries(updates).forEach(([key, val]) => {
        if (val === null || val === undefined || val === '') {
          next.delete(key);
        } else {
          next.set(key, val.toString());
        }
      });
      return next;
    });
  };

  // For dynamic dropdowns
  const [availableMakes, setAvailableMakes] = useState([]);
  const [availableModels, setAvailableModels] = useState([]);

  // Fetch unique makes/models once on mount (fetch all to derive filter options)
  useEffect(() => {
    const API_BASE = import.meta.env.VITE_API_URL || '';
    fetch(`${API_BASE}/api/inventory?limit=1000`)
      .then(res => res.json())
      .then(data => {
        const vehiclesData = data.vehicles || [];
        const uniqueMakes = [...new Set(vehiclesData.map(v => v.make))].filter(Boolean).sort();
        setAvailableMakes(uniqueMakes);
      })
      .catch(err => console.error('Failed to fetch initial filters:', err));
  }, []);

  // Fetch models whenever make changes
  useEffect(() => {
    if (make) {
      const API_BASE = import.meta.env.VITE_API_URL || '';
      fetch(`${API_BASE}/api/inventory?make=${make}&limit=1000`)
        .then(res => res.json())
        .then(data => {
          const vehiclesData = data.vehicles || [];
          const uniqueModels = [...new Set(vehiclesData.map(v => v.model))].filter(Boolean).sort();
          setAvailableModels(uniqueModels);
        })
        .catch(err => console.error('Failed to fetch models:', err));
    } else {
      setAvailableModels([]);
    }
  }, [make]);

  // Main fetch for inventory
  useEffect(() => {
    setLoading(true);
    
    // Build query string
    const params = new URLSearchParams({
      limit: limit.toString(),
      page: page.toString(),
      sortBy,
      sortOrder
    });
    
    if (status) params.append('status', status);
    if (make) params.append('make', make);
    if (model) params.append('model', model);

    const API_BASE = import.meta.env.VITE_API_URL || '';
    fetch(`${API_BASE}/api/inventory?${params.toString()}`)
      .then(res => res.json())
      .then(data => {
        setVehicles(data.vehicles || []);
        setTotal(data.total || 0);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch inventory:', err);
        setLoading(false);
      });
  }, [status, make, model, sortBy, sortOrder, page]);

  const handleReset = () => {
    setSearchParams({});
  };

  const handleSortChange = (e) => {
    const val = e.target.value;
    let newSortBy = 'createdAt';
    let newSortOrder = 'desc';
    if (val === 'price_asc') {
      newSortBy = 'price'; newSortOrder = 'asc';
    } else if (val === 'price_desc') {
      newSortBy = 'price'; newSortOrder = 'desc';
    } else if (val === 'year_desc') {
      newSortBy = 'year'; newSortOrder = 'desc';
    } else if (val === 'year_asc') {
      newSortBy = 'year'; newSortOrder = 'asc';
    }
    updateParams({ sortBy: newSortBy, sortOrder: newSortOrder, page: 1 });
  };

  return (
    <main className="pt-24 pb-20 px-8 max-w-[1600px] mx-auto min-h-screen">
      <div className="flex flex-col md:flex-row gap-12">
        {/* Left Sidebar: Filters */}
        <aside className="w-full md:w-80 flex-shrink-0">
          <div className="sticky top-28 space-y-10 p-6 bg-surface-container-low rounded-2xl">
            <div>
              <h3 className="text-xs font-black tracking-widest text-outline uppercase mb-6">Status</h3>
              <div className="flex flex-col gap-3">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input 
                    checked={status === ''} 
                    onChange={() => { updateParams({ status: '', page: 1 }); }} 
                    className="w-5 h-5 border-2 border-outline-variant bg-white text-[#F68E13] focus:ring-[#F68E13]/20 rounded" 
                    name="status" 
                    type="radio" 
                  />
                  <span className="text-on-surface group-hover:text-primary font-medium transition-colors">All Inventory</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input 
                    checked={status === 'AVAILABLE'} 
                    onChange={() => { updateParams({ status: 'AVAILABLE', page: 1 }); }} 
                    className="w-5 h-5 border-2 border-outline-variant bg-white text-[#F68E13] focus:ring-[#F68E13]/20 rounded" 
                    name="status" 
                    type="radio" 
                  />
                  <span className="text-on-surface group-hover:text-primary font-medium transition-colors">Available</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input 
                    checked={status === 'RESERVED'} 
                    onChange={() => { updateParams({ status: 'RESERVED', page: 1 }); }} 
                    className="w-5 h-5 border-2 border-outline-variant bg-white text-[#F68E13] focus:ring-[#F68E13]/20 rounded" 
                    name="status" 
                    type="radio" 
                  />
                  <span className="text-on-surface group-hover:text-primary font-medium transition-colors">Reserved</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input 
                    checked={status === 'SOLD'} 
                    onChange={() => { updateParams({ status: 'SOLD', page: 1 }); }} 
                    className="w-5 h-5 border-2 border-outline-variant bg-white text-[#F68E13] focus:ring-[#F68E13]/20 rounded" 
                    name="status" 
                    type="radio" 
                  />
                  <span className="text-on-surface group-hover:text-primary font-medium transition-colors">Sold</span>
                </label>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-xs font-black tracking-widest text-outline uppercase mb-4">Manufacturer</h3>
              <div className="relative">
                <select 
                  value={make} 
                  onChange={(e) => { updateParams({ make: e.target.value, model: '', page: 1 }); }} 
                  className="w-full bg-white border border-outline-variant/30 text-on-surface py-4 px-4 rounded-xl appearance-none focus:ring-2 focus:ring-primary-container/20 transition-all"
                >
                  <option value="">All Makes</option>
                  {availableMakes.map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
                <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-outline">expand_more</span>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-xs font-black tracking-widest text-outline uppercase mb-4">Model</h3>
              <div className="relative">
                <select 
                  value={model} 
                  onChange={(e) => { updateParams({ model: e.target.value, page: 1 }); }} 
                  disabled={!make}
                  className="w-full bg-white border border-outline-variant/30 text-on-surface py-4 px-4 rounded-xl appearance-none focus:ring-2 focus:ring-primary-container/20 transition-all disabled:opacity-50"
                >
                  <option value="">All Models</option>
                  {availableModels.map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
                <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-outline">expand_more</span>
              </div>
            </div>

            <div className="pt-6">
              <button 
                onClick={handleReset} 
                className="w-full border border-outline text-on-surface py-4 rounded-xl font-bold hover:bg-white transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          </div>
        </aside>

        {/* Right Content: Inventory Grid */}
        <section className="flex-grow">
          <header className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <h1 className="text-6xl font-black tracking-tighter uppercase mb-2 text-on-surface">Our Inventory</h1>
              <p className="text-on-surface-variant font-body">{loading ? 'Loading...' : total} Masterpieces currently in the forest wheel.</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <select 
                  onChange={handleSortChange} 
                  value={sortBy === 'createdAt' ? 'newest' : sortBy === 'price' && sortOrder === 'asc' ? 'price_asc' : sortBy === 'price' && sortOrder === 'desc' ? 'price_desc' : sortBy === 'year' && sortOrder === 'desc' ? 'year_desc' : sortBy === 'year' && sortOrder === 'asc' ? 'year_asc' : 'newest'}
                  className="bg-transparent border-none text-on-surface font-bold py-2 pl-2 pr-8 focus:ring-0 appearance-none cursor-pointer"
                >
                  <option value="newest">Sort by: Newest</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="year_desc">Year: Newest</option>
                  <option value="year_asc">Year: Oldest</option>
                </select>
                <span className="material-symbols-outlined absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-primary">expand_more</span>
              </div>
            </div>
          </header>

          {/* The Gallery Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {loading ? (
              <div className="col-span-1 lg:col-span-2 flex justify-center py-20">
                <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
              </div>
            ) : vehicles.length === 0 ? (
              <div className="col-span-1 lg:col-span-2 text-center py-20 text-on-surface-variant">
                No vehicles available matching your criteria.
              </div>
            ) : (
              vehicles.map(v => (
                <Link key={v.id} to={`/inventory/${v.id}`} className="group relative bg-white border border-outline-variant/30 rounded-xl overflow-hidden hover:shadow-2xl hover:shadow-black/5 hover:-translate-y-1 transition-all duration-300 block">
                  <div className="aspect-[16/10] overflow-hidden relative bg-surface-container-highest">
                    {v.images?.[0] ? (
                      <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" src={v.images[0].url.startsWith('http') ? v.images[0].url : `/uploads/${v.images[0].url}`} alt={`${v.make} ${v.model}`} />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="material-symbols-outlined text-outline text-6xl">directions_car</span>
                      </div>
                    )}
                    <div className="absolute top-4 right-4 bg-[#F68E13] px-4 py-1.5 rounded-full text-white text-xs font-bold uppercase tracking-widest shadow-lg">
                      {v.status}
                    </div>
                  </div>
                  <div className="p-8">
                    <div className="flex justify-between items-start mb-4 gap-4">
                      <div>
                        <h2 className="text-3xl font-black tracking-tight leading-none mb-1 text-on-surface uppercase">{v.make} {v.model}</h2>
                        <p className="text-on-surface-variant text-sm font-medium uppercase tracking-widest">{v.year} · {v.variant || v.color || 'Base'}</p>
                      </div>
                      <div className="text-2xl font-black text-[#F68E13] whitespace-nowrap">${parseFloat(v.price).toLocaleString()}</div>
                    </div>
                    <div className="flex gap-4 pt-6 mt-4 border-t border-outline-variant/20">
                      <div className="flex items-center gap-1.5 text-on-surface-variant text-xs">
                        <span className="material-symbols-outlined text-sm">speed</span>
                        <span>{parseFloat(v.mileage).toLocaleString()} MI</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-on-surface-variant text-xs">
                        <span className="material-symbols-outlined text-sm">settings</span>
                        <span className="uppercase">{v.transmission || 'AUTO'}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>

          {/* Pagination */}
          {total > limit && (
            <div className="mt-20 flex justify-center items-center gap-4">
              <button 
                onClick={() => updateParams({ page: Math.max(1, page - 1) })}
                disabled={page === 1}
                className="w-12 h-12 flex items-center justify-center rounded-lg border border-outline-variant/30 text-outline hover:text-on-surface hover:bg-surface-container transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="material-symbols-outlined">chevron_left</span>
              </button>
              <div className="text-on-surface font-medium">Page {page} of {Math.ceil(total / limit)}</div>
              <button 
                onClick={() => updateParams({ page: Math.min(Math.ceil(total / limit), page + 1) })}
                disabled={page >= Math.ceil(total / limit)}
                className="w-12 h-12 flex items-center justify-center rounded-lg border border-outline-variant/30 text-outline hover:text-on-surface hover:bg-surface-container transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
            </div>
          )}
        </section>
      </div>
    </main>
  )
}
