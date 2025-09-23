'use client';
import { useApp } from "@/app/(app)/app-provider";
import { RefreshCw, Wifi, WifiOff, AlertCircle } from 'lucide-react';
import React from 'react';
import { DropdownMenuItem } from "./ui/dropdown-menu";

export const SyncStatusItem: React.FC = () => {
  const { syncStatus, lastSync, syncNow, isOnline } = useApp();

  const getIcon = () => {
    if (!isOnline) return <WifiOff className="mr-2 h-4 w-4 text-red-500" />;
    switch (syncStatus) {
      case 'syncing': return <RefreshCw className="mr-2 h-4 w-4 text-orange-500 animate-spin" />;
      case 'synced': return <Wifi className="mr-2 h-4 w-4 text-green-500" />;
      case 'error': return <AlertCircle className="mr-2 h-4 w-4 text-red-500" />;
      default: return <WifiOff className="mr-2 h-4 w-4 text-red-500" />;
    }
  };

  const getStatusText = () => {
    if (!isOnline) return 'Hors ligne';
    if (syncStatus === 'syncing') return 'Synchronisation...';
    if (syncStatus === 'synced' && lastSync) return `Synchronisé`;
    if (syncStatus === 'error') return 'Erreur de synchro';
    return 'Hors ligne';
  };

  return (
    <DropdownMenuItem
      onClick={syncNow}
      className="cursor-pointer focus:bg-gray-700"
    >
      {getIcon()}
      <div className="flex flex-col">
        <span className="font-medium">{getStatusText()}</span>
        {lastSync && isOnline && (
            <span className="text-xs text-gray-400">
                Dernière synchro: {lastSync.toLocaleTimeString('fr-FR')}
            </span>
        )}
      </div>
    </DropdownMenuItem>
  );
};
