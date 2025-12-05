import { _decorator, Component, Node, Prefab, instantiate, Vec3, tween } from 'cc';

const { ccclass, property } = _decorator;

@ccclass('CoinPool')
export class CoinPool extends Component {
  @property(Prefab)
  coinPrefab: Prefab | null = null;

  private pool: Node[] = [];
  private spawnDuration = 1;

  spawnCoin(position: Vec3, bundleName?: string): Node | null {
    let coin = this.pool.pop();
    if (!coin) {
      if (this.coinPrefab) {
        coin = instantiate(this.coinPrefab);
      }
    }
    if (!coin) return null;

    coin.active = true;
    coin.setParent(this.node);
    coin.setPosition(position);

    tween(coin)
      .by(this.spawnDuration * 0.5, { position: new Vec3(0, 80, 0) })
      .by(this.spawnDuration * 0.5, { position: new Vec3(0, -80, 0) })
      .call(() => this.recycle(coin!))
      .start();

    return coin;
  }

  recycle(node: Node): void {
    node.active = false;
    node.setParent(null);
    this.pool.push(node);
  }
}
