import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Debtor } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface StatusChartProps {
  debtors: Debtor[];
}

const COLORS = {
  pago: '#10b981',      // Verde Sucesso
  pendente: '#f59e0b',   // Amarelo Alerta
  atrasado: '#ef4444',   // Vermelho Perigo
};

export function StatusChart({ debtors }: StatusChartProps) {
  // Processa os dados do Firebase para o gráfico
  const data = [
    { name: 'Pago', value: debtors.filter(d => d.status === 'pago').length },
    { name: 'Pendente', value: debtors.filter(d => d.status === 'pendente').length },
    { name: 'Atrasado', value: debtors.filter(d => d.status === 'atrasado').length },
  ].filter(item => item.value > 0);

  return (
    <Card className="border-none shadow-sm h-[350px]">
      <CardHeader className="pb-0">
        <CardTitle className="text-base font-semibold text-muted-foreground">
          Distribuição de Status
        </CardTitle>
      </CardHeader>
      <CardContent className="h-full">
        <ResponsiveContainer width="100%" height="80%">
          <PieChart>
            <Pie
              data={data}
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry) => (
                <Cell 
                  key={entry.name} 
                  fill={COLORS[entry.name.toLowerCase() as keyof typeof COLORS]} 
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend verticalAlign="bottom" height={36}/>
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}