import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const VALID_STATUSES = ['in_transit', 'store', 'shipped', 'delivered'];

const statusLabel = (s) => ({ in_transit: 'In Transit', store: 'At Store', shipped: 'Shipped', delivered: 'Delivered' }[s] || s);

const statusBadgeClass = (s) => ({
  in_transit: 'text-blue-600 bg-blue-50',
  store: 'text-yellow-600 bg-yellow-50',
  shipped: 'text-purple-600 bg-purple-50',
  delivered: 'text-green-600 bg-green-50',
}[s] || 'text-gray-600 bg-gray-50');

const typeLabel = (t) => ({ express: 'Express', air: 'Air Freight', ocean: 'Ocean', road: 'Road', rail: 'Rail', eco: 'Eco' }[t] || t);

export default function ShipmentManagement() {
  const navigate = useNavigate();

  // Data state
  const [shipments, setShipments] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 20, totalPages: 1 });
  const [stats, setStats] = useState({ total: 0, in_transit: 0, critical: 0, revenue: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [page, setPage] = useState(1);
  const searchTimer = useRef(null);

  // Bulk select
  const [selectedIds, setSelectedIds] = useState([]);
  const [bulkStatus, setBulkStatus] = useState('');
  const [bulkLoading, setBulkLoading] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const fetchShipments = useCallback(async (params = {}) => {
    setLoading(true);
    setError('');
    try {
      const query = new URLSearchParams({
        page: params.page || page,
        limit: 20,
        search: params.search !== undefined ? params.search : search,
        status: params.status !== undefined ? params.status : statusFilter,
        type: params.type !== undefined ? params.type : typeFilter,
      }).toString();

      const res = await api.get(`/shipments?${query}`);
      const data = await api.parseResponse(res);
      setShipments(data.shipments);
      setPagination(data.pagination);

      // Calculate quick stats from this result set
      const inTransit = data.shipments.filter((s) => s.status === 'in_transit').length;
      setStats((prev) => ({ ...prev, total: data.pagination.total, in_transit: inTransit }));
    } catch (err) {
      setError('Failed to load shipments.');
    } finally {
      setLoading(false);
    }
  }, [page, search, statusFilter, typeFilter]);

  useEffect(() => {
    fetchShipments();
  }, [page, statusFilter, typeFilter]);

  // Debounced search
  const handleSearchChange = (value) => {
    setSearch(value);
    clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      setPage(1);
      fetchShipments({ search: value, page: 1 });
    }, 400);
  };

  const handleStatusFilterChange = (value) => {
    setStatusFilter(value);
    setPage(1);
  };

  const handleTypeFilterChange = (value) => {
    setTypeFilter(value);
    setPage(1);
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      const payload = { status: newStatus };
      if (newStatus === 'shipped') {
        payload.location = "at the Custom Office through international hub terminal.";
        payload.message = "Going through custom checks";
      }
      const res = await api.put(`/shipments/${id}`, payload);
      await api.parseResponse(res);
      setShipments((prev) => prev.map((s) => s.id === id ? { ...s, status: newStatus } : s));
    } catch {
      alert('Failed to update status.');
    }
  };

  // Delete single shipment
  const handleDelete = async (id) => {
    if (!window.confirm('Delete this shipment? This cannot be undone.')) return;
    try {
      const res = await api.delete(`/shipments/${id}`);
      await api.parseResponse(res);
      fetchShipments();
    } catch {
      alert('Failed to delete shipment.');
    }
  };

  // Bulk update
  const handleBulkUpdate = async () => {
    if (!bulkStatus || selectedIds.length === 0) return;
    setBulkLoading(true);
    try {
      const payload = { ids: selectedIds, status: bulkStatus };
      if (bulkStatus === 'shipped') {
        payload.location = "at the Custom Office through international hub terminal.";
        payload.message = "Going through custom checks";
      }
      const res = await api.post('/shipments/bulk', payload);
      await api.parseResponse(res);
      setSelectedIds([]);
      setBulkStatus('');
      fetchShipments();
    } catch (err) {
      alert(err.message || 'Bulk update failed.');
    } finally {
      setBulkLoading(false);
    }
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === shipments.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(shipments.map((s) => s.id));
    }
  };

  const toggleSelect = (id) => {
    setSelectedIds((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  };

  const formatDate = (d) => {
    if (!d) return '—';
    return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <>
      <section className="p-4 md:p-8 space-y-6 md:space-y-8 max-w-[1600px] mx-auto w-full">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <p className="text-[var(--color-secondary)] font-bold tracking-widest text-xs md:text-sm uppercase">Mission Control</p>
            <h2 className="text-3xl md:text-5xl font-black text-[var(--color-primary)] tracking-tight leading-none italic">Manage Shipments</h2>
          </div>
          <button
            onClick={() => navigate('/admin/shipments/new')}
            className="w-full md:w-auto bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-container)] text-white px-6 md:px-8 py-3 md:py-4 rounded-xl font-bold flex items-center justify-center gap-3 shadow-lg hover:scale-[1.02] transition-transform active:scale-95"
          >
            <span className="material-symbols-outlined">add_circle</span>
            Create New Shipment
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[var(--color-surface-container-low)] p-6 rounded-2xl space-y-1 border border-[var(--color-outline-variant)]/5">
            <p className="text-[var(--color-on-surface-variant)] text-[10px] font-black uppercase tracking-widest opacity-60">Active Freight</p>
            <p className="text-3xl font-black text-[var(--color-primary)]">{loading ? '—' : pagination.total}</p>
            <div className="pt-2 flex items-center gap-1 text-[var(--color-secondary)] text-[10px] font-black uppercase">
              <span className="material-symbols-outlined text-sm">inventory_2</span>
              Total Manifests
            </div>
          </div>
          <div className="bg-[var(--color-surface-container-low)] p-6 rounded-2xl space-y-1 border border-[var(--color-outline-variant)]/5">
            <p className="text-[var(--color-on-surface-variant)] text-[10px] font-black uppercase tracking-widest opacity-60">In Transit</p>
            <p className="text-3xl font-black text-[var(--color-primary)]">{loading ? '—' : stats.in_transit}</p>
            <div className="pt-2 flex items-center gap-1 text-blue-500 text-[10px] font-black uppercase">
              <span className="material-symbols-outlined text-sm animate-pulse">local_shipping</span>
              Currently Moving
            </div>
          </div>
          <div className="bg-[var(--color-surface-container-low)] p-6 rounded-2xl border-l-4 border-[var(--color-secondary)] space-y-1 shadow-sm">
            <p className="text-[var(--color-on-surface-variant)] text-[10px] font-black uppercase tracking-widest opacity-60">Selected</p>
            <p className="text-3xl font-black text-[var(--color-secondary)]">{selectedIds.length}</p>
            <div className="pt-2 text-[10px] font-black text-[var(--color-secondary)] uppercase tracking-wider">
              {selectedIds.length > 0 ? 'Protocol Ready' : 'Standby Mode'}
            </div>
          </div>
          <div className="bg-[var(--color-primary)] p-6 rounded-2xl space-y-1 shadow-xl shadow-[var(--color-primary)]/10">
            <p className="text-white/40 text-[10px] font-black uppercase tracking-widest">Network</p>
            <p className="text-3xl font-black text-white">{loading ? '...' : 'SECURE'}</p>
            <div className="pt-2 text-white/60 text-[10px] font-bold italic tracking-tight">Connected: {window.location.hostname}</div>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedIds.length > 0 && (
          <div className="bg-[var(--color-primary)] text-white p-4 md:p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl animate-in fade-in slide-in-from-top duration-500">
            <div className="flex items-center gap-4">
               <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-white">rule</span>
               </div>
               <div>
                  <p className="font-black text-sm uppercase tracking-widest">{selectedIds.length} Units Targeted</p>
                  <button onClick={() => setSelectedIds([])} className="text-[10px] font-bold text-white/50 hover:text-white transition-colors uppercase underline decoration-white/20 underline-offset-4">Abort Selection</button>
               </div>
            </div>
            <div className="flex items-center gap-3 w-full md:w-auto">
              <select
                value={bulkStatus}
                onChange={(e) => setBulkStatus(e.target.value)}
                className="flex-1 md:flex-none bg-white/10 border border-white/20 text-white rounded-xl px-4 py-3 text-xs font-black focus:outline-none focus:ring-2 focus:ring-white/40 transition-all uppercase tracking-tighter"
              >
                <option value="" className="text-black">Update Strategy...</option>
                {VALID_STATUSES.map((s) => <option key={s} value={s} className="text-black">{statusLabel(s)}</option>)}
              </select>
              <button
                onClick={() => { if (bulkStatus) setShowConfirmModal(true); }}
                disabled={!bulkStatus || bulkLoading}
                className="flex-1 md:flex-none bg-white text-[var(--color-primary)] px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-[#fea619] hover:text-[#002045] transition-all disabled:opacity-50 active:scale-95"
              >
                Execute
              </button>
            </div>
          </div>
        )}

        {/* Main Workspace */}
        <div className="bg-[var(--color-surface-container-lowest)] rounded-[2.5rem] p-4 md:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-[var(--color-outline-variant)]/10">
          {/* Controls */}
          <div className="flex flex-col lg:flex-row justify-between items-stretch lg:items-center gap-6 mb-8">
            <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4 flex-grow max-w-4xl">
              <div className="relative flex-grow">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-on-surface-variant)] text-xl opacity-40">search</span>
                <input
                  type="text"
                  placeholder="SCAN TRACKING ID OR ENTITY..."
                  className="w-full pl-12 pr-4 py-4 bg-[var(--color-surface-container-low)] border border-[var(--color-outline-variant)]/5 rounded-2xl text-[10px] font-black text-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/10 transition-all placeholder:text-[var(--color-on-surface-variant)]/30 uppercase tracking-[0.1em]"
                  value={search}
                  onChange={(e) => handleSearchChange(e.target.value)}
                />
              </div>
              
              <div className="flex gap-3 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
                <select
                  className="flex-1 md:flex-none px-5 py-4 bg-[var(--color-surface-container-low)] border border-[var(--color-outline-variant)]/5 rounded-xl text-[10px] font-black text-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/10 min-w-[150px] uppercase tracking-widest"
                  value={statusFilter}
                  onChange={(e) => handleStatusFilterChange(e.target.value)}
                >
                  <option value="">Status: All Filters</option>
                  {VALID_STATUSES.map(s => <option key={s} value={s}>{statusLabel(s)}</option>)}
                </select>

                <select
                  className="flex-1 md:flex-none px-5 py-4 bg-[var(--color-surface-container-low)] border border-[var(--color-outline-variant)]/5 rounded-xl text-[10px] font-black text-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/10 min-w-[150px] uppercase tracking-widest"
                  value={typeFilter}
                  onChange={(e) => handleTypeFilterChange(e.target.value)}
                >
                  <option value="">Type: All Modes</option>
                  <option value="AIR">Air Cargo</option>
                  <option value="OCEAN">Ocean Freight</option>
                  <option value="ROAD">Road Transport</option>
                  <option value="RAIL">Rail Cargo</option>
                </select>
              </div>
            </div>

            <button
               onClick={() => fetchShipments()}
               className={`p-4 bg-[var(--color-surface-container-low)] text-[var(--color-primary)] rounded-2xl border border-[var(--color-outline-variant)]/5 hover:bg-white transition-all shadow-sm ${loading ? 'animate-pulse' : ''}`}
            >
              <span className={`material-symbols-outlined text-xl ${loading ? 'animate-spin' : ''}`}>sync</span>
            </button>
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto -mx-4 md:-mx-0">
            <table className="w-full text-left min-w-[1100px] border-separate border-spacing-y-2">
              <thead>
                <tr className="text-[10px] font-black text-[var(--color-on-surface-variant)]/40 uppercase tracking-[0.2em]">
                  <th className="pb-4 px-6 text-center w-16">
                    <input 
                      type="checkbox" 
                      onChange={toggleSelectAll} 
                      checked={shipments.length > 0 && selectedIds.length === shipments.length} 
                      className="accent-[var(--color-primary)] scale-110" 
                    />
                  </th>
                  <th className="pb-4 px-6">Manifest ID</th>
                  <th className="pb-4 px-6">Entity Profile</th>
                  <th className="pb-4 px-6">Protocol Specs</th>
                  <th className="pb-4 px-6">Route Logistics</th>
                  <th className="pb-4 px-6">Operational Status</th>
                  <th className="pb-4 px-6 text-right">Command</th>
                </tr>
              </thead>
              <tbody className="space-y-4">
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i}>
                      <td colSpan="7" className="p-4">
                        <div className="h-16 bg-[var(--color-surface-container-low)] rounded-2xl animate-pulse"></div>
                      </td>
                    </tr>
                  ))
                ) : shipments.length > 0 ? (
                  shipments.map((s) => (
                    <tr 
                      key={s.id} 
                      className={`group transition-all duration-300 ${selectedIds.includes(s.id) ? 'bg-[var(--color-primary)]/[0.03] scale-[0.995]' : 'hover:bg-white shadow-sm hover:shadow-md'}`}
                    >
                      <td className="py-5 px-6 text-center rounded-l-2xl border-y border-l border-[var(--color-outline-variant)]/5">
                         <input 
                           type="checkbox" 
                           checked={selectedIds.includes(s.id)} 
                           onChange={() => toggleSelect(s.id)} 
                           className="accent-[var(--color-primary)] transition-transform active:scale-125" 
                         />
                      </td>
                      <td className="py-5 px-6 border-y border-[var(--color-outline-variant)]/5">
                        <p className="font-mono text-xs font-black text-[var(--color-primary)] tracking-tighter">{s.tracking_id}</p>
                        <p className="text-[9px] text-[var(--color-on-surface-variant)] font-black mt-1 uppercase opacity-30 tracking-widest">{formatDate(s.created_at)}</p>
                      </td>
                      <td className="py-5 px-6 border-y border-[var(--color-outline-variant)]/5">
                        <p className="text-xs font-black text-[var(--color-primary)] uppercase tracking-tight italic">{s.sender_name}</p>
                        <p className="text-[10px] text-[var(--color-on-surface-variant)] font-bold mt-0.5 opacity-60 line-clamp-1">{s.sender_email}</p>
                      </td>
                      <td className="py-5 px-6 border-y border-[var(--color-outline-variant)]/5">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-[var(--color-secondary)]/10 flex items-center justify-center">
                            <span className="material-symbols-outlined text-sm text-[var(--color-secondary)]">
                              {s.shipping_type === 'AIR' ? 'flight' : s.shipping_type === 'OCEAN' ? 'directions_boat' : 'local_shipping'}
                            </span>
                          </div>
                          <div>
                            <p className="text-[10px] font-black uppercase text-[var(--color-primary)]">{s.shipping_type}</p>
                            <p className="text-[9px] text-[var(--color-secondary)] font-black uppercase opacity-60 tracking-tighter">{s.num_packages} Units • {s.total_weight} KG</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-5 px-6 border-y border-[var(--color-outline-variant)]/5 max-w-[220px]">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                             <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]"></div>
                             <p className="text-[10px] font-bold text-[var(--color-on-surface)] line-clamp-1 uppercase tracking-tight">{s.origin_address}</p>
                          </div>
                          <div className="flex items-center gap-2">
                             <div className="w-2 h-2 rounded-full bg-[#fea619] shadow-[0_0_8px_rgba(254,166,25,0.4)]"></div>
                             <p className="text-[10px] font-black text-[var(--color-primary)] line-clamp-1 italic uppercase tracking-tight">{s.destination_address}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-5 px-6 border-y border-[var(--color-outline-variant)]/5">
                        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${statusBadgeClass(s.status)} shadow-sm`}>
                          <div className="w-1.5 h-1.5 rounded-full bg-current animate-pulse"></div>
                          <span className="text-[9px] font-black uppercase tracking-widest">{statusLabel(s.status)}</span>
                        </div>
                      </td>
                      <td className="py-5 px-6 text-right rounded-r-2xl border-y border-r border-[var(--color-outline-variant)]/5">
                        <div className="flex items-center justify-end gap-2 pr-2 opacity-40 group-hover:opacity-100 transition-opacity duration-300">
                          <button
                            onClick={() => navigate(`/admin/shipments/${s.id}`)}
                            className="p-3 bg-[var(--color-surface-container-low)] text-[var(--color-primary)] rounded-xl hover:bg-white hover:shadow-xl hover:shadow-[var(--color-primary)]/10 transition-all border border-transparent hover:border-[var(--color-outline-variant)]/10 active:scale-95"
                            title="Inspect Manifest"
                          >
                            <span className="material-symbols-outlined text-sm">visibility</span>
                          </button>
                          <button
                            onClick={() => handleDelete(s.id)}
                            className="p-3 bg-red-500/5 text-red-500 rounded-xl hover:bg-red-500 hover:text-white hover:shadow-xl hover:shadow-red-500/20 transition-all border border-transparent hover:border-red-500/10 active:scale-95"
                            title="Terminal Deletion"
                          >
                            <span className="material-symbols-outlined text-sm">delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="py-32 px-4">
                      <div className="flex flex-col items-center justify-center opacity-30 text-center">
                        <span className="material-symbols-outlined text-7xl mb-6">inventory_2</span>
                        <h3 className="text-xl font-black uppercase tracking-[0.3em] mb-2">Zero Operational Units</h3>
                        <p className="text-sm font-bold opacity-60">The logistics manifest is currently empty. Initialize a new shipment to begin.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Footer Logistics */}
          <div className="flex flex-col sm:flex-row items-center justify-between mt-12 pt-8 border-t border-[var(--color-outline-variant)]/10 gap-6">
            <div className="flex flex-col items-center sm:items-start">
               <p className="text-[10px] font-black text-[var(--color-on-surface-variant)] uppercase tracking-[0.2em] opacity-40 mb-1">Manifest Integrity</p>
               <p className="text-xs font-bold text-[var(--color-primary)]">
                 Showing {shipments.length} of {pagination.total} Units Verified
               </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="w-12 h-12 rounded-2xl bg-[var(--color-surface-container-low)] flex items-center justify-center hover:bg-white hover:shadow-xl transition-all disabled:opacity-30 border border-transparent hover:border-[var(--color-outline-variant)]/10 active:scale-95 group"
              >
                <span className="material-symbols-outlined group-hover:-translate-x-1 transition-transform">chevron_left</span>
              </button>
              
              <div className="flex gap-2">
                {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xs transition-all border ${
                      page === p 
                        ? 'bg-[var(--color-primary)] text-white shadow-xl shadow-[var(--color-primary)]/20 border-transparent' 
                        : 'bg-[var(--color-surface-container-low)] text-[var(--color-primary)]/40 hover:bg-white hover:text-[var(--color-primary)] border-transparent hover:border-[var(--color-outline-variant)]/10'
                    }`}
                  >
                    {p < 10 ? `0${p}` : p}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
                disabled={page >= pagination.totalPages}
                className="w-12 h-12 rounded-2xl bg-[var(--color-surface-container-low)] flex items-center justify-center hover:bg-white hover:shadow-xl transition-all disabled:opacity-30 border border-transparent hover:border-[var(--color-outline-variant)]/10 active:scale-95 group"
              >
                <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">chevron_right</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xl z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
           <div className="bg-white rounded-[2.5rem] p-8 md:p-12 max-w-lg w-full shadow-2xl border border-white/20 animate-in zoom-in-95 duration-300">
              <div className="w-20 h-20 rounded-3xl bg-[var(--color-primary)]/5 flex items-center justify-center mb-8">
                 <span className="material-symbols-outlined text-[var(--color-primary)] text-4xl">warning</span>
              </div>
              
              <h3 className="text-3xl font-black text-[var(--color-primary)] tracking-tight mb-4 italic">Confirm Protocol Change</h3>
              <p className="text-[var(--color-on-surface-variant)] font-bold text-sm leading-relaxed mb-10 opacity-60">
                You are about to modify the operational status of <span className="text-[var(--color-primary)] font-black">{selectedIds.length} manifest units</span> to <span className="text-[var(--color-secondary)] font-black uppercase tracking-widest">[{statusLabel(bulkStatus)}]</span>. This action is recorded and impacts live logistics.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                 <button 
                   onClick={() => setShowConfirmModal(false)}
                   className="flex-1 py-5 rounded-2xl bg-[var(--color-surface-container-highest)] text-[var(--color-primary)] font-black uppercase text-xs tracking-[0.2em] hover:bg-[var(--color-outline-variant)]/10 transition-colors"
                 >
                   Abort Change
                 </button>
                 <button 
                   onClick={handleBulkUpdate}
                   className="flex-1 py-5 rounded-2xl bg-[var(--color-primary)] text-white font-black uppercase text-xs tracking-[0.2em] hover:bg-[#fea619] hover:text-[#002045] transition-all shadow-xl shadow-[var(--color-primary)]/20 shadow-hover-none active:scale-95"
                 >
                   Execute Protocol
                 </button>
              </div>
           </div>
        </div>
      )}
    </>
  );
}
