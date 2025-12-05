import { _decorator, Component, Label, tween } from 'cc';
import { ProgressBarController } from '../common/ProgressBarController';

const { ccclass, property } = _decorator;

@ccclass('LoadingController')
export class LoadingController extends Component {
  @property(ProgressBarController)
  progress: ProgressBarController | null = null;

  @property(Label)
  tipLabel: Label | null = null;

  @property
  fakeDuration = 2.5;

  setProgress(value: number): void {
    this.progress?.setProgress(value);
  }

  setTip(text: string): void {
    if (this.tipLabel) this.tipLabel.string = text;
  }

  runFakeProgress(onComplete?: () => void): void {
    this.progress?.setProgress(0);
    const driver = { value: 0 };
    tween(driver)
      .to(this.fakeDuration, { value: 1 }, {
        onUpdate: (target: typeof driver) => this.progress?.setProgress(target.value),
      })
      .call(() => onComplete?.())
      .start();
  }
}
