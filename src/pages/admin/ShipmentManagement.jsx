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

  // Status update for single row
  const handleStatusUpdate = async (id, newStatus) => {
    try {
      const res = await api.put(`/shipments/${id}`, { status: newStatus });
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
    setShowConfirmModal(false);
    try {
      const res = await api.post('/shipments/bulk', { ids: selectedIds, status: bulkStatus });
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
      <section className="p-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <p className="text-[var(--color-secondary)] font-bold tracking-widest text-sm uppercase">Mission Control</p>
            <h2 className="text-5xl font-black text-[var(--color-primary)] tracking-tight leading-none">Shipment Management</h2>
          </div>
          <button
            onClick={() => navigate('/admin/shipments/new')}
            className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-container)] text-white px-8 py-4 rounded-xl font-bold flex items-center gap-3 shadow-lg hover:scale-105 transition-transform"
          >
            <span className="material-symbols-outlined">add_circle</span>
            Create New Shipment
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-[var(--color-surface-container-low)] p-6 rounded-2xl space-y-1">
            <p className="text-[var(--color-on-surface-variant)] text-xs font-bold uppercase tracking-widest">Active Freight</p>
            <p className="text-3xl font-black text-[var(--color-primary)]">{loading ? '—' : pagination.total}</p>
            <div className="pt-2 flex items-center gap-1 text-[var(--color-secondary)] text-xs font-bold">
              <span className="material-symbols-outlined text-sm">inventory_2</span>
              Total shipments
            </div>
          </div>
          <div className="bg-[var(--color-surface-container-low)] p-6 rounded-2xl space-y-1">
            <p className="text-[var(--color-on-surface-variant)] text-xs font-bold uppercase tracking-widest">In Transit</p>
            <p className="text-3xl font-black text-[var(--color-primary)]">{loading ? '—' : stats.in_transit}</p>
            <div className="pt-2 flex items-center gap-1 text-[var(--color-on-surface-variant)] text-xs">
              <span className="material-symbols-outlined text-sm">schedule</span>
              Currently moving
            </div>
          </div>
          <div className="bg-[var(--color-surface-container-low)] p-6 rounded-2xl border-l-4 border-[var(--color-secondary)] space-y-1">
            <p className="text-[var(--color-on-surface-variant)] text-xs font-bold uppercase tracking-widest">Selected</p>
            <p className="text-3xl font-black text-[var(--color-secondary)]">{selectedIds.length}</p>
            <div className="pt-2 text-xs font-bold text-[var(--color-secondary)]">
              {selectedIds.length > 0 ? 'Ready for bulk action' : 'None selected'}
            </div>
          </div>
          <div className="bg-[var(--color-primary)] p-6 rounded-2xl space-y-1">
            <p className="text-white/60 text-xs font-bold uppercase tracking-widest">Database</p>
            <p className="text-3xl font-black text-white">{loading ? '—' : 'LIVE'}</p>
            <div className="pt-2 text-[var(--color-on-primary-container)] text-xs font-medium italic">Connected to PostgreSQL</div>
          </div>
        </div>

        {/* Bulk Action Bar */}
        {selectedIds.length > 0 && (
          <div className="bg-[var(--color-primary)] text-white p-4 rounded-2xl flex items-center justify-between gap-4 shadow-lg">
            <p className="font-bold text-sm">{selectedIds.length} shipment(s) selected</p>
            <div className="flex items-center gap-3">
              <select
                value={bulkStatus}
                onChange={(e) => setBulkStatus(e.target.value)}
                className="bg-white/10 border border-white/20 text-white rounded-lg px-4 py-2 text-sm font-bold focus:outline-none"
              >
                <option value="">Select new status...</option>
                {VALID_STATUSES.map((s) => <option key={s} value={s}>{statusLabel(s)}</option>)}
              </select>
              <button
                onClick={() => { if (bulkStatus) setShowConfirmModal(true); }}
                disabled={!bulkStatus || bulkLoading}
                className="bg-white text-[var(--color-primary)] px-5 py-2 rounded-lg font-bold text-sm hover:bg-white/90 transition disabled:opacity-50"
              >
                {bulkLoading ? 'Updating...' : 'Apply'}
              </button>
              <button onClick={() => setSelectedIds([])} className="text-white/70 hover:text-white text-sm underline">Clear</button>
            </div>
          </div>
        )}

        {/* Confirm Modal */}
        {showConfirmModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl">
              <h3 className="text-xl font-black text-[var(--color-primary)] mb-2">Confirm Bulk Update</h3>
              <p className="text-[var(--color-on-surface-variant)] text-sm mb-6">
                Update <strong>{selectedIds.length}</strong> shipment(s) to <strong>"{statusLabel(bulkStatus)}"</strong>? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button onClick={handleBulkUpdate} className="flex-1 bg-[var(--color-primary)] text-white py-3 rounded-xl font-bold text-sm">Confirm</button>
                <button onClick={() => setShowConfirmModal(false)} className="flex-1 bg-[var(--color-surface-container-low)] text-[var(--color-primary)] py-3 rounded-xl font-bold text-sm">Cancel</button>
              </div>
            </div>
          </div>
        )}

        {/* Filters & Table */}
        <div className="bg-[var(--color-surface-container-lowest)] p-6 rounded-3xl shadow-sm space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex-grow max-w-xl relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-on-surface-variant)]">search</span>
              <input
                className="w-full pl-12 pr-4 py-4 bg-[var(--color-surface-container-high)] rounded-xl outline-none border-none focus:ring-2 focus:ring-[var(--color-primary)]/20 text-sm placeholder:text-[var(--color-on-surface-variant)]/50"
                placeholder="Search Shipment ID, Port, or Consignee..."
                type="text"
                value={search}
                onChange={(e) => handleSearchChange(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-3">
              <select
                value={statusFilter}
                onChange={(e) => handleStatusFilterChange(e.target.value)}
                className="px-4 py-4 bg-[var(--color-surface-container-low)] text-[var(--color-primary)] font-bold text-sm rounded-xl border-none outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20"
              >
                <option value="">All Statuses</option>
                {VALID_STATUSES.map((s) => <option key={s} value={s}>{statusLabel(s)}</option>)}
              </select>

              <select
                value={typeFilter}
                onChange={(e) => handleTypeFilterChange(e.target.value)}
                className="px-4 py-4 bg-[var(--color-surface-container-low)] text-[var(--color-primary)] font-bold text-sm rounded-xl border-none outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20"
              >
                <option value="">All Types</option>
                <option value="air">Air Freight</option>
                <option value="ocean">Ocean</option>
                <option value="road">Road</option>
                <option value="rail">Rail</option>
                <option value="express">Express</option>
                <option value="eco">Eco Friendly</option>
              </select>
              <button className="px-6 py-4 bg-[var(--color-surface-container-low)] text-[var(--color-primary)] font-bold text-sm rounded-xl flex items-center gap-2 hover:bg-[var(--color-surface-container-high)] transition-colors">
                <span className="material-symbols-outlined text-xl">download</span>
                Export
              </button>
            </div>
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">{error}</div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[var(--color-surface-container)] text-[var(--color-on-surface-variant)] text-[10px] font-black uppercase tracking-[0.2em]">
                  <th className="px-4 py-4 rounded-l-xl">
                    <input
                      type="checkbox"
                      checked={shipments.length > 0 && selectedIds.length === shipments.length}
                      onChange={toggleSelectAll}
                      className="rounded"
                    />
                  </th>
                  <th className="px-6 py-4">Shipment ID</th>
                  <th className="px-6 py-4">Sender</th>
                  <th className="px-6 py-4">Receiver</th>
                  <th className="px-6 py-4">Origin &amp; Destination</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">ETA</th>
                  <th className="px-6 py-4 rounded-r-xl">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-transparent">
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i}>
                      <td colSpan="7" className="px-6 py-4">
                        <div className="h-8 bg-[var(--color-surface-container-low)] rounded-xl animate-pulse"></div>
                      </td>
                    </tr>
                  ))
                ) : shipments.length > 0 ? (
                  shipments.map((s) => (
                    <tr key={s.id} className={`group hover:bg-[var(--color-surface-container-low)]/50 transition-colors ${selectedIds.includes(s.id) ? 'bg-[var(--color-primary)]/5' : ''}`}>
                      <td className="px-4 py-4">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(s.id)}
                          onChange={() => toggleSelect(s.id)}
                          className="rounded"
                        />
                      </td>
                      <td className="px-6 py-4 font-mono text-sm font-bold text-[var(--color-primary)]">{s.tracking_id}</td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-bold text-[var(--color-secondary)]">{s.sender_name || '—'}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-bold text-[var(--color-secondary)]">{s.receiver_name || '—'}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-medium text-[var(--color-on-surface)]">{s.origin_address}</p>
                        <p className="text-xs text-[var(--color-on-surface-variant)] mt-0.5">→ {s.destination_address}</p>
                      </td>
                      <td className="px-6 py-4 text-sm text-[var(--color-on-surface-variant)] capitalize">{typeLabel(s.shipping_type)}</td>
                      <td className="px-6 py-4">
                        <select
                          value={s.status}
                          onChange={(e) => handleStatusUpdate(s.id, e.target.value)}
                          className={`text-xs font-bold px-2 py-1 rounded-full border-none outline-none cursor-pointer ${statusBadgeClass(s.status)}`}
                        >
                          {VALID_STATUSES.map((st) => <option key={st} value={st}>{statusLabel(st)}</option>)}
                        </select>
                      </td>
                      <td className="px-6 py-4 text-sm text-[var(--color-on-surface-variant)]">{formatDate(s.estimated_delivery_date)}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => navigate(`/admin/shipments/${s.id}`)}
                            className="text-xs font-bold text-[var(--color-primary)] hover:text-[var(--color-secondary)] transition-colors"
                            title="Edit"
                          >
                            <span className="material-symbols-outlined text-sm">edit</span>
                          </button>
                          <button
                            onClick={() => handleDelete(s.id)}
                            className="text-xs font-bold text-red-400 hover:text-red-600 transition-colors"
                            title="Delete"
                          >
                            <span className="material-symbols-outlined text-sm">delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr className="group hover:bg-[var(--color-surface-container-low)]/50 transition-colors">
                    <td className="px-6 py-20" colSpan="7">
                      <div className="flex flex-col items-center text-[var(--color-on-surface-variant)]/50">
                         <span className="material-symbols-outlined text-4xl mb-4">inventory_2</span>
                         <p className="text-sm font-medium tracking-wide">Command Center: No active shipments found in current protocol.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between pt-8 border-t border-[var(--color-surface-container)]">
            <p className="text-xs text-[var(--color-on-surface-variant)] font-medium">
              Showing {shipments.length} of {pagination.total} shipments
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="w-10 h-10 rounded-xl bg-[var(--color-surface-container-low)] flex items-center justify-center hover:bg-[var(--color-surface-container)] transition-colors disabled:opacity-40"
              >
                <span className="material-symbols-outlined">chevron_left</span>
              </button>
              {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm transition-colors ${
                    page === p ? 'bg-[var(--color-primary)] text-white' : 'bg-[var(--color-surface-container-low)] hover:bg-[var(--color-surface-container)]'
                  }`}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
                disabled={page >= pagination.totalPages}
                className="w-10 h-10 rounded-xl bg-[var(--color-surface-container-low)] flex items-center justify-center hover:bg-[var(--color-surface-container)] transition-colors disabled:opacity-40"
              >
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      <div className="flex-grow"></div>
    </>
  );
}
