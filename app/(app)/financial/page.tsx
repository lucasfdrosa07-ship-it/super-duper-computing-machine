"use client";
import React, { useState } from "react";
import { 
  Plus, Search, TrendingDown, TrendingUp, DollarSign,
  AlertCircle, CheckCircle, RefreshCw, Paperclip, Edit2, 
  Trash2, ChevronLeft, ChevronRight, PieChart, CreditCard,
  X
} from "lucide-react";
import { cn, formatCurrency, formatDate } from "@/lib/utils";
import { mockFinancialRecords, financialCategories } from "@/lib/mock-data";
import { useAppStore } from "@/lib/store/app-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge, StatusBadge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ConfirmDialog, Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export default function FinancialPage() {
  const { addToast } = useAppStore();
  const [records, setRecords] = useState(mockFinancialRecords);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [monthOffset, setMonthOffset] = useState(0);
  
  // Modals
  const [recordModalOpen, setRecordModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showInfo, setShowInfo] = useState(true);

  // Derived state (mock logic for current month offset)
  const currentMonthDate = new Date();
  currentMonthDate.setMonth(currentMonthDate.getMonth() + monthOffset);
  const monthName = new Intl.DateTimeFormat("pt-BR", { month: "long", year: "numeric" }).format(currentMonthDate);

  // Calculate summaries
  const pendingBills = records.filter(r => r.type === "fatura" && r.status !== "paid").reduce((acc, curr) => acc + curr.amount, 0);
  const paidBills = records.filter(r => (r.type === "fatura" || r.type === "gasto") && r.status === "paid").reduce((acc, curr) => acc + curr.amount, 0);
  const totalReceived = records.filter(r => r.type === "recebimento" && r.status === "paid").reduce((acc, curr) => acc + curr.amount, 0);
  const balance = totalReceived - paidBills - pendingBills;

  // Filter records
  const filteredRecords = records.filter(r => {
    const matchSearch = r.description.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || r.status === statusFilter;
    const matchCategory = categoryFilter === "all" || r.category === categoryFilter;
    return matchSearch && matchStatus && matchCategory;
  });

  const getRecordsByType = (type: string) => filteredRecords.filter(r => r.type === type);

  // Actions
  const handleMarkPaid = (id: string) => {
    setRecords(prev => prev.map(r => r.id === id ? { ...r, status: "paid", paidDate: new Date().toISOString().split('T')[0] } : r));
    addToast({ type: "success", title: "Marcado como pago" });
  };

  const handleDelete = () => {
    if (deleteId) {
      setRecords(prev => prev.filter(r => r.id !== deleteId));
      addToast({ type: "success", title: "Registro excluído" });
    }
  };

  return (
    <div className="flex flex-col h-full bg-[var(--background)] max-w-6xl mx-auto px-4 py-6 md:px-8">
      {/* AI Hint */}
      {showInfo && (
        <div className="mb-6 bg-[var(--accent-subtle)] border border-[var(--accent)] border-opacity-30 rounded-[var(--radius-lg)] p-3 px-4 flex items-center justify-between animate-fade-in text-[var(--accent)] text-sm">
          <div className="flex items-center gap-3">
            <PieChart size={18} />
            <span>Bruce tem acesso ao seu histórico financeiro e pode responder perguntas sobre pagamentos no chat.</span>
          </div>
          <button onClick={() => setShowInfo(false)} className="opacity-70 hover:opacity-100 transition-opacity">
            <X size={16} />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
        <h1 className="text-2xl font-bold text-[var(--fg)]">Financeiro</h1>
        
        <div className="flex items-center justify-between w-full md:w-auto gap-4 bg-[var(--surface-2)] border border-[var(--border)] rounded-[var(--radius-lg)] p-1">
          <Button variant="ghost" size="icon-sm" onClick={() => setMonthOffset(p => p - 1)}>
            <ChevronLeft size={16} />
          </Button>
          <span className="text-sm font-semibold capitalize px-4 min-w-[140px] text-center">
            {monthName}
          </span>
          <Button variant="ghost" size="icon-sm" onClick={() => setMonthOffset(p => p + 1)}>
            <ChevronRight size={16} />
          </Button>
        </div>
        
        <Button variant="primary" className="w-full md:w-auto gap-2" onClick={() => setRecordModalOpen(true)}>
          <Plus size={16} /> Novo registro
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <SummaryCard 
          title="Total a Pagar" 
          value={pendingBills} 
          icon={AlertCircle} 
          color="var(--warning)" 
          bg="var(--warning-subtle)" 
          subtitle={`${records.filter(r => r.type === "fatura" && r.status !== "paid").length} contas pendentes`}
        />
        <SummaryCard 
          title="Total Pago" 
          value={paidBills} 
          icon={CheckCircle} 
          color="var(--fg-2)" 
          bg="var(--surface-3)" 
        />
        <SummaryCard 
          title="Total Recebido" 
          value={totalReceived} 
          icon={TrendingUp} 
          color="var(--accent)" 
          bg="var(--accent-subtle)" 
        />
        <SummaryCard 
          title="Saldo do Mês" 
          value={balance} 
          icon={DollarSign} 
          color={balance >= 0 ? "var(--success)" : "var(--danger)"} 
          bg={balance >= 0 ? "var(--success-subtle)" : "var(--danger-subtle)"} 
        />
      </div>

      {/* Main Content */}
      <div className="flex flex-col flex-1 min-h-0 bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-lg)] overflow-hidden">
        <Tabs defaultValue="faturas" className="flex flex-col h-full">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-b border-[var(--border)]">
            <TabsList>
              <TabsTrigger value="faturas">Faturas</TabsTrigger>
              <TabsTrigger value="gastos">Gastos</TabsTrigger>
              <TabsTrigger value="recebimentos">Recebimentos</TabsTrigger>
            </TabsList>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
              <div className="relative w-full sm:w-64">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--fg-3)]" />
                <input 
                  placeholder="Buscar..." 
                  className="w-full h-9 pl-9 pr-3 text-sm bg-[var(--surface-2)] border border-[var(--border)] rounded-[var(--radius)] text-[var(--fg)] focus:outline-none focus:border-[var(--accent)]"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[130px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Status</SelectItem>
                  <SelectItem value="paid">Pagos</SelectItem>
                  <SelectItem value="pending">Pendentes</SelectItem>
                  <SelectItem value="overdue">Atrasados</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            <TabsContent value="faturas" className="m-0 h-full flex flex-col gap-2">
              {getRecordsByType("fatura").length === 0 ? <EmptyState type="fatura" onAdd={() => setRecordModalOpen(true)} /> : 
                getRecordsByType("fatura").map(r => <RecordItem key={r.id} record={r} onMarkPaid={handleMarkPaid} onDelete={() => setDeleteId(r.id)} />)}
            </TabsContent>
            
            <TabsContent value="gastos" className="m-0 h-full flex flex-col gap-2">
              {getRecordsByType("gasto").length === 0 ? <EmptyState type="gasto" onAdd={() => setRecordModalOpen(true)} /> : 
                getRecordsByType("gasto").map(r => <RecordItem key={r.id} record={r} onMarkPaid={handleMarkPaid} onDelete={() => setDeleteId(r.id)} />)}
            </TabsContent>
            
            <TabsContent value="recebimentos" className="m-0 h-full flex flex-col gap-2">
              {getRecordsByType("recebimento").length === 0 ? <EmptyState type="recebimento" onAdd={() => setRecordModalOpen(true)} /> : 
                getRecordsByType("recebimento").map(r => <RecordItem key={r.id} record={r} onMarkPaid={handleMarkPaid} onDelete={() => setDeleteId(r.id)} />)}
            </TabsContent>
          </div>
        </Tabs>
      </div>

      <ConfirmDialog 
        open={!!deleteId} 
        onClose={() => setDeleteId(null)} 
        onConfirm={handleDelete}
        title="Excluir registro?"
        description="Tem certeza que deseja excluir este registro financeiro?"
      />
      
      {/* Mock modal just to show UI */}
      <Dialog open={recordModalOpen} onOpenChange={setRecordModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Novo Registro</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-4 px-6">
            <div className="flex gap-4">
              <Button variant="secondary" className="flex-1 bg-[var(--surface-2)] border-[var(--accent)] text-[var(--accent)]">Fatura</Button>
              <Button variant="secondary" className="flex-1">Gasto</Button>
              <Button variant="secondary" className="flex-1">Receita</Button>
            </div>
            <Input label="Descrição" placeholder="Ex: Aluguel" />
            <div className="flex gap-4">
              <Input label="Valor" placeholder="R$ 0,00" />
              <div className="flex flex-col gap-1.5 w-full">
                <label className="text-xs font-medium text-[var(--fg-2)]">Categoria</label>
                <Select defaultValue={financialCategories[0]}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {financialCategories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Input label="Data de Vencimento" type="date" />
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setRecordModalOpen(false)}>Cancelar</Button>
            <Button variant="primary" onClick={() => { setRecordModalOpen(false); addToast({type:'success', title:'Registro criado'}); }}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function SummaryCard({ title, value, icon: Icon, color, bg, subtitle }: any) {
  return (
    <div className="bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-lg)] p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-[var(--fg-2)]">{title}</span>
        <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: bg, color }}>
          <Icon size={16} />
        </div>
      </div>
      <div>
        <h3 className="text-2xl font-bold" style={{ color }}>{formatCurrency(value)}</h3>
        {subtitle && <p className="text-xs text-[var(--fg-3)] mt-1">{subtitle}</p>}
      </div>
    </div>
  );
}

function RecordItem({ record, onMarkPaid, onDelete }: any) {
  return (
    <div className="flex items-center justify-between p-4 rounded-[var(--radius)] bg-[var(--surface-2)] border border-[var(--border)] hover:border-[var(--border-2)] transition-colors group">
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{
          backgroundColor: record.status === 'paid' ? 'var(--success)' : record.status === 'overdue' ? 'var(--danger)' : 'var(--warning)'
        }} />
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-[var(--fg)] truncate">{record.description}</span>
            {record.recurring && <RefreshCw size={12} className="text-[var(--accent)] shrink-0" title="Recorrente" />}
          </div>
          <div className="flex items-center gap-3 text-xs text-[var(--fg-3)] mt-0.5">
            <span className="px-1.5 py-0.5 rounded-[var(--radius-sm)] border border-[var(--border)]">{record.category}</span>
            <span>Vence: {formatDate(record.dueDate)}</span>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-4 shrink-0 pl-4">
        <div className="flex flex-col items-end">
          <span className="font-bold text-[var(--fg)]">{formatCurrency(record.amount)}</span>
          <StatusBadge status={record.status} />
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="p-1 rounded-[var(--radius-sm)] text-[var(--fg-3)] hover:text-[var(--fg)] hover:bg-[var(--surface-3)]">
              <MoreHorizontal size={18} />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem><Edit2 size={14} className="mr-2" /> Editar</DropdownMenuItem>
            {record.status !== "paid" && (
              <DropdownMenuItem onClick={() => onMarkPaid(record.id)}>
                <CheckCircle size={14} className="mr-2 text-[var(--success)]" /> Marcar como pago
              </DropdownMenuItem>
            )}
            <DropdownMenuItem><Paperclip size={14} className="mr-2" /> Anexar comprovante</DropdownMenuItem>
            <DropdownMenuItem destructive onClick={onDelete}><Trash2 size={14} className="mr-2" /> Excluir</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

function EmptyState({ type, onAdd }: { type: string, onAdd: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center animate-fade-in">
      <div className="w-16 h-16 rounded-full bg-[var(--surface-2)] flex items-center justify-center mb-4">
        {type === "fatura" ? <CreditCard size={24} className="text-[var(--fg-3)]" /> : 
         type === "gasto" ? <TrendingDown size={24} className="text-[var(--fg-3)]" /> :
         <TrendingUp size={24} className="text-[var(--fg-3)]" />}
      </div>
      <h3 className="text-lg font-semibold text-[var(--fg)] mb-1">
        Nenhum{type === "fatura" ? "a fatura" : ` ${type}`}
      </h3>
      <p className="text-[var(--fg-3)] max-w-sm mb-6">
        Adicione registros para acompanhar suas finanças e permitir que a IA te ajude com insights.
      </p>
      <Button variant="primary" onClick={onAdd} className="gap-2">
        <Plus size={16} /> Adicionar {type}
      </Button>
    </div>
  );
}
