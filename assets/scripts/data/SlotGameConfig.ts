import { ReelGroupConfig } from '../game/reel/ReelConfig';
import { SymbolConfigMap } from '../game/symbol/SymbolConfig';
import { PaylineList } from '../game/result/PaylineConfig';

export interface SlotGameConfig {
  reels: ReelGroupConfig;
  symbols: SymbolConfigMap;
  paylines: PaylineList;
  defaultBet: number;
  minBet: number;
  maxBet: number;
  rows: number;
  cols: number;
  spinTime: number;
  maxLines: number;
  bundle?: string;
}
