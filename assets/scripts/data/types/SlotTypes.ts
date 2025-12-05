export interface SpinRequest {
  bet: number;
  lines: number;
  auto?: boolean;
}

export interface SpinResponse {
  matrix: number[][];
  wins: { lineId: number; payout: number; symbolId: number; count: number }[];
  totalWin: number;
  balance: number;
}

export interface ReelStopData {
  reelIndex: number;
  symbols: number[];
}
