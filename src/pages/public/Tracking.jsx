import React, { useState, useEffect, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../../services/api';

const STATUS_STEPS = [
  { key: 'in_transit', label: 'In Transit', icon: 'local_shipping' },
  { key: 'store', label: 'At Store', icon: 'store' },
  { key: 'shipped', label: 'Shipped', icon: 'hub' },
  { key: 'delivered', label: 'Delivered', icon: 'inventory_2' },
];

const STATUS_INDEX = { in_transit: 0, store: 1, shipped: 2, delivered: 3 };

export default function Tracking() {
  const [searchParams, setSearchParams] = useSearchParams();
  const trackingId = searchParams.get('id');
  const [inputVal, setInputVal] = useState('');

  const [shipment, setShipment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const autoRefreshTimer = useRef(null);

  const searchTracking = async (reference, silent = false) => {
    if (!reference) return;
    if (!silent) { setLoading(true); setError(''); setShipment(null); }
    try {
      const res = await api.get(`/shipments/track/${encodeURIComponent(reference)}`);
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Shipment not found.');
      }
      const data = await res.json();
      setShipment(data);
    } catch (err) {
      setError(err.message);
      setShipment(null);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  // Fetch on URL param change
  useEffect(() => {
    if (trackingId) {
      searchTracking(trackingId);
    }
  }, [trackingId]);

  // Auto-refresh every 10 seconds when a shipment is loaded
  useEffect(() => {
    if (shipment?.tracking_id) {
      autoRefreshTimer.current = setInterval(() => {
        searchTracking(shipment.tracking_id, true); // silent refresh
      }, 10000);
    }
    return () => clearInterval(autoRefreshTimer.current);
  }, [shipment?.tracking_id]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (inputVal.trim()) {
      setSearchParams({ id: inputVal.trim() });
    }
  };

  const formatDate = (d) => {
    if (!d) return 'TBD';
    return new Date(d).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  const formatDateTime = (iso) => {
    if (!iso) return '';
    const d = new Date(iso);
    return {
      date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase(),
      time: d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    };
  };

  const currentStepIdx = shipment ? (STATUS_INDEX[shipment.status] ?? 0) : -1;

  // Search-only view
  if (!trackingId) {
    return (
      <main className="max-w-7xl mx-auto px-8 py-32 w-full flex flex-col items-center sm:items-start justify-center min-h-[70vh]">
        <div className="max-w-2xl w-full">
          <span className="text-[var(--color-secondary)] uppercase font-bold tracking-[0.2em] text-sm mb-4 block">REAL-TIME UPDATES</span>
          <h1 className="text-[var(--color-primary)] text-6xl md:text-7xl font-black tracking-tighter mb-4 uppercase">
            Track Shipment
          </h1>
          <p className="text-[var(--color-on-surface-variant)] text-lg mb-12">
            Enter your Ufedmill tracking number to get the latest status update. No login required.
          </p>

          <form onSubmit={handleSearch} className="flex flex-col gap-6 w-full max-w-xl">
            <input
              type="text"
              className="bg-[var(--color-surface-container-high)] text-[var(--color-on-surface)] rounded-2xl px-6 py-5 text-lg w-full border border-[var(--color-outline-variant)]/20 outline-none focus:ring-2 focus:ring-[var(--color-primary)] placeholder-[var(--color-on-surface-variant)]/50"
              placeholder="Enter tracking number (e.g. TRK-ABC123)"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
            />
            <button
              type="submit"
              className="bg-[var(--color-secondary-container)] hover:bg-[#ffb95f] text-[var(--color-on-secondary-container)] flex items-center justify-center gap-3 px-8 py-5 rounded-2xl w-full font-black text-lg uppercase tracking-wider transition-all shadow-lg shadow-[var(--color-secondary)]/20 cursor-pointer hover:scale-[1.02] active:scale-95"
            >
              <span className="material-symbols-outlined font-bold" style={{ fontVariationSettings: "'FILL' 1" }}>location_on</span>
              Track Package
            </button>
          </form>
        </div>
      </main>
    );
  }

  // Loading state
  if (loading) {
    return (
      <main className="max-w-7xl mx-auto px-8 py-32 w-full flex flex-col items-center justify-center min-h-[70vh]">
        <div className="flex flex-col items-center gap-6 opacity-60">
          <div className="w-14 h-14 border-4 border-[var(--color-primary)]/20 border-t-[var(--color-primary)] rounded-full animate-spin"></div>
          <p className="text-[var(--color-on-surface-variant)] font-bold tracking-widest uppercase text-sm">Locating shipment...</p>
        </div>
      </main>
    );
  }

  // Error state
  if (error) {
    return (
      <main className="max-w-7xl mx-auto px-8 py-32 w-full flex flex-col items-center sm:items-start justify-center min-h-[70vh]">
        <div className="max-w-2xl w-full">
          <div className="p-8 bg-red-50 border border-red-200 rounded-2xl mb-8">
            <span className="material-symbols-outlined text-red-500 text-4xl mb-4 block">search_off</span>
            <h2 className="text-2xl font-black text-red-600 mb-2">Shipment Not Found</h2>
            <p className="text-red-500 text-sm">{error}</p>
          </div>
          <form onSubmit={handleSearch} className="flex gap-4">
            <input
              type="text"
              className="flex-1 bg-[var(--color-surface-container-high)] rounded-2xl px-6 py-4 text-sm border border-[var(--color-outline-variant)]/20 outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              placeholder="Try another tracking number..."
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
            />
            <button type="submit" className="bg-[var(--color-secondary-container)] text-[var(--color-on-secondary-container)] px-6 py-4 rounded-2xl font-black text-sm hover:bg-[#ffb95f] transition-all">Search</button>
          </form>
        </div>
      </main>
    );
  }

  // Results view
  if (!shipment) return null;

  const history = [...(shipment.status_history || [])].reverse();

  return (
    <>
      <main className="max-w-7xl mx-auto px-8 py-12 w-full">
        {/* Hero Section */}
        <section className="mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-end">
            <div>
              <span className="text-[var(--color-secondary)] font-bold tracking-[0.2em] uppercase text-xs mb-4 block capitalize">{shipment.shipping_type?.replace('_', ' ')} Service</span>
              <h2 className="text-[var(--color-primary)] text-6xl md:text-7xl font-black tracking-tighter leading-tight break-all uppercase truncate" title={shipment.tracking_id}>{shipment.tracking_id}</h2>
              <p className="text-[var(--color-on-surface-variant)] text-lg mt-4 max-w-md">Real-time architectural flow of your asset through our global logistics framework.</p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[var(--color-secondary)] animate-pulse"></span>
                <span className="text-[var(--color-on-surface)] font-bold text-sm uppercase tracking-widest capitalize">{shipment.status?.replace('_', ' ')}</span>
              </div>
              <p className="text-[var(--color-on-surface-variant)] text-sm">Estimated Delivery: <span className="text-[var(--color-on-surface)] font-black">{formatDate(shipment.estimated_delivery_date)}</span></p>
            </div>
          </div>
        </section>

        {/* Progress Stepper */}
        <section className="mb-16 bg-[var(--color-surface-container-low)] p-10 rounded-xl relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_right,_var(--color-secondary-container)_0%,_transparent_50%)]"></div>
          <div className="relative z-10 flex justify-between items-start">
            {STATUS_STEPS.map((step, idx) => {
              const isCompleted = idx < currentStepIdx;
              const isCurrent = idx === currentStepIdx;
              const isPending = idx > currentStepIdx;

              return (
                <React.Fragment key={step.key}>
                  <div className="flex flex-col items-center text-center w-1/4">
                    <div className={`${isCurrent ? 'w-14 h-14 ring-[12px] ring-white shadow-xl scale-110 bg-[var(--color-secondary-container)] text-[var(--color-on-secondary-container)]' : isCompleted ? 'w-12 h-12 ring-8 ring-[var(--color-surface-container)] bg-[var(--color-primary)] text-white' : 'w-12 h-12 ring-8 ring-[var(--color-surface-container)] bg-[var(--color-surface-container-highest)] text-[var(--color-on-surface-variant)]'} rounded-full flex items-center justify-center mb-4 transition-all`}>
                      <span className="material-symbols-outlined" style={{ fontVariationSettings: (isCompleted || isCurrent) ? "'FILL' 1" : undefined }}>{step.icon}</span>
                    </div>
                    <p className={`font-bold text-sm uppercase tracking-wider ${isCurrent ? 'text-[var(--color-on-surface)] font-extrabold' : isCompleted ? 'text-[var(--color-primary)]' : 'text-[var(--color-outline)]'}`}>{step.label}</p>
                    {isCurrent && <p className="text-[var(--color-secondary)] font-bold text-[10px] mt-1">Currently Here</p>}
                    {isCompleted && <p className="text-[var(--color-on-surface-variant)] text-[10px] mt-1">Completed</p>}
                    {isPending && <p className="text-[var(--color-on-surface-variant)] text-[10px] mt-1">Pending</p>}
                  </div>
                  {idx < STATUS_STEPS.length - 1 && (
                    <div className={`h-1 flex-grow mt-6 -mx-8 relative z-0 ${idx < currentStepIdx ? 'bg-[var(--color-primary)]' : 'bg-[var(--color-surface-container-highest)]'}`}></div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </section>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left: Manifest Details */}
          <div className="lg:col-span-5 flex flex-col gap-8">
            <div className="bg-white p-8 rounded-xl shadow-[0_12px_40px_rgba(11,28,48,0.06)] overflow-hidden relative">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-[var(--color-primary)] font-black text-2xl tracking-tighter">Manifest Details</h3>
                <span className="material-symbols-outlined text-[var(--color-outline)]">description</span>
              </div>
              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-[var(--color-surface-container)] rounded-full flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[var(--color-primary)]">location_on</span>
                  </div>
                  <div>
                    <p className="text-[var(--color-on-surface-variant)] text-xs uppercase tracking-widest font-bold mb-1">Origin</p>
                    <p className="text-[var(--color-on-surface)] font-bold text-lg">{shipment.origin_address}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-[var(--color-surface-container)] rounded-full flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[var(--color-secondary)]">near_me</span>
                  </div>
                  <div>
                    <p className="text-[var(--color-on-surface-variant)] text-xs uppercase tracking-widest font-bold mb-1">Destination</p>
                    <p className="text-[var(--color-on-surface)] font-bold text-lg">{shipment.destination_address}</p>
                  </div>
                </div>
                <div className="pt-8 border-t border-[var(--color-surface-container-low)] grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[var(--color-on-surface-variant)] text-xs uppercase tracking-widest font-bold mb-1">Reference</p>
                    <p className="text-[var(--color-on-surface)] font-black">{shipment.reference_number || '—'}</p>
                  </div>
                  <div>
                    <p className="text-[var(--color-on-surface-variant)] text-xs uppercase tracking-widest font-bold mb-1">Service Type</p>
                    <p className="text-[var(--color-on-surface)] font-black capitalize">{shipment.shipping_type?.replace('_', ' ')}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Map placeholder */}
            <div className="h-64 bg-[var(--color-surface-container)] rounded-xl overflow-hidden shadow-sm">
              <img className="w-full h-full object-cover grayscale opacity-80" alt="Map graphic" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDrqwVVcfOdN9VSe0EFuFh1_mNPRgFUuZ5Hp5NJo2SZkdrPfgZ8o1FWzV6tGcjngKeTOYEGubfp4SNltREZYWmShFu0XXIX1JZX4CiTrJMYAAkilDJwLbEbU8aPzbXOcjUK4p2RZ5bfEI3iK2ptGw95G90O7cHDst8p5AJDdcmvyogTyySfPE2NxBKBQPUz4ks9zbytzx14yjSNaXvMNpPypTXhsDVj822WbQRK5pBixvjC3tieoUqjP65KYa2Dy5fqT5XoIrx6Z4Q" />
            </div>
          </div>

          {/* Right: Timeline from status_history */}
          <div className="lg:col-span-7">
            <div className="flex justify-between items-center mb-8 px-4">
              <h3 className="text-[var(--color-primary)] font-black text-2xl tracking-tighter">Chain of Custody</h3>
              <button className="flex items-center gap-2 text-[var(--color-primary)] font-bold text-sm hover:translate-x-1 transition-transform cursor-pointer">
                <span>Download Logs</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </div>

            <div className="space-y-0 relative">
              <div className="absolute left-10 top-0 bottom-0 w-2 bg-[var(--color-surface-container-high)] rounded-full"></div>

              {history.length > 0 ? history.map((entry, idx) => {
                const dt = formatDateTime(entry.timestamp);
                const isLatest = idx === 0;
                return (
                  <div key={idx} className="relative flex items-start gap-8 pb-12 group">
                    <div className="mt-1 w-20 text-right shrink-0">
                      <p className={`font-black text-xs ${isLatest ? 'text-[var(--color-primary)]' : 'text-[var(--color-on-surface-variant)]'}`}>{dt.date}</p>
                      <p className="text-[var(--color-on-surface-variant)] text-[10px] uppercase font-bold">{dt.time}</p>
                    </div>
                    <div className={`relative z-10 w-6 h-6 rounded-full flex items-center justify-center ring-8 ring-[var(--color-surface)] mt-1 ${isLatest ? 'bg-[var(--color-secondary)]' : 'bg-[var(--color-primary)]'}`}>
                      {isLatest
                        ? <span className="w-2 h-2 bg-white rounded-full"></span>
                        : <span className="material-symbols-outlined text-[12px] text-white" style={{ fontVariationSettings: "'FILL' 1" }}>check</span>
                      }
                    </div>
                    <div className={`p-6 rounded-xl flex-grow transition-colors ${isLatest ? 'bg-[var(--color-surface-container-low)] group-hover:bg-[var(--color-surface-container)]' : 'bg-white border border-[var(--color-surface-container-high)]'}`}>
                      <h4 className={`font-black text-lg tracking-tight ${isLatest ? 'text-[var(--color-on-surface)]' : 'text-[var(--color-on-surface)] font-bold'}`}>
                        Status: <span className="capitalize">{entry.status?.replace('_', ' ')}</span>
                      </h4>
                      {entry.location && <p className="text-[var(--color-on-surface-variant)] mt-1">{entry.location}</p>}
                      {isLatest && (
                        <span className="inline-block mt-4 px-3 py-1 bg-[var(--color-secondary)]/10 text-[var(--color-secondary)] font-bold text-[10px] uppercase tracking-widest rounded-full">
                          Latest Update
                        </span>
                      )}
                    </div>
                  </div>
                );
              }) : (
                <div className="pl-32 py-12 text-[var(--color-on-surface-variant)]/50">
                  <p className="text-sm font-medium">No status history available.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Search Another */}
        <div className="mt-20 flex justify-center border-t border-[var(--color-outline-variant)]/10 pt-16">
          <Link to="/tracking" className="bg-[var(--color-surface-container-high)] border border-[var(--color-outline-variant)]/20 text-[var(--color-primary)] px-8 py-5 rounded-2xl font-bold flex items-center gap-3 hover:bg-[var(--color-surface-container-highest)] transition-all cursor-pointer shadow-sm hover:shadow-md">
            <span className="material-symbols-outlined text-[var(--color-secondary)]">search</span>
            Search Another Shipment
          </Link>
        </div>
      </main>

      {/* Floating Live Chat Widget */}
      <ChatWidget trackingId={shipment?.tracking_id} />
    </>
  );
}

function ChatWidget({ trackingId }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [unreadCount, setUnreadCount] = useState(0);
  const messagesEndRef = useRef(null);

  const fetchMessages = async () => {
    if (!trackingId || !isOpen) return;
    try {
      const res = await api.get(`/messages/${trackingId}`);
      const data = await api.parseResponse(res);
      setMessages(data);
      setUnreadCount(0);
    } catch (err) {
      console.error('Failed to fetch messages');
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchMessages();
      const interval = setInterval(fetchMessages, 5000);
      return () => clearInterval(interval);
    }
  }, [isOpen, trackingId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputText.trim() || !trackingId) return;

    try {
      const res = await api.post('/messages', {
        tracking_id: trackingId,
        content: inputText,
        sender_type: 'user'
      });
      const newMessage = await api.parseResponse(res);
      setMessages([...messages, newMessage]);
      setInputText('');
    } catch (err) {
      alert('Failed to send message');
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-[60] flex flex-col items-end">
      {isOpen && (
        <div className="mb-4 w-[350px] bg-white rounded-3xl shadow-2xl border border-[var(--color-outline-variant)]/10 overflow-hidden flex flex-col h-[500px] transition-all">
          <div className="bg-[var(--color-primary)] p-6 text-white flex justify-between items-center">
            <div>
              <h4 className="font-black text-sm tracking-tight">Ufedmill Support</h4>
              <p className="text-[10px] opacity-70">Direct Link: {trackingId}</p>
            </div>
            <button onClick={() => setIsOpen(false)} className="material-symbols-outlined text-xl hover:bg-white/10 rounded-full p-1 transition-colors">close</button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[var(--color-surface-container-lowest)]">
            {messages.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center opacity-30 text-center px-4">
                <span className="material-symbols-outlined text-4xl mb-4">chat_bubble</span>
                <p className="text-xs font-bold uppercase tracking-widest">Secure Communication Channel</p>
                <p className="text-[10px] mt-2 font-medium">Connect with our logistics team regarding manifest {trackingId}.</p>
              </div>
            )}
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.sender_type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-2xl text-xs ${
                  msg.sender_type === 'user' 
                    ? 'bg-[var(--color-primary)] text-white rounded-tr-none' 
                    : 'bg-white text-[var(--color-on-surface)] rounded-tl-none shadow-sm'
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-[var(--color-outline-variant)]/10 flex gap-2">
            <input
              type="text"
              className="flex-1 bg-[var(--color-surface-container-low)] rounded-xl px-4 py-2 text-xs border-none outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
              placeholder="Ask about your package..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="bg-[var(--color-secondary-container)] text-[var(--color-on-secondary-container)] p-2 rounded-xl shadow-md flex items-center justify-center disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-sm">send</span>
            </button>
          </form>
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 bg-silk-gradient text-white rounded-full flex items-center justify-center shadow-2xl scale-95 active:scale-100 transition-all hover:shadow-[0_20px_50px_rgba(0,32,69,0.3)] relative"
      >
        <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>
          {isOpen ? 'close' : 'chat'}
        </span>
        {!isOpen && unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-[var(--color-secondary)] rounded-full border-2 border-white flex items-center justify-center text-[10px] font-bold">
            {unreadCount}
          </span>
        )}
      </button>
    </div>
  );
}
