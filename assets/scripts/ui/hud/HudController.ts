import { _decorator, Component } from 'cc';
import { BalancePanel } from './BalancePanel';
import { BetPanel } from './BetPanel';
import { AutoSpinPanel } from './AutoSpinPanel';
import { SpinButtonController } from './SpinButtonController';
import { EventBus, GlobalEventBus } from '../../core/EventBus';

const { ccclass, property } = _decorator;

@ccclass('HudController')
export class HudController extends Component {
  @property(BalancePanel)
  balancePanel: BalancePanel | null = null;

  @property(BetPanel)
  betPanel: BetPanel | null = null;

  @property(AutoSpinPanel)
  autoSpinPanel: AutoSpinPanel | null = null;

  @property(SpinButtonController)
  spinButton: SpinButtonController | null = null;

  private readonly events: EventBus = GlobalEventBus;

  start(): void {
    this.events.on('BALANCE_CHANGED', (value: number) => this.balancePanel?.setBalance(value));
    this.events.on('BET_CHANGED', (value: number) => this.betPanel?.setBet(value));
    this.events.on('SLOT_AUTO_SPIN_CHANGED', (enabled: boolean) => this.autoSpinPanel?.setAuto(enabled));
  }
}
