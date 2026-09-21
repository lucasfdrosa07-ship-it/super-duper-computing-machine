"use client";
import React, { useState } from "react";
import { 
  Search, LayoutGrid, List, Plus, FileText, Link as LinkIcon, 
  Image as ImageIcon, Music, Video, Star, MoreVertical, 
  Trash2, Download, ExternalLink, Edit2, Bot, UploadCloud
} from "lucide-react";
import { cn, formatRelativeTime, truncate } from "@/lib/utils";
import { mockNotes } from "@/lib/mock-data";
import { useAppStore } from "@/lib/store/app-store";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { ConfirmDialog } from "@/components/ui/dialog";

export default function NotesPage() {
  const { addToast } = useAppStore();
  const [view, setView] = useState<"grid" | "list">("grid");
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterFav, setFilterFav] = useState(false);
  const [items, setItems] = useState(mockNotes);
  
  // Modals state
  const [createNoteOpen, setCreateNoteOpen] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Filters
  const filteredItems = items.filter(i => {
    const matchSearch = i.title.toLowerCase().includes(search.toLowerCase());
    const matchType = filterType === "all" || i.type === filterType;
    const matchFav = filterFav ? i.favorite : true;
    return matchSearch && matchType && matchFav;
  });

  const handleToggleFavorite = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setItems(prev => prev.map(i => i.id === id ? { ...i, favorite: !i.favorite } : i));
  };

  const handleDelete = () => {
    if (deleteId) {
      setItems(prev => prev.filter(i => i.id !== deleteId));
      addToast({ type: "success", title: "Item excluído" });
    }
  };

  const handleUseInChat = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    addToast({ type: "success", title: "Adicionado ao contexto", description: "O item estará disponível na sua próxima mensagem." });
  };

  const types = [
    { id: "all", label: "Todos" },
    { id: "note", label: "Notas" },
    { id: "link", label: "Links" },
    { id: "pdf", label: "PDFs" },
    { id: "image", label: "Imagens" },
    { id: "audio", label: "Áudio" },
  ];

  return (
    <div className="flex flex-col h-full bg-[var(--background)] max-w-6xl mx-auto px-4 py-6 md:px-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[var(--fg)]">Notas & Arquivos</h1>
          <p className="text-[var(--fg-3)] mt-1">Sua base de conhecimento pessoal para a IA.</p>
        </div>
        
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="primary" className="gap-2">
                <Plus size={16} /> Criar
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => setCreateNoteOpen(true)}>
                <FileText size={14} className="mr-2" /> Nova nota
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => addToast({type:'info', title:'Modal visual'})}>
                <LinkIcon size={14} className="mr-2" /> Adicionar link
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setUploadOpen(true)}>
                <UploadCloud size={14} className="mr-2" /> Fazer upload
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6 bg-[var(--surface)] p-2 rounded-[var(--radius-lg)] border border-[var(--border)]">
        <div className="flex flex-1 items-center gap-2 overflow-x-auto w-full scrollbar-hide pb-1 md:pb-0">
          <div className="relative shrink-0 w-48 mr-2">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--fg-3)]" />
            <input 
              placeholder="Buscar..." 
              className="w-full h-8 pl-8 pr-3 text-sm bg-[var(--surface-2)] border border-[var(--border)] rounded-[var(--radius)] text-[var(--fg)] focus:outline-none focus:border-[var(--accent)]"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          
          <div className="w-px h-6 bg-[var(--border)] shrink-0 mx-1" />
          
          {types.map(t => (
            <button
              key={t.id}
              onClick={() => setFilterType(t.id)}
              className={cn(
                "px-3 py-1.5 text-xs font-medium rounded-[var(--radius-sm)] transition-colors shrink-0",
                filterType === t.id 
                  ? "bg-[var(--accent)] text-white" 
                  : "bg-transparent text-[var(--fg-2)] hover:bg-[var(--surface-2)]"
              )}
            >
              {t.label}
            </button>
          ))}
          
          <div className="w-px h-6 bg-[var(--border)] shrink-0 mx-1" />
          
          <button
            onClick={() => setFilterFav(!filterFav)}
            className={cn(
              "px-3 py-1.5 text-xs font-medium rounded-[var(--radius-sm)] transition-colors shrink-0 flex items-center gap-1.5",
              filterFav 
                ? "bg-[var(--accent-subtle)] text-[var(--accent)]" 
                : "bg-transparent text-[var(--fg-2)] hover:bg-[var(--surface-2)]"
            )}
          >
            <Star size={14} className={filterFav ? "fill-current" : ""} /> Favoritos
          </button>
        </div>
        
        <div className="flex items-center gap-1 shrink-0 self-end md:self-auto">
          <Button variant={view === "grid" ? "secondary" : "ghost"} size="icon-sm" onClick={() => setView("grid")}>
            <LayoutGrid size={16} />
          </Button>
          <Button variant={view === "list" ? "secondary" : "ghost"} size="icon-sm" onClick={() => setView("list")}>
            <List size={16} />
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto pb-10">
        {filteredItems.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-[var(--surface-2)] flex items-center justify-center mb-4">
              <FileText size={24} className="text-[var(--fg-3)]" />
            </div>
            <h3 className="text-lg font-semibold text-[var(--fg)] mb-1">Nenhum item encontrado</h3>
            <p className="text-[var(--fg-3)] max-w-sm">
              Salve notas, links e arquivos aqui para o Bruce ter acesso.
            </p>
          </div>
        ) : view === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 animate-fade-in">
            {filteredItems.map(item => (
              <ItemCard key={item.id} item={item} onFav={handleToggleFavorite} onDelete={() => setDeleteId(item.id)} onUse={handleUseInChat} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-2 animate-fade-in">
            {filteredItems.map(item => (
              <ItemList key={item.id} item={item} onFav={handleToggleFavorite} onDelete={() => setDeleteId(item.id)} onUse={handleUseInChat} />
            ))}
          </div>
        )}
      </div>

      {/* Create Note Modal */}
      <Dialog open={createNoteOpen} onOpenChange={setCreateNoteOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Nova Nota</DialogTitle>
          </DialogHeader>
          <div className="px-6 py-4 flex flex-col gap-4">
            <input 
              placeholder="Título da nota" 
              className="w-full text-xl font-bold bg-transparent border-none outline-none placeholder:text-[var(--fg-3)]" 
              autoFocus
            />
            <div className="flex items-center gap-1 border-y border-[var(--border)] py-2">
              <Button variant="ghost" size="icon-sm"><strong className="font-serif">B</strong></Button>
              <Button variant="ghost" size="icon-sm"><em className="font-serif">I</em></Button>
              <Button variant="ghost" size="icon-sm" className="underline decoration-1 underline-offset-2 font-serif">U</Button>
              <div className="w-px h-4 bg-[var(--border)] mx-1" />
              <Button variant="ghost" size="icon-sm"><List size={14} /></Button>
            </div>
            <textarea 
              placeholder="Comece a escrever..." 
              className="w-full h-48 bg-transparent border-none outline-none resize-none text-[var(--fg)] placeholder:text-[var(--fg-3)] leading-relaxed"
            />
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setCreateNoteOpen(false)}>Cancelar</Button>
            <Button variant="primary" onClick={() => { setCreateNoteOpen(false); addToast({type:'success', title:'Nota salva'}); }}>Salvar nota</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Upload Modal */}
      <Dialog open={uploadOpen} onOpenChange={setUploadOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Fazer Upload</DialogTitle>
          </DialogHeader>
          <div className="px-6 py-6">
            <div className="w-full border-2 border-dashed border-[var(--border-2)] hover:border-[var(--accent)] hover:bg-[var(--accent-subtle)] rounded-[var(--radius-lg)] p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-colors" onClick={() => addToast({type:'success', title:'Arquivo em upload', description:'Aguarde a conclusão...'})}>
              <UploadCloud size={32} className="text-[var(--accent)] mb-3" />
              <h4 className="font-medium text-[var(--fg)]">Arraste arquivos aqui ou clique</h4>
              <p className="text-xs text-[var(--fg-3)] mt-2 max-w-xs">
                Suporta PDF, Imagens (PNG/JPG), Áudio e Vídeo. Limite: 5 GB/arquivo.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setUploadOpen(false)}>Cancelar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog 
        open={!!deleteId} 
        onClose={() => setDeleteId(null)} 
        onConfirm={handleDelete}
        title="Excluir item?"
        description="Esta ação removerá o arquivo permanentemente da sua base."
      />
    </div>
  );
}

