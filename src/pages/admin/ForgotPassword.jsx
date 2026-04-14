import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await api.post('/admin/forgot-password', { email });
      await api.parseResponse(res);
      setSubmitted(true);
    } catch (err) {
      setError(err.message || 'Failed to send reset link.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[var(--color-surface)] text-[var(--color-on-surface)] font-body min-h-screen flex flex-col">
      <header className="bg-white/80 backdrop-blur-xl sticky top-0 z-50 shadow-sm border-b border-slate-100">
        <div className="flex justify-between items-center px-6 py-4 w-full max-w-7xl mx-auto">
          <Link to="/" className="font-sans font-black tracking-tighter text-[#002045] text-2xl">Ufedmill</Link>
          <nav className="flex gap-4 md:gap-8">
            <Link to="/admin/login" className="font-sans text-[10px] font-black uppercase tracking-widest text-[#43474e] hover:text-[#fea619] transition-all">Sign In</Link>
          </nav>
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center p-4 md:p-8 bg-[var(--color-surface-container-low)] relative overflow-hidden">
        <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[60%] bg-[#002045]/5 rounded-full blur-3xl opacity-40"></div>
        <div className="absolute bottom-[-10%] right-[-5%] w-[30%] h-[50%] bg-[#fea619]/10 rounded-full blur-3xl opacity-30"></div>
        
        <div className="w-full max-w-[440px] z-10">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 p-6 md:p-10 relative overflow-hidden ring-1 ring-[#002045]/5">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-[#002045] to-[#fea619]"></div>
            
            <div className="mb-10 text-center md:text-left">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#855300] mb-2 block">RECOVERY PROTOCOL</span>
              <h1 className="font-sans text-3xl md:text-4xl font-black tracking-tighter text-[#002045] mb-2 uppercase italic">Recover Access</h1>
              <p className="font-body text-[#43474e] text-xs font-bold opacity-60">Enter your institutional email to verify authority and receive a reset cipher.</p>
            </div>

            {submitted ? (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="p-8 bg-green-50/50 border border-green-200 rounded-3xl flex flex-col items-center text-center gap-6 shadow-sm">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center shadow-inner">
                    <span className="material-symbols-outlined text-green-600 text-3xl">mail</span>
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-sans font-black text-[#002045] uppercase tracking-tighter text-lg">Check your inbox</h3>
                    <p className="text-[11px] text-[#43474e] font-bold leading-relaxed opacity-70">If an account exists for <b className="text-[#002045]">{email}</b>, we've sent instructions to reset your access cipher.</p>
                  </div>
                </div>
                <Link 
                  to="/admin/login" 
                  className="w-full py-4 text-center font-sans text-[10px] font-black uppercase tracking-[0.2em] text-[#43474e] hover:text-[#fea619] transition-all block border border-slate-100 rounded-2xl"
                >
                  Return to Dashboard Login
                </Link>
              </div>
            ) : (
              <form className="space-y-8" onSubmit={handleSubmit}>
                {error && (
                  <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                    <span className="material-symbols-outlined text-red-500 text-sm mt-0.5">error</span>
                    <p className="text-red-700 text-[10px] font-black uppercase tracking-wide leading-tight">{error}</p>
                  </div>
                )}

                <div className="space-y-2 group">
                  <label className="block font-sans text-[10px] font-black uppercase tracking-[0.2em] text-[#43474e] ml-1">Institutional Email</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg group-focus-within:text-[#002045] transition-colors">alternate_email</span>
                    <input
                      required
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-[#002045]/5 focus:bg-white focus:border-[#002045]/20 transition-all font-bold text-sm text-[#002045]"
                      placeholder="authority@ufedmill.com"
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    className="w-full bg-[#002045] text-white font-black py-4 rounded-2xl flex items-center justify-center gap-3 group hover:shadow-xl hover:shadow-[#002045]/20 transition-all active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed uppercase tracking-widest text-xs"
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                        <span>Verifying...</span>
                      </>
                    ) : (
                      <>
                        <span>Send Reset Link</span>
                        <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">send</span>
                      </>
                    )}
                  </button>
                </div>
                
                <div className="text-center">
                  <Link to="/admin/login" className="text-[9px] font-black uppercase tracking-[0.2em] text-[#43474e]/60 hover:text-[#fea619] transition-colors">
                    Back to Sign In
                  </Link>
                </div>
              </form>
            )}
          </div>
        </div>
      </main>

      <footer className="bg-[#002045] w-full py-8 md:py-12 px-6 md:px-8">
        <div className="w-full max-w-7xl mx-auto flex justify-between items-center whitespace-nowrap">
          <span className="font-sans font-black text-[#fea619] text-xl">Ufedmill</span>
          <p className="text-white text-[10px] font-bold tracking-widest opacity-40 uppercase">© 2026 Restricted Interface</p>
        </div>
      </footer>
    </div>
  );
}
