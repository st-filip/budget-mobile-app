export interface Transaction {
  id: string;
  type: string;
  amount?: number;
  date: Date;
  user: string;
  note?: string;
  party?: string;
  envelopeAllocation: { [envelope: string]: number };
}
