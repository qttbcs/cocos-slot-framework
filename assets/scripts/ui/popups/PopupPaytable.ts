import { _decorator, Component, Button, ScrollView } from 'cc';
import { PopupBase } from './PopupBase';

const { ccclass, property } = _decorator;

@ccclass('PopupPaytable')
export class PopupPaytable extends PopupBase {
  @property(Button)
  closeButton: Button | null = null;

  @property(ScrollView)
  scrollView: ScrollView | null = null;

  onEnable(): void {
    this.closeButton?.node.on(Button.EventType.CLICK, this.close, this);
  }

  onDisable(): void {
    this.closeButton?.node.off(Button.EventType.CLICK, this.close, this);
  }

  public close(): void {
    this.closeWithDestroy();
  }

  private closeWithDestroy(): void {
    super.close(() => this.node.destroy());
  }
}
