import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../services/api';

const SHIPPING_TYPES = {
  express: { name: 'Express Delivery', days: '1-2 days', price: '$49.99', icon: '🚀' },
  air:     { name: 'Air Freight',       days: '2-4 days', price: '$34.99', icon: '✈️' },
  ocean:   { name: 'Ocean Freight',     days: '14-30 days', price: '$12.99', icon: '🚢' },
  road:    { name: 'Road Freight',      days: '3-7 days', price: '$19.99', icon: '🚛' },
  rail:    { name: 'Rail Freight',      days: '5-10 days', price: '$15.99', icon: '🚂' },
  eco:     { name: 'Eco Shipping',      days: '5-10 days', price: 'Free', icon: '🌱' },
};

const STATUSES = ['in_transit', 'store', 'shipped', 'delivered'];
const statusLabel = (s) => ({ in_transit: 'In Transit', store: 'At Store', shipped: 'Shipped', delivered: 'Delivered' }[s] || s);

const TRACKING_ID_PLACEHOLDER = 'Auto-generated on save';

const EMPTY_ADDRESS = { street: '', city: '', state: '', zip: '', country: '' };
const addressToString = (a) => [a.street, a.city, a.state, a.zip, a.country].filter(Boolean).join(', ');
const stringToAddress = (str) => {
  const parts = str.split(', ').map((p) => p.trim());
  return {
    street: parts[0] || '',
    city: parts[1] || '',
    state: parts[2] || '',
    zip: parts[3] || '',
    country: parts[4] || '',
  };
};

