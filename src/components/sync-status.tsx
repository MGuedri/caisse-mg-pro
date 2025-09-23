'use client';
import { useApp } from "@/app/(app)/app-provider";
import { RefreshCw, Wifi, WifiOff, AlertCircle } from 'lucide-react';
import React from 'react';

export const SyncStatus: React.FC = () => {
  const { syncStatus, lastSync, syncNow, isOnline } = useApp();

  const getIcon = () => {
    if(!isOnline) return <WifiOff className="h-3 w-3 text-red-500" />;
    switch (syncStatus) {
      case 'syncing': return <RefreshCw className="h-3 w-3 text-orange-500 animate-spin" />;
      case 'synced': return <Wifi className="h-3 w-3 text-green-500" />;
      case 'error': return <AlertCircle className="h-3 w-3 text-red-500" />;
      default: return <WifiOff className="h-3 w-3 text-red-500" />;
    }
  };

  const getStatusText = () => {
    if (!isOnline) return 'Offline';
    if (syncStatus === 'synced' && lastSync) return `Synced: ${lastSync.toLocaleTimeString()}`;
    return syncStatus.charAt(0).toUpperCase() + syncStatus.slice(1);
  }

  return (
    <div 
      className="absolute bottom-0 right-0 flex items-center justify-center h-5 w-5 rounded-full bg-gray-800 cursor-pointer border-2 border-gray-800"
      onClick={(e) => { e.stopPropagation(); syncNow(); }}
      title={`Sync status: ${getStatusText()}`}
    >
      {getIcon()}
    </div>
  );
};
