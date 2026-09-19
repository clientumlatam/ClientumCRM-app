import React from 'react';

export interface ClientumNavyIconProps {
  category: 'sales' | 'communication' | 'ai' | 'erp' | 'admin';
  className?: string;
  size?: number;
}

export const ClientumNavyIcon: React.FC<ClientumNavyIconProps> = ({
  category,
  className = 'w-4 h-4',
  size = 16,
}) => {
  switch (category) {
    case 'sales':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
        >
          <rect width="64" height="64" rx="14" fill="#0F172A" />
          <path
            d="M18 44L28 34L36 40L46 22"
            stroke="#38BDF8"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M38 22H46V30"
            stroke="#38BDF8"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="20" cy="44" r="2.5" fill="#FFFFFF" />
          <circle cx="28" cy="34" r="2.5" fill="#FFFFFF" />
          <circle cx="36" cy="40" r="2.5" fill="#FFFFFF" />
          <circle cx="46" cy="22" r="2.5" fill="#FFFFFF" />
        </svg>
      );

    case 'communication':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
        >
          <rect width="64" height="64" rx="14" fill="#0F172A" />
          <path
            d="M18 24C18 20.6863 20.6863 18 24 18H40C43.3137 18 46 20.6863 46 24V36C46 39.3137 43.3137 42 40 42H26L18 48V24Z"
            stroke="#38BDF8"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="26" cy="30" r="2.5" fill="#FFFFFF" />
          <circle cx="32" cy="30" r="2.5" fill="#FFFFFF" />
          <circle cx="38" cy="30" r="2.5" fill="#FFFFFF" />
        </svg>
      );

    case 'ai':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
        >
          <rect width="64" height="64" rx="14" fill="#0F172A" />
          <path
            d="M32 16L35.5 26.5L46 30L35.5 33.5L32 44L28.5 33.5L18 30L28.5 26.5L32 16Z"
            fill="#38BDF8"
            stroke="#38BDF8"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <circle cx="44" cy="20" r="3" fill="#FFFFFF" />
          <circle cx="20" cy="42" r="2" fill="#93C5FD" />
        </svg>
      );

    case 'erp':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
        >
          <rect width="64" height="64" rx="14" fill="#0F172A" />
          <rect x="20" y="18" width="24" height="28" rx="4" stroke="#38BDF8" strokeWidth="4" />
          <path d="M26 26H38" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
          <path d="M26 32H38" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
          <path d="M26 38H32" stroke="#38BDF8" strokeWidth="3" strokeLinecap="round" />
        </svg>
      );

    case 'admin':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
        >
          <rect width="64" height="64" rx="14" fill="#0F172A" />
          <path
            d="M32 18V22M32 42V46M18 32H22M42 32H46M22 22L25 25M39 39L42 42M22 42L25 39M39 25L42 22"
            stroke="#38BDF8"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <circle cx="32" cy="32" r="8" stroke="#FFFFFF" strokeWidth="4" />
        </svg>
      );

    default:
      return null;
  }
};
