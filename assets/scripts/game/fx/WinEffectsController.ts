import { _decorator, Component, Node, Prefab, instantiate, Vec3, tween, ParticleSystem, sp } from 'cc';
import { LineWin } from '../result/LineEvaluator';
import { SymbolView } from '../symbol/SymbolView';

const { ccclass, property } = _decorator;

@ccclass('WinEffectsController')
export class WinEffectsController extends Component {
  @property(Node)
  fxRoot: Node | null = null;

  @property(Prefab)
  coinBurstPrefab: Prefab | null = null;

  @property(Prefab)
  lineHighlightPrefab: Prefab | null = null;

  playLineWins(wins: LineWin[], linePaths?: Record<number, number[]>, symbolGrid?: SymbolView[][]): void {
    wins.forEach((win) => {
      this.spawnLineHighlight(win.lineId);
      this.highlightSymbols(win, linePaths, symbolGrid);
      this.spawnCoins();
    });
  }

  playBigWin(totalWin: number): void {
    if (!this.fxRoot) return;
    const node = this.coinBurstPrefab ? instantiate(this.coinBurstPrefab) : null;
    if (node) {
      node.setParent(this.fxRoot);
      node.setPosition(Vec3.ZERO);
      this.playParticles(node);
      tween(node).delay(1).call(() => node.destroy()).start();
    }
    console.log('Big win', totalWin);
  }

  private spawnLineHighlight(lineId: number): void {
    if (!this.fxRoot || !this.lineHighlightPrefab) return;
    const node = instantiate(this.lineHighlightPrefab);
    node.setParent(this.fxRoot);
    // Positioning should be handled by prefab or external mapping for the line.
    tween(node).delay(1).call(() => node.destroy()).start();
  }

  private spawnCoins(): void {
    if (!this.fxRoot || !this.coinBurstPrefab) return;
    const node = instantiate(this.coinBurstPrefab);
    node.setParent(this.fxRoot);
    node.setPosition(Vec3.ZERO);
    this.playParticles(node);
    tween(node).delay(1).call(() => node.destroy()).start();
  }

  private playParticles(node: Node): void {
    node.getComponentsInChildren(ParticleSystem).forEach((ps) => ps.play());
    node.getComponentsInChildren(sp.Skeleton).forEach((sk) => sk.setAnimation(0, 'animation', false));
  }

  private highlightSymbols(win: LineWin, linePaths?: Record<number, number[]>, symbolGrid?: SymbolView[][]): void {
    if (!linePaths || !symbolGrid) return;
    const path = linePaths[win.lineId];
    if (!path) return;
    const cols = Math.min(path.length, win.count);
    for (let col = 0; col < cols; col += 1) {
      const row = path[col];
      const view = symbolGrid[row]?.[col];
      view?.setHighlight(true);
      view?.setBlur(false);
    }
  }
}
