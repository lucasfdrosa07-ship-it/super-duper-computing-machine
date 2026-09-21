"use client";
import React, { useState } from "react";
import { 
  Brain, Plus, Pencil, Trash2, CheckCircle2, 
  BarChart, Smile, Zap, Laugh, Palette
} from "lucide-react";
import { cn, formatRelativeTime } from "@/lib/utils";
import { mockMemories } from "@/lib/mock-data";
import { useAppStore } from "@/lib/store/app-store";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Input, Textarea } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

export default function PersonalizationPage() {
  const { addToast, theme, setTheme } = useAppStore();
  const [memories, setMemories] = useState(mockMemories);
  const [autoMemory, setAutoMemory] = useState(true);
  const [memoryFilter, setMemoryFilter] = useState("all");
  const [tone, setTone] = useState("direto");

  const filteredMemories = memories.filter(m => memoryFilter === "all" || m.type === memoryFilter);

  const memoryTypes = [
    { id: "all", label: "Todas" },
    { id: "pessoal", label: "Pessoal" },
    { id: "preferência", label: "Preferências" },
    { id: "trabalho", label: "Trabalho" },
    { id: "outros", label: "Outros" }
  ];

  return (
    <div className="flex flex-col h-full bg-[var(--background)] max-w-4xl mx-auto px-4 py-6 md:px-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[var(--fg)]">Personalização</h1>
        <p className="text-[var(--fg-3)] mt-1">Adapte o Bruce para trabalhar do seu jeito.</p>
      </div>

      <Tabs defaultValue="memoria" className="flex flex-col flex-1 min-h-0">
        <TabsList className="mb-6 w-full justify-start overflow-x-auto overflow-y-hidden border-b border-[var(--border)] pb-px scrollbar-hide shrink-0">
          <TabsTrigger value="memoria" className="gap-2"><Brain size={14} /> Memória da IA</TabsTrigger>
          <TabsTrigger value="instrucoes" className="gap-2"><Pencil size={14} /> Instruções</TabsTrigger>
          <TabsTrigger value="tema" className="gap-2"><Palette size={14} /> Tema & Interface</TabsTrigger>
        </TabsList>

        <div className="flex-1 overflow-y-auto pb-10">
          
          {/* TAB: Memória */}
          <TabsContent value="memoria" className="m-0 flex flex-col gap-6 animate-fade-in">
            <div className="bg-[var(--surface-2)] border border-[var(--border)] rounded-[var(--radius-lg)] p-5 flex items-center justify-between gap-4">
              <div>
                <h3 className="font-semibold text-[var(--fg)]">Memória automática</h3>
                <p className="text-sm text-[var(--fg-3)] mt-1">Quando ativada, Bruce pode salvar informações relevantes sobre você automaticamente durante as conversas.</p>
              </div>
              <Switch checked={autoMemory} onCheckedChange={setAutoMemory} />
            </div>

            {!autoMemory && (
              <div className="p-3 bg-[var(--warning-subtle)] text-[var(--warning)] text-sm rounded-[var(--radius-lg)] border border-[var(--warning)] border-opacity-30">
                A memória automática está desativada. Apenas memórias adicionadas manualmente serão usadas.
              </div>
            )}

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-hide">
                {memoryTypes.map(t => (
                  <button
                    key={t.id}
                    onClick={() => setMemoryFilter(t.id)}
                    className={cn(
                      "px-3 py-1.5 text-xs font-medium rounded-[var(--radius-sm)] transition-colors shrink-0",
                      memoryFilter === t.id ? "bg-[var(--surface-3)] text-[var(--fg)]" : "text-[var(--fg-3)] hover:bg-[var(--surface-2)] hover:text-[var(--fg-2)]"
                    )}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
              <Button variant="primary" size="sm" className="gap-2 shrink-0">
                <Plus size={14} /> Nova memória
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredMemories.map(m => (
                <div key={m.id} className="group flex flex-col bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-lg)] p-4 hover:border-[var(--border-2)] transition-colors">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <p className="text-sm text-[var(--fg)] leading-relaxed">{m.content}</p>
                    <Switch checked={m.active} onCheckedChange={() => {}} className="shrink-0 scale-75" />
                  </div>
                  <div className="flex items-center justify-between mt-auto pt-3">
                    <div className="flex items-center gap-2 text-[10px]">
                      <Badge variant="outline" className="bg-[var(--surface-2)] text-[var(--fg-3)] font-normal capitalize px-1.5">{m.type}</Badge>
                      <span className="text-[var(--fg-3)] capitalize flex items-center gap-1">
                        {m.source === 'automático' && <Zap size={10} />}
                        {m.source}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1.5 text-[var(--fg-3)] hover:text-[var(--fg)] rounded"><Pencil size={12} /></button>
                      <button className="p-1.5 text-[var(--fg-3)] hover:text-[var(--danger)] rounded"><Trash2 size={12} /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* TAB: Instruções */}
          <TabsContent value="instrucoes" className="m-0 animate-fade-in flex flex-col lg:flex-row gap-8">
            <div className="flex-1 flex flex-col gap-8 max-w-2xl">
              
              <section className="flex flex-col gap-4">
                <h3 className="font-semibold text-[var(--fg)]">Identidade</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input label="Apelido do assistente" defaultValue="Bruce" />
                  <Input label="Como você gostaria de ser chamado?" defaultValue="Rafael" />
                </div>
              </section>

              <section className="flex flex-col gap-4">
                <div>
                  <h3 className="font-semibold text-[var(--fg)]">Tom de conversa</h3>
                  <p className="text-sm text-[var(--fg-3)] mt-1">Como Bruce deve se comunicar com você?</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { id: 'formal', icon: BarChart, title: 'Formal', desc: 'Profissional e preciso' },
                    { id: 'casual', icon: Smile, title: 'Casual', desc: 'Descontraído e amigável' },
                    { id: 'direto', icon: Zap, title: 'Direto', desc: 'Objetivo, sem rodeios' },
                    { id: 'engracado', icon: Laugh, title: 'Engraçado', desc: 'Leveza e humor' },
                  ].map(t => (
                    <button 
                      key={t.id}
                      onClick={() => setTone(t.id)}
                      className={cn(
                        "flex items-start gap-3 p-3 rounded-[var(--radius-lg)] border text-left transition-all",
                        tone === t.id ? "bg-[var(--accent-subtle)] border-[var(--accent)]" : "bg-[var(--surface-2)] border-[var(--border)] hover:border-[var(--border-2)]"
                      )}
                    >
                      <t.icon size={18} className={tone === t.id ? "text-[var(--accent)] mt-0.5" : "text-[var(--fg-3)] mt-0.5"} />
                      <div>
                        <h4 className={cn("font-medium text-sm", tone === t.id ? "text-[var(--accent)]" : "text-[var(--fg)]")}>{t.title}</h4>
                        <p className="text-xs text-[var(--fg-3)] mt-0.5">{t.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </section>

              <section className="flex flex-col gap-4">
                <div>
                  <h3 className="font-semibold text-[var(--fg)]">Instruções personalizadas</h3>
                  <p className="text-sm text-[var(--fg-3)] mt-1">Regras específicas que o Bruce deve sempre seguir.</p>
                </div>
                <Textarea 
                  placeholder="Ex: Sempre use bullet points. Não me chame de sr. Fale sempre em português." 
                  className="h-32"
                  defaultValue="Seja o mais sucinto possível. Não use emojis a menos que eu peça. Sempre apresente valores financeiros em BRL formatado."
                />
              </section>

              <div className="pt-4 flex justify-end border-t border-[var(--border)]">
                <Button variant="primary" onClick={() => addToast({type:'success', title:'Instruções salvas'})}>Salvar alterações</Button>
              </div>
            </div>
            
            <div className="hidden lg:block w-80 shrink-0">
              <div className="sticky top-0 bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-lg)] p-4 flex flex-col gap-4">
                <h4 className="text-xs font-semibold text-[var(--fg-3)] uppercase tracking-wider">Preview do Tom</h4>
                
                <div className="flex flex-col gap-3 text-sm">
                  <div className="bg-[var(--accent)] text-white rounded-[var(--radius)] rounded-tr-sm p-3 self-end max-w-[85%]">
                    Resuma a reunião de hoje.
                  </div>
                  <div className="bg-[var(--surface-2)] text-[var(--fg)] border border-[var(--border)] rounded-[var(--radius)] rounded-tl-sm p-3 self-start max-w-[95%]">
                    <strong className="block mb-1 text-[var(--fg)]">Resumo: Reunião de Alinhamento Q3</strong>
                    <ul className="list-disc pl-4 text-[var(--fg-2)] flex flex-col gap-1 mt-2">
                      <li>Aprovado orçamento de marketing de R$ 50.000.</li>
                      <li>Lançamento da v2.0 adiado para 15/10.</li>
                      <li>João enviará os designs finais até sexta.</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* TAB: Tema */}
          <TabsContent value="tema" className="m-0 animate-fade-in flex flex-col gap-8 max-w-2xl">
            <section className="flex flex-col gap-4">
              <h3 className="font-semibold text-[var(--fg)]">Tema Base</h3>
              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => setTheme('dark')}
                  className={cn(
                    "flex flex-col gap-3 p-3 rounded-[var(--radius-lg)] border text-left transition-all",
                    theme === 'dark' ? "border-[var(--accent)] bg-[var(--surface)]" : "border-[var(--border)] bg-[var(--surface-2)] opacity-70 hover:opacity-100"
                  )}
                >
                  <div className="w-full h-24 bg-[#0a0a0a] rounded-[var(--radius-sm)] border border-[#262626] flex flex-col p-2 gap-2">
                    <div className="w-full h-3 bg-[#171717] rounded-sm" />
                    <div className="w-2/3 h-3 bg-[#262626] rounded-sm" />
                    <div className="w-1/2 h-8 bg-[#3b82f6] bg-opacity-20 rounded-sm mt-auto self-end" />
                  </div>
                  <div className="flex items-center justify-between w-full">
                    <span className="font-medium text-[var(--fg)]">Escuro</span>
                    {theme === 'dark' && <CheckCircle2 size={16} className="text-[var(--accent)]" />}
                  </div>
                </button>

                <button 
                  onClick={() => setTheme('light')}
                  className={cn(
                    "flex flex-col gap-3 p-3 rounded-[var(--radius-lg)] border text-left transition-all",
                    theme === 'light' ? "border-[var(--accent)] bg-[var(--surface)]" : "border-[var(--border)] bg-[var(--surface-2)] opacity-70 hover:opacity-100"
                  )}
                >
                  <div className="w-full h-24 bg-white rounded-[var(--radius-sm)] border border-gray-200 flex flex-col p-2 gap-2">
                    <div className="w-full h-3 bg-gray-100 rounded-sm" />
                    <div className="w-2/3 h-3 bg-gray-200 rounded-sm" />
                    <div className="w-1/2 h-8 bg-blue-100 rounded-sm mt-auto self-end" />
                  </div>
                  <div className="flex items-center justify-between w-full">
                    <span className="font-medium text-[var(--fg)]">Claro</span>
                    {theme === 'light' && <CheckCircle2 size={16} className="text-[var(--accent)]" />}
                  </div>
                </button>
              </div>
            </section>

            <section className="flex flex-col gap-4 opacity-50 pointer-events-none" title="Em breve">
              <h3 className="font-semibold text-[var(--fg)] flex items-center gap-2">
                Temas de Destaque <Badge variant="outline" className="text-[10px]">Em breve</Badge>
              </h3>
              <div className="grid grid-cols-4 gap-3">
                {['Midnight', 'Ocean', 'Forest', 'Sand'].map((t, i) => (
                  <div key={t} className="flex flex-col gap-2">
                    <div className="w-full aspect-video rounded-[var(--radius)] bg-[var(--surface-3)]" />
                    <span className="text-xs text-[var(--fg-2)] text-center">{t}</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="flex flex-col gap-6">
              <h3 className="font-semibold text-[var(--fg)]">Aparência</h3>
              
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-[var(--fg)]">Tamanho da fonte</label>
                <Slider defaultValue={[50]} max={100} step={50} />
                <div className="flex justify-between text-xs text-[var(--fg-3)] mt-1">
                  <span>Pequeno</span>
                  <span>Normal</span>
                  <span>Grande</span>
                </div>
              </div>

              <div className="flex flex-col gap-1.5 w-full">
                <label className="text-sm font-medium text-[var(--fg)]">Fonte principal</label>
                <Select defaultValue="inter">
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="inter">Inter (Padrão)</SelectItem>
                    <SelectItem value="roboto">Roboto</SelectItem>
                    <SelectItem value="mono">JetBrains Mono</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </section>
          </TabsContent>

        </div>
      </Tabs>
    </div>
  );
}
