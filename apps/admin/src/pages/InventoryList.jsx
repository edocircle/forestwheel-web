import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../lib/api';

export default function InventoryList() {
  const [vehicles, setVehicles] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get('page') || '1', 10);
  const statusFilter = searchParams.get('status') || '';
  const searchVal = searchParams.get('search') || '';

  const [search, setSearch] = useState(searchVal);
  const navigate = useNavigate();

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

  const loadVehicles = async () => {
    setLoading(true);
    try {
      const params = { page, limit: 10, search: searchVal };
      if (statusFilter) params.status = statusFilter;
      const res = await api.get('/inventory', { params });
      setVehicles(res.data.vehicles);
      setTotal(res.data.total);
    } catch (err) {
      console.error('Failed to load inventory:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVehicles();
  }, [page, statusFilter, searchVal]);

  // Sync search input when URL changes (e.g. going back)
  useEffect(() => {
    setSearch(searchVal);
  }, [searchVal]);

  const handleSearch = (e) => {
    e.preventDefault();
    updateParams({ search, page: 1 });
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this vehicle?')) return;
    try {
      await api.delete(`/inventory/${id}`);
      loadVehicles();
    } catch (err) {
      alert('Failed to delete vehicle');
    }
  };

  const totalPages = Math.ceil(total / 10);

  const statusBadge = (status) => {
    const classes = {
      AVAILABLE: 'bg-tertiary-container text-on-tertiary-container border-tertiary/20',
      RESERVED: 'bg-primary-container text-on-primary-container border-primary/20',
      SOLD: 'bg-error-container text-on-error-container border-error/20',
    };
    return `px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${classes[status] || ''}`;
  };

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-end mb-12">
        <div>
          <h1 className="text-5xl font-black font-headline tracking-tighter text-on-surface">INVENTORY</h1>
          <p className="text-on-surface-variant text-lg mt-2">
            Managing {total} vehicles in the gallery fleet.
          </p>
        </div>
        <button
          onClick={() => navigate('/inventory/new')}
          className="px-8 py-3 rounded-lg bg-primary text-white font-bold uppercase tracking-widest text-xs shadow-lg shadow-primary/20 hover:brightness-110 active:scale-95 transition-all"
        >
          + New Listing
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl border border-outline-variant/30">
          <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold mb-2">Total Vehicles</p>
          <p className="text-2xl font-black font-headline text-on-surface">{total}</p>
        </div>
        <button onClick={() => updateParams({ status: '', page: 1 })} className={`p-6 rounded-xl border text-left ${!statusFilter ? 'border-primary bg-primary/5' : 'border-outline-variant/30 bg-white'}`}>
          <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold mb-2">All</p>
          <p className="text-2xl font-black font-headline text-on-surface">{total}</p>
        </button>
        <button onClick={() => updateParams({ status: 'AVAILABLE', page: 1 })} className={`p-6 rounded-xl border text-left ${statusFilter === 'AVAILABLE' ? 'border-tertiary bg-tertiary/5' : 'border-outline-variant/30 bg-white'}`}>
          <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold mb-2">Available</p>
          <p className="text-2xl font-black font-headline text-tertiary">—</p>
        </button>
        <button onClick={() => updateParams({ status: 'SOLD', page: 1 })} className={`p-6 rounded-xl border text-left ${statusFilter === 'SOLD' ? 'border-error bg-error/5' : 'border-outline-variant/30 bg-white'}`}>
          <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold mb-2">Sold</p>
          <p className="text-2xl font-black font-headline text-error">—</p>
        </button>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="mb-6">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">search</span>
            <input
              className="w-full bg-white border border-outline-variant/30 rounded-xl pl-12 pr-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              placeholder="Search by make, model, or variant..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button type="submit" className="px-6 py-3 bg-surface-container-highest text-on-surface-variant rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-surface-container transition-colors">
            Search
          </button>
        </div>
      </form>

      {/* Table */}
      <div className="bg-white rounded-2xl overflow-hidden border border-outline-variant/30">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
          </div>
        ) : (
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-surface-container">
                <th className="px-8 py-6 text-[10px] uppercase tracking-[0.2em] font-bold text-on-surface-variant">Vehicle</th>
                <th className="px-6 py-6 text-[10px] uppercase tracking-[0.2em] font-bold text-on-surface-variant">Year</th>
                <th className="px-6 py-6 text-[10px] uppercase tracking-[0.2em] font-bold text-on-surface-variant">Price</th>
                <th className="px-6 py-6 text-[10px] uppercase tracking-[0.2em] font-bold text-on-surface-variant">Status</th>
                <th className="px-6 py-6 text-right text-[10px] uppercase tracking-[0.2em] font-bold text-on-surface-variant">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/30">
              {vehicles.map((v) => (
                <tr key={v.id} className="hover:bg-surface-container-low transition-colors">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-24 h-16 rounded-lg overflow-hidden bg-surface-container-highest shrink-0">
                        {v.images?.[0] ? (
                          <img src={v.images[0].url.startsWith('http') ? v.images[0].url : `/uploads/${v.images[0].url}`} alt={v.make} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="material-symbols-outlined text-outline">directions_car</span>
                          </div>
                        )}
                      </div>
                      <div>
                        <h3 className="font-headline font-bold text-on-surface">{v.make} {v.model}</h3>
                        <p className="text-xs text-on-surface-variant">{v.variant || `${v.color || ''}`}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-6 text-sm font-bold text-on-surface">{v.year}</td>
                  <td className="px-6 py-6 text-sm font-black text-primary">
                    ${parseFloat(v.price).toLocaleString()}
                  </td>
                  <td className="px-6 py-6">
                    <span className={statusBadge(v.status)}>{v.status}</span>
                  </td>
                  <td className="px-6 py-6 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => navigate(`/inventory/${v.id}/edit`)} className="p-2 rounded-lg hover:bg-surface-container-highest transition-colors text-on-surface-variant" title="Edit">
                        <span className="material-symbols-outlined text-sm">edit</span>
                      </button>
                      <button onClick={() => handleDelete(v.id)} className="p-2 rounded-lg hover:bg-error-container/20 transition-colors text-error" title="Delete">
                        <span className="material-symbols-outlined text-sm">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {vehicles.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-8 py-16 text-center text-secondary">
                    No vehicles found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}

        {/* Pagination */}
        <div className="px-8 py-6 bg-surface-container flex items-center justify-between">
          <p className="text-xs text-on-surface-variant font-bold uppercase tracking-widest">
            Showing {vehicles.length} of {total} vehicles
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => updateParams({ page: Math.max(1, page - 1) })}
              disabled={page === 1}
              className="px-4 py-2 bg-surface-container-highest text-on-surface-variant rounded-md text-xs font-bold uppercase tracking-widest hover:bg-surface-variant transition-colors disabled:opacity-50"
            >
              Previous
            </button>
            <span className="px-4 py-2 text-xs font-bold">{page} / {totalPages || 1}</span>
            <button
              onClick={() => updateParams({ page: Math.min(totalPages, page + 1) })}
              disabled={page >= totalPages}
              className="px-4 py-2 bg-primary text-white rounded-md text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-colors disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
