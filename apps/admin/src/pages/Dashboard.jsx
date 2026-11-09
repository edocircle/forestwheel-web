import { useState, useEffect } from 'react';
import api from '../lib/api';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [statsRes, activityRes] = await Promise.all([
          api.get('/dashboard/stats'),
          api.get('/dashboard/activity?limit=10'),
        ]);
        setStats(statsRes.data);
        setActivities(activityRes.data);
      } catch (err) {
        console.error('Failed to load dashboard:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  const formatCurrency = (val) => {
    const num = parseFloat(val) || 0;
    if (num >= 1000000) return `$${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `$${(num / 1000).toFixed(0)}K`;
    return `$${num.toFixed(0)}`;
  };

  const formatTime = (date) => {
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  return (
    <div className="space-y-10">
      {/* Hero Stats */}
      <section>
        <div className="flex items-baseline justify-between mb-8">
          <h2 className="text-5xl font-black font-headline tracking-tighter text-on-surface">Gallery Pulse</h2>
          <span className="text-secondary font-label text-sm uppercase tracking-widest">Real-time status</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Inventory */}
          <div className="bg-white p-8 rounded-xl border border-surface-container relative overflow-hidden shadow-sm">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
            <p className="text-secondary font-label text-xs uppercase tracking-widest mb-2">Total Inventory</p>
            <div className="flex items-end gap-3">
              <span className="text-5xl font-black font-headline text-on-surface">{stats?.totalInventory || 0}</span>
            </div>
            <div className="mt-6 w-full h-1 bg-surface-container-highest overflow-hidden">
              <div className="h-full bg-primary" style={{ width: `${Math.min(100, ((stats?.availableCars || 0) / Math.max(1, stats?.totalInventory || 1)) * 100)}%` }}></div>
            </div>
          </div>

          {/* Available */}
          <div className="bg-white p-8 rounded-xl border border-surface-container border-l-4 border-l-tertiary relative overflow-hidden shadow-sm">
            <p className="text-secondary font-label text-xs uppercase tracking-widest mb-2">Available Cars</p>
            <div className="flex items-end gap-3">
              <span className="text-5xl font-black font-headline text-on-surface">{stats?.availableCars || 0}</span>
              <span className="text-tertiary text-sm font-bold pb-2">Ready</span>
            </div>
            <div className="mt-6 flex gap-1">
              <div className="h-2 w-8 bg-tertiary rounded-full"></div>
              <div className="h-2 w-8 bg-tertiary rounded-full"></div>
              <div className="h-2 w-8 bg-surface-container-highest rounded-full"></div>
            </div>
          </div>

          {/* Sold This Month */}
          <div className="bg-white p-8 rounded-xl border border-surface-container relative overflow-hidden shadow-sm">
            <p className="text-secondary font-label text-xs uppercase tracking-widest mb-2">Cars Sold (Month)</p>
            <div className="flex items-end gap-3">
              <span className="text-5xl font-black font-headline text-on-surface">{stats?.soldCarsMonth || 0}</span>
            </div>
            <div className="mt-6 text-xs text-secondary font-medium italic">Monthly performance</div>
          </div>

          {/* Active Leads */}
          <div className="bg-white p-8 rounded-xl border border-surface-container border-l-4 border-l-primary relative overflow-hidden shadow-sm">
            <p className="text-secondary font-label text-xs uppercase tracking-widest mb-2">Active Leads</p>
            <div className="flex items-end gap-3">
              <span className="text-5xl font-black font-headline text-on-surface">{stats?.activeLeads || 0}</span>
              <span className="text-primary text-sm font-bold pb-2">Pipeline</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Activity Feed */}
        <section className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-black font-headline tracking-tight text-on-surface">Gallery Feed</h3>
          </div>
          <div className="space-y-4">
            {activities.length === 0 ? (
              <div className="bg-white p-12 rounded-lg border border-surface-container text-center">
                <span className="material-symbols-outlined text-4xl text-outline mb-4 block">history</span>
                <p className="text-secondary font-medium">No recent activity yet.</p>
                <p className="text-outline text-sm mt-1">Actions will appear here as you use the portal.</p>
              </div>
            ) : (
              activities.map((activity) => (
                <div key={activity.id} className="bg-white p-6 flex items-center gap-6 hover:bg-surface-variant border border-surface-container transition-colors rounded-lg">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center bg-primary/10 shrink-0">
                    <span className="material-symbols-outlined text-primary">
                      {activity.action === 'LOGIN' ? 'login' :
                       activity.action === 'CREATE' ? 'add_circle' :
                       activity.action === 'UPDATE' ? 'edit' :
                       activity.action === 'DELETE' ? 'delete' :
                       activity.action === 'UPDATE_LEAD' ? 'group' :
                       activity.action === 'UPDATE_SETTING' ? 'settings' : 'history'}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h4 className="font-headline font-bold text-on-surface">
                        {activity.action.replace('_', ' ')} — {activity.entityType}
                      </h4>
                      <span className="text-[10px] text-secondary font-label uppercase">{formatTime(activity.createdAt)}</span>
                    </div>
                    <p className="text-sm text-on-surface-variant mt-1">
                      By <span className="font-semibold">{activity.user?.fullName || 'System'}</span>
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Sidebar */}
        <aside className="lg:col-span-4 space-y-8">
          {/* Revenue Widget */}
          <section className="bg-white p-8 rounded-xl border border-primary/20 relative overflow-hidden shadow-sm">
            <div className="absolute -bottom-10 -right-10 opacity-5">
              <span className="material-symbols-outlined text-[150px]">trending_up</span>
            </div>
            <h3 className="text-xs font-bold text-secondary uppercase tracking-[0.2em] mb-2">Portfolio Value</h3>
            <div className="flex items-center justify-between mb-6">
              <span className="text-3xl font-black font-headline text-on-surface">{formatCurrency(stats?.portfolioValue)}</span>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between text-[10px] font-bold uppercase text-secondary">
                <span>Monthly Revenue</span>
                <span className="text-on-surface">{formatCurrency(stats?.monthlyRevenue)}</span>
              </div>
              <div className="w-full h-1.5 bg-surface-container rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-primary to-orange-400 w-4/5"></div>
              </div>
            </div>
          </section>

          {/* Quick Actions */}
          <section className="bg-white p-8 rounded-xl border border-surface-container shadow-sm">
            <h3 className="text-xl font-black font-headline tracking-tight text-on-surface mb-6 italic">Quick Ignition</h3>
            <div className="grid grid-cols-2 gap-4">
              <a href="/inventory/new" className="flex flex-col items-center justify-center gap-3 p-6 rounded-lg bg-surface-variant hover:bg-primary transition-all group">
                <span className="material-symbols-outlined text-primary group-hover:text-white">add_circle</span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface group-hover:text-white">New Car</span>
              </a>
              <a href="/leads" className="flex flex-col items-center justify-center gap-3 p-6 rounded-lg bg-surface-variant hover:bg-primary transition-all group">
                <span className="material-symbols-outlined text-primary group-hover:text-white">group</span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface group-hover:text-white">Leads</span>
              </a>
              <a href="/users" className="flex flex-col items-center justify-center gap-3 p-6 rounded-lg bg-surface-variant hover:bg-primary transition-all group">
                <span className="material-symbols-outlined text-primary group-hover:text-white">people</span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface group-hover:text-white">Users</span>
              </a>
              <a href="/settings" className="flex flex-col items-center justify-center gap-3 p-6 rounded-lg bg-surface-variant hover:bg-primary transition-all group">
                <span className="material-symbols-outlined text-primary group-hover:text-white">settings</span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface group-hover:text-white">Settings</span>
              </a>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}
