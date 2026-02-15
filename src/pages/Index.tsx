import { useState, useMemo, useCallback, useEffect } from "react";
import { loadDebtors, sortDebtors } from "@/lib/debtors";
import { Debtor } from "@/lib/types";
import { MetricCards } from "@/components/MetricCards";
import { DebtorTable } from "@/components/DebtorTable";
import { InterestCalculator } from "@/components/InterestCalculator";
import { StatusChart } from "@/components/StatusChart"; // Novo Componente
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Landmark, LogOut } from "lucide-react"; 
import { logoutExecutivo } from "@/lib/auth_service";

const Index = () => {
  const [debtors, setDebtors] = useState<Debtor[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState("");
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const data = await loadDebtors();
      setDebtors(data);
    } catch (error) {
      console.error("Erro ao carregar devedores:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const filtered = useMemo(() => {
    let list = debtors;
    if (search) list = list.filter((d) => d.name.toLowerCase().includes(search.toLowerCase()));
    if (statusFilter !== "all") list = list.filter((d) => d.status === statusFilter);
    if (dateFilter) list = list.filter((d) => d.dueDate === dateFilter);
    return sortDebtors(list);
  }, [debtors, search, statusFilter, dateFilter]);

  const today = new Date().toLocaleDateString("pt-BR", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <header className="mb-6 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-primary p-2">
              <Landmark className="h-6 w-6 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">
              Gestão de <span className="text-primary">Cobranças</span>
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            <p className="text-sm text-muted-foreground capitalize">{today}</p>
            <button 
              onClick={() => logoutExecutivo()} 
              className="flex items-center gap-2 text-sm font-medium text-red-500 hover:text-red-700 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Sair
            </button>
          </div>
        </header>

        <section className="mb-6">
          <MetricCards debtors={debtors} />
        </section>

        {/* Filtros preservados */}
        <div className="flex flex-wrap gap-3 mb-6">
          <div className="relative max-w-xs flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome..."
              className="pl-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="atrasado">Atrasado</SelectItem>
              <SelectItem value="pendente">Pendente</SelectItem>
              <SelectItem value="pago">Pago</SelectItem>
            </SelectContent>
          </Select>
          <Input
            type="date"
            className="w-[170px]"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <section className="flex flex-col gap-6">
            {/* GRÁFICO INSERIDO AQUI: Visão executiva de status */}
            <StatusChart debtors={debtors} />

            <div>
              <h2 className="mb-3 text-lg font-semibold text-foreground">Lista de Devedores</h2>
              {loading ? (
                <p className="text-muted-foreground">Carregando dados da nuvem...</p>
              ) : (
                <DebtorTable debtors={filtered} onRefresh={refresh} />
              )}
            </div>
          </section>

          <aside>
            <InterestCalculator onDebtorAdded={refresh} />
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Index;