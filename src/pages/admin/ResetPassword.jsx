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
      <main className="flex-grow flex items-center justify-center p-6 bg-[var(--color-surface-container-low)] relative overflow-hidden">
        <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[60%] bg-[var(--color-surface-container-high)] rounded-full blur-3xl opacity-40"></div>
        
        <div className="w-full max-w-[440px] z-10">
          <div className="bg-[var(--color-surface-container-lowest)] rounded-xl ambient-lift p-10 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-silk-gradient border-l-[4px] border-[var(--color-primary)]"></div>
            
            <div className="mb-10">
              <h1 className="font-sans text-[32px] font-black tracking-tight text-[var(--color-primary)] leading-tight mb-2">Reset Cipher</h1>
              <p className="font-body text-[var(--color-on-surface-variant)] text-sm tracking-wide">Establish a new access protocol for your institutional identity.</p>
            </div>

            {success ? (
              <div className="space-y-6 text-center animate-in fade-in duration-700">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="material-symbols-outlined text-green-600 text-3xl">verified</span>
                </div>
                <h2 className="text-2xl font-black text-[var(--color-primary)]">Cipher Updated</h2>
                <p className="text-[var(--color-on-surface-variant)]">Your new access protocol has been synchronized.</p>
                <div className="pt-4">
                  <p className="text-sm font-bold text-[var(--color-primary)]">
                    Redirecting to Command Access in <span className="text-xl">{countdown}</span>...
                  </p>
                </div>
              </div>
            ) : (
              <form className="space-y-8" onSubmit={handleSubmit}>
                {error && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                    <span className="material-symbols-outlined text-red-500 text-sm mt-0.5" data-icon="error">error</span>
                    <p className="text-red-600 text-sm font-medium">{error}</p>
                  </div>
                )}

                <div className="space-y-6">
                  <div className="group relative">
                    <label className="block font-sans text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-on-surface-variant)] mb-2 ml-1">New Access Cipher</label>
                    <div className="relative flex items-center">
                      <span className="material-symbols-outlined absolute left-0 text-[var(--color-primary-container)]/40 group-focus-within:text-[var(--color-primary)] transition-colors">lock</span>
                      <input
                        required
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-8 pr-4 py-3 outline-none bg-[var(--color-surface-container-high)] border-none border-b border-[var(--color-outline-variant)]/30 focus:ring-0 focus:bg-[var(--color-primary-fixed)]/30 transition-all font-body text-[var(--color-on-surface)] placeholder:text-[var(--color-on-surface-variant)]/40 rounded-t-lg"
                        placeholder="••••••••••••"
                      />
                    </div>
                  </div>

                  <div className="group relative">
                    <label className="block font-sans text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-on-surface-variant)] mb-2 ml-1">Confirm Cipher</label>
                    <div className="relative flex items-center">
                      <span className="material-symbols-outlined absolute left-0 text-[var(--color-primary-container)]/40 group-focus-within:text-[var(--color-primary)] transition-colors">lock_reset</span>
                      <input
                        required
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full pl-8 pr-4 py-3 outline-none bg-[var(--color-surface-container-high)] border-none border-b border-none focus:ring-0 focus:bg-[var(--color-primary-fixed)]/30 transition-all font-body text-[var(--color-on-surface)] placeholder:text-[var(--color-on-surface-variant)]/40 rounded-t-lg"
                        placeholder="••••••••••••"
                      />
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
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <span>Reset Password</span>
                        <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">update</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
