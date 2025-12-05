import { _decorator, Component, Node } from 'cc';
import { ReelController } from './ReelController';
import { ReelGroupConfig, ReelConfig } from './ReelConfig';

const { ccclass, property } = _decorator;

@ccclass('ReelGroupController')
export class ReelGroupController extends Component {
  @property([ReelController])
  reels: ReelController[] = [];

  @property
  startStagger = 0.08; // seconds between reel starts

  @property
  stopStagger = 0.12; // seconds between reel stops

  configure(config: ReelGroupConfig): void {
    config.reels.forEach((cfg, index) => {
      const reel = this.reels[index];
      if (reel) reel.setup(cfg);
    });
  }

  startSpin(): void {
    this.reels.forEach((reel, idx) => {
      this.scheduleOnce(() => reel.startSpin(), idx * this.startStagger);
    });
  }

  stopSpin(onComplete?: () => void): void {
    let remaining = this.reels.length;
    const done = () => {
      remaining -= 1;
      if (remaining <= 0) onComplete?.();
    };
    this.reels.forEach((reel, idx) => {
      this.scheduleOnce(() => reel.stopSpin(done), idx * this.stopStagger);
    });
  }

  getReelNode(index: number): Node | null {
    return this.reels[index]?.node ?? null;
  }

  getConfig(index: number): ReelConfig | null {
    return this.reels[index]?.config ?? null;
  }
}
