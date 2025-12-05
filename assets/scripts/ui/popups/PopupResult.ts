import { _decorator, Component, Label, Button } from 'cc';
import { PopupBase } from './PopupBase';

const { ccclass, property } = _decorator;

@ccclass('PopupResult')
export class PopupResult extends PopupBase {
  @property(Label)
  winLabel: Label | null = null;

  @property(Button)
  closeButton: Button | null = null;

  onEnable(): void {
    this.closeButton?.node.on(Button.EventType.CLICK, this.close, this);
  }

  onDisable(): void {
    this.closeButton?.node.off(Button.EventType.CLICK, this.close, this);
  }

  showWin(amount: number): void {
    if (this.winLabel) this.winLabel.string = amount.toLocaleString();
    this.open();
  }

  public close(): void {
    this.closeWithDestroy();
  }

  private closeWithDestroy(): void {
    super.close(() => this.node.destroy());
  }
}
