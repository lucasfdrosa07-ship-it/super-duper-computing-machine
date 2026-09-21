"use client";
import React, { useState, useEffect, useRef } from "react";
import { 
  Plus, Search, Pin, MoreHorizontal, Copy, Edit2, 
  ThumbsUp, ThumbsDown, BookmarkPlus, Paperclip, 
  Mic, Send, Bot, Calendar, CreditCard, Mail, Star, Check
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/lib/store/app-store";
import { mockChats } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { StatusBadge } from "@/components/ui/badge";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

export default function ChatPage() {
  const { activeChatId, setActiveChatId, setAiStatus, aiStatus, addToast } = useAppStore();
  const [input, setInput] = useState("");
  const [search, setSearch] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeChat = mockChats.find(c => c.id === activeChatId);

  useEffect(() => {
    if (activeChat) {
      setMessages(activeChat.messages || []);
    } else {
      setMessages([]);
    }
  }, [activeChatId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, aiStatus]);

  const handleSend = (text: string = input) => {
    if (!text.trim()) return;
    
    // Add user message
    const newMsg = {
      id: Date.now().toString(),
      role: "user",
      content: text,
      timestamp: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, newMsg]);
    setInput("");
    
    // If it was empty state, "create" a new chat visually
    if (!activeChatId) {
      setActiveChatId("new-chat");
    }

    // Simulate AI thinking and responding
    setAiStatus("thinking");
    setTimeout(() => {
      setAiStatus("processing");
      
      setTimeout(() => {
        const aiMsg = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "Esta é uma resposta simulada para a sua mensagem. Como este é um protótipo visual, as respostas reais da IA serão integradas posteriormente.\n\nMas eu entendi que você disse:\n> *" + text + "*\n\nPosso ajudar com mais alguma coisa?",
          timestamp: new Date().toISOString(),
          toolCalls: [
            { tool: "system", label: "Processando requisição", result: "Concluído", expanded: false }
          ],
          memoriesUsed: 1
        };
        setMessages(prev => [...prev, aiMsg]);
        setAiStatus("online");
      }, 1500);
    }, 1500);
  };

  const handleSuggestionClick = (text: string) => {
    handleSend(text);
  };

  const toggleToolCall = (msgId: string, toolIndex: number) => {
    setMessages(prev => prev.map(msg => {
      if (msg.id === msgId && msg.toolCalls) {
        const newTools = [...msg.toolCalls];
        newTools[toolIndex] = { ...newTools[toolIndex], expanded: !newTools[toolIndex].expanded };
        return { ...msg, toolCalls: newTools };
      }
      return msg;
    }));
  };

  // Chat list grouping (mock simple logic)
  const filteredChats = mockChats.filter(c => c.title.toLowerCase().includes(search.toLowerCase()));
  const pinnedChats = filteredChats.filter(c => c.pinned);
  const unpinnedChats = filteredChats.filter(c => !c.pinned);

  return (
    <div className="flex h-full overflow-hidden">
      {/* Left Sidebar - Chat History (Desktop only) */}
      <div className="hidden md:flex flex-col w-64 border-r border-[var(--border)] bg-[var(--surface-2)] shrink-0">
        <div className="p-3 border-b border-[var(--border)] flex flex-col gap-3">
          <Button 
            variant="primary" 
            className="w-full justify-start gap-2"
            onClick={() => setActiveChatId(null)}
          >
            <Plus size={16} /> Novo chat
          </Button>
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--fg-3)]" />
            <input 
              placeholder="Buscar conversas..." 
              className="w-full h-8 pl-8 pr-3 text-sm bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius)] text-[var(--fg)] placeholder:text-[var(--fg-3)] focus:outline-none focus:border-[var(--accent)]"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-2 flex flex-col gap-4">
          {pinnedChats.length > 0 && (
            <div className="flex flex-col gap-0.5">
              <span className="text-xs font-semibold text-[var(--fg-3)] px-2 mb-1 flex items-center gap-1">
                <Pin size={12} className="rotate-45" /> Fixados
              </span>
              {pinnedChats.map(chat => (
                <ChatListItem key={chat.id} chat={chat} isActive={activeChatId === chat.id} onClick={() => setActiveChatId(chat.id)} />
              ))}
            </div>
          )}
          
          <div className="flex flex-col gap-0.5">
            <span className="text-xs font-semibold text-[var(--fg-3)] px-2 mb-1">Recentes</span>
            {unpinnedChats.map(chat => (
              <ChatListItem key={chat.id} chat={chat} isActive={activeChatId === chat.id} onClick={() => setActiveChatId(chat.id)} />
            ))}
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-[var(--background)] relative">
        {/* Messages or Empty State */}
        <div className="flex-1 overflow-y-auto px-4 py-6 md:px-8">
          <div className="max-w-3xl mx-auto h-full flex flex-col">
            
            {!activeChatId && messages.length === 0 ? (
              // Empty State
              <div className="flex-1 flex flex-col items-center justify-center text-center animate-fade-in my-auto">
                <div className="w-16 h-16 rounded-2xl bg-[var(--accent-subtle)] flex items-center justify-center mb-6">
                  <Bot size={32} className="text-[var(--accent)]" />
                </div>
                <h2 className="text-2xl font-bold text-[var(--fg)] mb-2">Olá, Rafael!</h2>
                <p className="text-[var(--fg-2)] mb-8 max-w-md">
                  Bruce está pronto para ajudar. O que você precisa fazer hoje?
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-xl">
                  <SuggestionCard icon={Calendar} text="O que tenho hoje?" onClick={() => handleSuggestionClick("O que tenho hoje?")} />
                  <SuggestionCard icon={CreditCard} text="Algum pagamento vencendo?" onClick={() => handleSuggestionClick("Algum pagamento vencendo?")} />
                  <SuggestionCard icon={Mail} text="Resuma meus e-mails não lidos." onClick={() => handleSuggestionClick("Resuma meus e-mails não lidos.")} />
                  <SuggestionCard icon={Star} text="Quais são minhas prioridades?" onClick={() => handleSuggestionClick("Quais são minhas prioridades hoje?")} />
                </div>
              </div>
            ) : (
              // Active Chat Messages
              <div className="flex flex-col gap-6 pb-4">
                {messages.map((msg) => (
                  <div key={msg.id} className={cn(
                    "flex w-full",
                    msg.role === "user" ? "justify-end" : "justify-start"
                  )}>
                    <div className={cn(
                      "max-w-[85%] sm:max-w-[75%] rounded-[var(--radius-lg)] p-4 relative group transition-all",
                      msg.role === "user" 
                        ? "bg-[var(--accent)] text-white rounded-tr-sm" 
                        : "bg-[var(--surface-2)] border border-[var(--border)] text-[var(--fg)] rounded-tl-sm"
                    )}>
                      
                      {/* AI specific header: Memories and Tool calls */}
                      {msg.role === "assistant" && (
                        <div className="flex flex-col gap-2 mb-3">
                          {msg.memoriesUsed > 0 && (
                            <div className="flex items-center gap-1.5 cursor-pointer hover:opacity-80 transition-opacity w-fit" title="Memórias utilizadas">
                              <span className="text-base leading-none">🧠</span>
                              <span className="text-[10px] font-medium text-[var(--accent)] uppercase tracking-wider">Usou {msg.memoriesUsed} memórias</span>
                            </div>
                          )}
                          
                          {msg.toolCalls?.map((tool: any, i: number) => (
                            <div key={i} className="flex flex-col gap-1 bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-sm)] p-2 text-xs">
                              <div 
                                className="flex items-center gap-2 cursor-pointer select-none"
                                onClick={() => toggleToolCall(msg.id, i)}
                              >
                                {tool.result ? <Check size={14} className="text-[var(--success)]" /> : <div className="w-3.5 h-3.5 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />}
                                <span className="font-medium text-[var(--fg-2)] flex-1">{tool.label}</span>
                                <span className="text-[var(--fg-3)] text-[10px]">{tool.expanded ? 'Ocultar' : 'Expandir'}</span>
                              </div>
                              {tool.expanded && tool.result && (
                                <div className="mt-1 pl-5 text-[var(--fg-3)] border-l-2 border-[var(--border-2)] ml-1.5">
                                  {tool.result}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Message Content */}
                      <div className={cn(
                        "prose-chat whitespace-pre-wrap",
                        msg.role === "user" ? "text-white/90" : "text-[var(--fg-2)]"
                      )}>
                        {/* Rendering basic markdown manually for mockup */}
                        {msg.content.split('\n').map((line: string, i: number) => {
                          if (line.startsWith('> ')) {
                            return <div key={i} className="border-l-2 border-current pl-3 opacity-80 my-2 italic">{line.substring(2)}</div>;
                          }
                          if (line.startsWith('• ') || line.startsWith('- ')) {
                            return <div key={i} className="flex gap-2"><span className="opacity-50">•</span><span>{line.substring(2).replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}</span></div>;
                          }
                          // Handle bold
                          const parts = line.split(/(\*\*.*?\*\*)/g);
                          return (
                            <p key={i}>
                              {parts.map((part, j) => 
                                part.startsWith('**') && part.endsWith('**') 
                                  ? <strong key={j}>{part.slice(2, -2)}</strong>
                                  : part
                              )}
                            </p>
                          );
                        })}
                      </div>

                      {/* Message Actions (hover) */}
                      <div className={cn(
                        "absolute -bottom-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-[var(--surface)] border border-[var(--border)] rounded-full px-1 py-0.5 shadow-sm",
                        msg.role === "user" ? "right-2" : "left-2"
                      )}>
                        <button className="p-1 hover:bg-[var(--surface-2)] rounded-full text-[var(--fg-3)] hover:text-[var(--fg)]" title="Copiar" onClick={() => addToast({type:'success', title:'Copiado'})}><Copy size={12} /></button>
                        <button className="p-1 hover:bg-[var(--surface-2)] rounded-full text-[var(--fg-3)] hover:text-[var(--fg)]" title="Editar"><Edit2 size={12} /></button>
                        {msg.role === "assistant" && (
                          <>
                            <div className="w-px h-3 bg-[var(--border)] mx-0.5" />
                            <button className="p-1 hover:bg-[var(--surface-2)] rounded-full text-[var(--fg-3)] hover:text-[var(--success)]" title="Útil"><ThumbsUp size={12} /></button>
                            <button className="p-1 hover:bg-[var(--surface-2)] rounded-full text-[var(--fg-3)] hover:text-[var(--danger)]" title="Incorreto"><ThumbsDown size={12} /></button>
                            <button className="p-1 hover:bg-[var(--surface-2)] rounded-full text-[var(--fg-3)] hover:text-[var(--accent)]" title="Salvar como nota" onClick={() => addToast({type:'success', title:'Salvo em Notas'})}><BookmarkPlus size={12} /></button>
                          </>
                        )}
                      </div>

                    </div>
                  </div>
                ))}
                
                {/* AI Thinking Indicator */}
                {(aiStatus === "thinking" || aiStatus === "processing") && (
                  <div className="flex w-full justify-start animate-fade-in">
                    <div className="bg-[var(--surface-2)] border border-[var(--border)] rounded-[var(--radius-lg)] rounded-tl-sm p-4 flex items-center gap-2 text-[var(--fg-3)] text-sm">
                      <div className="flex items-center gap-1">
                        <span className="typing-dot" />
                        <span className="typing-dot" />
                        <span className="typing-dot" />
                      </div>
                      <span className="ml-2 font-medium">{aiStatus === "thinking" ? "Bruce está pensando..." : "Acessando ferramentas..."}</span>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-[var(--border)] bg-[var(--surface)] md:bg-transparent md:border-transparent md:p-6 md:pt-0 max-w-3xl w-full mx-auto relative">
          
          <div className="relative flex flex-col bg-[var(--surface-2)] border border-[var(--border)] rounded-[var(--radius-lg)] shadow-sm focus-within:ring-2 focus-within:ring-[var(--accent)] focus-within:border-transparent transition-all">
            <textarea 
              className="w-full bg-transparent p-3 pb-12 text-[var(--fg)] placeholder:text-[var(--fg-3)] resize-none outline-none min-h-[60px] max-h-[200px]"
              placeholder="Fale com Bruce..."
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
            />
            
            {/* Input Toolbar */}
            <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon-sm" className="rounded-full text-[var(--fg-3)]" title="Anexar arquivo" onClick={() => addToast({type:'info', title:'Funcionalidade visual', description:'Simula abertura de arquivo.'})}>
                  <Paperclip size={16} />
                </Button>
                <Button variant="ghost" size="icon-sm" className="rounded-full text-[var(--fg-3)]" title="Mensagem de voz">
                  <Mic size={16} />
                </Button>
              </div>
              <Button 
                variant="primary" 
                size="icon-sm" 
                className="rounded-full" 
                disabled={!input.trim() || aiStatus !== "online"}
                onClick={() => handleSend()}
              >
                <Send size={14} className={input.trim() ? "translate-x-[-1px] translate-y-[1px]" : ""} />
              </Button>
            </div>
          </div>
          
          <div className="text-center mt-2">
            <span className="text-[10px] text-[var(--fg-3)]">
              <span className="font-mono bg-[var(--surface-2)] px-1 rounded">/</span> comandos · <span className="font-mono bg-[var(--surface-2)] px-1 rounded">@</span> integrações
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function SuggestionCard({ icon: Icon, text, onClick }: { icon: any, text: string, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className="flex items-center gap-3 p-4 rounded-[var(--radius-lg)] bg-[var(--surface-2)] border border-[var(--border)] text-left hover:border-[var(--accent)] hover:bg-[var(--accent-subtle)] transition-all group"
    >
      <div className="w-8 h-8 rounded-full bg-[var(--surface-3)] flex items-center justify-center shrink-0 group-hover:bg-[var(--accent)] group-hover:text-white transition-colors text-[var(--fg-2)]">
        <Icon size={14} />
      </div>
      <span className="text-sm font-medium text-[var(--fg-2)] group-hover:text-[var(--accent)]">{text}</span>
    </button>
  );
}

function ChatListItem({ chat, isActive, onClick }: { chat: any, isActive: boolean, onClick: () => void }) {
  return (
    <div 
      className={cn(
        "group flex flex-col gap-1 p-2 rounded-[var(--radius)] cursor-pointer transition-all",
        isActive 
          ? "bg-[var(--accent-subtle)] border border-[var(--accent)] border-opacity-20" 
          : "hover:bg-[var(--surface-3)] border border-transparent"
      )}
      onClick={onClick}
    >
      <div className="flex items-center justify-between gap-2">
        <span className={cn(
          "text-sm font-medium truncate",
          isActive ? "text-[var(--accent)]" : "text-[var(--fg-2)] group-hover:text-[var(--fg)]"
        )}>
          {chat.title}
        </span>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="opacity-0 group-hover:opacity-100 p-0.5 rounded text-[var(--fg-3)] hover:text-[var(--fg)] hover:bg-[var(--surface)] transition-all" onClick={e => e.stopPropagation()}>
              <MoreHorizontal size={14} />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Renomear</DropdownMenuItem>
            <DropdownMenuItem>{chat.pinned ? "Desfixar" : "Fixar"}</DropdownMenuItem>
            <DropdownMenuItem>Exportar PDF</DropdownMenuItem>
            <DropdownMenuItem destructive>Excluir</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <span className="text-[10px] text-[var(--fg-3)] truncate">{chat.preview}</span>
    </div>
  );
}
