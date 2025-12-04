import { _decorator, Component, Node } from 'cc';
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

  @property(Node)
  popupRoot: Node | null = null;

  @property(Node)
  toastRoot: Node | null = null;

  readonly eventBus: EventBus = GlobalEventBus;
  readonly stateMachine: SlotStateMachine = new SlotStateMachine(this.eventBus);
  readonly audio: AudioManager = new AudioManager(this.eventBus);
  readonly popups: PopupManager = new PopupManager();
  readonly toasts: ToastManager = new ToastManager();
  readonly assets: AssetLoader = new AssetLoader();
  readonly time: TimeService = new TimeService();

  onLoad(): void {
    if (GameManager.instance && GameManager.instance !== this) {
      this.destroy();
      return;
    }
    GameManager.instance = this;
    this.popups.bindRoot(this.popupRoot);
    this.toasts.bindRoot(this.toastRoot);
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