export default function NewShipment() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [form, setForm] = useState({
    reference_number: '',
    shipping_type: '',
    status: 'in_transit',
    origin: { ...EMPTY_ADDRESS },
    destination: { ...EMPTY_ADDRESS },
    sender_name: '',
    receiver_name: '',
  });
  const [trackingId, setTrackingId] = useState(TRACKING_ID_PLACEHOLDER);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(isEdit);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Load existing shipment in edit mode
  useEffect(() => {
    if (!isEdit) return;
    async function load() {
      try {
        const res = await api.get(`/shipments/${id}`);
        const data = await api.parseResponse(res);
        setTrackingId(data.tracking_id);
        setForm({
          reference_number: data.reference_number || '',
          shipping_type: data.shipping_type || '',
          status: data.status || 'in_transit',
          origin: stringToAddress(data.origin_address || ''),
          destination: stringToAddress(data.destination_address || ''),
          sender_name: data.sender_name || '',
          receiver_name: data.receiver_name || '',
        });
      } catch (err) {
        setError('Failed to load shipment: ' + err.message);
      } finally {
        setFetchLoading(false);
      }
    }
    load();
  }, [id, isEdit]);

  const setField = (field, value) => setForm((f) => ({ ...f, [field]: value }));
  const setAddress = (type, field, value) =>
    setForm((f) => ({ ...f, [type]: { ...f[type], [field]: value } }));

  const validate = () => {
    if (!form.shipping_type) return 'Please select a shipping type.';
    const originStr = addressToString(form.origin);
    const destStr = addressToString(form.destination);
    if (!originStr) return 'Origin address is required.';
    if (!destStr) return 'Destination address is required.';
    return null;
  };

  const handleSave = async (andNew = false) => {
    const validationError = validate();
    if (validationError) { setError(validationError); return; }

    setLoading(true);
    setError('');
    setSuccess('');

    const payload = {
      reference_number: form.reference_number || undefined,
      shipping_type: form.shipping_type,
      status: form.status,
      origin_address: addressToString(form.origin),
      destination_address: addressToString(form.destination),
      sender_name: form.sender_name || undefined,
      receiver_name: form.receiver_name || undefined,
    };

    try {
      if (isEdit) {
        await api.parseResponse(await api.put(`/shipments/${id}`, payload));
        setSuccess('Shipment updated successfully!');
        if (!andNew) setTimeout(() => navigate('/admin/shipments'), 1200);
      } else {
        const data = await api.parseResponse(await api.post('/shipments', payload));
        setSuccess(`Shipment ${data.tracking_id} created!`);
        if (andNew) {
          setTimeout(() => {
            setForm({ reference_number: '', shipping_type: '', status: 'in_transit', origin: { ...EMPTY_ADDRESS }, destination: { ...EMPTY_ADDRESS }, sender_name: '', receiver_name: '' });
            setTrackingId(TRACKING_ID_PLACEHOLDER);
            setSuccess('');
          }, 800);
        } else {
          setTimeout(() => navigate('/admin/shipments'), 1200);
        }
      }
    } catch (err) {
      setError(err.message || 'Save failed.');
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[40vh]">
        <div className="flex flex-col items-center gap-4 opacity-40">
          <div className="w-10 h-10 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-medium">Loading shipment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto w-full space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/admin/shipments')}
          className="w-10 h-10 rounded-xl bg-[var(--color-surface-container-low)] flex items-center justify-center hover:bg-[var(--color-surface-container)] transition-colors"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <div>
          <p className="text-[var(--color-secondary)] font-bold tracking-widest text-xs uppercase">
            {isEdit ? 'Edit Shipment' : 'New Shipment'}
          </p>
          <h1 className="text-3xl font-black text-[var(--color-primary)] tracking-tight">
            {isEdit ? trackingId : 'Create Manifest'}
          </h1>
        </div>
      </div>

      {/* Alerts */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-3">
          <span className="material-symbols-outlined text-red-500 text-sm mt-0.5">error</span>
          <p className="text-red-600 text-sm font-medium">{error}</p>
        </div>
      )}
      {success && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-2xl flex items-start gap-3">
          <span className="material-symbols-outlined text-green-500 text-sm mt-0.5">check_circle</span>
          <p className="text-green-600 text-sm font-medium">{success}</p>
        </div>
      )}

      {/* Tracking ID & Reference */}
      <div className="bg-[var(--color-surface-container-lowest)] rounded-3xl p-6 shadow-sm border border-[var(--color-outline-variant)]/10 space-y-4">
        <h2 className="text-lg font-black text-[var(--color-primary)]">Identification</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-[var(--color-on-surface-variant)]">Tracking ID (Auto-generated)</label>
            <input
              readOnly
              value={trackingId}
              className="w-full px-4 py-3 bg-[var(--color-surface-container-low)] rounded-xl text-sm font-mono font-bold text-[var(--color-on-surface-variant)] cursor-not-allowed border-none outline-none"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-[var(--color-on-surface-variant)]">Reference Number (Optional)</label>
            <input
              value={form.reference_number}
              onChange={(e) => setField('reference_number', e.target.value)}
              placeholder="e.g. PO-2024-001"
              className="w-full px-4 py-3 bg-[var(--color-surface-container-high)] rounded-xl text-sm text-[var(--color-on-surface)] border-none outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20"
            />
          </div>
        </div>
      </div>

      {/* Customer Details */}
      <div className="bg-[var(--color-surface-container-lowest)] rounded-3xl p-6 shadow-sm border border-[var(--color-outline-variant)]/10 space-y-4">
        <h2 className="text-lg font-black text-[var(--color-primary)]">Customer Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-[var(--color-on-surface-variant)]">Sender Name</label>
            <input
              value={form.sender_name}
              onChange={(e) => setField('sender_name', e.target.value)}
              placeholder="e.g. John Doe"
              className="w-full px-4 py-3 bg-[var(--color-surface-container-high)] rounded-xl text-sm text-[var(--color-on-surface)] border-none outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-[var(--color-on-surface-variant)]">Receiver Name</label>
            <input
              value={form.receiver_name}
              onChange={(e) => setField('receiver_name', e.target.value)}
              placeholder="e.g. Jane Smith"
              className="w-full px-4 py-3 bg-[var(--color-surface-container-high)] rounded-xl text-sm text-[var(--color-on-surface)] border-none outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20"
            />
          </div>
        </div>
      </div>

      {/* Shipping Type */}
      <div className="bg-[var(--color-surface-container-lowest)] rounded-3xl p-6 shadow-sm border border-[var(--color-outline-variant)]/10 space-y-4">
        <h2 className="text-lg font-black text-[var(--color-primary)]">Shipping Type</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {Object.entries(SHIPPING_TYPES).map(([key, type]) => (
            <button
              key={key}
              type="button"
              onClick={() => setField('shipping_type', key)}
              className={`p-4 rounded-2xl border-2 text-left transition-all hover:scale-[1.02] active:scale-95 ${
                form.shipping_type === key
                  ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/5'
                  : 'border-[var(--color-outline-variant)]/20 bg-[var(--color-surface-container-low)] hover:border-[var(--color-primary)]/30'
              }`}
            >
              <span className="text-2xl mb-2 block">{type.icon}</span>
              <p className="font-bold text-sm text-[var(--color-primary)]">{type.name}</p>
              <p className="text-xs text-[var(--color-on-surface-variant)] mt-0.5">{type.days}</p>
              <p className="text-xs font-black text-[var(--color-secondary)] mt-1">{type.price}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Addresses */}
      {(['origin', 'destination']).map((type) => (
        <div key={type} className="bg-[var(--color-surface-container-lowest)] rounded-3xl p-6 shadow-sm border border-[var(--color-outline-variant)]/10 space-y-4">
          <h2 className="text-lg font-black text-[var(--color-primary)] capitalize flex items-center gap-2">
            <span className="material-symbols-outlined text-[var(--color-secondary)]">
              {type === 'origin' ? 'location_on' : 'near_me'}
            </span>
            {type} Address
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[['street', 'Street Address', 'md:col-span-2'], ['city', 'City'], ['state', 'State / Province'], ['zip', 'Postal Code'], ['country', 'Country']].map(([field, label, extra]) => (
              <div key={field} className={`space-y-2 ${extra || ''}`}>
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-[var(--color-on-surface-variant)]">{label}</label>
                <input
                  value={form[type][field]}
                  onChange={(e) => setAddress(type, field, e.target.value)}
                  placeholder={label}
                  className="w-full px-4 py-3 bg-[var(--color-surface-container-high)] rounded-xl text-sm text-[var(--color-on-surface)] border-none outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20"
                />
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Status */}
      <div className="bg-[var(--color-surface-container-lowest)] rounded-3xl p-6 shadow-sm border border-[var(--color-outline-variant)]/10 space-y-4">
        <h2 className="text-lg font-black text-[var(--color-primary)]">Initial Status</h2>
        <select
          value={form.status}
          onChange={(e) => setField('status', e.target.value)}
          className="w-full px-4 py-3 bg-[var(--color-surface-container-high)] rounded-xl text-sm text-[var(--color-on-surface)] border-none outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 font-medium"
        >
          {STATUSES.map((s) => <option key={s} value={s}>{statusLabel(s)}</option>)}
        </select>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 pb-8">
        <button
          onClick={() => handleSave(false)}
          disabled={loading}
          className="flex-1 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-container)] text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:shadow-lg transition-all disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? (
            <><span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> Saving...</>
          ) : (
            <><span className="material-symbols-outlined text-sm">save</span> {isEdit ? 'Update Shipment' : 'Save Shipment'}</>
          )}
        </button>
        {!isEdit && (
          <button
            onClick={() => handleSave(true)}
            disabled={loading}
            className="flex-1 bg-[var(--color-surface-container)] text-[var(--color-primary)] py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-[var(--color-surface-container-high)] transition-all disabled:opacity-60"
          >
            <span className="material-symbols-outlined text-sm">add</span> Save &amp; New
          </button>
        )}
        <button
          onClick={() => navigate('/admin/shipments')}
          className="sm:w-40 py-4 rounded-2xl font-bold text-[var(--color-on-surface-variant)] bg-[var(--color-surface-container-low)] hover:bg-[var(--color-surface-container)] transition-all"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
