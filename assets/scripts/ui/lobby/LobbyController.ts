import { _decorator, Component, Node, Prefab, instantiate, director, Button } from 'cc';
import { LobbySlotItem } from './LobbySlotItem';
import { AssetLoader } from '../../core/AssetLoader';
import { EventBus, GlobalEventBus } from '../../core/EventBus';
import { SlotGameList } from '../../data/SlotGameList';
import { GameManager } from '../../core/GameManager';

const { ccclass, property } = _decorator;

@ccclass('LobbyController')
export class LobbyController extends Component {
  @property(Node)
  listRoot: Node | null = null;

  @property(Prefab)
  slotItemPrefab: Prefab | null = null;

  @property(Button)
  settingsButton: Button | null = null;

  private readonly loader = new AssetLoader();
  private readonly events: EventBus = GlobalEventBus;
  private readonly onSlotSelected = (bundleName: string) => this.handleSlotSelected(bundleName);
  private gameManager: GameManager | null = null;

  protected onLoad(): void {
    this.gameManager = GameManager.getInstance();
    this.populate(SlotGameList);
    this.events.on('LOBBY_SLOT_SELECTED', this.onSlotSelected);
    this.settingsButton?.node.on(Button.EventType.CLICK, this.openSettings, this);
  }

  protected onDestroy(): void {
    this.events.off('LOBBY_SLOT_SELECTED', this.onSlotSelected);
    this.settingsButton?.node.off(Button.EventType.CLICK, this.openSettings, this);
  }

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

  private handleSlotSelected(bundleName: string): void {
    director.loadScene('Loading', (err) => {
      if (err) console.error('Failed to enter Loading scene', err, bundleName);
    });
  }

  private async openSettings(): Promise<void> {
    try {
      console.log('Opening settings popup');
      const gm = this.gameManager ?? GameManager.getInstance();
      await gm.popups.showPopup('prefabs/popups/PopupSettings');
    } catch (err) {
      console.error('Failed to open settings popup', err);
    }
  }
}
