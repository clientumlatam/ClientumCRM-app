import React from 'react';

interface ProtectedRouteProps {
  isAuthenticated: boolean;
  fallback: React.ReactNode;
  children: React.ReactNode;
}

/**
 * Small route boundary for the app shell.
 *
 * This project uses a lightweight browser-history router instead of
 * react-router. Keeping the auth decision in one component prevents a
 * private shell from being rendered accidentally while the public route is
 * being restored.
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  isAuthenticated,
  fallback,
  children,
}) => {
  return isAuthenticated ? <>{children}</> : <>{fallback}</>;
};