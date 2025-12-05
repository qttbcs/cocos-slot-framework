export interface PaylineConfig {
  id: number;
  path: number[]; // row index per column
  payoutMultiplier: number;
}

export type PaylineList = PaylineConfig[];
