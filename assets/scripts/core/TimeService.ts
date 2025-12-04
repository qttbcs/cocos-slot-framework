import { director, game, Game } from 'cc';

type TimerId = string;

/**
 * Small wrapper around Cocos scheduler for clearer usage.
 */
export class TimeService {
  public readonly id = `TimeService-${Date.now()}`;
  private readonly scheduler = director.getScheduler();
  private readonly callbacks: Map<TimerId, () => void> = new Map();
  private timeScale = 1;
  private deltaTime = 0;
  private idleThreshold = 300; // seconds
  private idleTimer = 0;
  private readonly onIdle?: () => void;

  constructor(onIdle?: () => void) {
    this.onIdle = onIdle;
    game.on(Game.EVENT_HIDE, this.handleIdle, this);
  }

  setTimeout(callback: () => void, delaySeconds: number): TimerId {
    const id = `timeout-${Date.now()}-${Math.random()}`;
    const wrapped = () => {
      this.clear(id);
      callback();
    };
    this.scheduler.schedule(wrapped, this, 0, 0, delaySeconds);
    this.callbacks.set(id, wrapped);
    return id;
  }

  setInterval(callback: () => void, intervalSeconds: number): TimerId {
    const id = `interval-${Date.now()}-${Math.random()}`;
    this.scheduler.schedule(callback, this, intervalSeconds, Number.POSITIVE_INFINITY, 0, false);
    this.callbacks.set(id, callback);
    return id;
  }

  /**
   * Call per-frame to track deltaTime and idle timer with custom timescale.
   */
  tick(dt: number): void {
    this.deltaTime = dt * this.timeScale;
    this.idleTimer += this.deltaTime;
    if (this.idleTimer >= this.idleThreshold) {
      this.handleIdle();
      this.idleTimer = 0;
    }
  }

  getDeltaTime(): number {
    return this.deltaTime;
  }

  setTimeScale(scale: number): void {
    this.timeScale = Math.max(0, scale);
    this.scheduler.setTimeScale(this.timeScale);
  }

  resetIdleTimer(): void {
    this.idleTimer = 0;
  }

  clear(id: TimerId): void {
    const cb = this.callbacks.get(id);
    if (!cb) return;
    this.scheduler.unschedule(cb, this);
    this.callbacks.delete(id);
  }

  dispose(): void {
    this.scheduler.unscheduleAllForTarget(this);
    this.callbacks.clear();
    game.off(Game.EVENT_HIDE, this.handleIdle, this);
  }

  private handleIdle(): void {
    if (this.onIdle) {
      this.onIdle();
    } else {
      // Default behavior: slow down the scheduler to drop FPS while idle.
      this.setTimeScale(0.5);
    }
  }
}
