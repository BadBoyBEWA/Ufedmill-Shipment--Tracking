import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import api from '../../services/api';

export default function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get token from URL query params
  const query = new URLSearchParams(location.search);
  const token = query.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    if (success && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (success && countdown === 0) {
      navigate('/admin/login');
    }
  }, [success, countdown, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return setError('Passwords do not match.');
    }
    if (password.length < 8) {
      return setError('Password must be at least 8 characters.');
    }

    setLoading(true);
    setError('');

    try {
      const res = await api.post('/admin/reset-password', { token, password });
      await api.parseResponse(res);
      setSuccess(true);
    } catch (err) {
      setError(err.message || 'Failed to reset password. The link may be expired.');
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-[var(--color-surface)] flex items-center justify-center p-6">
        <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-sm">
          <span className="material-symbols-outlined text-red-500 text-5xl mb-4">error</span>
          <h2 className="text-xl font-bold mb-2">Invalid Token</h2>
          <p className="text-gray-600 mb-6">This password reset link is missing or invalid.</p>
          <Link to="/admin/login" className="text-[var(--color-primary)] font-bold">Return to Login</Link>
        </div>
      </div>
    );
  }

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
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#855300] mb-2 block">SECURITY PROTOCOL</span>
              <h1 className="font-sans text-3xl md:text-4xl font-black tracking-tighter text-[#002045] mb-2 uppercase italic">Reset Cipher</h1>
              <p className="font-body text-[#43474e] text-xs font-bold opacity-60">Establish a new access protocol for your institutional identity.</p>
            </div>

            {success ? (
              <div className="space-y-6 text-center animate-in fade-in duration-700">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
                  <span className="material-symbols-outlined text-green-600 text-3xl">verified</span>
                </div>
                <div className="space-y-2">
                  <h2 className="text-xl font-black text-[#002045] uppercase tracking-tighter">Cipher Updated</h2>
                  <p className="text-[11px] text-[#43474e] font-bold opacity-70">Your new access protocol has been synchronized across the global network.</p>
                </div>
                <div className="pt-4 p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                  <p className="text-[10px] font-black uppercase tracking-widest text-[#002045]">
                    Redirecting in <span className="text-lg text-[#fea619]">{countdown}</span> seconds
                  </p>
                </div>
              </div>
            ) : (
              <form className="space-y-6" onSubmit={handleSubmit}>
                {error && (
                  <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                    <span className="material-symbols-outlined text-red-500 text-sm mt-0.5">error</span>
                    <p className="text-red-700 text-[10px] font-black uppercase tracking-wide leading-tight">{error}</p>
                  </div>
                )}

                <div className="space-y-4">
                  <div className="space-y-2 group">
                    <label className="block font-sans text-[10px] font-black uppercase tracking-[0.2em] text-[#43474e] ml-1">New Access Cipher</label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg group-focus-within:text-[#002045] transition-colors">lock</span>
                      <input
                        required
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-[#002045]/5 focus:bg-white focus:border-[#002045]/20 transition-all font-bold text-sm text-[#002045]"
                        placeholder="••••••••••••"
                      />
                    </div>
                  </div>

                  <div className="space-y-2 group">
                    <label className="block font-sans text-[10px] font-black uppercase tracking-[0.2em] text-[#43474e] ml-1">Confirm Cipher</label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg group-focus-within:text-[#002045] transition-colors">lock_reset</span>
                      <input
                        required
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-[#002045]/5 focus:bg-white focus:border-[#002045]/20 transition-all font-bold text-sm text-[#002045]"
                        placeholder="••••••••••••"
                      />
                    </div>
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
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <span>Verify & Update</span>
                        <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">update</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </main>

      <footer className="bg-[#002045] w-full py-8 md:py-12 px-6 md:px-8 text-center">
        <span className="font-sans font-black text-[#fea619] text-xl">Ufedmill</span>
        <p className="text-white text-[10px] font-bold tracking-widest opacity-40 uppercase mt-2">© 2026 Institutional Interface</p>
      </footer>
    </div>
  );
}
