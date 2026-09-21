"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  MessageSquare, DollarSign, FileText, Plug, MoreHorizontal,
  Bot
} from "lucide-react";
import { cn } from "@/lib/utils";

const bottomItems = [
  { href: "/chat", icon: MessageSquare, label: "Chat" },
  { href: "/financial", icon: DollarSign, label: "Financeiro" },
  { href: "/notes", icon: FileText, label: "Notas" },
  { href: "/integrations", icon: Plug, label: "Integrações" },
  { href: "/settings", icon: MoreHorizontal, label: "Mais" },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[var(--surface)] border-t border-[var(--border)] flex items-center justify-around px-2 pb-safe md:hidden">
      {bottomItems.map((item) => {
        const active = pathname === item.href || pathname.startsWith(item.href + "/");
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center gap-1 py-2 px-3 rounded-[var(--radius)] transition-all duration-150",
              active ? "text-[var(--accent)]" : "text-[var(--fg-3)] hover:text-[var(--fg-2)]"
            )}
          >
            <item.icon size={20} />
            <span className="text-[10px] font-medium">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
