import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAppDispatch } from '../hooks/storeHooks';
import { authService } from '../services/authService';
import { setCredentials } from '../store/slices/authSlice';
import { addToast } from '../store/slices/uiSlice';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { Brain, Mail, Lock } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const from = (location.state as any)?.from || '/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await authService.login({ email, password });
      if (res.success) {
        dispatch(setCredentials({ user: res.data.user, token: res.data.token }));
        dispatch(addToast({ type: 'success', message: `Welcome back, ${res.data.user.name}!` }));
        navigate(from, { replace: true });
      } else {
        setError(res.message || 'Login failed');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 bg-slate-50">
      <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200 p-8 shadow-sm space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-cyan-500 flex items-center justify-center text-white mx-auto shadow-md">
            <Brain className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-black text-slate-900">Sign in to TestHub</h2>
          <p className="text-xs text-slate-500">Access your practice tests, dashboard, and performance analytics.</p>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-600 font-medium">
            {error}
          </div>
        )}

        {/* Demo Login Credentials Box for Quick Testing */}
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs space-y-1 text-amber-900">
          <span className="font-bold block">Demo Credentials:</span>
          <div className="flex justify-between">
            <span>Demo Student: <strong>user@testhub.com</strong></span>
            <span>Pass: <strong>user123</strong></span>
          </div>
          <div className="flex justify-between">
            <span>Admin User: <strong>admin@testhub.com</strong></span>
            <span>Pass: <strong>admin123</strong></span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email Address"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            leftIcon={<Mail className="w-4 h-4" />}
            required
          />

          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            leftIcon={<Lock className="w-4 h-4" />}
            required
          />

          <Button type="submit" className="w-full" isLoading={loading}>
            Sign In
          </Button>
        </form>

        <div className="text-center text-xs text-slate-500 pt-2">
          Don't have an account?{' '}
          <Link to="/register" className="font-bold text-brand-600 hover:underline">
            Register Free
          </Link>
        </div>
      </div>
    </div>
  );
};
