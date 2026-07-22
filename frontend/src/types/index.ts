export type User = {
  id: number;
  name: string;
  email: string;
  is_active: boolean;
  created_at: string;
};

export type Category = {
  id: number;
  name: string;
  color: string;
  icon: string;
};

export type Transaction = {
  id: number;
  title: string;
  description?: string | null;
  amount: string;
  type: "income" | "expense";
  transaction_date: string;
  created_at: string;
  category: Category;
};

export type Budget = {
  id: number;
  amount: string;
  month: number;
  year: number;
  spent: string;
  progress: number;
  category: Category;
};

export type DashboardSummary = {
  balance: string;
  income: string;
  expense: string;
  savings_rate: number;
  category_expenses: {
    category: string;
    amount: string;
    color: string;
  }[];
  monthly_trend: {
    month: string;
    income: string;
    expense: string;
  }[];
};
