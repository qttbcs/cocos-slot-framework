import { Prefab, resources, SpriteFrame, assetManager, Asset, JsonAsset, AudioClip } from 'cc';

export class AssetLoader {
  private readonly bundleCache: Map<string, assetManager.Bundle> = new Map();

  /** Load prefab (optionally from bundle under bundles/). */
  loadPrefab(path: string, bundleName?: string): Promise<Prefab> {
    return this.load(path, Prefab, bundleName);
  }

  /** Load sprite frame (optionally from bundle under bundles/). */
  loadSpriteFrame(path: string, bundleName?: string): Promise<SpriteFrame> {
    return this.load(path, SpriteFrame, bundleName);
  }

  /** Load audio clip (optionally from bundle under bundles/). */
  loadAudioClip(path: string, bundleName?: string): Promise<AudioClip> {
    return this.load(path, AudioClip, bundleName);
  }

  loadJson<T = any>(path: string, bundleName?: string): Promise<T> {
    return this.load(path, JsonAsset, bundleName).then((asset) => asset.json as T);
  }

  preload(path: string, type: typeof Asset, bundleName?: string): Promise<void> {
    if (bundleName) {
      return this.loadBundle(bundleName).then((bundle) =>
        new Promise((resolve, reject) => {
          bundle.preload(path, type, (err) => {
            if (err) {
              reject(err);
              return;
            }
            resolve();
          });
        })
      );
    }

    return new Promise((resolve, reject) => {
      resources.preload(path, type, (err) => {
        if (err) {
          reject(err);
          return;
        }
        resolve();
      });
    });
  }

  release(path: string, type: typeof Asset, bundleName?: string): void {
    if (bundleName) {
      const bundle = this.bundleCache.get(bundleName);
      const asset = bundle?.get(path, type as any);
      if (asset) assetManager.releaseAsset(asset);
      return;
    }

    const asset = resources.get(path, type as any);
    if (asset) {
      assetManager.releaseAsset(asset);
    }
  }

  releaseBundle(bundleName: string): void {
    const bundle = this.bundleCache.get(bundleName);
    if (!bundle) return;
    bundle.releaseAll();
    this.bundleCache.delete(bundleName);
  }

  private load<T extends Asset>(path: string, type: typeof Asset, bundleName?: string): Promise<T> {
    if (bundleName) {
      return this.loadBundle(bundleName).then(
        (bundle) =>
          new Promise<T>((resolve, reject) => {
            bundle.load(path, type, (err, asset) => {
              if (err || !asset) {
                reject(err);
                return;
              }
              resolve(asset as T);
            });
          })
      );
    }

    return new Promise((resolve, reject) => {
      resources.load(path, type, (err, asset) => {
        if (err || !asset) {
          reject(err);
          return;
        }
        resolve(asset as T);
      });
    });
  }

  private loadBundle(name: string): Promise<assetManager.Bundle> {
    if (this.bundleCache.has(name)) {
      return Promise.resolve(this.bundleCache.get(name)!);
    }

    return new Promise((resolve, reject) => {
      assetManager.loadBundle(name, (err, bundle) => {
        if (err || !bundle) {
          reject(err);
          return;
        }
        this.bundleCache.set(name, bundle);
        resolve(bundle);
      });
    });
  }
}
