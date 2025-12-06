import { _decorator, Component, Label, Sprite, Button } from 'cc';
import { AssetLoader } from '../../core/AssetLoader';
import { EventBus, GlobalEventBus } from '../../core/EventBus';

const { ccclass, property } = _decorator;

export interface LobbySlotData {
  id: string;
  title: string;
  icon: string;
}

@ccclass('LobbySlotItem')
export class LobbySlotItem extends Component {
  @property(Label)
  titleLabel: Label | null = null;

  @property(Sprite)
  iconSprite: Sprite | null = null;

  @property(Button)
  playButton: Button | null = null;

  private readonly loader = new AssetLoader();
  private data: LobbySlotData | null = null;
  private readonly events: EventBus = GlobalEventBus;

  onEnable(): void {
    this.playButton?.node.on(Button.EventType.CLICK, this.handlePlay, this);
  }

  onDisable(): void {
    this.playButton?.node.off(Button.EventType.CLICK, this.handlePlay, this);
  }

  async bindData(data: LobbySlotData, bundleName?: string): Promise<void> {
    this.data = data;
    if (this.titleLabel) this.titleLabel.string = data.title;
    if (this.iconSprite) {
      const frame = await this.loader.loadSpriteFrame(data.icon, bundleName);
      this.iconSprite.spriteFrame = frame;
    }
  }

  private handlePlay(): void {
    console.log('Slot item clicked:', this.data);
    if (!this.data) return;
    this.events.emit('LOBBY_SLOT_SELECTED', this.data.id);
  }
}
