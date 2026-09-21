"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, ShieldCheck, CreditCard, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAppStore } from "@/lib/store/app-store";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const planId = searchParams?.get("plan") || "plus";
  const { addToast } = useAppStore();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const planInfo = planId === "pro" 
    ? { name: "Pro", price: "R$ 450,00" } 
    : { name: "Plus", price: "R$ 180,00" };

  const handleCheckout = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      addToast({ type: "success", title: "Pagamento aprovado!", description: `Bem-vindo ao plano ${planInfo.name}.` });
      router.push("/settings?tab=billing");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[var(--background)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16">
        
        {/* Left: Summary */}
        <div className="flex flex-col">
          <Link href="/plans" className="text-sm flex items-center gap-2 text-[var(--fg-3)] hover:text-[var(--fg)] mb-8 transition-colors w-fit">
            <ArrowLeft size={16} /> Voltar aos planos
          </Link>
          
          <h1 className="text-3xl font-bold text-[var(--fg)] mb-2">Finalizar assinatura</h1>
          <p className="text-[var(--fg-3)] mb-8">Complete seus dados para assinar o plano {planInfo.name}.</p>
          
          <div className="bg-[var(--surface-2)] border border-[var(--border)] p-6 rounded-[var(--radius-lg)] flex flex-col gap-4 mb-6">
            <h3 className="font-semibold text-[var(--fg)] border-b border-[var(--border)] pb-4 mb-2">Resumo do pedido</h3>
            
            <div className="flex justify-between text-[var(--fg-2)]">
              <span>Plano {planInfo.name} (Mensal)</span>
              <span>{planInfo.price}</span>
            </div>
            
            <div className="flex justify-between text-[var(--fg-3)] text-sm">
              <span>Impostos</span>
              <span>R$ 0,00</span>
            </div>
            
            <div className="flex justify-between text-[var(--fg)] font-bold text-lg border-t border-[var(--border)] pt-4 mt-2">
              <span>Total hoje</span>
              <span>{planInfo.price}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-3 text-sm text-[var(--fg-3)]">
            <ShieldCheck size={20} className="text-[var(--success)]" />
            <p>Seus dados estão protegidos por criptografia de ponta a ponta e processados de forma segura pelo Mercado Pago.</p>
          </div>
        </div>

        {/* Right: Payment Form */}
        <div className="bg-[var(--surface)] border border-[var(--border)] p-6 sm:p-8 rounded-2xl shadow-xl">
          <h2 className="text-xl font-bold text-[var(--fg)] mb-6 flex items-center gap-2">
            <CreditCard size={20} /> Dados de Pagamento
          </h2>

          <div className="flex flex-col gap-5">
            <div className="flex gap-2">
              <Button variant="secondary" className="flex-1 border-[var(--accent)] text-[var(--accent)] bg-[var(--accent-subtle)]">Cartão de Crédito</Button>
              <Button variant="secondary" className="flex-1 text-[var(--fg-3)] opacity-50 cursor-not-allowed">PIX</Button>
            </div>

            <div className="space-y-4 mt-2">
              <Input label="Número do cartão" placeholder="0000 0000 0000 0000" />
              
              <div className="grid grid-cols-2 gap-4">
                <Input label="Validade" placeholder="MM/AA" />
                <Input label="CVC" placeholder="123" type="password" maxLength={4} />
              </div>
              
              <Input label="Nome no cartão" placeholder="Ex: RAFAEL MENDES" />
              <Input label="CPF" placeholder="000.000.000-00" />
            </div>

            <Button 
              variant="primary" 
              className="w-full mt-4 h-12 text-base gap-2"
              onClick={handleCheckout}
              loading={loading}
            >
              <Lock size={16} /> Assinar por {planInfo.price}/mês
            </Button>
            
            <p className="text-xs text-center text-[var(--fg-3)] mt-2">
              Ao assinar, você concorda com nossos Termos de Serviço e Política de Privacidade.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
