"use client";
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-[var(--radius-sm)] text-xs font-medium px-2 py-0.5 transition-colors",
  {
    variants: {
      variant: {
        default: "bg-[var(--surface-3)] text-[var(--fg-2)]",
        accent: "bg-[var(--accent-subtle)] text-[var(--accent)]",
        success: "bg-[var(--success-subtle)] text-[var(--success)]",
        warning: "bg-[var(--warning-subtle)] text-[var(--warning)]",
        danger: "bg-[var(--danger-subtle)] text-[var(--danger)]",
        outline: "border border-[var(--border-2)] text-[var(--fg-2)]",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; variant: "success" | "warning" | "danger" | "default" | "accent" | "outline" }> = {
    paid: { label: "Pago", variant: "success" },
    pending: { label: "Pendente", variant: "warning" },
    overdue: { label: "Atrasado", variant: "danger" },
    connected: { label: "Conectado", variant: "success" },
    disconnected: { label: "Desconectado", variant: "default" },
    connecting: { label: "Conectando...", variant: "accent" },
    error: { label: "Erro", variant: "danger" },
    expired: { label: "Expirado", variant: "warning" },
    active: { label: "Ativa", variant: "success" },
    inactive: { label: "Inativa", variant: "default" },
    success: { label: "Sucesso", variant: "success" },
    online: { label: "Online", variant: "success" },
    thinking: { label: "Pensando", variant: "accent" },
    processing: { label: "Processando", variant: "accent" },
  };
  const cfg = map[status] ?? { label: status, variant: "default" as const };
  return <Badge variant={cfg.variant}>{cfg.label}</Badge>;
}
