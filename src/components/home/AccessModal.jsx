import React, { useState } from 'react';
import { api } from '@/api/apiClient';
import { useAuth } from '@/lib/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FileText, ShieldCheck, XCircle } from 'lucide-react';
import { createPageUrl } from '@/utils';

export default function AccessModal({ onAccessGranted }) {
  const [view, setView] = useState('login'); // 'login' | 'gate' | 'gate-denied' | 'register' | 'forgot'
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
            {view === 'gate' && 'Membership Check'}
            {view === 'gate-denied' && 'Access Required'}
            {view === 'register' && 'Create Account'}
            {view === 'forgot' && 'Forgot Password'}
          </h2>
          <p className="text-slate-500 text-sm mt-1 text-center">
            {view === 'login' && 'Sign in to access the Code Violation Forms Directory.'}
            {view === 'gate' && 'Please confirm before proceeding.'}
            {view === 'gate-denied' && 'Membership is required to register.'}
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
              <button type="button" onClick={() => switchView('gate')} className="text-emerald-600 hover:text-emerald-700 font-medium transition-colors">Register</button>
            </div>
          </form>
        )}

        {/* GATE - Membership Check */}
        {view === 'gate' && (
          <div className="space-y-5">
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 text-center">
              <ShieldCheck className="w-10 h-10 text-emerald-600 mx-auto mb-3" />
              <p className="text-slate-800 font-semibold text-lg leading-snug">
                Are you a member of the Gov List Millionaire course in Skool?
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Button
                type="button"
                onClick={() => switchView('register')}
                className="h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-base"
              >
                Yes, I am
              </Button>
              <Button
                type="button"
                onClick={() => switchView('gate-denied')}
                variant="outline"
                className="h-12 border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-base"
              >
                No
              </Button>
            </div>
            <div className="text-center text-sm pt-1">
              <button type="button" onClick={() => switchView('login')} className="text-slate-500 hover:text-emerald-600 transition-colors">Back to sign in</button>
            </div>
          </div>
        )}

        {/* GATE DENIED - Not a member */}
        {view === 'gate-denied' && (
          <div className="space-y-5">
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 text-center">
              <XCircle className="w-10 h-10 text-amber-500 mx-auto mb-3" />
              <p className="text-slate-800 font-medium text-base leading-relaxed">
                If you want access, you should be part of the Gov List Millionaire course.
              </p>
              <a
                href="https://www.skool.com/wholesailors/classroom/6b2157d8"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-4 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-lg hover:from-emerald-600 hover:to-teal-600 transition-all shadow-md hover:shadow-lg"
              >
                Join the Course on Skool →
              </a>
            </div>
            <div className="text-center text-sm pt-1">
              <button type="button" onClick={() => switchView('login')} className="text-slate-500 hover:text-emerald-600 transition-colors">Back to sign in</button>
            </div>
          </div>
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