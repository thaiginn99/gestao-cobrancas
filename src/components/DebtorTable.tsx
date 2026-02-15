import { useState } from "react";
import { Debtor } from "@/lib/types";
import { formatCurrency, deleteDebtor, updateDebtor } from "@/lib/debtors";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip, TooltipContent, TooltipProvider, TooltipTrigger,
} from "@/components/ui/tooltip";
import { CheckCircle2, Pencil, Trash2, ShieldCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DebtorTableProps {
  debtors: Debtor[];
  onRefresh: () => void;
}

const statusConfig = {
  pago: { label: "Pago", className: "bg-success-light text-success border-0" },
  pendente: { label: "Pendente", className: "bg-warning-light text-warning border-0" },
  atrasado: { label: "Atrasado", className: "bg-danger-light text-danger border-0" },
};

export function DebtorTable({ debtors, onRefresh }: DebtorTableProps) {
  const { toast } = useToast();
  const [editDebtor, setEditDebtor] = useState<Debtor | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handlePay = (id: string) => {
    updateDebtor(id, { status: "pago" });
    onRefresh();
    toast({ title: "Pagamento registrado com sucesso!" });
  };

  const handleDelete = () => {
    if (!deleteId) return;
    deleteDebtor(deleteId);
    setDeleteId(null);
    onRefresh();
    toast({ title: "Devedor excluído." });
  };

  const handleEditSave = () => {
    if (!editDebtor) return;
    updateDebtor(editDebtor.id, editDebtor);
    setEditDebtor(null);
    onRefresh();
    toast({ title: "Devedor atualizado!" });
  };

  return (
    <TooltipProvider>
      <>
        <div className="rounded-lg border bg-card shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>Nome</TableHead>
                <TableHead>Empréstimo</TableHead>
                <TableHead>Juros</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Vencimento</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {debtors.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    Nenhum devedor encontrado.
                  </TableCell>
                </TableRow>
              )}
              {debtors.map((d) => {
                const sc = statusConfig[d.status];
                const hasCollateral = !!d.collateralDescription?.trim();
                return (
                  <TableRow key={d.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-1.5">
                        {d.name}
                        {hasCollateral && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <ShieldCheck className="h-4 w-4 text-primary cursor-help" />
                            </TooltipTrigger>
                            <TooltipContent className="max-w-xs">
                              <p className="font-semibold text-xs">Garantia</p>
                              <p className="text-xs">{d.collateralDescription}</p>
                              {d.collateralValue ? (
                                <p className="text-xs mt-1">Valor: {formatCurrency(d.collateralValue)}</p>
                              ) : null}
                            </TooltipContent>
                          </Tooltip>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{formatCurrency(d.principal)}</TableCell>
                    <TableCell>{formatCurrency(d.interest)}</TableCell>
                    <TableCell className="font-semibold">{formatCurrency(d.total)}</TableCell>
                    <TableCell>{new Date(d.dueDate + "T12:00:00").toLocaleDateString("pt-BR")}</TableCell>
                    <TableCell>
                      <Badge className={sc.className}>{sc.label}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        {d.status !== "pago" && (
                          <Button size="icon" variant="ghost" onClick={() => handlePay(d.id)} title="Registrar Pagamento">
                            <CheckCircle2 className="h-4 w-4 text-success" />
                          </Button>
                        )}
                        <Button size="icon" variant="ghost" onClick={() => setEditDebtor({ ...d })} title="Editar">
                          <Pencil className="h-4 w-4 text-muted-foreground" />
                        </Button>
                        <Button size="icon" variant="ghost" onClick={() => setDeleteId(d.id)} title="Excluir">
                          <Trash2 className="h-4 w-4 text-danger" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        {/* Edit Dialog */}
        <Dialog open={!!editDebtor} onOpenChange={(o) => !o && setEditDebtor(null)}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Editar Devedor</DialogTitle>
              <DialogDescription>Altere as informações do devedor.</DialogDescription>
            </DialogHeader>
            {editDebtor && (
              <div className="grid gap-4 py-2">
                <div className="grid gap-2">
                  <Label>Nome</Label>
                  <Input value={editDebtor.name} onChange={(e) => setEditDebtor({ ...editDebtor, name: e.target.value })} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label>Principal (R$)</Label>
                    <Input type="number" value={editDebtor.principal} onChange={(e) => setEditDebtor({ ...editDebtor, principal: +e.target.value })} />
                  </div>
                  <div className="grid gap-2">
                    <Label>Vencimento</Label>
                    <Input type="date" value={editDebtor.dueDate} onChange={(e) => setEditDebtor({ ...editDebtor, dueDate: e.target.value })} />
                  </div>
                </div>
                {/* Collateral fields */}
                <div className="grid gap-2">
                  <Label>Descrição do Bem de Penhora</Label>
                  <Input
                    placeholder="Ex: Veículo - Honda Civic 2020"
                    value={editDebtor.collateralDescription || ""}
                    onChange={(e) => setEditDebtor({ ...editDebtor, collateralDescription: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Valor Avaliado da Garantia (R$)</Label>
                  <Input
                    type="number"
                    placeholder="0,00"
                    value={editDebtor.collateralValue || ""}
                    onChange={(e) => setEditDebtor({ ...editDebtor, collateralValue: +e.target.value })}
                  />
                </div>
                {/* Notes */}
                <div className="grid gap-2">
                  <Label>Observações Executivas</Label>
                  <Textarea
                    placeholder="Histórico de contatos, promessas de pagamento..."
                    rows={3}
                    value={editDebtor.notes || ""}
                    onChange={(e) => setEditDebtor({ ...editDebtor, notes: e.target.value })}
                  />
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditDebtor(null)}>Cancelar</Button>
              <Button onClick={handleEditSave}>Salvar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation */}
        <Dialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirmar Exclusão</DialogTitle>
              <DialogDescription>Tem certeza que deseja excluir este devedor? Esta ação não pode ser desfeita.</DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteId(null)}>Cancelar</Button>
              <Button variant="destructive" onClick={handleDelete}>Excluir</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </>
    </TooltipProvider>
  );
}
