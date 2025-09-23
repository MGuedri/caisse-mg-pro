
'use client';
import { useApp } from "@/app/(app)/app-provider";
import { RefreshCw, Wifi, WifiOff, AlertCircle } from 'lucide-react';
import React from 'react';

export const SyncStatus: React.FC = () => {
  const { syncStatus, lastSync, refreshData } = useApp();

  const isOnline = syncStatus !== 'offline';

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
    if (!isOnline) return 'Hors ligne';
    if (syncStatus === 'synced') return `Synchronisé`;
    if (syncStatus === 'syncing') return 'Synchronisation...';
    if (syncStatus === 'error') return 'Erreur';
    return 'Hors ligne';
  }

  return (
    <div 
      className="flex items-center gap-2 cursor-pointer"
      onClick={(e) => { e.stopPropagation(); refreshData(); }}
      title={`Sync status: ${getStatusText()}`}
    >
      {getIcon()}
      <div className="flex flex-col">
        <span className="text-sm">{getStatusText()}</span>
        {isOnline && lastSync && syncStatus === 'synced' && (
           <span className="text-xs text-gray-400">
             Dernière: {lastSync.toLocaleTimeString()}
           </span>
        )}
      </div>
    </div>
  );
};
