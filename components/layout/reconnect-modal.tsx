"use client";
import React from "react";
import { WifiOff, RefreshCw } from "lucide-react";
import { useAppStore } from "@/lib/store/app-store";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { mockIntegrations } from "@/lib/mock-data";
import { formatRelativeTime } from "@/lib/utils";

export function ReconnectModal() {
  const { reconnectModal, hideReconnectModal, addToast } = useAppStore();
  const integration = mockIntegrations.find(i => i.id === reconnectModal.integration);

  function handleReconnect() {
    addToast({ type: "success", title: "Reconectando...", description: `Redirecionando para autenticação do ${integration?.name}.` });
    hideReconnectModal();
  }

  if (!integration) return null;

  return (
    <Dialog open={reconnectModal.open} onOpenChange={(v) => !v && hideReconnectModal()}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-[var(--radius)] bg-[var(--danger-subtle)] border border-[var(--danger)] border-opacity-30 flex items-center justify-center">
              <WifiOff size={18} className="text-[var(--danger)]" />
            </div>
            <div>
              <DialogTitle>Conexão expirada</DialogTitle>
              <DialogDescription>
                Sua conexão com o {integration.name} precisa ser renovada.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <div className="px-6 py-4 border-t border-b border-[var(--border)] flex flex-col gap-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-[var(--fg-3)]">Integração</span>
            <span className="text-[var(--fg)] font-medium">{integration.name}</span>
          </div>
          {integration.lastSync && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-[var(--fg-3)]">Última sync</span>
              <span className="text-[var(--fg-2)]">{formatRelativeTime(integration.lastSync)}</span>
            </div>
          )}
          <div className="flex flex-col gap-1">
            <span className="text-xs text-[var(--fg-3)]">Permissões necessárias</span>
            <div className="flex flex-wrap gap-1 mt-1">
              {integration.permissions.map((p) => (
                <span key={p} className="px-2 py-0.5 rounded-[var(--radius-sm)] bg-[var(--surface-2)] text-xs text-[var(--fg-2)] border border-[var(--border)]">
                  {p}
                </span>
              ))}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" size="sm" onClick={hideReconnectModal}>Ignorar</Button>
          <Button variant="primary" size="sm" onClick={handleReconnect} className="gap-2">
            <RefreshCw size={13} />
            Reconectar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
