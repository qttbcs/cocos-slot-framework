import { _decorator, Component, Sprite, Material, SpriteFrame, UIOpacity, UITransform } from 'cc';
import { SymbolConfig } from './SymbolConfig';
import { AssetLoader } from '../../core/AssetLoader';

const { ccclass, property } = _decorator;

@ccclass('SymbolView')
export class SymbolView extends Component {
  @property(Sprite)
  sprite: Sprite | null = null;

  @property(Sprite)
  blurOverlay: Sprite | null = null;

  @property(Sprite)
  highlightOverlay: Sprite | null = null;

  @property(Material)
  highlightMaterial: Material | null = null;

  config: SymbolConfig | null = null;
  private loader = new AssetLoader();
  private defaultMaterial: Material | null = null;
  private cachedFrame: SpriteFrame | null = null;

  async apply(config: SymbolConfig, bundleName?: string): Promise<void> {
    this.config = config;
    if (!this.sprite) return;
    const frame = await this.loader.loadSpriteFrame(config.sprite, bundleName);
    this.cachedFrame = frame;
    this.sprite.spriteFrame = frame;
    if (!this.defaultMaterial) this.defaultMaterial = this.sprite.customMaterial;
  }

  setBlur(active: boolean): void {
    if (this.blurOverlay) {
      this.blurOverlay.node.active = active;
    }
  }

  setHighlight(active: boolean): void {
    if (!this.sprite) return;
    if (active) {
      if (this.highlightMaterial) this.sprite.customMaterial = this.highlightMaterial;
      if (this.highlightOverlay) this.highlightOverlay.node.active = true;
    } else {
      this.sprite.customMaterial = this.defaultMaterial;
      if (this.highlightOverlay) this.highlightOverlay.node.active = false;
    }
  }

  setOpacity(value: number): void {
    const uiOpacity = this.getComponent(UIOpacity) ?? this.addComponent(UIOpacity);
    uiOpacity.opacity = Math.min(255, Math.max(0, value * 255));
  }

  resizeTo(frameWidth: number, frameHeight: number): void {
    const transform = this.getComponent(UITransform);
    if (transform) {
      transform.setContentSize(frameWidth, frameHeight);
    }
  }
}
