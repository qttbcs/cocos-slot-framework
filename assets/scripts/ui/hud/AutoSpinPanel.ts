import { _decorator, Component, Button, Label } from 'cc';
import { EventBus, GlobalEventBus } from '../../core/EventBus';

const { ccclass, property } = _decorator;

@ccclass('AutoSpinPanel')
export class AutoSpinPanel extends Component {
  @property(Button)
  toggleButton: Button | null = null;

  @property(Label)
  statusLabel: Label | null = null;

  @property(Label)
  countLabel: Label | null = null;

  @property([Number])
  options: number[] = [10, 25, 50, 100];

  private readonly events: EventBus = GlobalEventBus;
  private isAutoEnabled = false;
  private selectedCountIndex = 0;

  onEnable(): void {
    this.toggleButton?.node.on(Button.EventType.CLICK, this.toggle, this);
  }

  onDisable(): void {
    this.toggleButton?.node.off(Button.EventType.CLICK, this.toggle, this);
  }

  setAuto(enabled: boolean, remaining?: number): void {
    this.isAutoEnabled = enabled;
    if (this.statusLabel) this.statusLabel.string = enabled ? 'Auto: ON' : 'Auto: OFF';
    if (remaining !== undefined && this.countLabel) {
      this.countLabel.string = `x${remaining}`;
    }
  }

  setOption(index: number): void {
    this.selectedCountIndex = Math.max(0, Math.min(this.options.length - 1, index));
    this.updateCountLabel(this.options[this.selectedCountIndex]);
  }

  private updateCountLabel(count: number): void {
    if (this.countLabel) this.countLabel.string = `x${count}`;
  }

  private toggle(): void {
    this.setAuto(!this.isAutoEnabled);
    const count = this.options[this.selectedCountIndex] ?? 0;
    this.events.emit('SLOT_AUTO_SPIN_CHANGED', this.isAutoEnabled, count);
    if (this.isAutoEnabled) {
      this.events.emit('SLOT_SPIN_REQUESTED');
    }
  }
}
