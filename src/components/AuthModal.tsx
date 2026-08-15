'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { X, Lock, Mail, User, ShieldCheck, Store, UserCheck, ArrowRight, CheckCircle2, KeyRound } from 'lucide-react';
import { UserRole, User as UserType } from '@/types';

export const AuthModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { users, switchUserRole, setActiveTab } = useApp();

  const [mode, setMode] = useState<'login' | 'register' | 'verify'>('login');
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Registration state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regRole, setRegRole] = useState<'merchant' | 'buyer'>('buyer');
  const [verificationCode, setVerificationCode] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (usernameOrEmail === 'siris888' && password === 'Passw0rd') {
      switchUserRole('admin');
      setActiveTab('admin');
      onClose();
      return;
    }
    if (usernameOrEmail === 'marchant' && password === 'password123') {
      switchUserRole('merchant', 'mch-1');
      setActiveTab('merchant');
      onClose();
      return;
    }
    if (usernameOrEmail === 'buyer' && password === 'password123') {
      switchUserRole('buyer');
      setActiveTab('home');
      onClose();
      return;
    }

    const found = users.find(
      u => (u.username === usernameOrEmail || u.email === usernameOrEmail) && u.password === password
    );

    if (found) {
      switchUserRole(found.role, found.merchantId);
      setActiveTab(found.role === 'admin' ? 'admin' : found.role === 'merchant' ? 'merchant' : 'home');
      onClose();
    } else {
      setError('Invalid username/email or password. Please check your credentials or register.');
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName || !regEmail || !regPassword) {
      setError('Please fill in all registration fields.');
      return;
    }
    setMode('verify');
    setSuccessMsg(`Verification email dispatched to ${regEmail}. Please enter verification code '123456'.`);
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (verificationCode === '123456') {
      const newUser: UserType = {
        id: `usr-${Date.now()}`,
        name: regName,
        email: regEmail,
        username: regEmail.split('@')[0],
        password: regPassword,
        role: regRole,
        merchantId: regRole === 'merchant' ? `mch-${Date.now()}` : undefined,
        verified: true,
        joinedDate: new Date().toISOString().split('T')[0]
      };
      users.push(newUser);
      switchUserRole(regRole, newUser.merchantId);
      setActiveTab(regRole === 'merchant' ? 'merchant' : 'home');
      alert('Email verified successfully! Welcome to EthioParts.');
      onClose();
    } else {
      setError('Invalid verification code. Enter 123456 for simulation.');
    }
  };

  const handleGoogleRegistration = () => {
    const googleName = 'Google User (' + Math.floor(100 + Math.random() * 900) + ')';
    const googleEmail = 'googleuser' + Math.floor(1000 + Math.random() * 9000) + '@gmail.com';
    const newUser: UserType = {
      id: `usr-${Date.now()}`,
      name: googleName,
      email: googleEmail,
      username: googleEmail.split('@')[0],
      password: 'google-oauth-secure',
      role: regRole,
      merchantId: regRole === 'merchant' ? `mch-${Date.now()}` : undefined,
      verified: true,
      joinedDate: new Date().toISOString().split('T')[0]
    };
    users.push(newUser);
    switchUserRole(regRole, newUser.merchantId);
    setActiveTab(regRole === 'merchant' ? 'merchant' : 'home');
    alert(`Successfully registered and logged in with Google as ${googleEmail}!`);
    onClose();
  };

  const fillCredentials = (user: string, pass: string) => {
    setUsernameOrEmail(user);
    setPassword(pass);
    setError('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-6 animate-fadeIn">
        <div className="flex justify-between items-center border-b border-slate-800 pb-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Lock className="w-5 h-5 text-amber-500" />
            {mode === 'login' ? 'EthioParts Secure Login' : mode === 'register' ? 'Create New Account' : 'Email Verification'}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="p-3 bg-red-500/20 border border-red-500/40 text-red-300 text-xs rounded-xl">
            {error}
          </div>
        )}

        {/* LOGIN FORM */}
        {mode === 'login' && (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Username or Email</label>
              <input
                type="text"
                value={usernameOrEmail}
                onChange={e => setUsernameOrEmail(e.target.value)}
                placeholder="siris888, marchant, or buyer"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white text-xs focus:outline-none focus:border-amber-500 font-mono"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white text-xs focus:outline-none focus:border-amber-500"
                required
              />
            </div>

            {/* Quick Demo Credentials Assistant */}
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2">
              <span className="text-[11px] font-bold text-amber-400 block uppercase font-mono">Quick Demo Logins:</span>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  type="button"
                  onClick={() => fillCredentials('siris888', 'Passw0rd')}
                  className="px-2 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-lg text-[10px] font-medium border border-slate-800 transition text-center"
                >
                  Admin<br/><strong className="text-amber-400">siris888</strong>
                </button>
                <button
                  type="button"
                  onClick={() => fillCredentials('marchant', 'password123')}
                  className="px-2 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-lg text-[10px] font-medium border border-slate-800 transition text-center"
                >
                  Merchant<br/><strong className="text-amber-400">marchant</strong>
                </button>
                <button
                  type="button"
                  onClick={() => fillCredentials('buyer', 'password123')}
                  className="px-2 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-lg text-[10px] font-medium border border-slate-800 transition text-center"
                >
                  Buyer<br/><strong className="text-amber-400">buyer</strong>
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-xs transition shadow-lg shadow-amber-500/20"
            >
              Sign In to Account
            </button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => setMode('register')}
                className="text-xs text-amber-400 hover:underline"
              >
                Don't have an account? Register here
              </button>
            </div>
          </form>
        )}

        {/* REGISTER FORM */}
        {mode === 'register' && (
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
              <input
                type="text"
                value={regName}
                onChange={e => setRegName(e.target.value)}
                placeholder="Abebe Kebede"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white text-xs focus:outline-none focus:border-amber-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
              <input
                type="email"
                value={regEmail}
                onChange={e => setRegEmail(e.target.value)}
                placeholder="abebe@gmail.com"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white text-xs focus:outline-none focus:border-amber-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
              <input
                type="password"
                value={regPassword}
                onChange={e => setRegPassword(e.target.value)}
                placeholder="Create secure password"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white text-xs focus:outline-none focus:border-amber-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Select Account Role</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRegRole('buyer')}
                  className={`p-3 rounded-xl border text-center text-xs font-bold transition flex flex-col items-center gap-1.5 ${
                    regRole === 'buyer' ? 'bg-amber-500/10 border-amber-500 text-amber-300' : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  <UserCheck className="w-4 h-4 text-amber-500" />
                  Buyer Account
                </button>
                <button
                  type="button"
                  onClick={() => setRegRole('merchant')}
                  className={`p-3 rounded-xl border text-center text-xs font-bold transition flex flex-col items-center gap-1.5 ${
                    regRole === 'merchant' ? 'bg-amber-500/10 border-amber-500 text-amber-300' : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  <Store className="w-4 h-4 text-amber-500" />
                  Merchant Vendor
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-xs transition shadow-lg shadow-amber-500/20"
            >
              Continue & Verify Email
            </button>

            {/* Google Signup Simulation */}
            <button
              type="button"
              onClick={handleGoogleRegistration}
              className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-medium transition flex items-center justify-center gap-2 border border-slate-700"
            >
              <span className="font-bold text-amber-400">G</span> Sign up instantly with Google
            </button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => setMode('login')}
                className="text-xs text-slate-400 hover:text-white"
              >
                Already have an account? Sign In
              </button>
            </div>
          </form>
        )}

        {/* VERIFICATION FORM */}
        {mode === 'verify' && (
          <form onSubmit={handleVerify} className="space-y-4">
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs rounded-xl text-center">
              {successMsg}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Enter 6-digit Verification Code</label>
              <input
                type="text"
                value={verificationCode}
                onChange={e => setVerificationCode(e.target.value)}
                placeholder="123456"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-3 text-center text-white text-base font-mono tracking-widest focus:outline-none focus:border-amber-500"
                maxLength={6}
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-xs transition shadow-lg shadow-amber-500/20"
            >
              Verify & Complete Registration
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
