/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Mail } from 'lucide-react';
import { FormInput } from './components/FormInput';
import { AuthLayout } from './components/AuthLayout';
import { LoginForm } from './components/LoginForm';
import { SignupForm } from './components/SignupForm';

type AuthView = 'login' | 'signup' | 'forgot-password';

export default function App() {
  const [view, setView] = useState<AuthView>('login');

  const toggleView = () => setView(prev => (prev === 'login' ? 'signup' : 'login'));
  const showForgotPassword = () => setView('forgot-password');

  return (
    <AuthLayout 
      title={
        view === 'login' ? 'Welcome Back' : 
        view === 'signup' ? 'Get Started' : 
        'Reset Password'
      }
      subtitle={
        view === 'login' ? 'Please enter your details' : 
        view === 'signup' ? 'Create an account to explore' : 
        'Enter your email to receive a reset link'
      }
    >
      <AnimatePresence mode="wait">
        {view === 'login' && (
          <motion.div
            key="login"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <LoginForm 
              onToggleForm={toggleView} 
              onForgotPassword={showForgotPassword} 
            />
          </motion.div>
        )}
        {view === 'signup' && (
          <motion.div
            key="signup"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <SignupForm onToggleForm={toggleView} />
          </motion.div>
        )}
        {view === 'forgot-password' && (
          <motion.div
            key="forgot"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex flex-col gap-6"
          >
            <FormInput 
              label="Email Address" 
              type="email" 
              placeholder="you@example.com" 
              icon={<Mail size={20} />} 
            />
            <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3.5 rounded-xl font-bold transition-all shadow-lg shadow-indigo-200 dark:shadow-none">
              Send Reset Link
            </button>
            <button 
              onClick={() => setView('login')}
              className="text-slate-500 dark:text-slate-400 text-sm font-semibold hover:underline"
            >
              Back to Login
            </button>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Attribution / Footer info */}
      <div className="mt-12 pt-6 border-t border-slate-100 flex items-center justify-center gap-4 text-[10px] text-slate-400 uppercase tracking-widest font-semibold">
        <span>Secure</span>
        <div className="w-1 h-1 bg-slate-300 rounded-full" />
        <span>Encrypted</span>
        <div className="w-1 h-1 bg-slate-300 rounded-full" />
        <span>v2.0.4</span>
      </div>
    </AuthLayout>
  );
}

