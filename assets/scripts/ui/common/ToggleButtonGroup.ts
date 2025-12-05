import { _decorator, Component, Toggle, EventHandler } from 'cc';

const { ccclass, property } = _decorator;

@ccclass('ToggleButtonGroup')
export class ToggleButtonGroup extends Component {
  @property([Toggle])
  toggles: Toggle[] = [];

  @property(EventHandler)
  onToggleChanged: EventHandler | null = null;

  start(): void {
    this.toggles.forEach((toggle, index) => {
      toggle.node.on('toggle', () => this.handleToggle(index), this);
    });
  }

  private handleToggle(index: number): void {
    this.toggles.forEach((t, i) => {
      t.isChecked = i === index;
    });
    if (this.onToggleChanged) {
      this.onToggleChanged.emit([index]);
    }
  }
}
