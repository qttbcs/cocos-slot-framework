import { ResultMatrix } from './ResultMatrix';
import { PaylineConfig, PaylineList } from './PaylineConfig';

export interface LineWin {
  lineId: number;
  symbolId: number;
  count: number;
  payout: number;
}

export interface EvaluationResult {
  lineWins: LineWin[];
  totalWin: number;
}

/**
 * Basic line evaluator; extend with wild/scatter logic as needed.
 */
export class LineEvaluator {
  evaluate(matrix: ResultMatrix, paylines: PaylineList, bet: number, paytable: Record<number, number[]>): EvaluationResult {
    const wins: LineWin[] = [];
    paylines.forEach((line) => {
      const firstSymbol = matrix.getSymbol(line.path[0], 0);
      if (firstSymbol == null) return;

      let count = 1;
      for (let col = 1; col < line.path.length; col += 1) {
        const symbol = matrix.getSymbol(line.path[col], col);
        if (symbol !== firstSymbol) break;
        count += 1;
      }

      const payoutTable = paytable[firstSymbol];
      const payoutPerBet = payoutTable?.[count - 1] ?? 0;
      if (payoutPerBet > 0) {
        wins.push({
          lineId: line.id,
          symbolId: firstSymbol,
          count,
          payout: payoutPerBet * bet * line.payoutMultiplier,
        });
      }
    });
    const totalWin = wins.reduce((sum, w) => sum + w.payout, 0);
    return { lineWins: wins, totalWin };
  }
}
