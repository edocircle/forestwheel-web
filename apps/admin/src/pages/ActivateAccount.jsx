import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../lib/api';

export default function ActivateAccount() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [step, setStep] = useState('activating'); // activating, set-password, done, error
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Activate the account
    api.post(`/auth/activate/${token}`)
      .then((res) => {
        setEmail(res.data.email);
        setStep('set-password');
      })
      .catch((err) => {
        setError(err.response?.data?.error || 'Invalid or expired activation link.');
        setStep('error');
      });
  }, [token]);

  const handleSetPassword = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setLoading(true);
    setError('');
    try {
      await api.post('/auth/set-password', { email, password });
      setStep('done');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to set password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md px-6">
        <div className="text-center mb-10">
          <h1 className="font-headline text-4xl font-black tracking-tighter text-primary mb-2">Forest Wheel</h1>
          <p className="font-label text-xs uppercase tracking-[0.2em] text-on-surface-variant font-semibold">Account Activation</p>
        </div>

        <div className="bg-white border border-outline-variant/30 rounded-xl shadow-xl p-8">
          {step === 'activating' && (
            <div className="text-center py-8">
              <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-on-surface-variant">Activating your account...</p>
            </div>
          )}

          {step === 'set-password' && (
            <form onSubmit={handleSetPassword} className="space-y-6">
              <div className="text-center mb-4">
                <span className="material-symbols-outlined text-primary text-4xl mb-2 block">check_circle</span>
                <h2 className="font-headline text-xl font-bold">Account Activated!</h2>
                <p className="text-sm text-on-surface-variant mt-1">Now set your password to complete setup.</p>
              </div>

              {error && (
                <div className="bg-error-container/50 text-on-error-container px-4 py-3 rounded-lg text-sm">{error}</div>
              )}

              <div className="space-y-2">
                <label className="block text-[10px] uppercase font-bold tracking-widest text-on-surface-variant">New Password</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8}
                  className="w-full bg-surface-container-low border-none rounded-lg px-4 py-4 focus:ring-2 focus:ring-primary/20"
                  placeholder="Minimum 8 characters" />
              </div>

              <div className="space-y-2">
                <label className="block text-[10px] uppercase font-bold tracking-widest text-on-surface-variant">Confirm Password</label>
                <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required
                  className="w-full bg-surface-container-low border-none rounded-lg px-4 py-4 focus:ring-2 focus:ring-primary/20"
                  placeholder="Re-enter password" />
              </div>

              <button type="submit" disabled={loading} className="w-full bg-primary text-white py-4 rounded-lg font-bold uppercase tracking-widest text-sm shadow-lg shadow-primary/20 hover:brightness-110 disabled:opacity-50">
                {loading ? 'Setting...' : 'Set Password'}
              </button>
            </form>
          )}

          {step === 'done' && (
            <div className="text-center py-8">
              <span className="material-symbols-outlined text-green-500 text-5xl mb-4 block">verified</span>
              <h2 className="font-headline text-xl font-bold mb-2">All Set!</h2>
              <p className="text-on-surface-variant mb-6">Your account is ready. You can now log in.</p>
              <button onClick={() => navigate('/login')} className="w-full bg-primary text-white py-4 rounded-lg font-bold uppercase tracking-widest text-sm shadow-lg shadow-primary/20">
                Go to Login
              </button>
            </div>
          )}

          {step === 'error' && (
            <div className="text-center py-8">
              <span className="material-symbols-outlined text-error text-5xl mb-4 block">error</span>
              <h2 className="font-headline text-xl font-bold mb-2">Activation Failed</h2>
              <p className="text-on-surface-variant mb-6">{error}</p>
              <button onClick={() => navigate('/login')} className="text-primary font-bold hover:underline text-sm uppercase tracking-widest">
                Back to Login
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
