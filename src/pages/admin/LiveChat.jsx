import React, { useState, useEffect, useRef } from 'react';
import api from '../../services/api';

export default function LiveChat() {
  const [conversations, setConversations] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  const fetchConversations = async () => {
    try {
      const res = await api.get('/messages/conversations');
      const data = await api.parseResponse(res);
      setConversations(data);
    } catch (err) {
      console.error('Failed to fetch conversations');
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (id) => {
    if (!id) return;
    try {
      const res = await api.get(`/messages/${id}`);
      const data = await api.parseResponse(res);
      setMessages(data);
      // Mark as read
      await api.put(`/messages/${id}/read`, {});
    } catch (err) {
      console.error('Failed to fetch messages');
    }
  };

  useEffect(() => {
    fetchConversations();
    const interval = setInterval(fetchConversations, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (selectedId) {
      fetchMessages(selectedId);
      const interval = setInterval(() => fetchMessages(selectedId), 5000);
      return () => clearInterval(interval);
    }
  }, [selectedId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!selectedId || !inputText.trim()) return;
    try {
      const res = await api.post('/messages', {
        tracking_id: selectedId,
        content: inputText,
        sender_type: 'admin'
      });
      const newMessage = await api.parseResponse(res);
      setMessages([...messages, newMessage]);
      setInputText('');
    } catch (err) {
      alert('Failed to send message');
    }
  };

  return (
    <div className="flex-1 flex overflow-hidden h-[calc(100vh-80px)] relative">
      {/* Conversation List */}
      <section className={`
        ${selectedId ? 'hidden md:flex' : 'flex'} 
        w-full md:w-80 lg:w-96 bg-[var(--color-surface-container-low)] flex-col border-r border-[var(--color-outline-variant)]/10 z-20
      `}>
        <div className="p-4 md:p-6">
          <h2 className="text-lg md:text-xl font-black text-[var(--color-primary)] mb-4 uppercase tracking-tighter">Active Streams</h2>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-on-surface-variant)] opacity-50 text-sm">search</span>
            <input 
              className="w-full outline-none bg-white border border-slate-100 rounded-2xl pl-10 pr-4 py-3 text-xs focus:ring-4 focus:ring-[#002045]/5 focus:border-[#002045]/10" 
              placeholder="Filter streams..." 
              type="text"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto px-3 space-y-1 pb-20 md:pb-10">
          {conversations.length > 0 ? (
            conversations.map((conv) => (
              <button
                key={conv.tracking_id}
                onClick={() => setSelectedId(conv.tracking_id)}
                className={`w-full p-4 rounded-2xl flex items-center gap-4 transition-all ${
                  selectedId === conv.tracking_id 
                    ? 'bg-white shadow-lg shadow-[#002045]/5 ring-1 ring-[#002045]/5' 
                    : 'hover:bg-white/40'
                }`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-black shrink-0 transition-colors ${
                  selectedId === conv.tracking_id ? 'bg-[#002045] text-white' : 'bg-slate-200 text-slate-500'
                }`}>
                  {conv.tracking_id.substring(0, 2)}
                </div>
                <div className="text-left overflow-hidden flex-1">
                  <p className="font-black text-xs text-[#002045] truncate uppercase tracking-tight">{conv.tracking_id}</p>
                  <p className="text-[9px] text-[var(--color-on-surface-variant)] font-bold opacity-60 uppercase tracking-widest mt-0.5">
                    {new Date(conv.last_message_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                {conv.unread_count > 0 && selectedId !== conv.tracking_id && (
                  <span className="w-5 h-5 bg-[#fea619] text-[#002045] text-[9px] font-black rounded-full flex items-center justify-center animate-pulse">
                    {conv.unread_count}
                  </span>
                )}
              </button>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-20 px-6 text-center opacity-40">
              <span className="material-symbols-outlined text-4xl mb-4">forum</span>
              <p className="text-[10px] font-black uppercase tracking-[0.2em]">No Active Streams</p>
            </div>
          )}
        </div>
      </section>

      {/* Active Chat Window */}
      <section className={`
        ${selectedId ? 'flex' : 'hidden md:flex'} 
        flex-1 bg-white flex-col items-center justify-center overflow-hidden h-full z-30
      `}>
        {selectedId ? (
          <>
            {/* Header */}
            <div className="w-full p-4 md:p-6 border-b border-slate-100 flex items-center gap-4 bg-white/80 backdrop-blur-md sticky top-0 z-10">
              <button 
                onClick={() => setSelectedId(null)}
                className="md:hidden w-10 h-10 flex items-center justify-center text-[#002045] hover:bg-slate-100 rounded-full transition-colors"
                aria-label="Back to conversations"
              >
                <span className="material-symbols-outlined">arrow_back</span>
              </button>
              
              <div className="flex items-center gap-3 flex-1 overflow-hidden">
                <div className="w-10 h-10 rounded-full bg-[#fea619]/10 flex items-center justify-center text-[#855300] font-black shrink-0 text-sm ring-1 ring-[#fea619]/20">
                  {selectedId.substring(0, 2)}
                </div>
                <div className="overflow-hidden">
                  <h3 className="font-black text-[#002045] text-sm md:text-base truncate uppercase italic tracking-tighter">{selectedId}</h3>
                  <p className="text-[10px] text-green-600 font-black uppercase tracking-[0.1em] flex items-center gap-1.5 opacity-80 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                    Operational encrypted feed
                  </p>
                </div>
              </div>
            </div>

            {/* Chat History */}
            <div className="flex-1 w-full overflow-y-auto p-4 md:p-8 space-y-4 md:space-y-6 flex flex-col scroll-smooth">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender_type === 'admin' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] md:max-w-[70%] p-4 rounded-3xl text-xs md:text-sm shadow-sm transition-all ${
                    msg.sender_type === 'admin' 
                      ? 'bg-[#002045] text-white rounded-tr-none' 
                      : 'bg-[#eff4ff] text-[#002045] rounded-tl-none border border-blue-50'
                  }`}>
                    <p className="leading-relaxed font-medium">{msg.content}</p>
                    <p className={`text-[9px] mt-2 opacity-40 font-black uppercase tracking-widest ${msg.sender_type === 'admin' ? 'text-right' : 'text-left'}`}>
                      {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="w-full p-4 md:p-8 border-t border-slate-100 bg-slate-50/50">
              <div className="flex items-end gap-3 md:gap-4 bg-white p-2 rounded-[2rem] shadow-xl shadow-[#002045]/5 ring-1 ring-[#002045]/5">
                <textarea
                  className="flex-1 outline-none border-none focus:ring-0 py-3 px-4 text-xs md:text-sm resize-none placeholder:opacity-40 min-h-[44px] max-h-32 font-medium"
                  placeholder="Type an authoritative response..."
                  rows="1"
                  value={inputText}
                  onChange={(e) => {
                    setInputText(e.target.value);
                    e.target.style.height = 'auto';
                    e.target.style.height = e.target.scrollHeight + 'px';
                  }}
                  onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); } }}
                ></textarea>
                <div className="p-1">
                  <button
                    onClick={handleSendMessage}
                    disabled={!inputText.trim()}
                    className="bg-[#fea619] text-[#002045] w-10 h-10 md:w-12 md:h-12 rounded-full shadow-lg shadow-[#fea619]/20 hover:scale-105 transition-all active:scale-95 flex items-center justify-center disabled:opacity-30"
                  >
                    <span className="material-symbols-outlined text-lg md:text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>send</span>
                  </button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center opacity-30 animate-in fade-in zoom-in duration-1000">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="material-symbols-outlined text-5xl text-[#002045]">forum</span>
            </div>
            <h3 className="text-xl font-black uppercase tracking-tighter text-[#002045] italic">Secure Feed Idle</h3>
            <p className="max-w-xs text-xs mt-3 font-bold uppercase tracking-widest leading-loose">Select a tracking stream to initialize command-level terminal communication.</p>
          </div>
        )}
      </section>
    </div>
  );
}
