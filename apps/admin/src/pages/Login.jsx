import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white text-on-surface min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
      {/* Ambient Background */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
        <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] bg-primary/5 rounded-full blur-[120px]"></div>
        <div className="absolute -bottom-[20%] -right-[10%] w-[50%] h-[50%] bg-tertiary/5 rounded-full blur-[100px]"></div>
      </div>

      {/* Main Login */}
      <main className="relative z-10 w-full max-w-md px-6">
        {/* Brand */}
        <div className="text-center mb-10">
          <h1 className="font-headline text-4xl font-black tracking-tighter text-primary mb-2">
            Forest Wheel
          </h1>
          <p className="font-label text-xs uppercase tracking-[0.2em] text-on-surface-variant font-semibold">
            Management Portal
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-surface-container-low border border-outline-variant/30 rounded-xl shadow-xl overflow-hidden">
          {/* Header Image */}
          <div className="h-32 w-full relative overflow-hidden bg-gradient-to-br from-primary/20 to-tertiary/10">
            <div className="absolute inset-0 bg-gradient-to-t from-surface-container-low to-transparent"></div>
            <div className="absolute bottom-4 left-8">
              <h2 className="font-headline text-xl font-bold text-on-surface">Secure Access</h2>
            </div>
          </div>

          {/* Form */}
          <form className="p-8 space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-error-container/50 border border-error/20 text-on-error-container px-4 py-3 rounded-lg text-sm font-medium">
                {error}
              </div>
            )}

            {/* Email */}
            <div className="space-y-2 group">
              <label className="font-label text-[10px] font-bold uppercase tracking-widest text-on-surface-variant ml-1" htmlFor="email">
                Administrator Identity
              </label>
              <div className="relative bg-surface-container-highest/50 rounded-lg overflow-hidden transition-all duration-300 focus-within:ring-1 focus-within:ring-primary/40">
                <div className="absolute left-4 top-1/2 -translate-y-1/2">
                  <span className="material-symbols-outlined text-on-surface-variant text-lg">alternate_email</span>
                </div>
                <input
                  className="w-full bg-transparent border-none py-4 pl-12 pr-4 text-on-surface placeholder:text-outline focus:ring-0 text-sm font-medium"
                  id="email"
                  type="email"
                  placeholder="admin@forestwheel.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-primary transition-all duration-500 group-focus-within:w-full"></div>
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2 group">
              <label className="font-label text-[10px] font-bold uppercase tracking-widest text-on-surface-variant ml-1" htmlFor="password">
                Encrypted Credential
              </label>
              <div className="relative bg-surface-container-highest/50 rounded-lg overflow-hidden transition-all duration-300 focus-within:ring-1 focus-within:ring-primary/40">
                <div className="absolute left-4 top-1/2 -translate-y-1/2">
                  <span className="material-symbols-outlined text-on-surface-variant text-lg">lock</span>
                </div>
                <input
                  className="w-full bg-transparent border-none py-4 pl-12 pr-12 text-on-surface placeholder:text-outline focus:ring-0 text-sm font-medium"
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-primary transition-all duration-500 group-focus-within:w-full"></div>
                <button
                  type="button"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <span className="material-symbols-outlined text-lg">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              className="w-full bg-primary py-4 rounded-lg font-headline font-bold text-white tracking-wide shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:brightness-110 transition-all duration-200 uppercase text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              type="submit"
              disabled={loading}
            >
              {loading ? 'Authenticating...' : 'Initialize Session'}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="mt-12 flex items-center justify-center space-x-6">
          <p className="text-[10px] text-on-surface-variant font-medium font-label">v1.0.0 Stable Build</p>
        </div>
      </main>

      {/* Decorative Corner */}
      <div className="fixed bottom-10 left-10 hidden lg:block">
        <div className="flex flex-col">
          <span className="font-headline text-surface-container-highest font-black text-6xl select-none leading-none opacity-50">FOREST</span>
          <span className="font-headline text-surface-container-highest font-black text-6xl select-none leading-none ml-12 opacity-50">WHEEL</span>
        </div>
      </div>
    </div>
  );
}
