import React, { useState, useRef, useEffect } from 'react';
import { Mail, Lock, User, UserPlus, Loader2, Camera } from 'lucide-react';
import { motion } from 'motion/react';
import Lottie from 'lottie-react';
import { FormInput } from './FormInput';
import { SignupFormData, FormErrors } from '../types';

interface SignupFormProps {
  onToggleForm: () => void;
}

export function SignupForm({ onToggleForm }: SignupFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState<SignupFormData>({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    avatar: '',
  });
  const [errors, setErrors] = useState<FormErrors<SignupFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [successAnimation, setSuccessAnimation] = useState<any>(null);

  useEffect(() => {
    fetch('https://lottie.host/df6b3250-9377-4ae9-a169-ca18f4a6e4d6/vY6eQoZ5kK.json')
      .then(res => res.json())
      .then(data => setSuccessAnimation(data));
  }, []);

  const validate = (): boolean => {
    const newErrors: FormErrors<SignupFormData> = {};
    if (!formData.username.trim()) {
      newErrors.username = { message: 'Username is required' };
    } else if (formData.username.length < 3) {
      newErrors.username = { message: 'Username must be at least 3 characters' };
    }

    if (!formData.email) {
      newErrors.email = { message: 'Email is required' };
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = { message: 'Please enter a valid email address' };
    }

    if (!formData.password) {
      newErrors.password = { message: 'A secure password is required' };
    } else if (formData.password.length < 8) {
      newErrors.password = { message: 'Must be at least 8 characters long' };
    } else if (!/[0-9]/.test(formData.password)) {
      newErrors.password = { message: 'Please include at least one number' };
    } else if (!/[A-Z]/.test(formData.password)) {
      newErrors.password = { message: 'Please include an uppercase letter' };
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = { message: 'Please confirm your password' };
    } else if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = { message: 'Password confirmation does not match' };
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, avatar: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsSubmitting(false);
    setIsSuccess(true);
    
    setTimeout(() => {
      onToggleForm();
    }, 4500);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof SignupFormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const getPasswordStrength = () => {
    const p = formData.password;
    let strength = 0;
    if (p.length >= 8) strength++;
    if (/[A-Z]/.test(p)) strength++;
    if (/[0-9]/.test(p)) strength++;
    if (/[^a-zA-Z0-9]/.test(p)) strength++;
    return strength;
  };

  const strength = getPasswordStrength();
  const strengthLabels = ['Weak', 'Fair', 'Good', 'Strong'];
  const strengthColors = ['bg-rose-400', 'bg-orange-400', 'bg-amber-400', 'bg-emerald-400'];

  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center py-6 text-center"
      >
        <div className="w-48 h-48 -mt-8 -mb-4">
          {successAnimation && <Lottie animationData={successAnimation} loop={false} />}
        </div>
        <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2 tracking-tight">Welcome Aboard!</h2>
        <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-[280px]">
          Redirecting you to the login screen now...
        </p>
        <div className="flex gap-2">
           {[0, 1, 2].map((i) => (
             <motion.div
               key={i}
               animate={{ opacity: [0.3, 1, 0.3] }}
               transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.2 }}
               className="w-2.5 h-2.5 bg-indigo-600 dark:bg-indigo-400 rounded-full"
             />
           ))}
        </div>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {/* Avatar Picker */}
      <div className="flex justify-center mb-4">
        <div className="relative group">
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="w-24 h-24 rounded-full border-4 border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 flex items-center justify-center cursor-pointer overflow-hidden group-hover:border-indigo-500 transition-all shadow-inner"
          >
            {formData.avatar ? (
              <img src={formData.avatar} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <User className="text-slate-300 dark:text-slate-600" size={40} />
            )}
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
               <Camera className="text-white" size={24} />
            </div>
          </div>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleAvatarChange} 
            className="hidden" 
            accept="image/*"
          />
          <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white border-4 border-white dark:border-slate-900 shadow-md">
             <UserPlus size={14} />
          </div>
        </div>
      </div>

      <FormInput
        label="Username"
        name="username"
        type="text"
        placeholder="johndoe"
        autoComplete="username"
        value={formData.username}
        onChange={handleChange}
        error={errors.username?.message}
        icon={<User size={20} />}
      />

      <FormInput
        label="Email Address"
        name="email"
        type="email"
        placeholder="john@example.com"
        autoComplete="email"
        value={formData.email}
        onChange={handleChange}
        error={errors.email?.message}
        icon={<Mail size={20} />}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput
          label="Password"
          name="password"
          type="password"
          placeholder="Min 8 chars, 1 uppercase, 1 number"
          autoComplete="new-password"
          value={formData.password}
          onChange={handleChange}
          error={errors.password?.message}
          icon={<Lock size={20} />}
        />

        <div className="md:col-span-2">
           <div className="flex justify-between items-center mb-1.5 px-1">
             <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 dark:text-slate-500">Security Strength</span>
             <span className={`text-[10px] font-bold uppercase ${strength === 0 ? 'text-slate-300 dark:text-slate-700' : strengthColors[strength - 1].replace('bg-', 'text-')}`}>
               {strength === 0 ? 'Too short' : strengthLabels[strength - 1]}
             </span>
           </div>
           <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex gap-0.5">
             {[1, 2, 3, 4].map((step) => (
               <div
                 key={step}
                 className={`h-full flex-1 transition-all duration-500 ${
                   strength >= step ? strengthColors[strength - 1] : 'bg-transparent'
                 }`}
               />
             ))}
           </div>
        </div>

        <FormInput
          label="Confirm"
          name="confirmPassword"
          type="password"
          placeholder="••••••••"
          autoComplete="new-password"
          value={formData.confirmPassword}
          onChange={handleChange}
          error={errors.confirmPassword?.message}
          icon={<Lock size={20} />}
        />
      </div>

      <motion.button
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        disabled={isSubmitting}
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all mt-4 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-indigo-200 dark:shadow-none"
      >
        {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <UserPlus size={20} />}
        {isSubmitting ? 'Creating account...' : 'Create Account'}
      </motion.button>

      <div className="flex items-center gap-4 my-4">
        <div className="h-px flex-1 bg-slate-100 dark:bg-slate-800" />
        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest leading-none">Or sign up with</span>
        <div className="h-px flex-1 bg-slate-100 dark:bg-slate-800" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button type="button" className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all font-medium text-sm text-slate-900 dark:text-white">
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
          </svg>
          Google
        </button>
        <button type="button" className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all font-medium text-sm text-slate-900 dark:text-white">
          <svg className="w-5 h-5 dark:fill-white" viewBox="0 0 24 24">
            <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
          </svg>
          GitHub
        </button>
      </div>

      <div className="mt-6 text-center">
        <p className="text-slate-500 dark:text-slate-400 text-sm">
          Already have an account?{' '}
          <button
            type="button"
            onClick={onToggleForm}
            className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
          >
            Sign in
          </button>
        </p>
      </div>
    </form>
  );
}
