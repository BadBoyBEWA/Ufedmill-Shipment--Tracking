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
      <header className="bg-slate-50/80 backdrop-blur-xl top-0 sticky z-50 shadow-[0_12px_40px_rgba(11,28,48,0.06)] bg-gradient-to-b from-slate-100 to-transparent">
        <div className="flex justify-between items-center px-8 py-4 w-full max-w-full">
          <div className="flex items-center gap-4">
            <span className="font-sans font-black tracking-tighter text-[#002045] text-2xl">Ufedmill</span>
          </div>
          <div className="flex items-center gap-6">
            <nav className="flex gap-8">
              <Link to="/admin/login" className="font-sans text-sm font-medium uppercase tracking-widest text-[#43474e] hover:text-[#fea619] transition-all duration-300">Sign In</Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center p-6 bg-[var(--color-surface-container-low)] relative overflow-hidden">
        <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[60%] bg-[var(--color-surface-container-high)] rounded-full blur-3xl opacity-40"></div>
        <div className="absolute bottom-[-10%] right-[-5%] w-[30%] h-[50%] bg-[var(--color-secondary-container)]/10 rounded-full blur-3xl opacity-30"></div>
        
        <div className="w-full max-w-[440px] z-10">
          <div className="bg-[var(--color-surface-container-lowest)] rounded-xl ambient-lift p-10 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-silk-gradient border-l-[4px] border-[var(--color-primary)]"></div>
            
            <div className="mb-10">
              <h1 className="font-sans text-[32px] font-black tracking-tight text-[var(--color-primary)] leading-tight mb-2">Recover Access</h1>
              <p className="font-body text-[var(--color-on-surface-variant)] text-sm tracking-wide">Enter your institutional email to verify authority and receive a reset cipher.</p>
            </div>

            {submitted ? (
              <div className="space-y-6">
                <div className="p-6 bg-green-50/50 border border-green-200 rounded-xl flex flex-col items-center text-center gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="material-symbols-outlined text-green-600 text-2xl">mail</span>
                  </div>
                  <div>
                    <h3 className="font-sans font-bold text-green-900 border-none">Check your inbox</h3>
                    <p className="text-sm text-green-800 mt-1">If an account exists for <b>{email}</b>, we've sent instructions to reset your access cipher.</p>
                  </div>
                </div>
                <Link 
                  to="/admin/login" 
                  className="w-full py-4 text-center font-sans text-xs font-bold uppercase tracking-widest text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)] transition-colors block"
                >
                  Return to Dashboard Login
                </Link>
              </div>
            ) : (
              <form className="space-y-8" onSubmit={handleSubmit}>
                {error && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                    <span className="material-symbols-outlined text-red-500 text-sm mt-0.5">error</span>
                    <p className="text-red-600 text-sm font-medium">{error}</p>
                  </div>
                )}

                <div className="group relative">
                  <label className="block font-sans text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-on-surface-variant)] mb-2 ml-1">Institutional Email</label>
                  <div className="relative flex items-center">
                    <span className="material-symbols-outlined absolute left-0 text-[var(--color-primary-container)]/40 group-focus-within:text-[var(--color-primary)] transition-colors">alternate_email</span>
                    <input
                      required
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-8 pr-4 py-3 outline-none bg-[var(--color-surface-container-high)] border-none border-b border-[var(--color-outline-variant)]/30 focus:ring-0 focus:bg-[var(--color-primary-fixed)]/30 transition-all font-body text-[var(--color-on-surface)] placeholder:text-[var(--color-on-surface-variant)]/40 rounded-t-lg"
                      placeholder="authority@ufedmill.com"
                    />
                  </div>
                  <div className="absolute bottom-0 left-0 w-full h-[1px] bg-[var(--color-outline-variant)]/20 group-focus-within:h-[2px] group-focus-within:bg-[var(--color-primary)] transition-all"></div>
                </div>

                <div className="pt-4">
                  <button
                    className="w-full bg-silk-gradient text-white font-sans font-bold py-4 rounded-lg flex items-center justify-center gap-3 group hover:shadow-xl transition-all active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
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
                        <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">send</span>
                      </>
                    )}
                  </button>
                </div>
                
                <div className="text-center">
                  <Link to="/admin/login" className="font-sans text-[10px] font-bold uppercase tracking-widest text-[var(--color-on-surface-variant)]/60 hover:text-[var(--color-primary)] transition-colors">
                    Back to Sign In
                  </Link>
                </div>
              </form>
            )}
          </div>
        </div>
      </main>

      <footer className="bg-[#002045] w-full py-12 px-8">
        <div className="w-full max-w-7xl mx-auto flex justify-between items-center whitespace-nowrap">
          <span className="font-sans font-black text-[#fea619] text-sm md:text-xl">Ufedmill</span>
          <p className="text-white font-sans text-[10px] md:text-xs opacity-60">© 2026 Restricted Interface</p>
        </div>
      </footer>
    </div>
  );
}
