import React from 'react';

export const ClientumLogo = ({ className = "w-8 h-8" }: { className?: string }) => {
  return (
    <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="100" height="100" rx="22" fill="#0a2558"/>
      <path d="M50 25 L75 50 L50 75 L25 50 Z" stroke="white" strokeWidth="6" strokeLinejoin="round"/>
      <circle cx="50" cy="25" r="8" fill="white"/>
      <circle cx="75" cy="50" r="8" fill="white"/>
      <circle cx="50" cy="75" r="8" fill="white"/>
      <circle cx="25" cy="50" r="8" fill="white"/>
    </svg>
  );
};
