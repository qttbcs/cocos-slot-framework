export interface PaytableEntry {
  symbolId: number;
  payouts: number[]; // index = count-1
}

export interface PaytableData {
  entries: PaytableEntry[];
}

export const DefaultPaytable: PaytableData = {
  entries: [
    { symbolId: 1, payouts: [0, 2, 5, 10] },
    { symbolId: 2, payouts: [0, 2, 5, 8] },
    { symbolId: 99, payouts: [0, 0, 10, 20] },
    { symbolId: 100, payouts: [0, 0, 0, 50] },
  ],
};
