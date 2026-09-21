"use client";
import React, { useState } from "react";
import { Search, Plug, CheckCircle2, AlertTriangle, AlertCircle, RefreshCw, X } from "lucide-react";
import { cn, formatRelativeTime } from "@/lib/utils";
import { mockIntegrations } from "@/lib/mock-data";
import { useAppStore } from "@/lib/store/app-store";
import { Button } from "@/components/ui/button";
import { Badge, StatusBadge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

export default function IntegrationsPage() {
  const { addToast, showReconnectModal } = useAppStore();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Todas");
  
  const [integrations, setIntegrations] = useState(mockIntegrations);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeInt, setActiveInt] = useState<any>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  const categories = ["Todas", ...Array.from(new Set(mockIntegrations.map(i => i.category)))];

  const filtered = integrations.filter(i => {
    const matchSearch = i.name.toLowerCase().includes(search.toLowerCase()) || i.description.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === "Todas" || i.category === category;
    return matchSearch && matchCat;
  });

  const connected = filtered.filter(i => i.connected);

  const handleOpenModal = (int: any) => {
    setActiveInt(int);
    setModalOpen(true);
  };

  const handleConnect = () => {
    setIsConnecting(true);
    setTimeout(() => {
      setIsConnecting(false);
      setIntegrations(prev => prev.map(i => i.id === activeInt.id ? { ...i, connected: true, status: "connected", lastSync: new Date().toISOString() } : i));
      setActiveInt({ ...activeInt, connected: true, status: "connected", lastSync: new Date().toISOString() });
      addToast({ type: "success", title: "Integração conectada", description: `O ${activeInt.name} foi conectado com sucesso.` });
      setModalOpen(false);
    }, 2000);
  };

  const handleDisconnect = () => {
    setIntegrations(prev => prev.map(i => i.id === activeInt.id ? { ...i, connected: false, status: "disconnected", lastSync: null } : i));
    addToast({ type: "info", title: "Integração desconectada" });
    setModalOpen(false);
  };

  return (
    <div className="flex flex-col h-full bg-[var(--background)] max-w-6xl mx-auto px-4 py-6 md:px-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[var(--fg)]">Integrações</h1>
          <p className="text-[var(--fg-3)] mt-1">Conecte suas ferramentas para dar mais contexto ao Bruce.</p>
        </div>
        
        <div className="relative w-full md:w-72">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--fg-3)]" />
          <input 
            placeholder="Buscar integrações..." 
            className="w-full h-10 pl-9 pr-3 bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius)] text-sm focus:outline-none focus:border-[var(--accent)] text-[var(--fg)]"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Tabs Filter */}
      <Tabs value={category} onValueChange={setCategory} className="mb-8">
        <TabsList className="w-full justify-start overflow-x-auto overflow-y-hidden border-b border-[var(--border)] pb-px scrollbar-hide">
          {categories.map(c => (
            <TabsTrigger key={c} value={c} className="whitespace-nowrap">{c}</TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="flex-1 overflow-y-auto pb-10 flex flex-col gap-10">
        
        {/* Connected Section */}
        {connected.length > 0 && search === "" && category === "Todas" && (
          <section className="animate-fade-in">
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-lg font-semibold text-[var(--fg)]">Conectadas</h2>
              <Badge variant="accent">{connected.length}</Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {connected.map(i => (
                <IntegrationCard key={i.id} integration={i} onManage={() => handleOpenModal(i)} onReconnect={() => showReconnectModal(i.id)} />
              ))}
            </div>
          </section>
        )}

        {/* All Integrations Section */}
        <section className="animate-fade-in">
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-lg font-semibold text-[var(--fg)]">Todas as Integrações</h2>
            <Badge>{filtered.length}</Badge>
          </div>
          
          {filtered.length === 0 ? (
            <div className="py-20 flex flex-col items-center justify-center text-center">
              <Search size={32} className="text-[var(--fg-3)] mb-4" />
              <h3 className="text-lg font-medium text-[var(--fg)]">Nenhuma integração encontrada</h3>
              <p className="text-[var(--fg-3)]">Não encontramos nenhuma ferramenta correspondente à sua busca.</p>
              <Button variant="outline" className="mt-4" onClick={() => setSearch("")}>Limpar busca</Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map(i => (
                <IntegrationCard key={i.id} integration={i} onManage={() => handleOpenModal(i)} onReconnect={() => showReconnectModal(i.id)} />
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Integration Modal */}
      {activeInt && (
        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
          <DialogContent className="max-w-md p-0 overflow-hidden">
            <div className="h-24 bg-[var(--surface-2)] flex items-center justify-center relative border-b border-[var(--border)]">
              <div 
                className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-md border border-[var(--border)] absolute -bottom-8 bg-[var(--surface)]"
                style={{ color: activeInt.color }}
              >
                <Plug size={32} />
              </div>
            </div>
            
            <div className="pt-12 px-6 pb-6 flex flex-col items-center text-center">
              <h3 className="text-xl font-bold text-[var(--fg)]">{activeInt.name}</h3>
              <p className="text-sm text-[var(--fg-3)] mt-1">{activeInt.description}</p>
              
              <div className="w-full mt-8 flex flex-col gap-4 text-left">
                <div className="bg-[var(--surface-2)] rounded-[var(--radius-lg)] p-4 border border-[var(--border)] flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-[var(--fg)]">Status da conexão</span>
                    <StatusBadge status={activeInt.status} />
                  </div>
                  {activeInt.lastSync && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[var(--fg-3)]">Última sincronização</span>
                      <span className="text-sm text-[var(--fg-2)]">{formatRelativeTime(activeInt.lastSync)}</span>
                    </div>
                  )}
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-[var(--fg)] mb-2">Permissões</h4>
                  <ul className="flex flex-col gap-2">
                    {activeInt.permissions.map((p: string) => (
                      <li key={p} className="flex items-center gap-2 text-sm text-[var(--fg-2)]">
                        <CheckCircle2 size={14} className={activeInt.connected ? "text-[var(--success)]" : "text-[var(--border-2)]"} />
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            
            <DialogFooter className="bg-[var(--surface-2)] border-t border-[var(--border)] px-6 py-4 flex items-center justify-between sm:justify-between w-full">
              {activeInt.connected ? (
                <>
                  <Button variant="ghost" onClick={handleDisconnect} className="text-[var(--danger)] hover:bg-[var(--danger-subtle)] hover:text-[var(--danger)]">
                    Desconectar
                  </Button>
                  <Button variant="primary" onClick={() => setModalOpen(false)}>Concluído</Button>
                </>
              ) : (
                <>
                  <Button variant="ghost" onClick={() => setModalOpen(false)}>Cancelar</Button>
                  <Button variant="primary" onClick={handleConnect} disabled={isConnecting} className="w-full sm:w-auto">
                    {isConnecting ? (
                      <><RefreshCw size={14} className="animate-spin mr-2" /> Conectando...</>
                    ) : (
                      "Conectar com OAuth"
                    )}
                  </Button>
                </>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

function IntegrationCard({ integration: i, onManage, onReconnect }: any) {
  return (
    <div className={cn(
      "flex flex-col p-5 rounded-[var(--radius-lg)] border transition-all",
      i.connected 
        ? "bg-[var(--surface)] border-[var(--accent)] border-opacity-30 shadow-sm" 
        : "bg-[var(--surface-2)] border-[var(--border)] hover:border-[var(--border-2)]"
    )}>
      <div className="flex items-start justify-between mb-3">
        <div 
          className="w-10 h-10 rounded-[var(--radius)] flex items-center justify-center bg-[var(--surface)] border border-[var(--border)]"
          style={{ color: i.color }}
        >
          <Plug size={20} />
        </div>
        <StatusBadge status={i.status} />
      </div>
      
      <h3 className="font-semibold text-[var(--fg)] text-base">{i.name}</h3>
      <p className="text-sm text-[var(--fg-3)] mt-1 mb-4 flex-1 line-clamp-2">{i.description}</p>
      
      {i.status === "error" || i.status === "expired" ? (
        <Button variant="outline" className="w-full justify-center gap-2 border-[var(--danger)] text-[var(--danger)] hover:bg-[var(--danger-subtle)]" onClick={onReconnect}>
          <AlertCircle size={14} /> Reconectar
        </Button>
      ) : i.connected ? (
        <Button variant="secondary" className="w-full justify-center" onClick={onManage}>
          Gerenciar
        </Button>
      ) : (
        <Button variant="primary" className="w-full justify-center" onClick={onManage}>
          Conectar
        </Button>
      )}
    </div>
  );
}
