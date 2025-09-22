'use client';
import { useApp } from "@/app/(app)/app-provider";
import { RefreshCw, Wifi, WifiOff, AlertCircle } from 'lucide-react';
import React from 'react';

export const SyncStatus: React.FC = () => {
  const { syncStatus, lastSync, syncNow, isOnline } = useApp();

  const getIcon = () => {
    if(!isOnline) return <WifiOff className="h-4 w-4 text-red-500" />;
    switch (syncStatus) {
      case 'syncing': return <RefreshCw className="h-4 w-4 text-orange-500 animate-spin" />;
      case 'synced': return <Wifi className="h-4 w-4 text-green-500" />;
      case 'error': return <AlertCircle className="h-4 w-4 text-red-500" />;
      default: return <WifiOff className="h-4 w-4 text-red-500" />;
    }
  };

  const getStatusText = () => {
    if (!isOnline) return 'Offline';
    if (syncStatus === 'synced' && lastSync) return `Sync: ${lastSync.toLocaleTimeString()}`;
    return syncStatus;
  }

  return (
    <div 
      className="flex items-center gap-1 px-2 py-1 rounded bg-gray-800 text-xs cursor-pointer border border-gray-700"
      onClick={syncNow}
      title="Cliquez pour synchroniser"
    >
      {getIcon()}
      <span className="text-gray-300 hidden sm:inline">
       {getStatusText()}
      </span>
    </div>
  );
};