function getTypeIcon(type: string) {
  switch(type) {
    case 'note': return <FileText size={16} />;
    case 'link': return <LinkIcon size={16} />;
    case 'pdf': return <FileText size={16} className="text-[#ef4444]" />;
    case 'image': return <ImageIcon size={16} className="text-[#3b82f6]" />;
    case 'audio': return <Music size={16} className="text-[#8b5cf6]" />;
    case 'video': return <Video size={16} className="text-[#f59e0b]" />;
    default: return <FileText size={16} />;
  }
}

function ItemCard({ item, onFav, onDelete, onUse }: any) {
  return (
    <div className="group relative flex flex-col h-48 bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-lg)] overflow-hidden hover:border-[var(--border-2)] transition-colors cursor-pointer">
      <div className="absolute top-2 right-2 flex items-center gap-1 z-10">
        <button onClick={(e) => onFav(item.id, e)} className="w-8 h-8 flex items-center justify-center rounded-full bg-[var(--surface)]/80 backdrop-blur border border-[var(--border)] text-[var(--fg-3)] hover:text-[var(--accent)] transition-colors">
          <Star size={14} className={item.favorite ? "fill-[var(--accent)] text-[var(--accent)]" : ""} />
        </button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-[var(--surface)]/80 backdrop-blur border border-[var(--border)] text-[var(--fg-3)] hover:text-[var(--fg)] opacity-0 group-hover:opacity-100 transition-opacity" onClick={e => e.stopPropagation()}>
              <MoreVertical size={14} />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onUse}><Bot size={14} className="mr-2" /> Usar no Chat</DropdownMenuItem>
            {(item.type === 'note' || item.type === 'link') && <DropdownMenuItem><Edit2 size={14} className="mr-2" /> Editar</DropdownMenuItem>}
            {(item.type !== 'note' && item.type !== 'link') && <DropdownMenuItem><Download size={14} className="mr-2" /> Baixar</DropdownMenuItem>}
            {item.type === 'link' && <DropdownMenuItem><ExternalLink size={14} className="mr-2" /> Abrir link</DropdownMenuItem>}
            <DropdownMenuItem destructive onClick={(e) => { e.stopPropagation(); onDelete(item.id); }}><Trash2 size={14} className="mr-2" /> Excluir</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Visual Header based on type */}
      {item.type === 'image' ? (
        <div className="h-24 bg-[var(--surface-2)] flex items-center justify-center border-b border-[var(--border)] shrink-0">
          <ImageIcon size={24} className="text-[var(--fg-3)]" />
        </div>
      ) : item.type === 'pdf' ? (
        <div className="h-24 bg-[var(--danger-subtle)] flex items-center justify-center border-b border-[var(--border)] shrink-0">
          <Badge variant="danger" className="text-lg px-3 py-1">PDF</Badge>
        </div>
      ) : item.type === 'link' ? (
        <div className="h-24 bg-[var(--surface-2)] flex flex-col p-4 border-b border-[var(--border)] shrink-0 justify-end">
          <span className="text-xs text-[var(--accent)] truncate">{item.url}</span>
        </div>
      ) : (
        <div className="h-24 p-4 border-b border-[var(--border)] shrink-0 overflow-hidden relative">
          <div className="absolute top-3 left-3 text-[var(--fg-3)] opacity-20">
            <FileText size={48} />
          </div>
          <p className="text-xs text-[var(--fg-2)] line-clamp-4 relative z-10 leading-relaxed font-serif">
            {item.content || "Sem conteúdo"}
          </p>
        </div>
      )}

      {/* Footer info */}
      <div className="flex flex-col p-3 flex-1 justify-between min-h-0 bg-[var(--surface)]">
        <h4 className="text-sm font-semibold text-[var(--fg)] truncate" title={item.title}>{item.title}</h4>
        <div className="flex items-center justify-between mt-auto">
          <div className="flex gap-1 overflow-hidden">
            {item.tags.slice(0, 2).map((t: string) => (
              <span key={t} className="text-[10px] bg-[var(--surface-2)] border border-[var(--border)] text-[var(--fg-3)] px-1.5 py-0.5 rounded-[var(--radius-sm)] truncate">#{t}</span>
            ))}
          </div>
          <span className="text-[10px] text-[var(--fg-3)] shrink-0 ml-2">{formatRelativeTime(item.updatedAt)}</span>
        </div>
      </div>
    </div>
  );
}

