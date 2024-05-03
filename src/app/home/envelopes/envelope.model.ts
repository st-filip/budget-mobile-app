export interface Envelope {
  id: string;
  user?: string;
  category: string;
  budget: number;
  available: number;
  totalExpense?: number;
  type: string;
}
