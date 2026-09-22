import React, { useState } from 'react';

export interface ClientumLogoProps {
  className?: string;
  alt?: string;
  variant?: 'isotipo' | 'horizontal';
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'custom';
  showClearance?: boolean;
  badge?: string;
  subtitle?: string;
  minWidth209?: boolean;
  onDark?: boolean;
}

export const ClientumLogo: React.FC<ClientumLogoProps> = ({
  className = '',
  alt = 'Clientum',
  variant = 'isotipo',
  size = 'md',
  showClearance = false,
  badge = 'CRM',
  subtitle,
  minWidth209 = false,
  onDark = false,
}) => {
  const [hasError, setHasError] = useState(false);

  // Size mapping for the isotipo icon container
  const sizeClasses = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-11 h-11',
    xl: 'w-14 h-14',
    custom: '',
  };

  const currentIconSize = size !== 'custom' ? sizeClasses[size] : (className || 'w-8 h-8');

  const renderIcon = () => {
    if (hasError) {
      return (
        <svg
          className="w-full h-full object-contain"
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <rect width="100" height="100" rx="22" fill="var(--bg-canvas)" />
          <path
            d="M50 25 L75 50 L50 75 L25 50 Z"
            stroke="white"
            strokeWidth="6"
            strokeLinejoin="round"
          />
          <circle cx="50" cy="25" r="8" fill="white" />
          <circle cx="75" cy="50" r="8" fill="white" />
          <circle cx="50" cy="75" r="8" fill="white" />
          <circle cx="25" cy="50" r="8" fill="white" />
        </svg>
      );
    }

    return (
      <img
        src="/favicon.svg"
        alt={alt}
        className="w-full h-full object-contain"
        onError={() => setHasError(true)}
        referrerPolicy="no-referrer"
      />
    );
  };

  // Isotipo standalone mode
  if (variant === 'isotipo') {
    if (showClearance) {
      return (
        <div
          className={`relative shrink-0 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-1.5 flex items-center justify-center shadow-xs transition-transform duration-200 ${currentIconSize} ${className}`}
          title="Clientum - Isotipo Oficial"
        >
          {renderIcon()}
        </div>
      );
    }

    return (
      <div className={`relative shrink-0 flex items-center justify-center ${currentIconSize} ${className}`}>
        {renderIcon()}
      </div>
    );
  }

  // Horizontal Logotype mode
  return (
    <div
      className={`inline-flex items-center gap-3 select-none ${minWidth209 ? 'min-w-[209px]' : ''} ${className}`}
      title="Clientum - Logotipo Oficial"
    >
      {/* Isotipo within clearance container */}
      <div className="relative shrink-0 w-10 h-10 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-1.5 flex items-center justify-center shadow-xs">
        {renderIcon()}
      </div>

      {/* Brand Typography */}
      <div className="flex flex-col justify-center leading-none">
        <div className="flex items-center gap-1 leading-none font-['Inter',Arial,sans-serif]">
          <span className={`text-lg font-bold tracking-tight ${onDark ? 'text-white' : 'text-[#022046] dark:text-white'}`}>
            Clientum
          </span>
          {badge && (
            <span className="text-lg font-bold tracking-tight text-[#0056B3]">
              {badge}
            </span>
          )}
        </div>
        {subtitle && (
          <span className={`mt-1 text-[10px] font-medium tracking-normal ${onDark ? 'text-slate-400' : 'text-slate-500 dark:text-slate-400'}`}>
            {subtitle}
          </span>
        )}
      </div>
    </div>
  );
};

