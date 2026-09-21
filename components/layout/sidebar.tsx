"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  MessageSquare, Clock, DollarSign, Plug, FileText,
  Palette, Settings, ChevronLeft, ChevronRight, Zap,
  Plus, Bot
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/lib/store/app-store";
import { mockChats } from "@/lib/mock-data";

const navItems = [
  { href: "/chat", icon: MessageSquare, label: "Chat" },
  { href: "/history", icon: Clock, label: "Histórico" },
  { href: "/financial", icon: DollarSign, label: "Financeiro" },
  { href: "/integrations", icon: Plug, label: "Integrações" },
  { href: "/notes", icon: FileText, label: "Notas & Arquivos" },
  { href: "/automations", icon: Zap, label: "Automações" },
  { href: "/personalization", icon: Palette, label: "Personalização" },
  { href: "/settings", icon: Settings, label: "Configurações" },
];

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarOpen, toggleSidebar, setActiveChatId, activeChatId } = useAppStore();
  const isChat = pathname === "/chat";

  return (
    <aside
      className={cn(
        "h-full bg-[var(--surface)] border-r border-[var(--border)] flex flex-col transition-all duration-200 shrink-0",
        sidebarOpen ? "w-60" : "w-14"
      )}
    >
      {/* Logo */}
      <div className={cn(
        "flex items-center h-14 border-b border-[var(--border)] px-3 shrink-0",
        sidebarOpen ? "gap-3" : "justify-center"
      )}>
        <div className="w-8 h-8 rounded-[var(--radius)] bg-[var(--accent)] flex items-center justify-center shrink-0">
          <Bot size={16} className="text-white" />
        </div>
        {sidebarOpen && (
          <span className="text-sm font-semibold text-[var(--fg)] truncate">Bruce Agent</span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 p-2 flex flex-col gap-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-[var(--radius)] px-2.5 py-2 text-sm transition-all duration-150 group",
                active
                  ? "bg-[var(--accent-subtle)] text-[var(--accent)]"
                  : "text-[var(--fg-3)] hover:text-[var(--fg)] hover:bg-[var(--surface-2)]",
                !sidebarOpen && "justify-center px-0"
              )}
              title={!sidebarOpen ? item.label : undefined}
            >
              <item.icon size={17} className="shrink-0" />
              {sidebarOpen && <span className="truncate">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Recent chats (only when chat is active and sidebar open) */}
      {isChat && sidebarOpen && (
        <div className="px-2 pb-2 flex flex-col gap-0.5 border-t border-[var(--border)] pt-2 max-h-56 overflow-y-auto">
          <p className="px-2 py-1 text-xs text-[var(--fg-3)] font-medium">Recentes</p>
          {mockChats.slice(0, 5).map((chat) => (
            <button
              key={chat.id}
              onClick={() => setActiveChatId(chat.id)}
              className={cn(
                "w-full text-left px-2.5 py-1.5 rounded-[var(--radius-sm)] text-xs transition-all duration-150 truncate",
                activeChatId === chat.id
                  ? "text-[var(--fg)] bg-[var(--surface-2)]"
                  : "text-[var(--fg-3)] hover:text-[var(--fg-2)] hover:bg-[var(--surface-2)]"
              )}
            >
              {chat.title}
            </button>
          ))}
        </div>
      )}

      {/* Toggle collapse */}
      <div className="border-t border-[var(--border)] p-2">
        <button
          onClick={toggleSidebar}
          className="flex items-center justify-center w-full h-8 rounded-[var(--radius)] text-[var(--fg-3)] hover:text-[var(--fg)] hover:bg-[var(--surface-2)] transition-all duration-150"
          title={sidebarOpen ? "Recolher" : "Expandir"}
        >
          {sidebarOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
        </button>
      </div>
    </aside>
  );
}
