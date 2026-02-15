

# Dashboard de Gestão de Cobranças

## Visão Geral
Um dashboard moderno e profissional para gestão de cobranças, com design clean em fundo branco e detalhes em verde esmeralda. Dados armazenados localmente (localStorage) com dados de exemplo pré-carregados.

---

## 1. Cabeçalho
- Título "Gestão de **Cobranças**" com "Cobranças" em verde esmeralda
- Data atual formatada em português (ex: "Sábado, 14 De Fevereiro De 2026")
- Ícone decorativo ao lado do título

## 2. Campo de Busca
- Input com ícone de lupa para filtrar devedores por nome em tempo real

## 3. Cards de Métricas (6 cards no topo)
- **Cap. Investido** — soma do valor principal de todos os empréstimos
- **Total a Rec.** — soma de principal + juros de todos os empréstimos
- **Juros** — diferença entre total a receber e capital investido
- **Pendentes** — contador + valor total dos empréstimos com status pendente (ícone amarelo/laranja)
- **Recebidos** — contador + valor total dos pagos (ícone verde)
- **Atrasados** — contador + valor total dos atrasados (ícone vermelho)

Valores formatados em R$ (moeda brasileira).

## 4. Lista de Devedores (tabela principal)
- **Colunas:** Nome, Empréstimo, Juros, Total, Vencimento, Status, Ações
- **Status** com badges coloridos: verde (Pago), amarelo (Pendente), vermelho (Atrasado)
- **Ações por linha:**
  - Registrar Pagamento (muda status para "Pago")
  - Editar (abre formulário de edição)
  - Excluir (com confirmação)
- Filtro de busca por nome em tempo real
- Formulário para adicionar novo devedor

## 5. Calculadora de Juros (lateral direita)
- **Entradas:** Nome do cliente, Valor principal, Taxa de juros (%), Período (meses/dias)
- **Seletor:** Juros Simples ou Compostos
- **Resultado:** Montante final, total de juros e valor das parcelas
- Botão para adicionar o cálculo diretamente como novo devedor

## 6. Layout Responsivo
- Desktop: tabela de devedores à esquerda, calculadora à direita (2 colunas)
- Mobile: empilhado verticalmente
- Fonte Inter, ícones Lucide React

## 7. Persistência Local
- Dados salvos em localStorage para persistir entre sessões
- Dados de exemplo pré-carregados na primeira visita
