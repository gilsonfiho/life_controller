export const EXPENSE_CATEGORIES = {
  despesa_fixa: {
    label: 'Despesas Fixas',
    icon: 'home-outline',
    subcategories: ['Aluguel', 'Água', 'Energia', 'Internet', 'Telefone', 'Academia', 'Streaming', 'Outros'],
  },
  parcela_cartao: {
    label: 'Parcelas no Cartão',
    icon: 'card-outline',
    subcategories: [], // dinâmico — nome do item parcelado
  },
  transporte: {
    label: 'Transporte',
    icon: 'car-outline',
    subcategories: ['Uber', 'Ônibus', 'Passagem', 'Gasolina', 'Outros'],
  },
  despesa_avulsa: {
    label: 'Despesas Avulsas',
    icon: 'receipt-outline',
    subcategories: ['Lavanderia', 'Farmácia', 'Limpeza', 'Roupa', 'Presente', 'Eletrônicos', 'Outros'],
  },
  alimentacao: {
    label: 'Alimentação',
    icon: 'restaurant-outline',
    subcategories: ['Mercado', 'Restaurante', 'iFood', 'Açaí', 'Lanche', 'Outros'],
  },
  lazer: {
    label: 'Lazer e Rolês',
    icon: 'beer-outline',
    subcategories: ['Cerveja', 'Vinho', 'Cinema', 'Rolê', 'Outros'],
  },
} as const;

export const INCOME_CATEGORIES = {
  entrada: {
    label: 'Entradas',
    icon: 'trending-up-outline',
    subcategories: ['Salário', 'Benefício', 'Rendimentos', 'FGTS', 'Férias/13°', 'Venda', 'Freelance', 'Outros'],
  },
} as const;

export const ALL_CATEGORIES = { ...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES };

export const EXPENSE_CATEGORY_KEYS = Object.keys(EXPENSE_CATEGORIES) as Array<keyof typeof EXPENSE_CATEGORIES>;
export const INCOME_CATEGORY_KEYS = Object.keys(INCOME_CATEGORIES) as Array<keyof typeof INCOME_CATEGORIES>;
