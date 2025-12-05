import { _decorator, Component, tween, Vec3, Button } from 'cc';

const { ccclass, property } = _decorator;

@ccclass('ButtonScaleEffect')
export class ButtonScaleEffect extends Component {
  @property
  pressedScale = 0.95;

  @property
  duration = 0.08;

  onEnable(): void {
    const btn = this.getComponent(Button);
    if (btn) {
      btn.node.on(Button.EventType.TOUCH_START, this.onPress, this);
      btn.node.on(Button.EventType.TOUCH_END, this.onRelease, this);
      btn.node.on(Button.EventType.TOUCH_CANCEL, this.onRelease, this);
    }
  }

  onDisable(): void {
    const btn = this.getComponent(Button);
    if (btn) {
      btn.node.off(Button.EventType.TOUCH_START, this.onPress, this);
      btn.node.off(Button.EventType.TOUCH_END, this.onRelease, this);
      btn.node.off(Button.EventType.TOUCH_CANCEL, this.onRelease, this);
    }
  }

  private onPress(): void {
    const node = this.node;
    tween(node)
      .to(this.duration, { scale: new Vec3(this.pressedScale, this.pressedScale, 1) })
      .to(this.duration, { scale: Vec3.ONE })
      .start();
  }

  private onRelease(): void {
    tween(this.node).to(this.duration, { scale: Vec3.ONE }).start();
  }
}
