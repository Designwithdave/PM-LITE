export interface Expense {
  id: string;
  user_id: string;
  amount: number;
  category: string;
  description: string;
  date: string;
  created_at?: string;
  updated_at?: string;
}

export type ExpenseCategory = 
  | "Food" 
  | "Transport" 
  | "Shopping" 
  | "Bills" 
  | "Entertainment" 
  | "Healthcare" 
  | "Other";

export const EXPENSE_CATEGORIES: ExpenseCategory[] = [
  "Food",
  "Transport",
  "Shopping",
  "Bills",
  "Entertainment",
  "Healthcare",
  "Other"
];

export const CATEGORY_COLORS: Record<ExpenseCategory, string> = {
  Food: "bg-orange-500",
  Transport: "bg-blue-500",
  Shopping: "bg-purple-500",
  Bills: "bg-red-500",
  Entertainment: "bg-pink-500",
  Healthcare: "bg-green-500",
  Other: "bg-gray-500"
};

export const CATEGORY_ICONS: Record<ExpenseCategory, string> = {
  Food: "🍔",
  Transport: "🚗",
  Shopping: "🛍️",
  Bills: "📄",
  Entertainment: "🎬",
  Healthcare: "⚕️",
  Other: "📌"
};