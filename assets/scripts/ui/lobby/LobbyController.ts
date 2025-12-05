import { _decorator, Component, Node, Prefab, instantiate } from 'cc';
import { LobbySlotItem } from './LobbySlotItem';
import { AssetLoader } from '../../core/AssetLoader';
import { EventBus, GlobalEventBus } from '../../core/EventBus';

const { ccclass, property } = _decorator;

@ccclass('LobbyController')
export class LobbyController extends Component {
  @property(Node)
  listRoot: Node | null = null;

  @property(Prefab)
  slotItemPrefab: Prefab | null = null;

  private readonly loader = new AssetLoader();
  private readonly events: EventBus = GlobalEventBus;

  populate(slots: { id: string; title: string; icon: string }[]): void {
    if (!this.listRoot || !this.slotItemPrefab) return;
    this.listRoot.removeAllChildren();
    slots.forEach((slot) => {
      const node = instantiate(this.slotItemPrefab);
      node.setParent(this.listRoot);
      const item = node.getComponent(LobbySlotItem);
      item?.bindData(slot);
      node.on(Node.EventType.TOUCH_END, () => this.loadGame(slot.id), this);
    });
  }

  private async loadGame(bundleName: string): Promise<void> {
    try {
      await this.loader.loadBundle(bundleName);
      this.events.emit('LOBBY_SLOT_SELECTED', bundleName);
    } catch (err) {
      console.error('Failed to load bundle', bundleName, err);
    }
  }
}
