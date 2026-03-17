import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export const Input = ({
  type = 'text',
  placeholder,
  icon: Icon,
  name,
  value,
  onChange,
  error,
  ...rest
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';

  return (
    <div className="w-full mb-6 relative">
      <div
        className={`flex items-center w-full px-4 py-2.5 rounded border bg-white ${
          error ? 'border-[#f42619] text-[#f42619]' : 'border-gray-300 text-gray-400 focus-within:border-[#f42619] focus-within:text-[#f42619]'
        }`}
      >
        {Icon && (
          <span className="mr-4 flex items-center justify-center">
            <Icon size={18} strokeWidth={1.5} />
          </span>
        )}
        <input
          type={isPassword && showPassword ? 'text' : type}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="w-full bg-transparent outline-none text-gray-800 placeholder-gray-400 text-sm"
          {...rest}
        />
        {isPassword && (
          <button
            type="button"
            className="ml-3 text-gray-400 focus:outline-none"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <Eye size={18} strokeWidth={1.5} /> : <EyeOff size={18} strokeWidth={1.5} />}
          </button>
        )}
      </div>
      {error && (
        <p className="mt-1 text-xs text-[#f42619] text-right absolute right-0 -bottom-4.5">
          {error}
        </p>
      )}
    </div>
  );
};
