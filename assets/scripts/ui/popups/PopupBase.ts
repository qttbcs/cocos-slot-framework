import { _decorator, Component, tween, Vec3, Node } from 'cc';

const { ccclass, property } = _decorator;

@ccclass('PopupBase')
export class PopupBase extends Component {
  @property
  showDuration = 0.16;

  @property
  hideDuration = 0.12;

  @property(Node)
  overlay: Node | null = null;

  open(): void {
    this.node.active = true;
    this.playShowTween();
  }

  close(onComplete?: () => void): void {
    this.playHideTween(onComplete);
  }

  protected playShowTween(): void {
    this.overlay?.setScale(Vec3.ONE);
    this.node.scale = new Vec3(0.8, 0.8, 1);
    tween(this.node).to(this.showDuration, { scale: Vec3.ONE }, { easing: 'quadOut' }).start();
  }

  protected playHideTween(onComplete?: () => void): void {
    tween(this.node)
      .to(this.hideDuration, { scale: new Vec3(0.8, 0.8, 1) }, { easing: 'quadIn' })
      .call(() => onComplete?.())
      .start();
  }
}
