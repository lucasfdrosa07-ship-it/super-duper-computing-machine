"use client";
import React, { useState } from "react";
import { 
  Zap, Plus, Clock, ArrowRight, MoreHorizontal, 
  Trash2, Edit2, Play, Activity, Settings, CheckCircle2,
  AlertCircle
} from "lucide-react";
import { cn, formatRelativeTime } from "@/lib/utils";
import { mockAutomations } from "@/lib/mock-data";
import { useAppStore } from "@/lib/store/app-store";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

export default function AutomationsPage() {
  const { addToast } = useAppStore();
  const [automations, setAutomations] = useState(mockAutomations);
  const [wizardOpen, setWizardOpen] = useState(false);
  const [wizardStep, setWizardStep] = useState(1);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const activeCount = automations.filter(a => a.active).length;
  const totalRuns = automations.reduce((acc, curr) => acc + curr.executions.length, 0);
  // mock estimate
  const estimatedCredits = activeCount * 450;

  const handleToggleActive = (id: string, current: boolean) => {
    setAutomations(prev => prev.map(a => a.id === id ? { ...a, active: !current } : a));
    addToast({ type: "info", title: `Automação ${!current ? 'ativada' : 'desativada'}` });
  };

  const handleNextStep = () => {
    if (wizardStep < 4) setWizardStep(p => p + 1);
    else {
      setWizardOpen(false);
      setWizardStep(1);
      addToast({ type: "success", title: "Automação criada com sucesso!" });
    }
  };

  return (
    <div className="flex flex-col h-full bg-[var(--background)] max-w-5xl mx-auto px-4 py-6 md:px-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-[var(--fg)]">Automações</h1>
          <Badge variant="outline" className="hidden sm:inline-flex">
            Consumo estimado: {estimatedCredits} créditos/mês
          </Badge>
        </div>
        
        <Button variant="primary" className="gap-2" onClick={() => setWizardOpen(true)}>
          <Plus size={16} /> Nova automação
        </Button>
      </div>

      {estimatedCredits > 7000 && (
        <div className="mb-6 p-3 bg-[var(--warning-subtle)] text-[var(--warning)] text-sm rounded-[var(--radius-lg)] border border-[var(--warning)] border-opacity-30 flex items-center gap-2">
          <AlertCircle size={16} />
          Seu consumo de automações está alto. Fique atento ao limite do seu plano.
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-lg)] p-4 flex flex-col gap-1">
          <div className="flex items-center gap-2 text-[var(--fg-3)] text-sm mb-1">
            <Activity size={16} /> Ativas
          </div>
          <span className="text-2xl font-bold text-[var(--fg)]">{activeCount}</span>
        </div>
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-lg)] p-4 flex flex-col gap-1">
          <div className="flex items-center gap-2 text-[var(--fg-3)] text-sm mb-1">
            <Play size={16} /> Execuções este mês
          </div>
          <span className="text-2xl font-bold text-[var(--fg)]">{totalRuns}</span>
        </div>
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-lg)] p-4 flex flex-col gap-1">
          <div className="flex items-center gap-2 text-[var(--fg-3)] text-sm mb-1">
            <Zap size={16} /> Créditos usados
          </div>
          <span className="text-2xl font-bold text-[var(--fg)]">{totalRuns * 15}</span>
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto pb-10 flex flex-col gap-4">
        {automations.map(auto => (
          <div key={auto.id} className="bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-lg)] overflow-hidden transition-all hover:border-[var(--border-2)]">
            <div className="p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-6">
              
              <div className="flex items-start gap-4 flex-1 min-w-0">
                <Switch 
                  checked={auto.active} 
                  onCheckedChange={() => handleToggleActive(auto.id, auto.active)} 
                  className="mt-1"
                />
                <div className="flex flex-col min-w-0">
                  <h3 className="font-semibold text-[var(--fg)] text-base truncate">{auto.name}</h3>
                  <p className="text-sm text-[var(--fg-3)] truncate mt-0.5">{auto.description}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm bg-[var(--surface-2)] p-2 rounded-[var(--radius)] shrink-0 self-start lg:self-auto overflow-x-auto w-full lg:w-auto scrollbar-hide">
                <Badge variant="outline" className="bg-[var(--surface)] shrink-0 gap-1.5 font-normal">
                  {auto.triggerType === 'schedule' ? <Clock size={12} /> : <Zap size={12} />}
                  {auto.triggerConfig.schedule || auto.triggerConfig.event}
                </Badge>
                <ArrowRight size={14} className="text-[var(--fg-3)] shrink-0 mx-1" />
                <span className="text-[var(--fg-2)] truncate max-w-[150px]">{auto.actionPrompt.split(' e ')[0]}</span>
              </div>

              <div className="flex items-center justify-between lg:justify-end gap-6 shrink-0 w-full lg:w-auto mt-2 lg:mt-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-[var(--border)]">
                <div className="flex flex-col lg:items-end text-xs">
                  <span className="text-[var(--fg-2)] font-medium">15 cr. / exc.</span>
                  <span className="text-[var(--fg-3)]">Última: {formatRelativeTime(auto.executions[0]?.date || '')}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" onClick={() => setExpandedId(expandedId === auto.id ? null : auto.id)}>
                    {expandedId === auto.id ? 'Ocultar' : 'Histórico'}
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="p-1.5 rounded-[var(--radius-sm)] text-[var(--fg-3)] hover:text-[var(--fg)] hover:bg-[var(--surface-2)]">
                        <MoreHorizontal size={16} />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem><Edit2 size={14} className="mr-2" /> Editar</DropdownMenuItem>
                      <DropdownMenuItem><Play size={14} className="mr-2" /> Executar agora</DropdownMenuItem>
                      <DropdownMenuItem destructive><Trash2 size={14} className="mr-2" /> Excluir</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

            </div>

            {/* Expanded History */}
            {expandedId === auto.id && (
              <div className="bg-[var(--surface-2)] border-t border-[var(--border)] p-4 sm:px-5">
                <h4 className="text-xs font-semibold text-[var(--fg-3)] uppercase tracking-wider mb-3">Últimas execuções</h4>
                <div className="flex flex-col gap-2">
                  {auto.executions.map((ex, i) => (
                    <div key={i} className="flex items-center justify-between text-sm py-1">
                      <div className="flex items-center gap-3">
                        {ex.status === 'success' ? <CheckCircle2 size={14} className="text-[var(--success)]" /> : <AlertCircle size={14} className="text-[var(--danger)]" />}
                        <span className="text-[var(--fg-2)] w-32">{new Date(ex.date).toLocaleString('pt-BR', {day:'2-digit', month:'2-digit', hour:'2-digit', minute:'2-digit'})}</span>
                        <span className="text-[var(--fg)] truncate max-w-[200px] sm:max-w-md">{ex.result}</span>
                      </div>
                      <span className="text-[var(--fg-3)] text-xs hidden sm:block">15 créditos</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Creation Wizard Mock */}
      <Dialog open={wizardOpen} onOpenChange={setWizardOpen}>
        <DialogContent className="sm:max-w-[600px] h-[80vh] sm:h-auto flex flex-col overflow-hidden">
          <DialogHeader className="shrink-0 border-b border-[var(--border)] pb-4">
            <div className="flex items-center justify-between mb-4">
              <DialogTitle>Nova Automação</DialogTitle>
              <div className="flex items-center gap-1 text-xs text-[var(--fg-3)] font-medium">
                <span className={wizardStep >= 1 ? "text-[var(--accent)]" : ""}>1</span> <span className="opacity-30">•</span>
                <span className={wizardStep >= 2 ? "text-[var(--accent)]" : ""}>2</span> <span className="opacity-30">•</span>
                <span className={wizardStep >= 3 ? "text-[var(--accent)]" : ""}>3</span> <span className="opacity-30">•</span>
                <span className={wizardStep >= 4 ? "text-[var(--accent)]" : ""}>4</span>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-[var(--fg)]">
              {wizardStep === 1 && "Escolha o gatilho"}
              {wizardStep === 2 && "Defina a ação da IA"}
              {wizardStep === 3 && "Configurações gerais"}
              {wizardStep === 4 && "Revisão"}
            </h3>
          </DialogHeader>
          
          <div className="flex-1 overflow-y-auto p-6 text-[var(--fg-2)] text-sm flex flex-col gap-4">
            {wizardStep === 1 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="border border-[var(--accent)] bg-[var(--accent-subtle)] p-4 rounded-[var(--radius-lg)] cursor-pointer">
                  <Clock size={20} className="text-[var(--accent)] mb-2" />
                  <h4 className="font-semibold text-[var(--fg)]">Agendamento</h4>
                  <p className="text-xs text-[var(--fg-3)] mt-1">Ex: Todos os dias às 08:00</p>
                </div>
                <div className="border border-[var(--border)] bg-[var(--surface-2)] hover:border-[var(--border-2)] p-4 rounded-[var(--radius-lg)] cursor-pointer transition-colors">
                  <Zap size={20} className="text-[var(--fg-3)] mb-2" />
                  <h4 className="font-semibold text-[var(--fg)]">Evento</h4>
                  <p className="text-xs text-[var(--fg-3)] mt-1">Ex: Quando receber um e-mail</p>
                </div>
              </div>
            )}
            {wizardStep > 1 && (
              <div className="flex items-center justify-center h-full text-[var(--fg-3)]">
                Conteúdo da etapa {wizardStep} simulado...
              </div>
            )}
          </div>

          <DialogFooter className="shrink-0 border-t border-[var(--border)] pt-4 mt-auto">
            <Button variant="ghost" onClick={() => wizardStep > 1 ? setWizardStep(p=>p-1) : setWizardOpen(false)}>
              {wizardStep > 1 ? "Voltar" : "Cancelar"}
            </Button>
            <Button variant="primary" onClick={handleNextStep}>
              {wizardStep === 4 ? "Criar automação" : "Próximo"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
