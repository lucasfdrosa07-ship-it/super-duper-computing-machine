"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle2, ArrowRight } from "lucide-react";

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [goal, setGoal] = useState("");

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
  };

  return (
    <div className="flex flex-col gap-6 max-w-lg mx-auto">
      {/* Progress */}
      <div className="flex gap-2 mb-4">
        <div className={`h-1 flex-1 rounded-full ${step >= 1 ? 'bg-[var(--accent)]' : 'bg-[var(--surface-3)]'}`} />
        <div className={`h-1 flex-1 rounded-full ${step >= 2 ? 'bg-[var(--accent)]' : 'bg-[var(--surface-3)]'}`} />
        <div className={`h-1 flex-1 rounded-full ${step >= 3 ? 'bg-[var(--accent)]' : 'bg-[var(--surface-3)]'}`} />
      </div>

      {step === 1 && (
        <div className="animate-fade-in flex flex-col gap-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-[var(--fg)]">Como você pretende usar o Bruce?</h1>
            <p className="text-[var(--fg-3)] mt-2">Isso nos ajuda a personalizar sua experiência.</p>
          </div>
          
          <div className="flex flex-col gap-3">
            {[
              { id: "work", title: "Para o trabalho", desc: "Aumentar produtividade, gerenciar tarefas, emails" },
              { id: "personal", title: "Uso pessoal", desc: "Organização diária, finanças pessoais, estudos" },
              { id: "both", title: "Ambos", desc: "Quero centralizar minha vida inteira no Bruce" }
            ].map(item => (
              <button 
                key={item.id}
                onClick={() => setGoal(item.id)}
                className={`p-4 rounded-[var(--radius-lg)] border text-left flex items-start justify-between transition-all ${goal === item.id ? 'bg-[var(--accent-subtle)] border-[var(--accent)]' : 'bg-[var(--surface)] border-[var(--border)] hover:border-[var(--border-2)]'}`}
              >
                <div>
                  <h3 className={`font-medium ${goal === item.id ? 'text-[var(--accent)]' : 'text-[var(--fg)]'}`}>{item.title}</h3>
                  <p className="text-sm text-[var(--fg-3)] mt-1">{item.desc}</p>
                </div>
                {goal === item.id && <CheckCircle2 size={20} className="text-[var(--accent)]" />}
              </button>
            ))}
          </div>
          
          <Button variant="primary" className="mt-4" onClick={handleNext} disabled={!goal}>Continuar</Button>
        </div>
      )}

      {step === 2 && (
        <div className="animate-fade-in flex flex-col gap-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-[var(--fg)]">Conecte suas ferramentas</h1>
            <p className="text-[var(--fg-3)] mt-2">O Bruce funciona melhor quando integrado aos apps que você já usa.</p>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {['Google Calendar', 'Gmail', 'Notion', 'Slack', 'GitHub', 'Linear'].map(tool => (
              <div key={tool} className="flex flex-col items-center gap-2 p-4 bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-lg)] text-center">
                <div className="w-10 h-10 bg-[var(--surface-2)] rounded-[var(--radius)] flex items-center justify-center font-bold text-[var(--fg-2)]">{tool[0]}</div>
                <span className="text-xs text-[var(--fg-2)]">{tool}</span>
              </div>
            ))}
          </div>
          
          <div className="flex gap-3 mt-4">
            <Button variant="ghost" className="flex-1" onClick={handleNext}>Pular</Button>
            <Button variant="primary" className="flex-1" onClick={handleNext}>Conectar depois</Button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="animate-fade-in flex flex-col gap-6 text-center py-8">
          <div className="w-20 h-20 bg-[var(--accent-subtle)] rounded-full flex items-center justify-center mx-auto mb-2 text-[var(--accent)]">
            <CheckCircle2 size={40} />
          </div>
          <h1 className="text-2xl font-bold text-[var(--fg)]">Tudo pronto, Rafael!</h1>
          <p className="text-[var(--fg-3)]">Seu assistente pessoal está configurado e pronto para ajudar.</p>
          
          <Button variant="primary" className="mt-6 gap-2 w-full max-w-xs mx-auto" asChild>
            <Link href="/chat">
              Ir para o Chat <ArrowRight size={16} />
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}
