import { useState, useEffect } from 'react';
import api from '../lib/api';

export default function LeadsList() {
  const [leads, setLeads] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [statusCounts, setStatusCounts] = useState({});
  const [search, setSearch] = useState('');

  const loadLeads = async () => {
    setLoading(true);
    try {
      const params = { page, limit: 10, search };
      if (statusFilter) params.status = statusFilter;
      const [leadsRes, countsRes] = await Promise.all([
        api.get('/leads', { params }),
        api.get('/leads/status-counts'),
      ]);
      setLeads(leadsRes.data.leads);
      setTotal(leadsRes.data.total);
      setStatusCounts(countsRes.data);
    } catch (err) {
      console.error('Failed to load leads:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadLeads(); }, [page, statusFilter]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await api.put(`/leads/${id}`, { status: newStatus });
      loadLeads();
    } catch (err) {
      alert('Failed to update lead status');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this lead?')) return;
    try {
      await api.delete(`/leads/${id}`);
      loadLeads();
    } catch (err) {
      alert('Failed to delete lead');
    }
  };

  const totalPages = Math.ceil(total / 10);

  const statusBadge = (status) => {
    const map = {
      NEW: 'bg-primary/10 text-primary',
      CONTACTED: 'bg-surface-container-highest text-secondary',
      IN_PROGRESS: 'bg-tertiary-container text-on-tertiary-container',
      SOLD: 'bg-error-container text-on-error-container',
      ARCHIVED: 'bg-surface-variant text-on-surface-variant',
    };
    return `px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${map[status] || ''}`;
  };

  const filters = [
    { label: 'All', value: '', count: statusCounts.total },
    { label: 'New', value: 'NEW', count: statusCounts.NEW },
    { label: 'Contacted', value: 'CONTACTED', count: statusCounts.CONTACTED },
    { label: 'In Progress', value: 'IN_PROGRESS', count: statusCounts.IN_PROGRESS },
    { label: 'Sold', value: 'SOLD', count: statusCounts.SOLD },
    { label: 'Archived', value: 'ARCHIVED', count: statusCounts.ARCHIVED },
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-12 flex items-end justify-between">
        <div>
          <h1 className="text-5xl font-black font-headline tracking-tighter text-on-surface">Inquiry Pipeline</h1>
          <p className="text-on-surface-variant text-lg mt-2">
            Managing {total} vehicle sell-back inquiries.
          </p>
        </div>
        <div className="flex gap-4">
          <div className="bg-white border border-outline-variant/30 px-6 py-3 rounded-xl shadow-sm">
            <span className="text-xs font-bold text-on-surface-variant uppercase tracking-widest block mb-1">Active Leads</span>
            <span className="text-2xl font-headline font-bold text-primary">{(statusCounts.NEW || 0) + (statusCounts.CONTACTED || 0) + (statusCounts.IN_PROGRESS || 0)}</span>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border border-outline-variant/30 rounded-2xl p-4 mb-8 flex flex-wrap items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-2">
          {filters.map((f) => (
            <button
              key={f.value}
              onClick={() => { setStatusFilter(f.value); setPage(1); }}
              className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-colors ${
                statusFilter === f.value
                  ? 'bg-primary text-white'
                  : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
              }`}
            >
              {f.label} {f.count !== undefined ? `(${f.count})` : ''}
            </button>
          ))}
        </div>
        <form onSubmit={(e) => { e.preventDefault(); setPage(1); loadLeads(); }} className="flex gap-2">
          <input
            className="bg-surface-container-low border-none rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-primary/20 w-56"
            placeholder="Search leads..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </form>
      </div>

      {/* Leads List */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="space-y-4">
          {leads.map((lead) => (
            <div key={lead.id} className="bg-white border border-outline-variant/30 rounded-2xl overflow-hidden hover:bg-surface-container-low transition-all duration-300 shadow-sm">
              <div className="flex items-center min-h-[120px] p-6 gap-8">
                <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
                  {/* Name */}
                  <div>
                    <h3 className="text-on-surface text-lg font-bold font-headline mb-1">{lead.fullName}</h3>
                    <p className="text-xs text-on-surface-variant font-semibold tracking-wide">{lead.inquiryNumber}</p>
                    <span className={`inline-block mt-2 ${statusBadge(lead.status)}`}>{lead.status.replace('_', ' ')}</span>
                  </div>

                  {/* Contact */}
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="material-symbols-outlined text-xs text-primary">mail</span>
                      <span className="text-sm text-on-surface-variant">{lead.email}</span>
                    </div>
                    {lead.phone && (
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-xs text-primary">call</span>
                        <span className="text-sm text-on-surface-variant">{lead.phone}</span>
                      </div>
                    )}
                  </div>

                  {/* Vehicle */}
                  <div>
                    <h4 className="text-sm font-bold text-on-surface uppercase tracking-wider">{lead.vehicleMake} {lead.vehicleModel}</h4>
                    <div className="flex flex-col gap-1 mt-2">
                      <div className="flex gap-3 text-[11px] text-on-surface-variant font-bold">
                        {lead.vehicleYear && <span>Year: {lead.vehicleYear}</span>}
                        {lead.vehicleMileage && <span>Mileage: {lead.vehicleMileage.toLocaleString()} KM</span>}
                      </div>
                      {lead.registrationDate && (
                        <div className="flex items-center gap-1 text-[11px] text-secondary font-bold">
                          <span className="material-symbols-outlined text-[10px]" style={{ fontSize: '12px' }}>calendar_month</span>
                          <span>Reg: {new Date(lead.registrationDate).toLocaleDateString('en-SG', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                        </div>
                      )}
                      {lead.carPlate && (
                        <div className="flex items-center gap-1 text-[11px] text-[#f68e13] font-bold">
                          <span className="material-symbols-outlined text-[10px]" style={{ fontSize: '12px' }}>directions_car</span>
                          <span>Plate: {lead.carPlate.toUpperCase()}</span>
                        </div>
                      )}
                      {lead.accessCode && (
                        <div className="flex items-center gap-1 text-[11px] text-primary font-bold">
                          <span className="material-symbols-outlined text-[10px]" style={{ fontSize: '12px' }}>key</span>
                          <span>Code: {lead.accessCode}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex justify-end items-center gap-3 flex-wrap">
                    <div className="relative">
                      <select
                        value={lead.status}
                        onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                        className="bg-surface-container-low border border-outline-variant/30 text-[10px] font-black uppercase tracking-widest rounded-lg pl-3 pr-8 py-2.5 text-on-surface focus:ring-2 focus:ring-primary/20 appearance-none cursor-pointer outline-none transition-colors hover:bg-surface-container"
                      >
                        <option value="NEW">New Inquiry</option>
                        <option value="CONTACTED">Followed Up</option>
                        <option value="IN_PROGRESS">In Progress</option>
                        <option value="SOLD">Closed Won (Bought)</option>
                        <option value="ARCHIVED">Cancelled / Lost</option>
                      </select>
                      <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-xs pointer-events-none text-outline">expand_more</span>
                    </div>
                    <button onClick={() => handleDelete(lead.id)} className="p-2.5 rounded-lg hover:bg-error-container/20 transition-colors text-error cursor-pointer flex items-center justify-center" title="Delete">
                      <span className="material-symbols-outlined text-base">delete</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {leads.length === 0 && (
            <div className="bg-white p-16 rounded-2xl border border-outline-variant/30 text-center">
              <span className="material-symbols-outlined text-4xl text-outline mb-4 block">group</span>
              <p className="text-secondary font-medium">No leads found.</p>
            </div>
          )}
        </div>
      )}

      {/* Pagination */}
      <div className="mt-8 flex items-center justify-between">
        <p className="text-sm text-on-surface-variant font-semibold">Showing {leads.length} of {total}</p>
        <div className="flex gap-2">
          <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1} className="px-4 py-2 bg-white border border-outline-variant/30 rounded-lg text-on-surface-variant text-xs font-bold disabled:opacity-50">Previous</button>
          <span className="px-4 py-2 text-xs font-bold">{page} / {totalPages || 1}</span>
          <button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page >= totalPages} className="px-4 py-2 bg-primary text-white rounded-lg text-xs font-bold disabled:opacity-50">Next</button>
        </div>
      </div>
    </div>
  );
}
