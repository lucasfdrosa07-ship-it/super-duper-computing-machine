"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Plus, Zap, Circle, Bell, Settings, User, CreditCard,
  LogOut, Sun, Moon, ChevronDown
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/lib/store/app-store";
import { mockUser } from "@/lib/mock-data";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const pageTitles: Record<string, string> = {
  "/chat": "Chat",
  "/history": "Histórico",
  "/financial": "Financeiro",
  "/integrations": "Integrações",
  "/notes": "Notas & Arquivos",
  "/automations": "Automações",
  "/personalization": "Personalização",
  "/settings": "Configurações",
};

const statusConfig = {
  online: { label: "Online", color: "bg-[var(--success)]" },
  thinking: { label: "Pensando...", color: "bg-[var(--accent)] animate-pulse" },
  processing: { label: "Processando...", color: "bg-[var(--warning)] animate-pulse" },
};

export function Header() {
  const pathname = usePathname();
  const { aiStatus, theme, toggleTheme, setActiveChatId, notifications } = useAppStore();
  const status = statusConfig[aiStatus];
  const title = pageTitles[pathname] || "Bruce Agent";
  const isChat = pathname === "/chat";

  return (
    <header className="h-14 border-b border-[var(--border)] bg-[var(--surface)] flex items-center justify-between px-4 shrink-0 z-30">
      {/* Left: page title */}
      <div className="flex items-center gap-3">
        <h1 className="text-sm font-semibold text-[var(--fg)]">{title}</h1>
        {isChat && (
          <div className="flex items-center gap-1.5">
            <span className={cn("w-1.5 h-1.5 rounded-full", status.color)} />
            <span className="text-xs text-[var(--fg-3)]">Bruce · {status.label}</span>
          </div>
        )}
      </div>

      {/* Right: actions */}
      <div className="flex items-center gap-1.5">
        {isChat && (
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setActiveChatId(null)}
            title="Novo chat"
          >
            <Plus size={16} />
          </Button>
        )}

        {/* Credits badge */}
        <Link
          href="/settings?tab=billing"
          className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-[var(--radius-sm)] bg-[var(--surface-2)] border border-[var(--border)] hover:border-[var(--border-2)] transition-all duration-150"
        >
          <Zap size={12} className="text-[var(--accent)]" />
          <span className="text-xs text-[var(--fg-2)]">
            {mockUser.credits.remaining.toLocaleString("pt-BR")} créditos
          </span>
        </Link>

        {/* Theme toggle */}
        <Button variant="ghost" size="icon-sm" onClick={toggleTheme} title="Alternar tema">
          {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
        </Button>

        {/* Notifications */}
        <Button variant="ghost" size="icon-sm" className="relative" title="Notificações">
          <Bell size={15} />
          {notifications > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-[var(--accent)] text-[9px] font-bold text-white flex items-center justify-center">
              {notifications}
            </span>
          )}
        </Button>

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-[var(--radius)] hover:bg-[var(--surface-2)] transition-all duration-150 focus:outline-none">
              <div className="w-7 h-7 rounded-full bg-[var(--accent)] flex items-center justify-center text-white text-xs font-semibold shrink-0">
                {mockUser.name.slice(0, 1)}
              </div>
              <div className="hidden sm:flex flex-col items-start">
                <span className="text-xs font-medium text-[var(--fg)] leading-none">{mockUser.name.split(" ")[0]}</span>
                <span className="text-[10px] text-[var(--fg-3)] leading-none mt-0.5 capitalize">{mockUser.plan}</span>
              </div>
              <ChevronDown size={13} className="text-[var(--fg-3)]" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>{mockUser.name}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/settings?tab=account" className="flex items-center gap-2">
                <User size={14} /> Perfil
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/settings?tab=billing" className="flex items-center gap-2">
                <CreditCard size={14} /> Plano & Cobrança
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/settings" className="flex items-center gap-2">
                <Settings size={14} /> Configurações
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/login" className="flex items-center gap-2" destructive>
                <LogOut size={14} /> Sair
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
