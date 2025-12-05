import { SlotApiClient } from './SlotApiClient';
import { EventBus, GlobalEventBus } from '../../core/EventBus';

export interface SessionData {
  token: string;
  playerId: string;
  expiresAt?: number;
  balance?: number;
}

export class SlotSession {
  private session: SessionData | null = null;
  private readonly api: SlotApiClient;
  private readonly events: EventBus;

  constructor(api: SlotApiClient, events: EventBus = GlobalEventBus) {
    this.api = api;
    this.events = events;
  }

  async login(credential: Record<string, any>): Promise<SessionData> {
    const data = await this.api.post<SessionData>('/login', { body: credential });
    this.session = data;
    this.events.emit('SESSION_LOGGED_IN', data);
    return data;
  }

  async refreshBalance(): Promise<number | null> {
    if (!this.session) return null;
    const data = await this.api.get<{ balance: number }>('/balance', {
      headers: { Authorization: `Bearer ${this.session.token}` },
    });
    this.session.balance = data.balance;
    this.events.emit('BALANCE_SYNCED', data.balance);
    return data.balance;
  }

  getSession(): SessionData | null {
    return this.session;
  }

  isExpired(): boolean {
    if (!this.session?.expiresAt) return false;
    return Date.now() > this.session.expiresAt;
  }

  clear(): void {
    this.session = null;
    this.events.emit('SESSION_LOGGED_OUT');
  }
}
