import { _decorator, Component, Node, director, UITransform, BlockInputEvents } from 'cc';
import { SlotStateMachine } from './SlotStateMachine';
import { EventBus, GlobalEventBus } from './EventBus';
import { AudioManager } from './AudioManager';
import { PopupManager } from './PopupManager';
import { ToastManager } from './ToastManager';
import { AssetLoader } from './AssetLoader';
import { TimeService } from './TimeService';

const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {
  // Singleton instance to access global services and state.
  static instance: GameManager | null = null;

  // Global game state kept here to avoid scattering values across systems.
  balance = 0;
  bet = 1;
  isPaused = false;
  autoSpin = false;
  currentScene: string | null = null;

  private popupRoot: Node | null = null;
  private toastRoot: Node | null = null;

  readonly eventBus: EventBus = GlobalEventBus;
  stateMachine!: SlotStateMachine;
  audio!: AudioManager;
  popups!: PopupManager;
  toasts!: ToastManager;
  readonly assets: AssetLoader = new AssetLoader();
  readonly time: TimeService = new TimeService();
  private readonly POPUP_PRIORITY = 9999;

  onLoad(): void {
    if (GameManager.instance && GameManager.instance !== this) {
      this.destroy();
      return;
    }
    GameManager.instance = this;
    if (!director.isPersistRootNode(this.node)) {
      director.addPersistRootNode(this.node);
    }

    // Auto-create roots if not assigned
    if (!this.popupRoot) {
      this.popupRoot = new Node('PopupRoot');
      this.popupRoot.setParent(this.node);
    }
    this.ensureUiPriority(this.popupRoot, this.POPUP_PRIORITY);
    this.ensureBlockInput(this.popupRoot);
    if (!this.toastRoot) {
      this.toastRoot = new Node('ToastRoot');
      this.toastRoot.setParent(this.node);
    }

    this.stateMachine = new SlotStateMachine(this.eventBus);
    this.audio = AudioManager.getInstance(this.eventBus);
    this.popups = PopupManager.getInstance();
    this.toasts = ToastManager.getInstance();

    this.popups.bindRoot(this.popupRoot);
    this.toasts.bindRoot(this.toastRoot);
  }

  private ensureUiPriority(node: Node | null, priority: number): void {
    if (!node) return;
    const ui = node.getComponent(UITransform) ?? node.addComponent(UITransform);
    ui.priority = priority;
  }

  private ensureBlockInput(node: Node | null): void {
    if (!node) return;
    if (!node.getComponent(BlockInputEvents)) {
      node.addComponent(BlockInputEvents);
    }
  }

  static getInstance(): GameManager {
    if (!GameManager.instance) {
      throw new Error('GameManager not initialized yet');
    }
    return GameManager.instance;
  }

  start(): void {
    this.stateMachine.changeState('IDLE');
    this.eventBus.emit('GAME_READY');
  }

  setBalance(value: number): void {
    this.balance = value;
    this.eventBus.emit(GameEvents.BALANCE_CHANGED, value);
  }

  setBet(value: number): void {
    this.bet = value;
    this.eventBus.emit(GameEvents.BET_CHANGED, value);
  }

  setPaused(paused: boolean): void {
    this.isPaused = paused;
    this.eventBus.emit(GameEvents.PAUSE_CHANGED, paused);
  }

  setAutoSpin(enabled: boolean): void {
    this.autoSpin = enabled;
    this.eventBus.emit(GameEvents.AUTO_SPIN_CHANGED, enabled);
  }

  setCurrentScene(name: string | null): void {
    this.currentScene = name;
    this.eventBus.emit(GameEvents.SCENE_CHANGED, name);
  }

  onDestroy(): void {
    if (GameManager.instance === this) {
      GameManager.instance = null;
    }
    this.eventBus.clear();
    this.time.dispose();
  }
}

export const GameEvents = {
  GAME_READY: 'GAME_READY',
  BALANCE_CHANGED: 'BALANCE_CHANGED',
  BET_CHANGED: 'BET_CHANGED',
  PAUSE_CHANGED: 'PAUSE_CHANGED',
  AUTO_SPIN_CHANGED: 'AUTO_SPIN_CHANGED',
  SCENE_CHANGED: 'SCENE_CHANGED',
};
