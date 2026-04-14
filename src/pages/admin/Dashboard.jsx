import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

export default function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ 
    total: 0, 
    byStatus: { in_transit: 0, store: 0, shipped: 0, delivered: 0 }, 
    byType: {},
    recentShipments: [], 
    activities: [], 
    unreadMessages: 0 
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [recentStatus, setRecentStatus] = useState('all');

  const fetchStats = async (status = recentStatus) => {
    try {
      const res = await api.get(`/dashboard/stats?status=${status}`);
      const data = await api.parseResponse(res);
      setStats(data);
    } catch (err) {
      setError('Failed to load dashboard data.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats(recentStatus);
  }, [recentStatus]);

  const handleStatusFilter = (status) => {
    setLoading(true);
    setRecentStatus(status);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const statusBadge = (status) => {
    const map = {
      in_transit: 'text-blue-600 bg-blue-50',
      store: 'text-yellow-600 bg-yellow-50',
      shipped: 'text-purple-600 bg-purple-50',
      delivered: 'text-green-600 bg-green-50',
    };
    return map[status] || 'text-gray-600 bg-gray-50';
  };

  return (
    <>
      {/* Dashboard Content */}
      <div className="p-4 md:p-8 flex flex-col gap-6 md:gap-8 max-w-[1600px] mx-auto w-full">
        {/* Welcome Section */}
        <section className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="w-full">
            <h1 className="text-3xl md:text-4xl font-black tracking-tight text-[var(--color-primary)] leading-tight">Good morning, Admin</h1>
            <p className="text-[var(--color-on-surface-variant)] mt-2 flex items-center gap-2 text-sm">
              {loading
                ? 'Loading operational status...'
                : stats.total > 0
                  ? `Operational Status: ${stats.total} active shipments in command network.`
                  : 'Operational Status: Command Network Idle. Awaiting first shipment deployment.'}
            </p>
          </div>
          <div className="flex gap-3 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
            <button className="flex-1 md:flex-none px-6 py-3 bg-white border border-[var(--color-outline-variant)]/20 rounded-xl text-xs font-bold text-[var(--color-primary)] shadow-sm hover:shadow-md transition-all whitespace-nowrap">Download Report</button>
            <button
              onClick={() => navigate('/admin/shipments/new')}
              className="flex-1 md:flex-none px-6 py-3 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-container)] text-white rounded-xl text-xs font-bold shadow-lg shadow-[var(--color-primary)]/20 flex items-center justify-center gap-2 whitespace-nowrap"
            >
              <span className="material-symbols-outlined text-sm">add</span> New Shipment
            </button>
          </div>
        </section>

        {/* KPI Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {/* Total */}
          <div className="bg-[var(--color-surface-container-lowest)] p-5 md:p-6 rounded-3xl shadow-sm border border-[var(--color-outline-variant)]/5 hover:translate-y-[-4px] transition-transform">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-[var(--color-primary)]/5 rounded-2xl">
                <span className="material-symbols-outlined text-[var(--color-primary)]">inventory_2</span>
              </div>
              <span className="text-[10px] md:text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">All Time</span>
            </div>
            <p className="text-[var(--color-on-surface-variant)] text-xs md:text-sm font-medium">Total Shipments</p>
            <h3 className="text-2xl md:text-3xl font-black text-[var(--color-primary)] mt-1">
              {loading ? <span className="animate-pulse">—</span> : stats.total.toLocaleString()}
            </h3>
          </div>

          {/* In Transit */}
          <div className="bg-[var(--color-surface-container-lowest)] p-5 md:p-6 rounded-3xl shadow-sm border border-[var(--color-outline-variant)]/5 hover:translate-y-[-4px] transition-transform">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-[var(--color-secondary)]/5 rounded-2xl">
                <span className="material-symbols-outlined text-[var(--color-secondary)]">forklift</span>
              </div>
              <span className="text-[10px] md:text-xs font-bold text-[var(--color-secondary)] bg-[var(--color-secondary)]/5 px-2 py-1 rounded-full">In Motion</span>
            </div>
            <p className="text-[var(--color-on-surface-variant)] text-xs md:text-sm font-medium">In Transit</p>
            <h3 className="text-2xl md:text-3xl font-black text-[var(--color-primary)] mt-1">
              {loading ? <span className="animate-pulse">—</span> : stats.byStatus.in_transit.toLocaleString()}
            </h3>
          </div>

          {/* Delivered */}
          <div className="bg-[var(--color-surface-container-lowest)] p-5 md:p-6 rounded-3xl shadow-sm border border-[var(--color-outline-variant)]/5 hover:translate-y-[-4px] transition-transform">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-green-500/5 rounded-2xl">
                <span className="material-symbols-outlined text-green-600">verified</span>
              </div>
              <span className="text-[10px] md:text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">Completed</span>
            </div>
            <p className="text-[var(--color-on-surface-variant)] text-xs md:text-sm font-medium">Delivered</p>
            <h3 className="text-2xl md:text-3xl font-black text-[var(--color-primary)] mt-1">
              {loading ? <span className="animate-pulse">—</span> : stats.byStatus.delivered.toLocaleString()}
            </h3>
          </div>

          {/* Store / Pending */}
          <div className="bg-[var(--color-surface-container-lowest)] p-5 md:p-6 rounded-3xl shadow-sm border border-[var(--color-outline-variant)]/5 hover:translate-y-[-4px] transition-transform">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-[var(--color-error)]/5 rounded-2xl">
                <span className="material-symbols-outlined text-[var(--color-error)]">pending_actions</span>
              </div>
              <span className="text-[10px] md:text-xs font-bold text-[var(--color-error)] bg-[var(--color-error)]/5 px-2 py-1 rounded-full">Attention</span>
            </div>
            <p className="text-[var(--color-on-surface-variant)] text-xs md:text-sm font-medium">Pending / At Store</p>
            <h3 className="text-2xl md:text-3xl font-black text-[var(--color-primary)] mt-1">
              {loading ? <span className="animate-pulse">—</span> : ((stats.byStatus.store || 0) + (stats.byStatus.shipped || 0)).toLocaleString()}
            </h3>
          </div>
        </section>

        {/* Charts & Activity Row */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
          {/* Bar Chart Section */}
          <div className="lg:col-span-8 bg-[var(--color-surface-container-low)] rounded-[2rem] p-6 md:p-8">
            <div className="flex justify-between items-center mb-10">
              <div>
                <h4 className="text-lg md:text-xl font-extrabold text-[var(--color-primary)]">Shipments by Type</h4>
                <p className="text-xs md:text-sm text-[var(--color-on-surface-variant)]">Distribution across categories</p>
              </div>
            </div>
            <div className="h-48 md:h-64 flex items-end justify-between gap-2 md:gap-4 px-2 md:px-4">
              {loading ? (
                <div className="w-full flex items-center justify-center opacity-30">
                  <span className="material-symbols-outlined text-4xl animate-pulse">bar_chart</span>
                </div>
              ) : Object.entries(stats.byType || {}).length > 0 ? (
                (() => {
                  const maxVal = Math.max(...Object.values(stats.byType));
                  return Object.entries(stats.byType).map(([type, count]) => {
                    const heightPct = maxVal > 0 ? Math.max(5, Math.round((count / maxVal) * 100)) : 5;
                    return (
                      <div key={type} className="w-full flex flex-col items-center group">
                        <div
                          className="w-full bg-[var(--color-primary)]/20 rounded-t-md md:rounded-t-lg transition-all group-hover:bg-[var(--color-primary)]"
                          style={{ height: `${heightPct}%` }}
                        ></div>
                        <span className="text-[8px] md:text-[10px] mt-4 font-bold text-[var(--color-on-surface-variant)] uppercase line-clamp-1 text-center">{type}</span>
                      </div>
                    );
                  });
                })()
              ) : (
                ['AIR', 'OCEAN', 'ROAD', 'RAIL'].map((d) => (
                  <div key={d} className="w-full flex flex-col items-center group">
                    <div className="w-full bg-[var(--color-primary)]/10 rounded-t-lg h-[5%]"></div>
                    <span className="text-[10px] mt-4 font-bold text-[var(--color-on-surface-variant)]">{d}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Live Activity Section */}
          <div className="lg:col-span-4 bg-[var(--color-surface-container-lowest)] rounded-[2rem] p-6 md:p-8 shadow-sm border border-[var(--color-outline-variant)]/10 flex flex-col max-h-[500px]">
            <h4 className="text-lg md:text-xl font-extrabold text-[var(--color-primary)] mb-6 flex items-center gap-3">
              Live Activity
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-secondary)] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--color-secondary)]"></span>
              </span>
            </h4>
            <div className="space-y-6 overflow-y-auto custom-scrollbar pr-2 flex-grow">
              {!loading && stats.activities?.length > 0 ? (
                stats.activities.map((activity) => (
                  <div key={activity.id} className="flex gap-4 group">
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded-xl bg-[var(--color-primary)]/5 flex items-center justify-center">
                        <span className="material-symbols-outlined text-[var(--color-primary)] text-sm">
                          {activity.action === 'CREATE_SHIPMENT' ? 'add_circle' : 
                           activity.action === 'UPDATE_SHIPMENT' ? 'edit' : 
                           activity.action === 'DELETE_SHIPMENT' ? 'delete' : 'history'}
                        </span>
                      </div>
                      <div className="w-[1px] h-full bg-[var(--color-outline-variant)]/20 mt-2"></div>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[var(--color-primary)] capitalize">
                        {activity.action.replace(/_/g, ' ').toLowerCase()}
                      </p>
                      <p className="text-[10px] text-[var(--color-on-surface-variant)] mt-0.5 line-clamp-2">
                        {activity.details?.message || activity.action.replace(/_/g, ' ').toLowerCase()}
                      </p>
                      <p className="text-[9px] text-[var(--color-on-surface-variant)] opacity-50 uppercase font-black mt-1">
                        {activity.admin_name || 'System Admin'} • {new Date(activity.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center h-full opacity-30 py-10">
                  <span className="material-symbols-outlined text-4xl mb-2">notifications_off</span>
                  <p className="text-xs font-bold uppercase tracking-widest text-center">No Live Events</p>
                </div>
              )}
            </div>
            <button className="w-full mt-6 pt-4 text-[10px] font-black uppercase tracking-widest text-[var(--color-primary)] border-t border-[var(--color-outline-variant)]/20 hover:text-[var(--color-secondary)] transition-colors">
              View Command Log
            </button>
          </div>
        </section>

        {/* Recent Shipments Table */}
        <section className="bg-[var(--color-surface-container-lowest)] rounded-[2rem] p-6 md:p-8 shadow-sm border border-[var(--color-outline-variant)]/10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
            <div>
              <h4 className="text-xl md:text-2xl font-black text-[var(--color-primary)]">Recent Shipments</h4>
              <p className="text-xs md:text-sm text-[var(--color-on-surface-variant)]">Real-time oversight of active deliveries</p>
            </div>
            <div className="flex items-center gap-1 bg-[var(--color-surface-container-low)] p-1 rounded-xl w-full md:w-auto overflow-x-auto">
              {[
                { id: 'all', label: 'All' },
                { id: 'in_transit', label: 'In Transit' },
                { id: 'delivered', label: 'Delivered' }
              ].map((btn) => (
                <button
                  key={btn.id}
                  onClick={() => handleStatusFilter(btn.id)}
                  className={`flex-1 md:flex-none px-4 py-2 text-[10px] md:text-xs font-bold rounded-lg transition-all whitespace-nowrap ${
                    recentStatus === btn.id 
                      ? 'bg-white text-[var(--color-primary)] shadow-sm' 
                      : 'text-[var(--color-on-surface-variant)] hover:bg-white/50'
                  }`}
                >
                  {btn.label}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">{error}</div>
          )}

          <div className="overflow-x-auto -mx-6 px-6">
            <table className="w-full text-left min-w-[800px]">
              <thead>
                <tr className="border-b border-[var(--color-outline-variant)]/10">
                  <th className="pb-5 px-4 font-bold text-[10px] uppercase tracking-widest text-[var(--color-on-surface-variant)]">Tracking ID</th>
                  <th className="pb-5 px-4 font-bold text-[10px] uppercase tracking-widest text-[var(--color-on-surface-variant)]">Sender</th>
                  <th className="pb-5 px-4 font-bold text-[10px] uppercase tracking-widest text-[var(--color-on-surface-variant)]">Type</th>
                  <th className="pb-5 px-4 font-bold text-[10px] uppercase tracking-widest text-[var(--color-on-surface-variant)]">Destination</th>
                  <th className="pb-5 px-4 font-bold text-[10px] uppercase tracking-widest text-[var(--color-on-surface-variant)] text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-outline-variant)]/5">
                {loading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <tr key={i}>
                      <td colSpan="5" className="py-4 px-4">
                        <div className="h-6 bg-[var(--color-surface-container-low)] rounded animate-pulse"></div>
                      </td>
                    </tr>
                  ))
                ) : stats.recentShipments?.length > 0 ? (
                  stats.recentShipments.map((s) => (
                    <tr key={s.id} className="group hover:bg-[var(--color-surface-container-low)]/50 transition-colors">
                      <td className="py-4 px-4 font-mono text-sm font-bold text-[var(--color-primary)]">{s.tracking_id}</td>
                      <td className="py-4 px-4 text-sm font-bold text-[var(--color-secondary)]">{s.sender_name || '—'}</td>
                      <td className="py-4 px-4">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${statusBadge(s.status)}`}>
                          {s.shipping_type}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-sm text-[var(--color-on-surface)] line-clamp-1 max-w-[200px]">{s.destination_address}</td>
                      <td className="py-4 px-4 text-right">
                        <button
                          onClick={() => navigate(`/admin/shipments/${s.id}`)}
                          className="text-[10px] font-black uppercase tracking-widest text-[var(--color-primary)] hover:text-[var(--color-secondary)] transition-colors"
                        >
                          Details →
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="py-10 px-4 text-center" colSpan="5">
                      <div className="flex flex-col items-center opacity-30">
                         <span className="material-symbols-outlined text-4xl mb-2">inventory_2</span>
                         <p className="text-xs font-bold uppercase tracking-widest">No Recent Shipments</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </>
  );
}
