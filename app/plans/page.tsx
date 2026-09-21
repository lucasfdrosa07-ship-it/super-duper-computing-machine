import React from "react";
import Link from "next/link";
import { Check, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const plans = [
  {
    id: "free",
    name: "Gratuito",
    price: "R$ 0",
    period: "para sempre",
    description: "Para explorar o básico",
    features: [
      "100 créditos / mês",
      "Chat básico (modelo padrão)",
      "Histórico de 7 dias",
      "Até 3 integrações básicas",
      "Memória limitada (10 itens)"
    ],
    button: "Plano atual",
    variant: "outline"
  },
  {
    id: "plus",
    name: "Plus",
    price: "R$ 180",
    period: "por mês",
    description: "Para profissionais produtivos",
    popular: true,
    features: [
      "10.000 créditos / mês",
      "Modelos avançados (GPT-4, Claude)",
      "Histórico ilimitado",
      "Todas as integrações ilimitadas",
      "Memória profunda (100 itens)",
      "Automações básicas",
      "Upload de arquivos (até 50MB)"
    ],
    button: "Fazer upgrade",
    variant: "primary"
  },
  {
    id: "pro",
    name: "Pro",
    price: "R$ 450",
    period: "por mês",
    description: "Para uso intenso e fluxos complexos",
    features: [
      "50.000 créditos / mês",
      "Prioridade no tempo de resposta",
      "Modelos de raciocínio lógico profundo",
      "Automações avançadas ilimitadas",
      "Memória infinita",
      "Upload de arquivos grandes (até 1GB)",
      "Suporte prioritário"
    ],
    button: "Fazer upgrade",
    variant: "secondary"
  }
];

export default function PlansPage() {
  return (
    <div className="min-h-screen bg-[var(--background)] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <Button variant="ghost" className="gap-2 text-[var(--fg-3)]" asChild>
            <Link href="/settings?tab=billing"><ArrowLeft size={16} /> Voltar para configurações</Link>
          </Button>
        </div>

        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-3xl font-extrabold text-[var(--fg)] sm:text-5xl">
            Preços simples e transparentes
          </h1>
          <p className="mt-4 text-xl text-[var(--fg-3)]">
            Escolha o plano ideal para suas necessidades. Faça upgrade a qualquer momento.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start max-w-6xl mx-auto">
          {plans.map((plan) => (
            <div 
              key={plan.id}
              className={`relative flex flex-col p-8 rounded-3xl bg-[var(--surface)] border transition-all hover:scale-[1.02] ${plan.popular ? 'border-[var(--accent)] shadow-xl shadow-[var(--accent)]/10 ring-1 ring-[var(--accent)]' : 'border-[var(--border)]'}`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <Badge variant="accent" className="px-3 py-1 uppercase tracking-wider text-[10px] font-bold">
                    Mais popular
                  </Badge>
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-xl font-bold text-[var(--fg)]">{plan.name}</h3>
                <p className="text-sm text-[var(--fg-3)] mt-2 h-10">{plan.description}</p>
              </div>

              <div className="mb-8 flex items-baseline text-[var(--fg)]">
                <span className="text-4xl font-extrabold tracking-tight">{plan.price}</span>
                <span className="ml-1 text-sm font-medium text-[var(--fg-3)]">{plan.period}</span>
              </div>

              <ul className="flex-1 space-y-4 mb-8">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start">
                    <div className="flex-shrink-0 mt-0.5">
                      <Check size={16} className="text-[var(--success)]" />
                    </div>
                    <p className="ml-3 text-sm text-[var(--fg-2)]">{feature}</p>
                  </li>
                ))}
              </ul>

              <Button 
                variant={plan.variant as any} 
                className={`w-full py-6 text-base ${plan.variant === 'outline' ? 'bg-[var(--surface-2)] text-[var(--fg-2)] border border-[var(--border)]' : ''}`}
                asChild
              >
                <Link href={plan.id === 'free' ? '/chat' : `/checkout?plan=${plan.id}`}>
                  {plan.button}
                </Link>
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
