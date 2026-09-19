import React from 'react';
import { SyncStatusIndicator } from './SyncStatusIndicator';

export const ConnectivityIndicator: React.FC<{ className?: string }> = ({ className = '' }) => {
  return <SyncStatusIndicator className={className} />;
};
