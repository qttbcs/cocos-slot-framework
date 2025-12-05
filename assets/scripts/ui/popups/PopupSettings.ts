import { _decorator, Component, Button, Toggle } from 'cc';
import { PopupBase } from './PopupBase';
import { EventBus, GlobalEventBus } from '../../core/EventBus';

const { ccclass, property } = _decorator;

@ccclass('PopupSettings')
export class PopupSettings extends PopupBase {
  @property(Toggle)
  bgmToggle: Toggle | null = null;

  @property(Toggle)
  sfxToggle: Toggle | null = null;

  @property(Button)
  closeButton: Button | null = null;

  private readonly events: EventBus = GlobalEventBus;

  onEnable(): void {
    this.closeButton?.node.on(Button.EventType.CLICK, this.close, this);
  }

  onDisable(): void {
    this.closeButton?.node.off(Button.EventType.CLICK, this.close, this);
  }

  public close(): void {
    this.closeWithDestroy();
  }

  applySettings(): void {
    this.events.emit('AUDIO_VOLUME_CHANGED', 'bgm', this.bgmToggle?.isChecked ? 1 : 0);
    this.events.emit('AUDIO_VOLUME_CHANGED', 'sfx', this.sfxToggle?.isChecked ? 1 : 0);
  }

  private closeWithDestroy(): void {
    super.close(() => this.node.destroy());
  }
}
