import { _decorator, Component, EventKeyboard, input, Input, KeyCode, Button, EventTouch } from 'cc';
import { EventBus, GlobalEventBus } from '../../core/EventBus';

const { ccclass, property } = _decorator;

@ccclass('SpinInputHandler')
export class SpinInputHandler extends Component {
  @property(Button)
  spinButton: Button | null = null;

  @property(Button)
  autoSpinButton: Button | null = null;

  private readonly events: EventBus = GlobalEventBus;
  private holding = false;
  private holdTimeout: any = null;
  private holdThreshold = 0.4; // seconds
  private autoSpin = false;

  onEnable(): void {
    if (this.spinButton) {
      this.spinButton.node.on(Button.EventType.CLICK, this.requestSpin, this);
      this.spinButton.node.on(Button.EventType.TOUCH_START, this.onSpinTouchStart, this);
      this.spinButton.node.on(Button.EventType.TOUCH_END, this.onSpinTouchEnd, this);
      this.spinButton.node.on(Button.EventType.TOUCH_CANCEL, this.onSpinTouchEnd, this);
    }
    if (this.autoSpinButton) {
      this.autoSpinButton.node.on(Button.EventType.CLICK, this.toggleAutoSpin, this);
    }
    input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
  }

  onDisable(): void {
    if (this.spinButton) {
      this.spinButton.node.off(Button.EventType.CLICK, this.requestSpin, this);
      this.spinButton.node.off(Button.EventType.TOUCH_START, this.onSpinTouchStart, this);
      this.spinButton.node.off(Button.EventType.TOUCH_END, this.onSpinTouchEnd, this);
      this.spinButton.node.off(Button.EventType.TOUCH_CANCEL, this.onSpinTouchEnd, this);
    }
    if (this.autoSpinButton) {
      this.autoSpinButton.node.off(Button.EventType.CLICK, this.toggleAutoSpin, this);
    }
    input.off(Input.EventType.KEY_DOWN, this.onKeyDown, this);
  }

  private onKeyDown(event: EventKeyboard): void {
    if (event.keyCode === KeyCode.SPACE) {
      this.requestSpin();
    }
  }

  private requestSpin(): void {
    this.events.emit('SLOT_SPIN_REQUESTED');
  }

  private onSpinTouchStart(event: EventTouch): void {
    this.holding = true;
    this.holdTimeout = setTimeout(() => {
      if (this.holding) {
        this.events.emit('SLOT_SPIN_HOLD');
      }
    }, this.holdThreshold * 1000);
  }

  private onSpinTouchEnd(): void {
    this.holding = false;
    if (this.holdTimeout) {
      clearTimeout(this.holdTimeout);
      this.holdTimeout = null;
    }
  }

  private toggleAutoSpin(): void {
    this.autoSpin = !this.autoSpin;
    this.events.emit('SLOT_AUTO_SPIN_CHANGED', this.autoSpin);
    if (this.autoSpin) {
      this.requestSpin();
    }
  }
}
