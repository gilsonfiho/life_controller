# Life Controller

App mobile de controle financeiro pessoal construído com React Native + Expo.

## Stack

- **Expo SDK 54** / React Native 0.81 / React 19
- **Expo Router 6** — navegação file-based
- **Zustand** — estado global
- **AsyncStorage** — persistência local

## Funcionalidades (MVP)

- Navegação por mês (← →)
- Resumo mensal: Entradas, Despesas e Saldo
- Lançamentos agrupados por categoria (expansível)
- CRUD completo de transações
- Dados persistidos localmente no dispositivo

## Categorias

| Categoria | Tipo |
|---|---|
| Despesas Fixas | Saída |
| Parcelas no Cartão | Saída |
| Transporte | Saída |
| Despesas Avulsas | Saída |
| Alimentação | Saída |
| Lazer | Saída |
| Entradas | Entrada |

## Como rodar localmente

```bash
npm install
npx expo start
```

Escaneie o QR com o app **Expo Go** (iOS ou Android).

## Gerar APK (Android)

```bash
# Requer EAS CLI e conta Expo
npm install -g eas-cli
eas build --platform android --profile preview
```

## Estrutura do projeto

```
app/
  (tabs)/
    index.tsx         # Dashboard
    transactions.tsx  # Lista de lançamentos
    settings.tsx      # Configurações e estatísticas
  transaction/
    new.tsx           # Nova transação
    [id].tsx          # Editar / excluir
components/           # Componentes reutilizáveis
store/                # Zustand store
hooks/                # useTransactions, useMonthSummary
types/                # TypeScript types
utils/                # formatCurrency, calculateMonthSummary, etc.
constants/            # Categorias e labels
```

## Dados

Os dados são armazenados apenas no dispositivo via `AsyncStorage`.
O arquivo `data/seed/` está excluído do repositório (dados pessoais).
