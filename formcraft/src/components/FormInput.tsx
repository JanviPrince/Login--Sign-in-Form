import React, { useState } from 'react';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  icon?: React.ReactNode;
}

export function FormInput(props: FormInputProps) {
  const { label, error, icon, type, className, ...rest } = props;
  const [showPassword, setShowPassword] = useState(false);
  const [isCapsLock, setIsCapsLock] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (isPassword) {
      setIsCapsLock(e.getModifierState('CapsLock'));
    }
    if (props.onKeyDown) props.onKeyDown(e);
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="flex justify-between items-center px-1">
        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
          {label}
        </label>
        {isCapsLock && (
          <span className="text-[10px] font-bold text-amber-500 uppercase tracking-tighter">Caps Lock On</span>
        )}
      </div>
      <div className="relative group">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors">
            {icon}
          </div>
        )}
        <input
          {...rest}
          type={inputType}
          onKeyDown={handleKeyDown}
          className={`
            w-full py-3 ${icon ? 'pl-10' : 'pl-4'} pr-12
            bg-white dark:bg-slate-800 border-2 rounded-xl transition-all outline-hidden
            dark:text-white dark:placeholder-slate-500
            ${error 
              ? 'border-rose-400 focus:border-rose-500 bg-rose-50/10' 
              : 'border-slate-100 dark:border-slate-700 focus:border-indigo-500 dark:focus:border-indigo-400 hover:border-slate-200 dark:hover:border-slate-600'}
            ${className || ''}
          `}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
      <AnimatePresence mode="wait">
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-1.5 mt-1 text-rose-500 text-xs font-medium ml-1"
          >
            <AlertCircle size={14} />
            {error}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
