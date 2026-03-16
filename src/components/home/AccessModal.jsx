import React, { useState } from 'react';
import { api } from '@/api/apiClient';
import { useAuth } from '@/lib/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FileText } from 'lucide-react';
import { createPageUrl } from '@/utils';

export default function AccessModal({ onAccessGranted }) {
  const [view, setView] = useState('login'); // 'login' | 'register' | 'forgot'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();

  const reset = () => {
    setEmail(''); setPassword(''); setFirstName(''); setLastName('');
    setConfirmPassword(''); setError(''); setSuccess('');
  };

  const switchView = (v) => { reset(); setView(v); };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const userResult = await login(email.trim(), password);
      
      if (userResult.admin === 1) {
        window.location.href = createPageUrl('AdminDashboard');
      } else {
        if (onAccessGranted) onAccessGranted(userResult);
      }
    } catch (err) {
      setError(err.message || 'Incorrect email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    
    setLoading(true);
    try {
      const userResult = await register({
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        email: email.trim().toLowerCase(),
        password,
      });

      setSuccess('Registration complete. Your account is now under review. We will notify you via email regarding your status shortly.');
    } catch (err) {
      setError(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await api.post('/auth/forgot-password', { email: email.trim() });
      setSuccess(response.message || 'If an account exists, a reset link has been sent.');
    } catch (err) {
      setError(err.message || 'Failed to process request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-8">
        {/* Logo */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center mb-4">
            <FileText className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">
            {view === 'login' && 'Welcome'}
            {view === 'register' && 'Create Account'}
            {view === 'forgot' && 'Forgot Password'}
          </h2>
          <p className="text-slate-500 text-sm mt-1 text-center">
            {view === 'login' && 'Sign in to access the Code Violation Forms Directory.'}
            {view === 'register' && 'Register a new account to get started.'}
            {view === 'forgot' && "Enter your email and we'll send you your password."}
          </p>
        </div>

        {/* LOGIN */}
        {view === 'login' && (
          <form onSubmit={handleLogin} className="space-y-4">
            <Input type="email" placeholder="your@email.com" value={email} onChange={e => { setEmail(e.target.value); setError(''); }} required className="h-12 text-base" />
            <Input type="password" placeholder="Password" value={password} onChange={e => { setPassword(e.target.value); setError(''); }} required className="h-12 text-base" />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <Button type="submit" disabled={loading} className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-base">
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
            <div className="flex justify-between text-sm pt-1">
              <button type="button" onClick={() => switchView('forgot')} className="text-slate-500 hover:text-emerald-600 transition-colors">Forgot password?</button>
              <button type="button" onClick={() => switchView('register')} className="text-emerald-600 hover:text-emerald-700 font-medium transition-colors">Register</button>
            </div>
          </form>
        )}

        {/* REGISTER */}
        {view === 'register' && (
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Input placeholder="First name" value={firstName} onChange={e => setFirstName(e.target.value)} className="h-12" />
              <Input placeholder="Last name" value={lastName} onChange={e => setLastName(e.target.value)} className="h-12" />
            </div>
            <Input type="email" placeholder="your@email.com" value={email} onChange={e => { setEmail(e.target.value); setError(''); }} required className="h-12 text-base" />
            <Input type="password" placeholder="Password (min 6 chars)" value={password} onChange={e => { setPassword(e.target.value); setError(''); }} required className="h-12 text-base" />
            <Input type="password" placeholder="Confirm password" value={confirmPassword} onChange={e => { setConfirmPassword(e.target.value); setError(''); }} required className="h-12 text-base" />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            {success && <p className="text-emerald-600 text-sm">{success}</p>}
            <Button type="submit" disabled={loading} className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-base">
              {loading ? 'Creating account...' : 'Create Account'}
            </Button>
            <div className="text-center text-sm pt-1">
              <span className="text-slate-500">Already have an account? </span>
              <button type="button" onClick={() => switchView('login')} className="text-emerald-600 hover:text-emerald-700 font-medium">Sign in</button>
            </div>
          </form>
        )}

        {/* FORGOT PASSWORD */}
        {view === 'forgot' && (
          <form onSubmit={handleForgotPassword} className="space-y-4">
            <Input type="email" placeholder="your@email.com" value={email} onChange={e => { setEmail(e.target.value); setError(''); setSuccess(''); }} required className="h-12 text-base" />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            {success && <p className="text-emerald-600 text-sm">{success}</p>}
            <Button type="submit" disabled={loading} className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-base">
              {loading ? 'Sending...' : 'Send Password'}
            </Button>
            <div className="text-center text-sm pt-1">
              <button type="button" onClick={() => switchView('login')} className="text-slate-500 hover:text-emerald-600 transition-colors">Back to sign in</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}