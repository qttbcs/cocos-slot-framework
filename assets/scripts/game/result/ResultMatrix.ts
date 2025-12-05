export class ResultMatrix {
  constructor(public rows: number[][] = []) {}

  get rowsCount(): number {
    return this.rows.length;
  }

  get colsCount(): number {
    return this.rows[0]?.length ?? 0;
  }

  getSymbol(row: number, col: number): number | null {
    return this.rows[row]?.[col] ?? null;
  }
}
