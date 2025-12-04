import { Label, Node, Prefab, instantiate, tween, Vec3, UIOpacity } from 'cc';
import { AssetLoader } from './AssetLoader';

interface ToastConfig {
  message: string;
  duration?: number;
  prefab?: string | Prefab;
}

export class ToastManager {
  private root: Node | null = null;
  private readonly queue: ToastConfig[] = [];
  private readonly loader: AssetLoader;
  private readonly pools: Map<string, Node[]> = new Map();
  private showing = false;

  constructor(loader: AssetLoader = new AssetLoader()) {
    this.loader = loader;
  }

  bindRoot(root: Node | null): void {
    this.root = root;
  }

  push(config: ToastConfig): void {
    this.queue.push(config);
    this.tryShowNext();
  }

  private async tryShowNext(): Promise<void> {
    if (this.showing || !this.root) return;
    const config = this.queue.shift();
    if (!config) return;

    this.showing = true;
    const spawned = await this.spawnToast(config);
    if (!spawned) {
      this.showing = false;
      return;
    }
    const { node, key } = spawned;

    const label = node.getComponentInChildren(Label);
    if (label) {
      label.string = config.message;
    }

    const uiOpacity = node.getComponent(UIOpacity) ?? node.addComponent(UIOpacity);
    uiOpacity.opacity = 0;

    const lifetime = config.duration ?? 1.8;
    tween(node)
      .set({ position: new Vec3(0, -20, 0) })
      .by(0.2, { position: new Vec3(0, 10, 0) })
      .call(() => (uiOpacity.opacity = 255))
      .delay(lifetime)
      .call(() => (uiOpacity.opacity = 255))
      .by(0.25, { position: new Vec3(0, 10, 0) })
      .call(() => (uiOpacity.opacity = 0))
      .call(() => {
        this.recycleToast(key, node);
        this.showing = false;
        this.tryShowNext();
      })
      .start();
  }

  /**
   * Spawns a toast node from pool or prefab, attaches to root.
   */
  private async spawnToast(config: ToastConfig): Promise<{ node: Node; key: string } | null> {
    if (!this.root) return null;
    const prefab = typeof config.prefab === 'string' ? await this.loader.loadPrefab(config.prefab) : config.prefab;
    const key = typeof config.prefab === 'string' ? config.prefab : prefab?.name ?? 'Toast';

    const pool = this.pools.get(key) ?? [];
    const node = pool.pop() ?? (prefab ? instantiate(prefab) : new Node('Toast'));
    this.pools.set(key, pool);

    node.active = true;
    node.setParent(this.root);
    return { node, key };
  }

  /**
   * Recycles toast node back into its pool.
   */
  private recycleToast(key: string, node: Node): void {
    node.active = false;
    node.setParent(null);
    const pool = this.pools.get(key) ?? [];
    pool.push(node);
    this.pools.set(key, pool);
  }
}
