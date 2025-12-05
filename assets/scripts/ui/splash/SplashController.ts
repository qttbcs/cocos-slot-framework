import { _decorator, Component, director, tween, UIOpacity } from 'cc';
import { AssetLoader } from '../../core/AssetLoader';

const { ccclass, property } = _decorator;

@ccclass('SplashController')
export class SplashController extends Component {
  @property
  fadeInDuration = 0.4;

  @property
  holdDuration = 1.2; // seconds to stay before transitioning

  @property
  fadeOutDuration = 0.4;

  @property
  nextScene = 'Lobby';

  private loading = false;
  private uiOpacity: UIOpacity | null = null;
  private loader = new AssetLoader();

  onLoad(): void {
    this.uiOpacity = this.getComponent(UIOpacity) ?? this.addComponent(UIOpacity);
    this.uiOpacity.opacity = 0;
  }

  start(): void {
    this.playSequence();
  }

  private playSequence(): void {
    if (this.loading) return;
    this.loading = true;
    tween(this.uiOpacity)
      .to(this.fadeInDuration, { opacity: 255 })
      .delay(this.holdDuration)
      .call(() => this.preloadNextScene())
      .to(this.fadeOutDuration, { opacity: 0 })
      .call(() => this.loadNextScene())
      .start();
  }

  private preloadNextScene(): void {
    director.preloadScene(this.nextScene, (err) => {
      if (err) {
        console.error('Preload scene error', err);
      }
    });
  }

  private loadNextScene(): void {
    director.loadScene(this.nextScene, (err) => {
      if (err) console.error('Load scene error', err);
    });
  }
}
