export interface SymbolConfig {
  id: number;
  name: string;
  sprite: string; // sprite frame path
  payout: number[]; // payout by count (index = symbol count - 1)
  type: 'normal' | 'wild' | 'scatter' | 'bonus';
  substitutes?: number[]; // symbols this one can substitute (for wilds)
}

export type SymbolConfigMap = Record<number, SymbolConfig>;
