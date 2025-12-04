import { director } from 'cc';

type EventCallback = (...args: any[]) => void;

/**
 * Lightweight event hub to decouple systems.
 */
export class EventBus {
  private readonly listeners: Map<string, Set<EventCallback>> = new Map();

  on(event: string, callback: EventCallback): void {
    const list = this.listeners.get(event) ?? new Set<EventCallback>();
    list.add(callback);
    this.listeners.set(event, list);
  }

  once(event: string, callback: EventCallback): void {
    const wrapper: EventCallback = (...args: any[]) => {
      this.off(event, wrapper);
      callback(...args);
    };
    this.on(event, wrapper);
  }

  off(event: string, callback: EventCallback): void {
    const list = this.listeners.get(event);
    if (!list) return;
    list.delete(callback);
    if (list.size === 0) {
      this.listeners.delete(event);
    }
  }

  emit(event: string, ...args: any[]): void {
    const list = this.listeners.get(event);
    if (!list || list.size === 0) return;
    list.forEach((cb) => cb(...args));
  }

  /**
   * Clears listeners when the game is restarted.
   */
  clear(): void {
    this.listeners.clear();
  }
}

export const GlobalEventBus = new EventBus();

// Optional helper to integrate with Cocos pause/resume lifecycle.
director.on('GAME_RESTART', () => GlobalEventBus.clear());