function ItemList({ item, onFav, onDelete, onUse }: any) {
  return (
    <div className="group flex items-center justify-between p-3 rounded-[var(--radius-lg)] bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--border-2)] transition-colors cursor-pointer">
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <div className="w-10 h-10 rounded-[var(--radius)] bg-[var(--surface-2)] flex items-center justify-center shrink-0">
          {getTypeIcon(item.type)}
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-sm font-medium text-[var(--fg)] truncate">{item.title}</span>
          <div className="flex items-center gap-2 mt-0.5 text-xs text-[var(--fg-3)]">
            <span className="capitalize">{item.type}</span>
            <span>•</span>
            <span>{formatRelativeTime(item.updatedAt)}</span>
            {item.size && (
              <>
                <span>•</span>
                <span>{(item.size / 1024 / 1024).toFixed(1)} MB</span>
              </>
            )}
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-2 shrink-0">
        <button onClick={(e) => onFav(item.id, e)} className="p-2 text-[var(--fg-3)] hover:text-[var(--accent)] transition-colors">
          <Star size={16} className={item.favorite ? "fill-[var(--accent)] text-[var(--accent)]" : ""} />
        </button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="p-2 text-[var(--fg-3)] hover:text-[var(--fg)] transition-colors opacity-0 group-hover:opacity-100" onClick={e => e.stopPropagation()}>
              <MoreVertical size={16} />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onUse}><Bot size={14} className="mr-2" /> Usar no Chat</DropdownMenuItem>
            <DropdownMenuItem destructive onClick={(e) => { e.stopPropagation(); onDelete(item.id); }}><Trash2 size={14} className="mr-2" /> Excluir</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
