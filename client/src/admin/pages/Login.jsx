import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiEye, FiEyeOff, FiLock, FiMail } from 'react-icons/fi';
import { useForm } from 'react-hook-form';
import useAuth from '../hooks/useAuth.js';
import ButtonSpinner from '../components/ui/ButtonSpinner.jsx';

export const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await login(data.email, data.password);
      navigate('/admin');
    } catch (err) {
      // Toast handles error notifications inside context
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FCFBF8] flex items-center justify-center p-6 text-[#1E1E1B] font-sans">
      <div className="w-full max-w-md bg-[#FFFFFF] border border-[#ECE7DF] rounded-xl p-8 shadow-xs">
        
        {/* Branding header */}
        <div className="text-center mb-8">
          <h1 className="font-headings text-2xl font-bold tracking-tight uppercase mb-1">
            <span className="text-[#B56A45]">Mhatre</span> Traders
          </h1>
          <p className="text-[10px] uppercase tracking-widest text-[#676767] font-semibold">Administrative Access</p>
        </div>

        {/* Input form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          
          {/* Email block */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Email Address</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-400">
                <FiMail className="w-4 h-4" />
              </span>
              <input
                type="email"
                placeholder="admin@mhatretraders.com"
                autoComplete="email"
                {...register('email', { 
                  required: 'Email address is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Please enter a valid email address'
                  }
                })}
                className={`w-full pl-9 pr-4 py-2 bg-[#FCFBF8] border rounded-lg focus:outline-hidden focus:border-[#B56A45] text-sm transition-colors ${
                  errors.email ? 'border-red-500' : 'border-[#ECE7DF]'
                }`}
              />
            </div>
            {errors.email && (
              <span className="text-xs text-red-500">{errors.email.message}</span>
            )}
          </div>

          {/* Password block */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Password</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-400">
                <FiLock className="w-4 h-4" />
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                autoComplete="current-password"
                {...register('password', { required: 'Password is required' })}
                className={`w-full pl-9 pr-9 py-2 bg-[#FCFBF8] border rounded-lg focus:outline-hidden focus:border-[#B56A45] text-sm transition-colors ${
                  errors.password ? 'border-red-500' : 'border-[#ECE7DF]'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-400 hover:text-zinc-600"
              >
                {showPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && (
              <span className="text-xs text-red-500">{errors.password.message}</span>
            )}
          </div>

          {/* Action Trigger */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-[#B56A45] hover:bg-[#A05C39] disabled:bg-zinc-300 text-[#FFFFFF] text-xs font-bold uppercase tracking-widest py-3 rounded-lg cursor-pointer transition-colors shadow-xs"
          >
            {loading ? (
              <>
                <ButtonSpinner />
                <span>Signing In...</span>
              </>
            ) : (
              <span>Sign In</span>
            )}
          </button>
          
        </form>
      </div>
    </div>
  );
};

export default Login;
