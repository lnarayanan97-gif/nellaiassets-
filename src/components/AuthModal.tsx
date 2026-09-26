import React, { useState } from 'react';
import { 
  X, 
  Mail, 
  Lock, 
  User, 
  Phone, 
  MapPin, 
  Building2, 
  Briefcase, 
  CheckCircle2,
  AlertCircle,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import { NellaiAssetsLogo } from './NellaiAssetsLogo';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'signup';
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, initialMode = 'login' }) => {
  const { login, signup, resetPassword } = useAuth();
  
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>(initialMode);
  const [role, setRole] = useState<UserRole>('buyer');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('Tirunelveli');
  const [agencyName, setAgencyName] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    try {
      if (mode === 'login') {
        await login(email, password);
        onClose();
      } else if (mode === 'signup') {
        if (!displayName.trim() || !phone.trim()) {
          setErrorMsg('Please enter your full name and mobile number.');
          setLoading(false);
          return;
        }
        await signup({
          email,
          pass: password,
          displayName,
          role,
          phone,
          whatsapp: phone,
          city,
          district: 'Tirunelveli',
          agencyName: agencyName || undefined,
        });
        onClose();
      } else if (mode === 'forgot') {
        await resetPassword(email);
        setSuccessMsg('Password reset link sent to your email inbox.');
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setErrorMsg('Invalid email or password. Please verify credentials.');
      } else if (err.code === 'auth/email-already-in-use') {
        setErrorMsg('An account with this email already exists.');
      } else {
        setErrorMsg(err.message || 'Authentication failed. Please retry.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative border border-stone-200 animate-in fade-in zoom-in-95 duration-200 max-h-[92vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header with Official Brand Logo */}
        <div className="flex flex-col items-center text-center mb-6">
          <NellaiAssetsLogo size="md" showTagline={true} />
          <h2 className="text-xl font-serif font-black text-[#18352A] mt-4">
            {mode === 'login' ? 'Sign In to Your Account' : mode === 'signup' ? 'Create Nellai Assets Account' : 'Reset Password'}
          </h2>
          <p className="text-xs text-stone-500 mt-1 max-w-xs">
            {mode === 'login'
              ? 'Access your saved properties, leads and listings'
              : mode === 'signup'
              ? 'Join Tirunelveli’s premier real-estate discovery and advisory platform'
              : 'Enter your registered email to receive recovery instructions'}
          </p>
        </div>

        {/* Privacy Note */}
        <div className="mb-4 p-2.5 rounded-xl bg-[#F8F9F6] border border-stone-200 text-[11px] text-stone-600 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#123F2B] shrink-0" />
          <span>Your contact information is strictly protected and never shared without consent.</span>
        </div>

        {/* Alerts */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Sign up Role Selector */}
          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-bold text-stone-600 mb-1.5 uppercase tracking-wider">
                Select Your Account Type *
              </label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setRole('buyer')}
                  className={`p-2.5 rounded-xl border text-left font-bold transition-all cursor-pointer ${
                    role === 'buyer' 
                      ? 'bg-emerald-50 border-[#123F2B] text-[#123F2B]' 
                      : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                  }`}
                >
                  🏡 Buyer / Investor
                </button>
                <button
                  type="button"
                  onClick={() => setRole('seller')}
                  className={`p-2.5 rounded-xl border text-left font-bold transition-all cursor-pointer ${
                    role === 'seller' 
                      ? 'bg-emerald-50 border-[#123F2B] text-[#123F2B]' 
                      : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                  }`}
                >
                  🔑 Property Owner
                </button>
                <button
                  type="button"
                  onClick={() => setRole('agent')}
                  className={`p-2.5 rounded-xl border text-left font-bold transition-all cursor-pointer ${
                    role === 'agent' 
                      ? 'bg-emerald-50 border-[#123F2B] text-[#123F2B]' 
                      : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                  }`}
                >
                  💼 Real Estate Agent
                </button>
                <button
                  type="button"
                  onClick={() => setRole('builder')}
                  className={`p-2.5 rounded-xl border text-left font-bold transition-all cursor-pointer ${
                    role === 'builder' 
                      ? 'bg-emerald-50 border-[#123F2B] text-[#123F2B]' 
                      : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                  }`}
                >
                  🏗️ Builder / Promoter
                </button>
              </div>
            </div>
          )}

          {/* Full Name (Sign Up only) */}
          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-bold text-stone-600 mb-1">Full Name *</label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="text"
                  required
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="e.g. Sundararajan M."
                  className="w-full bg-[#F5F6F3] border border-stone-300 rounded-xl pl-9 pr-3 py-2 text-xs font-medium text-stone-800 focus:outline-emerald-800"
                />
              </div>
            </div>
          )}

          {/* Mobile Phone (Sign Up only) */}
          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-bold text-stone-600 mb-1">Mobile / WhatsApp Number *</label>
              <div className="relative">
                <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 94431 00000"
                  className="w-full bg-[#F5F6F3] border border-stone-300 rounded-xl pl-9 pr-3 py-2 text-xs font-medium text-stone-800 focus:outline-emerald-800"
                />
              </div>
              <p className="text-[10px] text-stone-400 mt-1">Used for OTP and advisory updates. Kept strictly confidential.</p>
            </div>
          )}

          {/* Email */}
          <div>
            <label className="block text-xs font-bold text-stone-600 mb-1">Email Address *</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full bg-[#F5F6F3] border border-stone-300 rounded-xl pl-9 pr-3 py-2 text-xs font-medium text-stone-800 focus:outline-emerald-800"
              />
            </div>
          </div>

          {/* Password (Login and Signup) */}
          {mode !== 'forgot' && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-stone-600">Password *</label>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => setMode('forgot')}
                    className="text-[11px] font-bold text-emerald-800 hover:underline"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#F5F6F3] border border-stone-300 rounded-xl pl-9 pr-3 py-2 text-xs font-medium text-stone-800 focus:outline-emerald-800"
                />
              </div>
            </div>
          )}

          {/* Builder or Agency Name */}
          {mode === 'signup' && (role === 'agent' || role === 'builder') && (
            <div>
              <label className="block text-xs font-bold text-stone-600 mb-1">Agency / Real Estate Firm Name</label>
              <div className="relative">
                <Briefcase className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="text"
                  value={agencyName}
                  onChange={(e) => setAgencyName(e.target.value)}
                  placeholder="e.g. Tamirabarani Promoters"
                  className="w-full bg-[#F5F6F3] border border-stone-300 rounded-xl pl-9 pr-3 py-2 text-xs font-medium text-stone-800 focus:outline-emerald-800"
                />
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-[#123F2B] hover:bg-[#1a553a] text-white font-bold text-xs shadow-md transition-all cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Processing...
              </span>
            ) : mode === 'login' ? (
              'Sign In'
            ) : mode === 'signup' ? (
              'Register Account'
            ) : (
              'Send Password Reset Link'
            )}
          </button>
        </form>

        {/* Footer switchers */}
        <div className="mt-6 pt-4 border-t border-stone-100 text-center text-xs text-stone-500">
          {mode === 'login' ? (
            <p>
              Don't have an account yet?{' '}
              <button
                type="button"
                onClick={() => setMode('signup')}
                className="font-bold text-[#123F2B] hover:underline"
              >
                Sign up now
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => setMode('login')}
                className="font-bold text-[#123F2B] hover:underline"
              >
                Sign in here
              </button>
            </p>
          )}
        </div>

      </div>
    </div>
  );
};
