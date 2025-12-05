import { _decorator, Component, Button } from 'cc';
import { PopupBase } from './PopupBase';
import { EventBus, GlobalEventBus } from '../../core/EventBus';

const { ccclass, property } = _decorator;

@ccclass('PopupPause')
export class PopupPause extends PopupBase {
  @property(Button)
  resumeButton: Button | null = null;

  @property(Button)
  quitButton: Button | null = null;

  private readonly events: EventBus = GlobalEventBus;

  onEnable(): void {
    this.resumeButton?.node.on(Button.EventType.CLICK, this.resume, this);
    this.quitButton?.node.on(Button.EventType.CLICK, this.quit, this);
  }

  onDisable(): void {
    this.resumeButton?.node.off(Button.EventType.CLICK, this.resume, this);
    this.quitButton?.node.off(Button.EventType.CLICK, this.quit, this);
  }

  private resume(): void {
    this.events.emit('PAUSE_CHANGED', false);
    this.closeWithDestroy();
  }

  private quit(): void {
    this.events.emit('GAME_QUIT');
    this.closeWithDestroy();
  }

  private closeWithDestroy(): void {
    super.close(() => this.node.destroy());
  }
}
