import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Mail, 
  Lock, 
  Phone, 
  ArrowRight, 
  CheckCircle2, 
  RefreshCw, 
  Smartphone, 
  ShieldAlert, 
  KeyRound, 
  Globe, 
  Sparkles,
  ArrowLeft
} from 'lucide-react';

interface AuthPageProps {
  initialMode?: 'login' | 'signup';
  onAuthComplete: (userEmail: string, mobilePhone: string) => void;
  onBackToLanding: () => void;
}

export default function AuthPage({ 
  initialMode = 'signup', 
  onAuthComplete,
  onBackToLanding 
}: AuthPageProps) {
  const [mode, setMode] = useState<'login' | 'signup' | 'verify_email' | 'verify_mobile'>(
    initialMode === 'login' ? 'login' : 'signup'
  );

  // Form States
  const [email, setEmail] = useState('compliance@aetheriapay.in');
  const [phone, setPhone] = useState('9820144892');
  const [password, setPassword] = useState('Aetheria#Pass2026');
  const [confirmPassword, setConfirmPassword] = useState('Aetheria#Pass2026');
  const [acceptTerms, setAcceptTerms] = useState(true);
  const [rememberMe, setRememberMe] = useState(true);

  // OTP States
  const [emailOtp, setEmailOtp] = useState(['8', '8', '4', '9', '2', '1']);
  const [mobileOtp, setMobileOtp] = useState(['9', '4', '0', '1', '1', '2']);
  const [timer, setTimer] = useState(30);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Timer countdown
  useEffect(() => {
    let interval: any = null;
    if ((mode === 'verify_email' || mode === 'verify_mobile') && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [mode, timer]);

  // Login Submit
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    if (!email || !password) {
      setErrorMessage("Please enter both business email and password.");
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      // Skip straight to onboarding or complete
      onAuthComplete(email, phone);
    }, 800);
  };

  // Sign Up Submit -> go to Email Verification
  const handleSignUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    if (!email || !phone || !password || !confirmPassword) {
      setErrorMessage("Please fill in all required fields.");
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }
    if (!acceptTerms) {
      setErrorMessage("You must accept the Terms and Privacy Policy.");
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setMode('verify_email');
      setTimer(30);
    }, 800);
  };

  // Verify Email OTP
  const handleVerifyEmail = () => {
    const code = emailOtp.join('');
    if (code.length < 6) {
      setErrorMessage("Please enter complete 6-digit OTP.");
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setMode('verify_mobile');
      setTimer(30);
      setErrorMessage(null);
    }, 800);
  };

  // Verify Mobile OTP -> Redirect to Onboarding
  const handleVerifyMobile = () => {
    const code = mobileOtp.join('');
    if (code.length < 6) {
      setErrorMessage("Please enter complete 6-digit Mobile OTP.");
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onAuthComplete(email, phone);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden font-sans">
      {/* Background glow effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Top Back Navigation */}
      <div className="absolute top-6 left-6">
        <button 
          onClick={onBackToLanding}
          className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white bg-slate-900 border border-slate-800 px-3.5 py-2 rounded-xl transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Rayvaanah Landing
        </button>
      </div>

      <div className="w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-2xl p-8 shadow-2xl shadow-emerald-950/40 relative z-10 backdrop-blur-md">
        
        {/* Header Logo */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center justify-center text-emerald-400 mb-3 shadow-inner">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">
            Rayvaanah Merchant OS
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {mode === 'login' && "Enterprise Gateway & Nodal Escrow Portal"}
            {mode === 'signup' && "Register Business Account for India's Payment OS"}
            {mode === 'verify_email' && "Step 1 of 2: Verify Corporate Email"}
            {mode === 'verify_mobile' && "Step 2 of 2: Verify Mobile Number"}
          </p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-6 bg-red-950/80 border border-red-500/30 text-red-200 text-xs p-3.5 rounded-xl flex items-start gap-2.5">
            <ShieldAlert className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* MODE: LOGIN */}
        {mode === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-medium mb-1.5">Business Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="compliance@yourcompany.com"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-slate-300 font-medium">Password</label>
                <a href="#" className="text-emerald-400 hover:underline text-[11px]">Forgot password?</a>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] pt-1">
              <label className="flex items-center gap-2 text-slate-400 cursor-pointer select-none">
                <input 
                  type="checkbox" 
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-700 text-emerald-500 focus:ring-0 w-3.5 h-3.5 bg-slate-950" 
                />
                <span>Remember this device</span>
              </label>

              <span className="text-emerald-400/80 font-mono text-[10px] flex items-center gap-1">
                <KeyRound className="w-3 h-3" />
                MFA Ready
              </span>
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 text-xs shadow-lg shadow-emerald-500/20 mt-2 cursor-pointer"
            >
              {isLoading ? (
                <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
              ) : (
                <>
                  <span>Sign In to Merchant OS</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            {/* Social / Future SSO */}
            <div className="pt-4 text-center">
              <span className="text-[10px] text-slate-500 uppercase tracking-widest bg-slate-900 px-2 relative z-10">Or Continue With</span>
              <div className="border-t border-slate-800 -mt-2.5 mb-4" />

              <div className="grid grid-cols-2 gap-3 text-slate-300">
                <button type="button" className="bg-slate-950 hover:bg-slate-800 border border-slate-800 py-2 rounded-xl text-[11px] font-medium flex items-center justify-center gap-2">
                  <Globe className="w-3.5 h-3.5 text-blue-400" />
                  Google Workspace
                </button>
                <button type="button" className="bg-slate-950 hover:bg-slate-800 border border-slate-800 py-2 rounded-xl text-[11px] font-medium flex items-center justify-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  Enterprise SSO
                </button>
              </div>
            </div>

            <div className="text-center pt-2">
              <span className="text-slate-400 text-xs">Don't have an account? </span>
              <button 
                type="button" 
                onClick={() => { setMode('signup'); setErrorMessage(null); }} 
                className="text-emerald-400 font-bold hover:underline"
              >
                Create Account
              </button>
            </div>
          </form>
        )}

        {/* MODE: CREATE ACCOUNT */}
        {mode === 'signup' && (
          <form onSubmit={handleSignUpSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Official Business Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="compliance@company.com"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Authorized Mobile Number (+91)</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input 
                  type="tel" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="98201 44892"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Password</label>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-100 focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-300 font-medium mb-1">Confirm Password</label>
                <input 
                  type="password" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-100 focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>
            </div>

            <div className="pt-1">
              <label className="flex items-start gap-2.5 text-slate-400 cursor-pointer select-none text-[11px] leading-relaxed">
                <input 
                  type="checkbox" 
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  className="rounded border-slate-700 text-emerald-500 focus:ring-0 w-4 h-4 mt-0.5 bg-slate-950 shrink-0" 
                />
                <span>
                  I accept the <a href="#" className="text-emerald-400 underline">Merchant Terms of Service</a>, <a href="#" className="text-emerald-400 underline">RBI PA/PG Escrow Mandate</a>, and <a href="#" className="text-emerald-400 underline">Privacy Policy</a>.
                </span>
              </label>
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 text-xs shadow-lg shadow-emerald-500/20 mt-2 cursor-pointer"
            >
              {isLoading ? (
                <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
              ) : (
                <>
                  <span>Create Account & Verify</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="text-center pt-2">
              <span className="text-slate-400 text-xs">Already registered? </span>
              <button 
                type="button" 
                onClick={() => { setMode('login'); setErrorMessage(null); }} 
                className="text-emerald-400 font-bold hover:underline"
              >
                Sign In Here
              </button>
            </div>
          </form>
        )}

        {/* MODE: VERIFY EMAIL OTP */}
        {mode === 'verify_email' && (
          <div className="space-y-5 text-xs text-center">
            <div className="p-3 bg-emerald-950/60 border border-emerald-500/30 rounded-xl text-emerald-300 text-xs leading-relaxed">
              Verification code sent to <strong className="text-white">{email}</strong>
            </div>

            <p className="text-slate-300 font-medium">Enter the 6-digit security OTP:</p>

            <div className="flex justify-center gap-2">
              {emailOtp.map((digit, idx) => (
                <input 
                  key={idx}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => {
                    const newOtp = [...emailOtp];
                    newOtp[idx] = e.target.value.slice(-1);
                    setEmailOtp(newOtp);
                  }}
                  className="w-10 h-12 bg-slate-950 border border-slate-700 rounded-xl text-center text-lg font-mono font-bold text-emerald-400 focus:outline-none focus:border-emerald-500"
                />
              ))}
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2">
              <span>Resend in: <strong className="text-emerald-400 font-mono">{timer}s</strong></span>
              <button 
                type="button" 
                onClick={() => setEmailOtp(['8', '8', '4', '9', '2', '1'])}
                className="text-xs font-semibold text-emerald-400 hover:underline flex items-center gap-1"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Auto-Fill Valid OTP (884-921)
              </button>
            </div>

            <button 
              type="button"
              onClick={handleVerifyEmail}
              disabled={isLoading}
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 text-xs shadow-lg shadow-emerald-500/20 cursor-pointer"
            >
              {isLoading ? (
                <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
              ) : (
                <>
                  <span>Verify Email & Proceed to Mobile</span>
                  <CheckCircle2 className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        )}

        {/* MODE: VERIFY MOBILE OTP */}
        {mode === 'verify_mobile' && (
          <div className="space-y-5 text-xs text-center">
            <div className="p-3 bg-teal-950/60 border border-teal-500/30 rounded-xl text-teal-300 text-xs leading-relaxed">
              SMS Security code dispatched to <strong className="text-white">+91 {phone}</strong>
            </div>

            <p className="text-slate-300 font-medium">Enter the 6-digit SMS OTP:</p>

            <div className="flex justify-center gap-2">
              {mobileOtp.map((digit, idx) => (
                <input 
                  key={idx}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => {
                    const newOtp = [...mobileOtp];
                    newOtp[idx] = e.target.value.slice(-1);
                    setMobileOtp(newOtp);
                  }}
                  className="w-10 h-12 bg-slate-950 border border-slate-700 rounded-xl text-center text-lg font-mono font-bold text-teal-300 focus:outline-none focus:border-teal-500"
                />
              ))}
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2">
              <span>Resend SMS in: <strong className="text-teal-400 font-mono">{timer}s</strong></span>
              <button 
                type="button" 
                onClick={() => setMobileOtp(['9', '4', '0', '1', '1', '2'])}
                className="text-xs font-semibold text-teal-400 hover:underline flex items-center gap-1"
              >
                <Smartphone className="w-3.5 h-3.5" />
                Auto-Read SMS OTP (940-112)
              </button>
            </div>

            <button 
              type="button"
              onClick={handleVerifyMobile}
              disabled={isLoading}
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 text-xs shadow-lg shadow-emerald-500/20 cursor-pointer"
            >
              {isLoading ? (
                <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
              ) : (
                <>
                  <span>Complete Verification & Launch Wizard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        )}

        {/* Security Footer Note */}
        <div className="mt-8 pt-4 border-t border-slate-800 text-center text-[10px] text-slate-500 flex items-center justify-center gap-2">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Encrypted with 256-bit AES • RBI PA/PG Nodal Vault Security</span>
        </div>

      </div>
    </div>
  );
}
