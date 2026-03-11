"use client";

import { useNetworkStatus } from "@/hooks/use-network-status";
import { WifiOff } from "lucide-react";

export function OfflineIndicator() {
  const { isOnline, wasOffline } = useNetworkStatus();

  if (isOnline && !wasOffline) return null;

  if (!isOnline) {
    return (
      <div className="fixed bottom-4 left-4 right-4 z-50 max-w-md mx-auto bg-destructive text-destructive-foreground px-4 py-3 rounded-lg flex items-center gap-2 shadow-lg">
        <WifiOff className="h-4 w-4" />
        <span className="text-sm">You are offline. Some features may not be available.</span>
      </div>
    );
  }

  if (wasOffline && isOnline) {
    return (
      <div className="fixed bottom-4 left-4 right-4 z-50 max-w-md mx-auto bg-primary text-primary-foreground px-4 py-3 rounded-lg text-sm shadow-lg animate-fade-in">
        You are back online.
      </div>
    );
  }

  return null;
}
