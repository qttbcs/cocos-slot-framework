import { _decorator, Component, ProgressBar, Label } from 'cc';

const { ccclass, property } = _decorator;

@ccclass('ProgressBarController')
export class ProgressBarController extends Component {
  @property(ProgressBar)
  bar: ProgressBar | null = null;

  @property(Label)
  label: Label | null = null;

  setProgress(value: number): void {
    const clamped = Math.max(0, Math.min(1, value));
    if (this.bar) this.bar.progress = clamped;
    if (this.label) this.label.string = `${Math.round(clamped * 100)}%`;
  }
}
