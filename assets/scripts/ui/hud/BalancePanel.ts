import { _decorator, Component, Label } from 'cc';
import { GameManager } from '../../core/GameManager';

const { ccclass, property } = _decorator;

@ccclass('BalancePanel')
export class BalancePanel extends Component {
  @property(Label)
  balanceLabel: Label | null = null;

  start(): void {
    const gm = GameManager.instance;
    if (gm) this.setBalance(gm.balance);
  }

  setBalance(value: number): void {
    if (this.balanceLabel) {
      this.balanceLabel.string = value.toLocaleString();
    }
  }
}
