"use client";
import React, { useState } from "react";
import { 
  Search, Filter, Pin, MoreHorizontal, Clock, 
  Calendar, Download, FileText, Trash2, Edit2, Copy
} from "lucide-react";
import { cn, formatRelativeTime } from "@/lib/utils";
import { mockChats, mockIntegrations } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ConfirmDialog } from "@/components/ui/dialog";
import { useAppStore } from "@/lib/store/app-store";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, 
  DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuCheckboxItem
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";

export default function HistoryPage() {
  const router = useRouter();
  const { addToast, setActiveChatId } = useAppStore();
  const [search, setSearch] = useState("");
  const [pinnedOnly, setPinnedOnly] = useState(false);
  const [chats, setChats] = useState(mockChats);
  
  const [deleteDialog, setDeleteDialog] = useState<{open: boolean, id: string | null}>({ open: false, id: null });

  // Filter logic
  const filteredChats = chats.filter(chat => {
    const matchesSearch = chat.title.toLowerCase().includes(search.toLowerCase()) || 
                          chat.preview.toLowerCase().includes(search.toLowerCase());
    const matchesPinned = pinnedOnly ? chat.pinned : true;
    return matchesSearch && matchesPinned;
  });

  const handleOpenChat = (id: string) => {
    setActiveChatId(id);
    router.push("/chat");
  };

  const handleTogglePin = (id: string) => {
    setChats(prev => prev.map(c => c.id === id ? { ...c, pinned: !c.pinned } : c));
    const chat = chats.find(c => c.id === id);
    addToast({ 
      type: "success", 
      title: chat?.pinned ? "Conversa desfixada" : "Conversa fixada" 
    });
  };

  const handleDelete = () => {
    if (deleteDialog.id) {
      setChats(prev => prev.filter(c => c.id !== deleteDialog.id));
      addToast({ type: "success", title: "Conversa excluída com sucesso" });
    }
  };

  const handleExport = (format: string) => {
    addToast({ type: "success", title: `Exportando em ${format}...`, description: "O download começará em instantes." });
  };

  // Grouping logic mock
  const todayChats = filteredChats.slice(0, 1);
  const yesterdayChats = filteredChats.slice(1, 3);
  const olderChats = filteredChats.slice(3);

  return (
    <div className="flex flex-col h-full bg-[var(--background)] max-w-5xl mx-auto px-4 py-6 md:px-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[var(--fg)] flex items-center gap-2">
            Histórico 
            <Badge variant="default" className="text-xs px-2 py-0.5 rounded-full">{chats.length}</Badge>
          </h1>
          <p className="text-[var(--fg-3)] mt-1">Gerencie e acesse suas conversas anteriores.</p>
        </div>
        
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--fg-3)]" />
            <input 
              placeholder="Buscar no histórico..." 
              className="w-full h-10 pl-9 pr-3 text-sm bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius)] text-[var(--fg)] placeholder:text-[var(--fg-3)] focus:outline-none focus:border-[var(--accent)] transition-all"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" className="h-10 px-3 gap-2">
                <Filter size={16} /> 
                <span className="hidden sm:inline">Filtros</span>
                {pinnedOnly && <div className="w-2 h-2 rounded-full bg-[var(--accent)]" />}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuCheckboxItem 
                checked={pinnedOnly} 
                onCheckedChange={setPinnedOnly}
              >
                Apenas fixados
              </DropdownMenuCheckboxItem>
              <DropdownMenuSeparator />
              <div className="px-2 py-1.5 text-xs font-medium text-[var(--fg-3)]">Período</div>
              <DropdownMenuItem>Hoje</DropdownMenuItem>
              <DropdownMenuItem>Esta semana</DropdownMenuItem>
              <DropdownMenuItem>Este mês</DropdownMenuItem>
              <DropdownMenuItem>Todos</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto pr-2 pb-10">
        {filteredChats.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-[var(--surface-2)] flex items-center justify-center mb-4">
              <Clock size={24} className="text-[var(--fg-3)]" />
            </div>
            <h3 className="text-lg font-semibold text-[var(--fg)] mb-1">Nenhuma conversa encontrada</h3>
            <p className="text-[var(--fg-3)] max-w-sm">
              {search || pinnedOnly 
                ? "Tente limpar os filtros ou usar outros termos de busca." 
                : "Suas conversas com o Bruce aparecerão aqui."}
            </p>
            {(search || pinnedOnly) && (
              <Button 
                variant="outline" 
                className="mt-6"
                onClick={() => { setSearch(""); setPinnedOnly(false); }}
              >
                Limpar filtros
              </Button>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-8">
            {todayChats.length > 0 && (
              <ChatGroup title="Hoje" chats={todayChats} onOpen={handleOpenChat} onTogglePin={handleTogglePin} onDelete={(id) => setDeleteDialog({open: true, id})} onExport={handleExport} />
            )}
            {yesterdayChats.length > 0 && (
              <ChatGroup title="Ontem" chats={yesterdayChats} onOpen={handleOpenChat} onTogglePin={handleTogglePin} onDelete={(id) => setDeleteDialog({open: true, id})} onExport={handleExport} />
            )}
            {olderChats.length > 0 && (
              <ChatGroup title="Mais antigos" chats={olderChats} onOpen={handleOpenChat} onTogglePin={handleTogglePin} onDelete={(id) => setDeleteDialog({open: true, id})} onExport={handleExport} />
            )}
          </div>
        )}
      </div>

      <ConfirmDialog 
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, id: null })}
        onConfirm={handleDelete}
        title="Excluir conversa?"
        description="Esta ação não pode ser desfeita. Todo o histórico desta conversa será apagado."
        confirmLabel="Excluir"
      />
    </div>
  );
}

