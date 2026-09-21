"use client";
import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { 
  User, Bell, CreditCard, Shield, LifeBuoy, Sliders, 
  Upload, Smartphone, Monitor, ChevronRight, Zap, Download,
  CheckCircle2
} from "lucide-react";
import { cn, formatDate } from "@/lib/utils";
import { mockUser, mockPaymentHistory, plans } from "@/lib/mock-data";
import { useAppStore } from "@/lib/store/app-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Badge, StatusBadge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ConfirmDialog } from "@/components/ui/dialog";

export default function SettingsPage() {
  const searchParams = useSearchParams();
  const initialTab = searchParams?.get("tab") || "account";
  const { addToast } = useAppStore();
  
  const [activeTab, setActiveTab] = useState(initialTab);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    if (searchParams?.get("tab")) {
      setActiveTab(searchParams.get("tab")!);
    }
  }, [searchParams]);

  const tabs = [
    { id: "account", label: "Conta", icon: User },
    { id: "preferences", label: "Preferências", icon: Sliders },
    { id: "notifications", label: "Notificações", icon: Bell },
    { id: "billing", label: "Plano & Cobrança", icon: CreditCard },
    { id: "privacy", label: "Privacidade", icon: Shield },
    { id: "support", label: "Suporte", icon: LifeBuoy },
  ];

  return (
    <div className="flex flex-col h-full bg-[var(--background)] max-w-6xl mx-auto px-4 py-6 md:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[var(--fg)]">Configurações</h1>
        <p className="text-[var(--fg-3)] mt-1">Gerencie sua conta e preferências do sistema.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8 flex-1 min-h-0">
        
        {/* Sidebar Nav */}
        <nav className="flex flex-row md:flex-col gap-1 w-full md:w-56 shrink-0 overflow-x-auto md:overflow-visible pb-2 md:pb-0 scrollbar-hide">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-[var(--radius)] text-sm font-medium transition-colors shrink-0",
                activeTab === t.id 
                  ? "bg-[var(--accent-subtle)] text-[var(--accent)]" 
                  : "text-[var(--fg-2)] hover:text-[var(--fg)] hover:bg-[var(--surface-2)]"
              )}
            >
              <t.icon size={16} className={activeTab === t.id ? "" : "text-[var(--fg-3)]"} />
              {t.label}
            </button>
          ))}
        </nav>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto pb-10">
          <div className="max-w-2xl animate-fade-in">
            
            {activeTab === "account" && (
              <div className="flex flex-col gap-10">
                <section>
                  <h3 className="text-lg font-semibold text-[var(--fg)] mb-4">Perfil</h3>
                  <div className="flex flex-col sm:flex-row gap-6">
                    <div className="flex flex-col items-center gap-3 shrink-0">
                      <div className="w-24 h-24 rounded-full bg-[var(--accent)] text-white text-3xl font-bold flex items-center justify-center">
                        {mockUser.name.charAt(0)}
                      </div>
                      <Button variant="outline" size="sm" className="gap-2">
                        <Upload size={14} /> Alterar foto
                      </Button>
                    </div>
                    <div className="flex-1 grid grid-cols-1 gap-4">
                      <Input label="Nome completo" defaultValue={mockUser.name} />
                      <Input label="E-mail" defaultValue={mockUser.email} disabled />
                      <div className="grid grid-cols-2 gap-4">
                        <Input label="Telefone" defaultValue="(11) 99999-9999" />
                        <Input label="Data de nascimento" type="date" defaultValue="1990-01-01" />
                      </div>
                      <Button variant="primary" className="w-fit mt-2" onClick={() => addToast({type:'success', title:'Perfil atualizado'})}>Salvar perfil</Button>
                    </div>
                  </div>
                </section>

                <div className="w-full h-px bg-[var(--border)]" />

                <section>
                  <h3 className="text-lg font-semibold text-[var(--fg)] mb-4">Segurança</h3>
                  <div className="flex flex-col gap-6">
                    <div className="bg-[var(--surface-2)] border border-[var(--border)] p-5 rounded-[var(--radius-lg)] flex flex-col gap-4">
                      <h4 className="font-medium text-[var(--fg)]">Alterar senha</h4>
                      <Input label="Senha atual" type="password" />
                      <Input label="Nova senha" type="password" />
                      <Input label="Confirmar nova senha" type="password" />
                      <Button variant="secondary" className="w-fit" onClick={() => addToast({type:'success', title:'Senha alterada'})}>Atualizar senha</Button>
                    </div>
                    
                    <div className="bg-[var(--surface-2)] border border-[var(--border)] p-5 rounded-[var(--radius-lg)] flex items-center justify-between gap-4">
                      <div>
                        <h4 className="font-medium text-[var(--fg)]">Autenticação em dois fatores (2FA)</h4>
                        <p className="text-sm text-[var(--fg-3)] mt-1">Adiciona uma camada extra de segurança.</p>
                      </div>
                      <Switch />
                    </div>
                  </div>
                </section>
                
                <div className="w-full h-px bg-[var(--border)]" />

                <section>
                  <h3 className="text-lg font-semibold text-[var(--fg)] mb-4">Sessões ativas</h3>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between p-3 border border-[var(--border)] rounded-[var(--radius-lg)]">
                      <div className="flex items-center gap-3">
                        <Monitor size={20} className="text-[var(--fg-3)]" />
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-[var(--fg)]">MacBook Pro (Este dispositivo)</span>
                          <span className="text-xs text-[var(--fg-3)]">São Paulo, Brasil • Ativo agora</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 border border-[var(--border)] rounded-[var(--radius-lg)]">
                      <div className="flex items-center gap-3">
                        <Smartphone size={20} className="text-[var(--fg-3)]" />
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-[var(--fg)]">iPhone 13</span>
                          <span className="text-xs text-[var(--fg-3)]">São Paulo, Brasil • Ontem às 14:30</span>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="text-[var(--danger)]">Encerrar</Button>
                    </div>
                  </div>
                </section>
              </div>
            )}

            {activeTab === "billing" && (
              <div className="flex flex-col gap-10">
                <section>
                  <h3 className="text-lg font-semibold text-[var(--fg)] mb-4">Seu Plano</h3>
                  
                  <div className="bg-[var(--surface-2)] border border-[var(--accent)] border-opacity-30 rounded-[var(--radius-lg)] overflow-hidden">
                    <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border)] bg-[var(--surface)]">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-xl font-bold text-[var(--fg)] capitalize">{mockUser.plan}</h4>
                          <Badge variant="accent" className="uppercase text-[10px]">Ativo</Badge>
                        </div>
                        <p className="text-sm text-[var(--fg-3)]">Renova em {formatDate(new Date(Date.now() + 15*24*60*60*1000).toISOString())}</p>
                      </div>
                      <div className="flex flex-col sm:items-end">
                        <span className="text-2xl font-bold text-[var(--fg)]">R$ 180<span className="text-base text-[var(--fg-3)] font-normal">/mês</span></span>
                      </div>
                    </div>
                    
                    <div className="p-5 flex flex-col gap-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-[var(--fg-2)] font-medium">Consumo de Créditos</span>
                        <span className="text-[var(--fg)] font-bold">{mockUser.credits.used.toLocaleString()} / {mockUser.credits.total.toLocaleString()}</span>
                      </div>
                      <div className="h-2 w-full bg-[var(--surface-3)] rounded-full overflow-hidden flex">
                        <div className="h-full bg-[var(--accent)]" style={{ width: `${(3500/10000)*100}%` }} title="Chat" />
                        <div className="h-full bg-[var(--warning)]" style={{ width: `${(900/10000)*100}%` }} title="Automações" />
                      </div>
                      <div className="flex gap-4 text-xs">
                        <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-[var(--accent)]"/> <span className="text-[var(--fg-3)]">Chat (35%)</span></div>
                        <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-[var(--warning)]"/> <span className="text-[var(--fg-3)]">Automações (9%)</span></div>
                        <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-[var(--surface-3)]"/> <span className="text-[var(--fg-3)]">Livre (56%)</span></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex gap-3">
                    <Button variant="primary">Fazer upgrade</Button>
                    <Button variant="outline">Comprar créditos avulsos</Button>
                  </div>
                </section>

                <div className="w-full h-px bg-[var(--border)]" />

                <section>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-[var(--fg)]">Método de pagamento</h3>
                  </div>
                  <div className="flex items-center justify-between p-4 border border-[var(--border)] rounded-[var(--radius-lg)] bg-[var(--surface)]">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-7 bg-white rounded border flex items-center justify-center font-bold text-[#1a1f36] italic text-xs">
                        Visa
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[var(--fg)]">Cartão terminando em 4242</p>
                        <p className="text-xs text-[var(--fg-3)]">Expira em 12/28</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">Editar</Button>
                  </div>
                </section>

                <section>
                  <h3 className="text-lg font-semibold text-[var(--fg)] mb-4">Histórico de cobranças</h3>
                  <div className="border border-[var(--border)] rounded-[var(--radius-lg)] overflow-hidden">
                    <table className="w-full text-sm text-left">
                      <thead className="bg-[var(--surface-2)] text-[var(--fg-3)] text-xs uppercase">
                        <tr>
                          <th className="px-4 py-3 font-medium">Data</th>
                          <th className="px-4 py-3 font-medium">Descrição</th>
                          <th className="px-4 py-3 font-medium text-right">Valor</th>
                          <th className="px-4 py-3 font-medium">Status</th>
                          <th className="px-4 py-3"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[var(--border)]">
                        {mockPaymentHistory.map((p, i) => (
                          <tr key={i} className="bg-[var(--surface)]">
                            <td className="px-4 py-3 text-[var(--fg-2)] whitespace-nowrap">{formatDate(p.date)}</td>
                            <td className="px-4 py-3 text-[var(--fg)]">{p.description}</td>
                            <td className="px-4 py-3 text-right text-[var(--fg)] font-medium">R$ 180,00</td>
                            <td className="px-4 py-3"><StatusBadge status={p.status} /></td>
                            <td className="px-4 py-3 text-right">
                              <Button variant="ghost" size="icon-sm" className="text-[var(--fg-3)]"><Download size={14} /></Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
              </div>
            )}

            {activeTab === "notifications" && (
              <div className="flex flex-col gap-8">
                <section>
                  <h3 className="text-lg font-semibold text-[var(--fg)] mb-4">Canais de recebimento</h3>
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between p-4 bg-[var(--surface-2)] border border-[var(--border)] rounded-[var(--radius-lg)]">
                      <div>
                        <p className="font-medium text-[var(--fg)]">E-mail</p>
                        <p className="text-sm text-[var(--fg-3)]">rafael@exemplo.com</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between p-4 bg-[var(--surface-2)] border border-[var(--border)] rounded-[var(--radius-lg)]">
                      <div>
                        <p className="font-medium text-[var(--fg)]">Push (Navegador)</p>
                        <p className="text-sm text-[var(--fg-3)]">Neste dispositivo</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </section>

                <section>
                  <h3 className="text-lg font-semibold text-[var(--fg)] mb-4">Tipos de alerta</h3>
                  <div className="flex flex-col gap-4 border border-[var(--border)] rounded-[var(--radius-lg)] p-4">
                    {[
                      { title: "Lembretes financeiros", desc: "Alertas de faturas próximas do vencimento" },
                      { title: "Resumo diário", desc: "Receba um resumo do seu dia toda manhã" },
                      { title: "Alertas da IA", desc: "Quando Bruce identificar algo importante" },
                      { title: "Alertas de automações", desc: "Status de execução (erros e sucessos)" },
                    ].map(item => (
                      <div key={item.title} className="flex items-center justify-between py-2">
                        <div>
                          <p className="text-sm font-medium text-[var(--fg)]">{item.title}</p>
                          <p className="text-xs text-[var(--fg-3)]">{item.desc}</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            )}

            {activeTab === "privacy" && (
              <div className="flex flex-col gap-8">
                <section>
                  <h3 className="text-lg font-semibold text-[var(--fg)] mb-4">Meus Dados</h3>
                  <div className="bg-[var(--surface-2)] border border-[var(--border)] p-5 rounded-[var(--radius-lg)] flex flex-col gap-3">
                    <p className="text-sm text-[var(--fg-2)] leading-relaxed">
                      Você tem controle total sobre os dados armazenados na plataforma. Pode solicitar uma cópia de tudo que a IA sabe sobre você a qualquer momento.
                    </p>
                    <Button variant="secondary" className="w-fit gap-2 mt-2" onClick={() => addToast({type:'success', title:'Exportação iniciada', description:'Você receberá um e-mail com os dados.'})}>
                      <Download size={14} /> Exportar meus dados (.json)
                    </Button>
                  </div>
                </section>

                <section>
                  <h3 className="text-lg font-semibold text-[var(--fg)] mb-4">Permissões da IA</h3>
                  <div className="flex flex-col gap-4 border border-[var(--border)] rounded-[var(--radius-lg)] p-4">
                    {[
                      { title: "Acessar histórico financeiro", desc: "Permite que a IA leia faturas e gastos para responder perguntas." },
                      { title: "Acessar notas e arquivos", desc: "Permite usar arquivos que você fez upload como contexto." },
                      { title: "Criar automações", desc: "Permite que a IA sugira e crie automações com base no seu uso." },
                    ].map(item => (
                      <div key={item.title} className="flex items-center justify-between py-2 border-b border-[var(--border)] last:border-0 last:pb-0">
                        <div className="pr-8">
                          <p className="text-sm font-medium text-[var(--fg)]">{item.title}</p>
                          <p className="text-xs text-[var(--fg-3)] mt-0.5">{item.desc}</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                    ))}
                  </div>
                </section>

                <section>
                  <h3 className="text-lg font-semibold text-[var(--danger)] mb-4">Zona de Perigo</h3>
                  <div className="border border-[var(--danger)] border-opacity-30 p-5 rounded-[var(--radius-lg)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h4 className="font-medium text-[var(--fg)]">Excluir conta</h4>
                      <p className="text-sm text-[var(--fg-3)] mt-1">Isso apagará todos os seus dados e não pode ser desfeito.</p>
                    </div>
                    <Button variant="destructive" onClick={() => setDeleteDialogOpen(true)}>Excluir conta</Button>
                  </div>
                </section>
              </div>
            )}

            {/* Other tabs omitted for brevity but UI is complete and navigable */}
            {activeTab === "preferences" && (
              <div className="flex flex-col items-center justify-center py-20 text-[var(--fg-3)]">
                Utilize a aba <strong>Personalização</strong> no menu principal para configurar o Tema e as preferências da IA.
              </div>
            )}
            
            {activeTab === "support" && (
              <div className="flex flex-col items-center justify-center py-20 text-[var(--fg-3)]">
                Central de Suporte. Em caso de dúvidas, envie e-mail para suporte@bruceagent.com
              </div>
            )}

          </div>
        </div>
      </div>

      <ConfirmDialog 
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={() => {}}
        title="Tem certeza absoluta?"
        description="Esta ação excluirá permanentemente sua conta e todos os dados associados a ela."
        confirmLabel="Sim, excluir conta"
      />
    </div>
  );
}
