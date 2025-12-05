import { _decorator, Component, Material, Sprite } from 'cc';

const { ccclass, property } = _decorator;

@ccclass('BigWinShaderController')
export class BigWinShaderController extends Component {
  @property(Material)
  bigWinMaterial: Material | null = null;

  @property(Sprite)
  targetSprite: Sprite | null = null;

  @property
  glowUniform = 'u_glow'; // change to match your shader property

  @property
  glowSpeed = 1.5;

  private active = false;
  private elapsed = 0;

  applyEffect(): void {
    if (!this.targetSprite || !this.bigWinMaterial) return;
    this.targetSprite.customMaterial = this.bigWinMaterial;
    this.elapsed = 0;
    this.active = true;
  }

  clearEffect(): void {
    if (this.targetSprite) {
      this.targetSprite.customMaterial = null;
    }
    this.active = false;
  }

  update(dt: number): void {
    if (!this.active || !this.bigWinMaterial) return;
    this.elapsed += dt * this.glowSpeed;
    const glow = (Math.sin(this.elapsed) + 1) * 0.5; // 0..1 loop
    this.bigWinMaterial.setProperty(this.glowUniform, glow);
  }
}
