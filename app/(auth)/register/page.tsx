"use client";
import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function RegisterPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="text-center mb-2">
        <h1 className="text-2xl font-bold text-[var(--fg)]">Crie sua conta</h1>
        <p className="text-[var(--fg-3)] mt-1">Comece a usar o Bruce Agent hoje mesmo.</p>
      </div>

      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-lg)] p-6 shadow-sm">
        <div className="flex flex-col gap-4">
          <Input label="Nome completo" placeholder="Ex: Rafael Mendes" />
          <Input label="E-mail" placeholder="seu@email.com" type="email" />
          <Input label="Senha" placeholder="Mínimo de 8 caracteres" type="password" />
          
          <Button variant="primary" className="w-full mt-2" asChild>
            <Link href="/onboarding">Criar conta</Link>
          </Button>
        </div>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[var(--border)]"></div>
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-[var(--surface)] px-2 text-[var(--fg-3)]">Ou cadastre-se com</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Button variant="secondary" className="w-full text-[var(--fg-2)]">Google</Button>
          <Button variant="secondary" className="w-full text-[var(--fg-2)]">GitHub</Button>
        </div>
      </div>

      <p className="text-center text-sm text-[var(--fg-3)]">
        Já tem uma conta? <Link href="/login" className="text-[var(--accent)] hover:underline font-medium">Faça login</Link>
      </p>
    </div>
  );
}
