import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { calculateInterest, formatCurrency, addDebtor } from "@/lib/debtors";
import { Calculator, Plus } from "lucide-react";

interface InterestCalculatorProps {
  onDebtorAdded: () => void;
}

export function InterestCalculator({ onDebtorAdded }: InterestCalculatorProps) {
  const [name, setName] = useState("");
  const [principal, setPrincipal] = useState("");
  const [rate, setRate] = useState("");
  const [months, setMonths] = useState("");
  const [type, setType] = useState<"simple" | "compound">("simple");
  const [collateralDescription, setCollateralDescription] = useState("");
  const [collateralValue, setCollateralValue] = useState("");
  const [notes, setNotes] = useState("");
  const [result, setResult] = useState<{ interest: number; total: number } | null>(null);

  const handleCalc = () => {
    const p = parseFloat(principal);
    const r = parseFloat(rate);
    const m = parseInt(months);
    if (isNaN(p) || isNaN(r) || isNaN(m) || p <= 0 || r <= 0 || m <= 0) return;
    setResult(calculateInterest(p, r, m, type));
  };

  const handleAdd = () => {
    if (!result || !name.trim()) return;
    const p = parseFloat(principal);
    const r = parseFloat(rate);
    const m = parseInt(months);
    const dueDate = new Date();
    dueDate.setMonth(dueDate.getMonth() + m);
    addDebtor({
      name: name.trim(),
      principal: p,
      interestRate: r,
      interestType: type,
      periodMonths: m,
      interest: result.interest,
      total: result.total,
      dueDate: dueDate.toISOString().split("T")[0],
      status: "pendente",
      collateralDescription: collateralDescription.trim() || undefined,
      collateralValue: parseFloat(collateralValue) || undefined,
      notes: notes.trim() || undefined,
    });
    setName(""); setPrincipal(""); setRate(""); setMonths("");
    setCollateralDescription(""); setCollateralValue(""); setNotes("");
    setResult(null);
    onDebtorAdded();
  };

  return (
    <Card className="border-none shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Calculator className="h-5 w-5 text-primary" />
          Calculadora de Juros
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3">
        <div className="grid gap-1.5">
          <Label className="text-xs">Nome do Cliente</Label>
          <Input placeholder="Ex: João Silva" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="grid gap-1.5">
          <Label className="text-xs">Valor Principal (R$)</Label>
          <Input type="number" placeholder="0,00" value={principal} onChange={(e) => setPrincipal(e.target.value)} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="grid gap-1.5">
            <Label className="text-xs">Taxa (%/mês)</Label>
            <Input type="number" placeholder="0" value={rate} onChange={(e) => setRate(e.target.value)} />
          </div>
          <div className="grid gap-1.5">
            <Label className="text-xs">Período (meses)</Label>
            <Input type="number" placeholder="0" value={months} onChange={(e) => setMonths(e.target.value)} />
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant={type === "simple" ? "default" : "outline"} size="sm" className="flex-1 text-xs" onClick={() => setType("simple")}>
            Simples
          </Button>
          <Button variant={type === "compound" ? "default" : "outline"} size="sm" className="flex-1 text-xs" onClick={() => setType("compound")}>
            Compostos
          </Button>
        </div>

        {/* Collateral & Notes */}
        <div className="grid gap-1.5">
          <Label className="text-xs">Bem de Penhora (opcional)</Label>
          <Input placeholder="Ex: Veículo, Imóvel..." value={collateralDescription} onChange={(e) => setCollateralDescription(e.target.value)} />
        </div>
        <div className="grid gap-1.5">
          <Label className="text-xs">Valor da Garantia (R$)</Label>
          <Input type="number" placeholder="0,00" value={collateralValue} onChange={(e) => setCollateralValue(e.target.value)} />
        </div>
        <div className="grid gap-1.5">
          <Label className="text-xs">Observações</Label>
          <Textarea placeholder="Notas executivas..." rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} />
        </div>

        <Button onClick={handleCalc} className="w-full">Calcular</Button>

        {result && (
          <div className="rounded-lg bg-emerald-light p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Montante Final</span>
              <span className="font-bold text-foreground">{formatCurrency(result.total)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Total de Juros</span>
              <span className="font-semibold text-primary">{formatCurrency(result.interest)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Parcela Mensal</span>
              <span className="font-semibold text-foreground">
                {formatCurrency(result.total / parseInt(months || "1"))}
              </span>
            </div>
            {name.trim() && (
              <Button variant="outline" size="sm" className="w-full mt-2" onClick={handleAdd}>
                <Plus className="h-4 w-4 mr-1" /> Adicionar como Devedor
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
