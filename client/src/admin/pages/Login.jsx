import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '../context/AuthContext';

// Login Validation Schema
const loginSchema = z.object({
  username: z.string().min(1, 'Username is required.'),
  password: z.string().min(1, 'Password is required.'),
});

export default function Login() {
  const { login, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [loginError, setLoginError] = useState('');

  const from = location.state?.from?.pathname || '/admin';

  // Redirect if already authenticated
  useEffect(() => {
    if (!loading && isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, loading, navigate, from]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    try {
      setLoginError('');
      const res = await login(data.username, data.password);
      if (res.success) {
        navigate(from, { replace: true });
      } else {
        setLoginError(res.message || 'Verification failed. Password or username incorrect.');
      }
    } catch (e) {
      setLoginError('Server connectivity interrupted. Please check network logs.');
    }
  };

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-background flex flex-col justify-center items-center gap-4">
        <div className="relative w-12 h-12">
          <div className="w-full h-full rounded-full border-[3px] border-primary/10 border-t-primary animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6 relative overflow-hidden">
      
      {/* Decorative center orb */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full radial-glow pointer-events-none opacity-30 blur-3xl z-0" />

      <div className="w-full max-w-md rounded-2xl glass-card border border-white/10 p-8 shadow-2xl relative z-10 space-y-8">
        
        {/* Header Title */}
        <div className="text-center">
          <h2 className="font-montserrat font-bold text-2xl text-white">
            Admin Panel Login
          </h2>
          <p className="font-mono text-xs text-primary mt-2">
            Panda Coders Portfolio
          </p>
        </div>

        {/* Status Messages */}
        {loginError && (
          <div className="p-4 bg-red-500/10 border border-red-500/30 text-red-500 rounded-xl text-xs flex items-center gap-2">
            <i className="fas fa-exclamation-triangle" />
            {loginError}
          </div>
        )}

        {/* Input Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          
          {/* Username */}
          <div className="space-y-2">
            <label htmlFor="username" className="mono-label text-[11px] text-tertiary">
              Username
            </label>
            <input
              id="username"
              type="text"
              placeholder="Enter administrator username"
              className={`w-full bg-surface-container border ${
                errors.username ? 'border-red-500' : 'border-white/10'
              } focus:border-primary/50 focus:outline-none rounded-xl px-4 py-3 text-on-surface text-sm transition-colors`}
              {...register('username')}
            />
            {errors.username && (
              <p className="text-red-500 text-xs font-mono">{errors.username.message}</p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label htmlFor="password" className="mono-label text-[11px] text-tertiary">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              className={`w-full bg-surface-container border ${
                errors.password ? 'border-red-500' : 'border-white/10'
              } focus:border-primary/50 focus:outline-none rounded-xl px-4 py-3 text-on-surface text-sm transition-colors`}
              {...register('password')}
            />
            {errors.password && (
              <p className="text-red-500 text-xs font-mono">{errors.password.message}</p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-primary text-on-primary font-semibold text-sm tracking-wide uppercase py-4 rounded-xl primary-glow hover:bg-white hover:text-background transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-on-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Verifying Credentials...
              </>
            ) : (
              <>
                <i className="fas fa-sign-in-alt font-medium" />
                Authenticate
              </>
            )}
          </button>
        </form>

        <div className="border-t border-white/5 pt-4 text-center">
          <button 
            type="button"
            onClick={() => navigate('/')}
            className="text-xs text-on-surface-variant hover:text-primary transition-colors inline-flex items-center gap-1 font-medium"
          >
            <i className="fas fa-arrow-left text-[9px]" /> Return to home site
          </button>
        </div>

      </div>

    </div>
  );
}
