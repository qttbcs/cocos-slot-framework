import { _decorator, Component, Node, Vec3, tween, Tween } from 'cc';
import { ReelConfig } from './ReelConfig';

const { ccclass, property } = _decorator;

@ccclass('ReelController')
export class ReelController extends Component {
  @property
  reelId = 0;

  @property
  spinDuration = 1.2;

  @property
  stopDelay = 0.1;

  @property(Node)
  strip: Node | null = null; // container holding symbol nodes

  @property(Node)
  blurOverlay: Node | null = null; // optional blur overlay during spin

  @property
  symbolHeight = 150;

  @property
  spinSpeed = 800; // pixels per second

  @property
  bounceDistance = 24;

  config: ReelConfig | null = null;
  private spinning = false;
  private spinTween: Tween<Node> | null = null;

  setup(config: ReelConfig): void {
    this.config = config;
    this.reelId = config.id;
    this.spinDuration = config.spinDuration;
    this.stopDelay = config.stopDelay;
  }

  startSpin(): void {
    if (this.spinning) return;
    this.spinning = true;
    this.enableBlur(true);
    const target = this.strip ?? this.node;

    // Infinite scroll: move down by one symbol height then wrap and cycle symbols.
    const duration = this.symbolHeight / this.spinSpeed;
    this.spinTween = tween(target)
      .repeatForever(
        tween<Node>()
          .by(duration, { position: new Vec3(0, -this.symbolHeight, 0) })
          .call(() => this.wrapStrip())
      )
      .start();
  }

  stopSpin(callback?: () => void): void {
    if (!this.spinning) return;
    this.spinning = false;
    this.scheduleOnce(() => {
      if (this.spinTween) {
        this.spinTween.stop();
        this.spinTween = null;
      }
      const target = this.strip ?? this.node;
      const startPos = target.position.clone();

      // Bounce settle to give a soft stop.
      tween(target)
        .to(0.12, { position: startPos.add(new Vec3(0, -this.bounceDistance, 0)) }, { easing: 'quadOut' })
        .to(0.1, { position: Vec3.ZERO }, { easing: 'quadIn' })
        .call(() => {
          this.enableBlur(false);
          callback?.();
        })
        .start();
    }, this.stopDelay);
  }

  updateReelSymbols(order: string[]): void {
    // Rearrange child nodes to match the provided symbol order (top to bottom).
    if (!this.strip) return;
    const children = this.strip.children.slice();
    const count = Math.min(order.length, children.length);
    for (let i = 0; i < count; i += 1) {
      children[i].name = order[i];
    }
  }

  private wrapStrip(): void {
    const target = this.strip ?? this.node;
    const pos = target.position;
    if (pos.y <= -this.symbolHeight) {
      target.setPosition(new Vec3(pos.x, 0, pos.z));
      this.cycleTopToBottom();
    }
  }

  private cycleTopToBottom(): void {
    if (!this.strip || this.strip.children.length === 0) return;
    const first = this.strip.children[0];
    first.removeFromParent();
    this.strip.addChild(first);
  }

  private enableBlur(active: boolean): void {
    if (this.blurOverlay) {
      this.blurOverlay.active = active;
    }
  }
}
