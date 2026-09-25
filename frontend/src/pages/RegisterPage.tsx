import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../hooks/storeHooks';
import { authService } from '../services/authService';
import { setCredentials } from '../store/slices/authSlice';
import { addToast } from '../store/slices/uiSlice';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { Brain, Mail, Lock, User as UserIcon, ShieldAlert, GraduationCap } from 'lucide-react';
import { Role } from '../types';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<Role>('USER');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await authService.register({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
        confirmPassword,
        role,
      });

      if (res.success) {
        dispatch(setCredentials({ user: res.data.user, token: res.data.token }));
        dispatch(addToast({ type: 'success', message: `Account created successfully as ${role === 'ADMIN' ? 'Administrator' : 'Student'}!` }));
        navigate(role === 'ADMIN' ? '/admin' : '/dashboard');
      } else {
        setError(res.message || 'Registration failed');
      }
    } catch (err: any) {
      console.error('Registration Error:', err);
      const serverMessage = err.response?.data?.message;
      const validationErrors = err.response?.data?.errors;

      if (Array.isArray(validationErrors) && validationErrors.length > 0) {
        setError(validationErrors.map((e: any) => e.message).join(' '));
      } else if (serverMessage) {
        setError(serverMessage);
      } else if (err.message) {
        setError(err.message);
      } else {
        setError('Registration failed. Please check backend connection.');
      }
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
          <h2 className="text-2xl font-black text-slate-900">Create TestHub Account</h2>
          <p className="text-xs text-slate-500">Join TestHub to access free practice tests & detailed analytics.</p>
        </div>

        {error && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-600 font-semibold leading-relaxed shadow-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Account Type / Role Selector */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700">Account Role</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole('USER')}
                className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                  role === 'USER'
                    ? 'bg-brand-50 border-brand-500 text-brand-700 ring-2 ring-brand-500/20'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <GraduationCap className="w-4 h-4" /> Student
              </button>
              <button
                type="button"
                onClick={() => setRole('ADMIN')}
                className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                  role === 'ADMIN'
                    ? 'bg-purple-50 border-purple-500 text-purple-700 ring-2 ring-purple-500/20'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <ShieldAlert className="w-4 h-4" /> Administrator
              </button>
            </div>
          </div>

          <Input
            label="Full Name"
            type="text"
            placeholder="Alex Johnson"
            value={name}
            onChange={(e) => setName(e.target.value)}
            leftIcon={<UserIcon className="w-4 h-4" />}
            required
          />

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
            placeholder="At least 6 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            leftIcon={<Lock className="w-4 h-4" />}
            required
          />

          <Input
            label="Confirm Password"
            type="password"
            placeholder="Re-enter password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            leftIcon={<Lock className="w-4 h-4" />}
            required
          />

          <Button type="submit" className="w-full" isLoading={loading}>
            Create {role === 'ADMIN' ? 'Admin' : 'Student'} Account
          </Button>
        </form>

        <div className="text-center text-xs text-slate-500 pt-2">
          Already registered?{' '}
          <Link to="/login" className="font-bold text-brand-600 hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};
