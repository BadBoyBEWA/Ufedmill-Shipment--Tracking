import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password, rememberMe);
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[var(--color-surface)] text-[var(--color-on-surface)] font-body selection:bg-[var(--color-secondary-fixed)] selection:text-[var(--color-on-secondary-fixed)] min-h-screen flex flex-col">
      <header className="bg-slate-50/80 backdrop-blur-xl docked full-width top-0 sticky z-50 shadow-[0_12px_40px_rgba(11,28,48,0.06)] bg-gradient-to-b from-slate-100 to-transparent">
        <div className="flex justify-between items-center px-8 py-4 w-full max-w-full">
          <div className="flex items-center gap-4">
            <span className="font-sans font-black tracking-tighter text-[#002045] text-2xl">Ufedmill</span>
          </div>
          <div className="flex items-center gap-6">
            <nav className="hidden md:flex gap-8">
              <Link to="/" className="font-sans text-sm font-medium uppercase tracking-widest text-[#43474e] hover:text-[#fea619] transition-all duration-300 cursor-pointer">Home</Link>
              <Link to="/tracking" className="font-sans text-sm font-medium uppercase tracking-widest text-[#43474e] hover:text-[#fea619] transition-all duration-300 cursor-pointer">Tracking</Link>
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
              <h1 className="font-sans text-[32px] font-black tracking-tight text-[var(--color-primary)] leading-tight mb-2">Command Access</h1>
              <p className="font-body text-[var(--color-on-surface-variant)] text-sm tracking-wide">Enter institutional credentials to manage Ufedmill assets.</p>
            </div>

            {/* Error message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                <span className="material-symbols-outlined text-red-500 text-sm mt-0.5">error</span>
                <p className="text-red-600 text-sm font-medium">{error}</p>
              </div>
            )}
            
            <form className="space-y-8" onSubmit={handleLogin}>
              <div className="space-y-6">
                <div className="group relative">
                  <label className="block font-sans text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-on-surface-variant)] mb-2 ml-1">Institutional Email</label>
                  <div className="relative flex items-center">
                    <span className="material-symbols-outlined absolute left-0 text-[var(--color-primary-container)]/40 group-focus-within:text-[var(--color-primary)] transition-colors" data-icon="alternate_email">alternate_email</span>
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
                
                <div className="group relative">
                  <label className="block font-sans text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-on-surface-variant)] mb-2 ml-1">Access Cipher</label>
                  <div className="relative flex items-center">
                    <span className="material-symbols-outlined absolute left-0 text-[var(--color-primary-container)]/40 group-focus-within:text-[var(--color-primary)] transition-colors" data-icon="lock">lock</span>
                    <input
                      required
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-8 pr-4 py-3 outline-none bg-[var(--color-surface-container-high)] border-none border-b border-[var(--color-outline-variant)]/30 focus:ring-0 focus:bg-[var(--color-primary-fixed)]/30 transition-all font-body text-[var(--color-on-surface)] placeholder:text-[var(--color-on-surface-variant)]/40 rounded-t-lg"
                      placeholder="••••••••••••"
                    />
                    <span
                      className="material-symbols-outlined absolute right-2 text-[var(--color-on-surface-variant)]/60 hover:text-[var(--color-primary)] cursor-pointer text-xl"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </div>
                  <div className="absolute bottom-0 left-0 w-full h-[1px] bg-[var(--color-outline-variant)]/20 group-focus-within:h-[2px] group-focus-within:bg-[var(--color-primary)] transition-all"></div>
                  <div className="flex justify-end mt-2">
                    <Link to="/admin/forgot-password" size="sm" className="font-sans text-[10px] font-bold uppercase tracking-widest text-[var(--color-on-surface-variant)]/60 hover:text-[var(--color-primary)] transition-colors">Recover Access</Link>
                  </div>
                </div>
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
                      <span>Authenticating...</span>
                    </>
                  ) : (
                    <>
                      <span>Sign In</span>
                      <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform" data-icon="arrow_forward">arrow_forward</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
          
          <div className="mt-8 text-center bg-transparent">
            <p className="font-sans text-[10px] uppercase tracking-[0.2em] text-[var(--color-on-surface-variant)]/60 bg-transparent">Restricted Enterprise Interface • Terminal 04-B</p>
          </div>
        </div>
      </main>

      <footer className="bg-[#002045] w-full py-12 px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-7xl mx-auto">
          <div>
            <span className="font-sans font-black text-[#fea619] text-xl">Ufedmill</span>
            <p className="text-white font-sans text-xs tracking-wide opacity-80 mt-4 max-w-sm">
              © 2026 Ufedmill. Architectural Precision in Motion. Providing the logistics infrastructure for the next generation of global industry.
            </p>
          </div>
          <div className="flex flex-wrap gap-x-8 gap-y-4 md:justify-end items-center">
            <Link className="text-slate-400 font-sans text-xs tracking-wide hover:text-[#fea619] transition-colors" to="#">Network Status</Link>
            <Link className="text-slate-400 font-sans text-xs tracking-wide hover:text-[#fea619] transition-colors" to="#">Global Terms</Link>
            <Link className="text-slate-400 font-sans text-xs tracking-wide hover:text-[#fea619] transition-colors" to="#">Privacy Protocol</Link>
            <Link className="text-slate-400 font-sans text-xs tracking-wide hover:text-[#fea619] transition-colors" to="#">Contact Command</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