function ChatGroup({ title, chats, onOpen, onTogglePin, onDelete, onExport }: any) {
  return (
    <div className="flex flex-col gap-3 animate-fade-in">
      <h3 className="text-sm font-semibold text-[var(--fg-3)] sticky top-0 bg-[var(--background)] py-1 z-10">
        {title}
      </h3>
      <div className="flex flex-col gap-2">
        {chats.map((chat: any) => (
          <div 
            key={chat.id}
            className="group relative flex items-center justify-between p-4 rounded-[var(--radius-lg)] bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--accent)] hover:shadow-md transition-all cursor-pointer"
            onClick={() => onOpen(chat.id)}
          >
            <div className="flex items-start gap-4 flex-1 min-w-0">
              <button 
                className="mt-1 flex-shrink-0 text-[var(--fg-3)] hover:text-[var(--accent)] transition-colors"
                onClick={(e) => { e.stopPropagation(); onTogglePin(chat.id); }}
                title={chat.pinned ? "Desfixar" : "Fixar"}
              >
                <Pin size={18} className={cn("transition-transform hover:scale-110", chat.pinned ? "fill-[var(--accent)] text-[var(--accent)] rotate-45" : "")} />
              </button>
              
              <div className="flex flex-col gap-1 flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="text-base font-semibold text-[var(--fg)] truncate group-hover:text-[var(--accent)] transition-colors">
                    {chat.title}
                  </h4>
                  {chat.integrations?.map((intId: string) => {
                    const int = mockIntegrations.find(i => i.id === intId);
                    if (!int) return null;
                    return (
                      <div key={intId} className="w-5 h-5 rounded-full bg-[var(--surface-2)] border border-[var(--border)] flex items-center justify-center shrink-0" title={int.name}>
                        <span className="text-[10px] font-bold" style={{color: int.color}}>{int.name[0]}</span>
                      </div>
                    );
                  })}
                </div>
                <p className="text-sm text-[var(--fg-3)] truncate">
                  {chat.preview}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 ml-4 shrink-0">
              <span className="text-xs text-[var(--fg-3)] hidden sm:block whitespace-nowrap">
                {formatRelativeTime(chat.date)}
              </span>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button 
                    className="w-8 h-8 flex items-center justify-center rounded-[var(--radius-sm)] text-[var(--fg-3)] hover:text-[var(--fg)] hover:bg-[var(--surface-2)] transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MoreHorizontal size={18} />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onOpen(chat.id); }}>
                    <Edit2 size={14} className="mr-2" /> Abrir conversa
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onTogglePin(chat.id); }}>
                    <Pin size={14} className="mr-2" /> {chat.pinned ? "Desfixar" : "Fixar no topo"}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={(e) => { e.stopPropagation(); addToast({type:'info', title:'Cópia criada'}); }}>
                    <Copy size={14} className="mr-2" /> Duplicar
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onExport("PDF"); }}>
                    <FileText size={14} className="mr-2" /> Exportar PDF
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onExport("Markdown"); }}>
                    <Download size={14} className="mr-2" /> Exportar Markdown
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    destructive 
                    onClick={(e) => { e.stopPropagation(); onDelete(chat.id); }}
                  >
                    <Trash2 size={14} className="mr-2" /> Excluir
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
