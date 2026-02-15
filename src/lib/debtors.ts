import { Debtor } from "./types";

const STORAGE_KEY = "cobrancas-debtors";

function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

export function calculateInterest(
  principal: number,
  rate: number,
  months: number,
  type: "simple" | "compound"
): { interest: number; total: number } {
  const r = rate / 100;
  if (type === "simple") {
    const interest = principal * r * months;
    return { interest, total: principal + interest };
  }
  const total = principal * Math.pow(1 + r, months);
  return { interest: total - principal, total };
}

const sampleDebtors: Debtor[] = [
  {
    id: generateId(), name: "João Silva", principal: 5000, interestRate: 3,
    interestType: "simple", periodMonths: 6, interest: 900, total: 5900,
    dueDate: "2026-03-15", status: "pendente",
    collateralDescription: "Veículo - Honda Civic 2020", collateralValue: 85000,
    notes: "Cliente com bom histórico. Prometeu pagamento parcial em março.",
  },
  {
    id: generateId(), name: "Maria Oliveira", principal: 12000, interestRate: 2.5,
    interestType: "compound", periodMonths: 12, interest: 4120.76, total: 16120.76,
    dueDate: "2026-01-10", status: "atrasado",
    collateralDescription: "Imóvel - Apartamento Centro", collateralValue: 250000,
    notes: "Em atraso desde janeiro. Contato realizado em 05/02 sem retorno.",
  },
  {
    id: generateId(), name: "Carlos Santos", principal: 3000, interestRate: 4,
    interestType: "simple", periodMonths: 3, interest: 360, total: 3360,
    dueDate: "2025-12-20", status: "pago",
    collateralDescription: "", collateralValue: 0,
    notes: "Pagamento quitado integralmente em 18/12/2025.",
  },
  {
    id: generateId(), name: "Ana Costa", principal: 8000, interestRate: 2,
    interestType: "compound", periodMonths: 8, interest: 1365.69, total: 9365.69,
    dueDate: "2026-04-01", status: "pendente",
    collateralDescription: "Veículo - Toyota Corolla 2022", collateralValue: 120000,
    notes: "",
  },
  {
    id: generateId(), name: "Pedro Souza", principal: 15000, interestRate: 1.5,
    interestType: "simple", periodMonths: 10, interest: 2250, total: 17250,
    dueDate: "2025-11-30", status: "pago",
    collateralDescription: "Imóvel - Casa Residencial", collateralValue: 320000,
    notes: "Quitado antecipadamente. Excelente pagador.",
  },
];

export function loadDebtors(): Debtor[] {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) return JSON.parse(stored);
  saveDebtors(sampleDebtors);
  return sampleDebtors;
}

export function saveDebtors(debtors: Debtor[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(debtors));
}

export function addDebtor(debtor: Omit<Debtor, "id">): Debtor {
  const debtors = loadDebtors();
  const newDebtor = { ...debtor, id: generateId() };
  debtors.push(newDebtor);
  saveDebtors(debtors);
  return newDebtor;
}

export function updateDebtor(id: string, updates: Partial<Debtor>): void {
  const debtors = loadDebtors().map((d) => (d.id === id ? { ...d, ...updates } : d));
  saveDebtors(debtors);
}

export function deleteDebtor(id: string): void {
  saveDebtors(loadDebtors().filter((d) => d.id !== id));
}

export function formatCurrency(value: number): string {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

const statusOrder: Record<string, number> = { atrasado: 0, pendente: 1, pago: 2 };

export function sortDebtors(debtors: Debtor[]): Debtor[] {
  return [...debtors].sort((a, b) => (statusOrder[a.status] ?? 9) - (statusOrder[b.status] ?? 9));
}
