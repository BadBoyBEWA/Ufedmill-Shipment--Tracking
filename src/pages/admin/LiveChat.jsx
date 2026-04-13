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
    <div className="flex-1 flex overflow-hidden h-[calc(100vh-80px)]">
      {/* Conversation List */}
      <section className="w-full max-w-xs lg:max-w-md bg-[var(--color-surface-container-low)] flex flex-col border-r border-[var(--color-outline-variant)]/10">
        <div className="p-6">
          <h2 className="text-xl font-black text-[var(--color-primary)] mb-4">Active Streams</h2>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-on-surface-variant)] opacity-50 text-sm">search</span>
            <input className="w-full outline-none bg-[var(--color-surface-container-high)] border-none rounded-xl pl-10 pr-4 py-2 text-xs focus:ring-2 focus:ring-[var(--color-primary)]/20" placeholder="Filter streams..." type="text"/>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto px-3 space-y-1 pb-10">
          {conversations.length > 0 ? (
            conversations.map((conv) => (
              <button
                key={conv.tracking_id}
                onClick={() => setSelectedId(conv.tracking_id)}
                className={`w-full p-4 rounded-2xl flex items-center gap-4 transition-all ${selectedId === conv.tracking_id ? 'bg-white shadow-md border-l-4 border-[var(--color-secondary)]' : 'hover:bg-white/40'}`}
              >
                <div className="w-10 h-10 rounded-full bg-[var(--color-primary)] flex items-center justify-center text-white text-xs font-bold shrink-0">
                  {conv.tracking_id.substring(0, 2)}
                </div>
                <div className="text-left overflow-hidden">
                  <p className="font-bold text-sm text-[var(--color-primary)] truncate">{conv.tracking_id}</p>
                  <p className="text-[10px] text-[var(--color-on-surface-variant)] opacity-70">
                    Last: {new Date(conv.last_message_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                {conv.unread_count > 0 && selectedId !== conv.tracking_id && (
                  <span className="ml-auto w-5 h-5 bg-[var(--color-secondary)] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {conv.unread_count}
                  </span>
                )}
              </button>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-20 px-6 text-center opacity-40">
              <span className="material-symbols-outlined text-4xl mb-4">forum</span>
              <p className="text-xs font-bold uppercase tracking-widest">No Active Streams</p>
            </div>
          )}
        </div>
      </section>

      {/* Active Chat Window */}
      <section className="flex-1 bg-[var(--color-surface-container-lowest)] flex flex-col items-center justify-center overflow-hidden">
        {selectedId ? (
          <>
            {/* Header */}
            <div className="w-full p-6 border-b border-[var(--color-outline-variant)]/10 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-[var(--color-secondary)]/10 flex items-center justify-center text-[var(--color-secondary)] font-bold">
                  {selectedId.substring(0, 1)}
                </div>
                <div>
                  <h3 className="font-black text-[var(--color-primary)]">{selectedId}</h3>
                  <p className="text-[10px] text-green-600 font-bold uppercase tracking-widest flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                    Direct Link Active
                  </p>
                </div>
              </div>
            </div>

            {/* Chat History */}
            <div className="flex-1 w-full overflow-y-auto p-8 space-y-6 flex flex-col scrollbar-thin scrollbar-thumb-[var(--color-surface-container-highest)] scrollbar-track-transparent">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender_type === 'admin' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[70%] p-4 rounded-2xl text-sm ${
                    msg.sender_type === 'admin' 
                      ? 'bg-[var(--color-primary)] text-white rounded-tr-none' 
                      : 'bg-[var(--color-surface-container-high)] text-[var(--color-on-surface)] rounded-tl-none'
                  }`}>
                    <p>{msg.content}</p>
                    <p className={`text-[9px] mt-2 opacity-50 font-bold ${msg.sender_type === 'admin' ? 'text-right' : 'text-left'}`}>
                      {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="w-full p-8 border-t border-[var(--color-outline-variant)]/10 bg-[var(--color-surface-container-low)]">
              <div className="flex items-end gap-4 bg-white p-2 rounded-2xl shadow-inner-lg">
                <textarea
                  className="flex-1 outline-none border-none focus:ring-0 py-3 px-4 text-sm resize-none placeholder:opacity-40"
                  placeholder="Type an authoritative response..."
                  rows="1"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); } }}
                ></textarea>
                <div className="p-1">
                  <button
                    onClick={handleSendMessage}
                    disabled={!inputText.trim()}
                    className="bg-[var(--color-secondary-container)] text-[var(--color-on-secondary-container)] p-3 rounded-xl shadow-lg hover:shadow-[var(--color-secondary)]/20 transition-all active:scale-95 flex items-center justify-center disabled:opacity-50"
                  >
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>send</span>
                  </button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center opacity-30">
            <span className="material-symbols-outlined text-6xl mb-4">chat_bubble_outline</span>
            <h3 className="text-xl font-black uppercase tracking-tighter">Secure Link Idle</h3>
            <p className="max-w-xs text-sm mt-2 font-medium">Select a tracking stream to initialize communication.</p>
          </div>
        )}
      </section>
    </div>
  );
}
