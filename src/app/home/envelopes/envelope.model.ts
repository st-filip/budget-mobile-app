export interface Envelope {
  id: string;
  user?: string;
  category: string;
  budget: number;
  currentMoney?: number;
  totalExpense?: number;
  type: string;
}
