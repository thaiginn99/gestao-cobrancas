import { db } from "./firebase";
import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy 
} from "firebase/firestore";
import { Debtor } from "./types";

// Referência para a coleção no Firestore
const debtorsCollection = collection(db, "debtors");

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

// BUSCAR DADOS DO FIREBASE
export async function loadDebtors(): Promise<Debtor[]> {
  const q = query(debtorsCollection);
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    ...doc.data(),
    id: doc.id
  } as Debtor));
}

// ADICIONAR NO FIREBASE
export async function addDebtor(debtor: Omit<Debtor, "id">): Promise<void> {
  try {
    await addDoc(debtorsCollection, {
      ...debtor,
      createdAt: new Date().toISOString()
    });
  } catch (error) {
    console.error("Erro ao salvar no banco:", error);
    throw error;
  }
}

// ATUALIZAR NO FIREBASE
export async function updateDebtor(id: string, updates: Partial<Debtor>): Promise<void> {
  const debtorDoc = doc(db, "debtors", id);
  await updateDoc(debtorDoc, updates);
}

// DELETAR NO FIREBASE
export async function deleteDebtor(id: string): Promise<void> {
  const debtorDoc = doc(db, "debtors", id);
  await deleteDoc(debtorDoc);
}

export function formatCurrency(value: number): string {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

const statusOrder: Record<string, number> = { atrasado: 0, pendente: 1, pago: 2 };

export function sortDebtors(debtors: Debtor[]): Debtor[] {
  return [...debtors].sort((a, b) => (statusOrder[a.status] ?? 9) - (statusOrder[b.status] ?? 9));
}