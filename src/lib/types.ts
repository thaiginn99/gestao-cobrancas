export type DebtorStatus = "atrasado" | "pendente" | "pago";

export interface Debtor {
  id: string;
  name: string;
  principal: number;          // Alinhado com seu debtors.ts
  interestRate: number;       // Alinhado com seu debtors.ts
  interestType: "simple" | "compound";
  periodMonths: number;
  interest: number;
  total: number;
  dueDate: string;
  status: DebtorStatus;
  collateralDescription: string; // Para a penhora
  collateralValue: number;       // Valor da penhora
  notes: string;                 // Para os comentários
}