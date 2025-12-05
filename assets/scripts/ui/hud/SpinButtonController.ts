import { _decorator, Component, Button, EventTouch, Label } from 'cc';
import { EventBus, GlobalEventBus } from '../../core/EventBus';

const { ccclass, property } = _decorator;

@ccclass('SpinButtonController')
export class SpinButtonController extends Component {
  @property(Button)
  button: Button | null = null;

  @property(Label)
  hintLabel: Label | null = null;

  private readonly events: EventBus = GlobalEventBus;
  private interactable = true;
  private holding = false;
  private holdTimeout: any = null;
  private holdThreshold = 0.6; // seconds to hold for auto-spin hint

  onEnable(): void {
    if (this.button) {
      this.button.node.on(Button.EventType.CLICK, this.handleClick, this);
      this.button.node.on(Button.EventType.TOUCH_START, this.onTouchStart, this);
      this.button.node.on(Button.EventType.TOUCH_END, this.onTouchEnd, this);
      this.button.node.on(Button.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
    }
  }

  onDisable(): void {
    if (this.button) {
      this.button.node.off(Button.EventType.CLICK, this.handleClick, this);
      this.button.node.off(Button.EventType.TOUCH_START, this.onTouchStart, this);
      this.button.node.off(Button.EventType.TOUCH_END, this.onTouchEnd, this);
      this.button.node.off(Button.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
    }
  }

  setInteractable(value: boolean): void {
    this.interactable = value;
    if (this.button) this.button.interactable = value;
  }

  private handleClick(): void {
    if (!this.interactable) return;
    this.events.emit('SLOT_SPIN_REQUESTED');
  }

  private onTouchStart(_event: EventTouch): void {
    if (!this.interactable) return;
    this.holding = true;
    if (this.hintLabel) this.hintLabel.string = 'Hold for Auto';
    this.holdTimeout = setTimeout(() => {
      if (this.holding) {
        this.events.emit('SLOT_SPIN_HOLD');
        if (this.hintLabel) this.hintLabel.string = 'Auto ready';
      }
    }, this.holdThreshold * 1000);
  }

  private onTouchEnd(): void {
    this.holding = false;
    if (this.holdTimeout) {
      clearTimeout(this.holdTimeout);
      this.holdTimeout = null;
    }
    if (this.hintLabel) this.hintLabel.string = '';
  }
}
