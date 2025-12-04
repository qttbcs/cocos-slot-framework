import { Node, Prefab, instantiate } from 'cc';
import { AssetLoader } from './AssetLoader';

interface PopupInstance {
  key: string;
  node: Node;
}

/**
 * Stack-based popup handler to ensure modal ordering.
 */
export class PopupManager {
  private root: Node | null = null;
  private readonly stack: PopupInstance[] = [];
  private readonly loader: AssetLoader;

  constructor(loader: AssetLoader = new AssetLoader()) {
    this.loader = loader;
  }

  bindRoot(root: Node | null): void {
    this.root = root;
  }

  async showPopup(pathOrPrefab: string | Prefab, options?: { key?: string }): Promise<Node | null> {
    if (!this.root) return null;
    const prefab = typeof pathOrPrefab === 'string' ? await this.loader.loadPrefab(pathOrPrefab) : pathOrPrefab;
    const node = instantiate(prefab);
    node.setParent(this.root);
    this.stack.push({ key: options?.key ?? prefab.name, node });
    return node;
  }

  // Backward-compatible alias
  async show(pathOrPrefab: string | Prefab, options?: { key?: string }): Promise<Node | null> {
    return this.showPopup(pathOrPrefab, options);
  }

  closeTop(): void {
    const top = this.stack.pop();
    top?.node.destroy();
  }

  closeByKey(key: string): void {
    const index = this.stack.findIndex((item) => item.key === key);
    if (index === -1) return;
    const [item] = this.stack.splice(index, 1);
    item.node.destroy();
  }

  closeAll(): void {
    while (this.stack.length > 0) {
      this.closeTop();
    }
  }
}
