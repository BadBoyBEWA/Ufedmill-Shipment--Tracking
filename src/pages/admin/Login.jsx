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
      console.error('Login error detail:', err);
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[var(--color-surface)] text-[var(--color-on-surface)] font-body selection:bg-[var(--color-secondary-fixed)] selection:text-[var(--color-on-secondary-fixed)] min-h-screen flex flex-col">
      <header className="bg-white/80 backdrop-blur-xl sticky top-0 z-50 shadow-sm border-b border-slate-100">
        <div className="flex justify-between items-center px-6 py-4 w-full max-w-7xl mx-auto">
          <Link to="/" className="font-sans font-black tracking-tighter text-[#002045] text-2xl">Ufedmill</Link>
          <nav className="hidden md:flex gap-8">
            <Link to="/" className="font-sans text-xs font-black uppercase tracking-widest text-[#43474e] hover:text-[#fea619] transition-all">Home</Link>
            <Link to="/tracking" className="font-sans text-xs font-black uppercase tracking-widest text-[#43474e] hover:text-[#fea619] transition-all">Tracking</Link>
          </nav>
          <Link to="/tracking" className="md:hidden flex items-center gap-2 text-[#002045]">
            <span className="material-symbols-outlined text-xl">query_stats</span>
          </Link>
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center p-4 md:p-8 bg-[var(--color-surface-container-low)] relative overflow-hidden">
        <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[60%] bg-[#002045]/5 rounded-full blur-3xl opacity-40"></div>
        <div className="absolute bottom-[-10%] right-[-5%] w-[30%] h-[50%] bg-[#fea619]/10 rounded-full blur-3xl opacity-30"></div>
        
        <div className="w-full max-w-[440px] z-10">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 p-6 md:p-10 relative overflow-hidden ring-1 ring-[#002045]/5">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-[#002045] to-[#fea619]"></div>
            
            <div className="mb-10 text-center md:text-left">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#855300] mb-2 block">SECURE TERMINAL</span>
              <h1 className="font-sans text-3xl md:text-4xl font-black tracking-tighter text-[#002045] mb-2 uppercase italic">Command Access</h1>
              <p className="font-body text-[#43474e] text-xs font-bold opacity-60">Enter institutional credentials to manage Ufedmill global assets.</p>
            </div>

            {/* Error message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                <span className="material-symbols-outlined text-red-500 text-sm mt-0.5">error</span>
                <p className="text-red-700 text-[10px] font-black uppercase tracking-wide leading-tight">{error}</p>
              </div>
            )}
            
            <form className="space-y-6" onSubmit={handleLogin}>
              <div className="space-y-4">
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
                
                <div className="space-y-2 group">
                  <label className="block font-sans text-[10px] font-black uppercase tracking-[0.2em] text-[#43474e] ml-1">Access Cipher</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg group-focus-within:text-[#002045] transition-colors">lock</span>
                    <input
                      required
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-12 pr-12 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-[#002045]/5 focus:bg-white focus:border-[#002045]/20 transition-all font-bold text-sm text-[#002045]"
                      placeholder="••••••••••••"
                    />
                    <button
                      type="button"
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#002045] transition-colors"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      <span className="material-symbols-outlined text-lg">
                        {showPassword ? 'visibility_off' : 'visibility'}
                      </span>
                    </button>
                  </div>
                  <div className="flex justify-end pt-1">
                    <Link to="/admin/forgot-password" size="sm" className="text-[9px] font-black uppercase tracking-widest text-[#43474e]/60 hover:text-[#fea619] transition-colors">Recover Access</Link>
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
                      <span>Authenticating...</span>
                    </>
                  ) : (
                    <>
                      <span>Secure Login</span>
                      <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
          
          <div className="mt-8 text-center flex flex-col gap-2">
            <p className="text-[9px] uppercase tracking-[0.3em] font-black text-[#43474e]/40">Restricted Enterprise Interface</p>
            <div className="flex justify-center gap-4 text-[8px] font-bold text-slate-300 uppercase tracking-widest">
              <span>Terminal 04-B</span>
              <span>•</span>
              <span>E2E Encrypted</span>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-[#002045] w-full py-8 md:py-12 px-6 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-7xl mx-auto items-center">
          <div className="text-center md:text-left">
            <span className="font-sans font-black text-[#fea619] text-xl">Ufedmill</span>
            <p className="text-white text-[10px] font-bold tracking-widest opacity-40 uppercase mt-2">Architectural Precision in Motion</p>
          </div>
          <div className="flex flex-wrap justify-center md:justify-end gap-x-6 gap-y-3">
            <Link className="text-slate-400 text-[10px] font-black uppercase tracking-widest hover:text-[#fea619] transition-colors" to="#">Network Status</Link>
            <Link className="text-slate-400 text-[10px] font-black uppercase tracking-widest hover:text-[#fea619] transition-colors" to="#">Global Terms</Link>
            <Link className="text-slate-400 text-[10px] font-black uppercase tracking-widest hover:text-[#fea619] transition-colors" to="#">Support</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
