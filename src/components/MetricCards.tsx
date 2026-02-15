import { Debtor } from "@/lib/types";
import { formatCurrency } from "@/lib/debtors";
import { Card, CardContent } from "@/components/ui/card";
import { 
  DollarSign, 
  TrendingUp, 
  Percent, 
  Clock, 
  CheckCircle2, 
  AlertCircle 
} from "lucide-react";

interface MetricCardsProps {
  debtors: Debtor[];
}

export const MetricCards = ({ debtors }: MetricCardsProps) => {
  // Cálculos baseados nos novos campos do seu debtors.ts
  const metrics = {
    capInvestido: debtors.reduce((acc, d) => acc + d.principal, 0),
    totalARec: debtors.reduce((acc, d) => acc + d.total, 0),
    juros: debtors.reduce((acc, d) => acc + d.interest, 0),
    
    pendentes: debtors.filter(d => d.status === "pendente"),
    recebidos: debtors.filter(d => d.status === "pago"),
    atrasados: debtors.filter(d => d.status === "atrasado"),
  };

  const cards = [
    { label: "Cap. Investido", value: metrics.capInvestido, icon: DollarSign, color: "text-emerald-600" },
    { label: "Total a Rec.", value: metrics.totalARec, icon: TrendingUp, color: "text-emerald-600" },
    { label: "Juros", value: metrics.juros, icon: Percent, color: "text-emerald-600" },
    { 
      label: "Pendentes", 
      value: metrics.pendentes.reduce((acc, d) => acc + d.total, 0), 
      count: metrics.pendentes.length,
      icon: Clock, 
      color: "text-amber-500" 
    },
    { 
      label: "Recebidos", 
      value: metrics.recebidos.reduce((acc, d) => acc + d.total, 0), 
      count: metrics.recebidos.length,
      icon: CheckCircle2, 
      color: "text-emerald-500" 
    },
    { 
      label: "Atrasados", 
      value: metrics.atrasados.reduce((acc, d) => acc + d.total, 0), 
      count: metrics.atrasados.length,
      icon: AlertCircle, 
      color: "text-red-500" 
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {cards.map((card) => (
        <Card key={card.label} className="border-none shadow-sm bg-white/50 backdrop-blur">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{card.label}</p>
                <h3 className="text-2xl font-bold mt-1">{formatCurrency(card.value)}</h3>
                {card.count !== undefined && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {card.count} empréstimo(s)
                  </p>
                )}
              </div>
              <div className={`rounded-full p-2 bg-slate-50 ${card.color}`}>
                <card.icon className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};