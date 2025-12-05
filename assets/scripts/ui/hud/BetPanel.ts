import { _decorator, Component, Label, Button } from 'cc';
import { EventBus, GlobalEventBus } from '../../core/EventBus';
import { GameManager } from '../../core/GameManager';

const { ccclass, property } = _decorator;

@ccclass('BetPanel')
export class BetPanel extends Component {
  @property(Label)
  betLabel: Label | null = null;

  @property(Button)
  minusButton: Button | null = null;

  @property(Button)
  plusButton: Button | null = null;

  private readonly events: EventBus = GlobalEventBus;
  private bet = 1;

  start(): void {
    const gm = GameManager.instance;
    if (gm) this.setBet(gm.bet);
  }

  onEnable(): void {
    this.minusButton?.node.on(Button.EventType.CLICK, this.decrease, this);
    this.plusButton?.node.on(Button.EventType.CLICK, this.increase, this);
  }

  onDisable(): void {
    this.minusButton?.node.off(Button.EventType.CLICK, this.decrease, this);
    this.plusButton?.node.off(Button.EventType.CLICK, this.increase, this);
  }

  setBet(value: number): void {
    this.bet = value;
    if (this.betLabel) this.betLabel.string = value.toLocaleString();
  }

  private decrease(): void {
    this.setBet(Math.max(1, this.bet - 1));
    this.events.emit('BET_CHANGED', this.bet);
  }

  private increase(): void {
    this.setBet(this.bet + 1);
    this.events.emit('BET_CHANGED', this.bet);
  }
}
