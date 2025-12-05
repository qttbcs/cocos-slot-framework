import { EventBus, GlobalEventBus } from '../../core/EventBus';

type HttpMethod = 'GET' | 'POST';

interface RequestOptions {
  headers?: Record<string, string>;
  body?: any;
  timeoutMs?: number;
}

interface MockHandler {
  method: HttpMethod;
  path: string;
  responder: (options: RequestOptions) => any | Promise<any>;
}

/**
 * HTTP/WS client with optional mock mode for offline testing.
 */
export class SlotApiClient {
  private readonly baseUrl: string;
  private readonly events: EventBus;
  private useMock: boolean;
  private mockLatencyMs: number;
  private readonly mockHandlers: MockHandler[] = [];

  constructor(baseUrl: string, events: EventBus = GlobalEventBus, useMock = false, mockLatencyMs = 300) {
    this.baseUrl = baseUrl;
    this.events = events;
    this.useMock = useMock;
    this.mockLatencyMs = mockLatencyMs;
  }

  setMockMode(enabled: boolean, latencyMs?: number): void {
    this.useMock = enabled;
    if (latencyMs !== undefined) this.mockLatencyMs = latencyMs;
  }

  registerMock(handler: MockHandler): void {
    this.mockHandlers.push(handler);
  }

  async get<T>(path: string, options: RequestOptions = {}): Promise<T> {
    return this.request<T>('GET', path, options);
  }

  async post<T>(path: string, options: RequestOptions = {}): Promise<T> {
    return this.request<T>('POST', path, options);
  }

  connectSocket(path: string): WebSocket | null {
    if (this.useMock) return null;
    const url = this.toWsUrl(path);
    const socket = new WebSocket(url);
    socket.onopen = () => this.events.emit('WS_OPEN', path);
    socket.onclose = () => this.events.emit('WS_CLOSE', path);
    socket.onerror = (err) => this.events.emit('WS_ERROR', err);
    socket.onmessage = (msg) => {
      try {
        const data = JSON.parse(msg.data as string);
        this.events.emit('WS_MESSAGE', data);
      } catch (err) {
        this.events.emit('WS_MESSAGE_RAW', msg.data);
      }
    };
    return socket;
  }

  private async request<T>(method: HttpMethod, path: string, options: RequestOptions): Promise<T> {
    if (this.useMock) {
      const handler = this.mockHandlers.find((h) => h.method === method && h.path === path);
      if (!handler) {
        throw new Error(`No mock handler for ${method} ${path}`);
      }
      await this.delay(this.mockLatencyMs);
      const data = await handler.responder(options);
      this.events.emit('NETWORK_RESPONSE', path, data);
      return data as T;
    }

    const controller = new AbortController();
    if (options.timeoutMs) {
      setTimeout(() => controller.abort(), options.timeoutMs);
    }

    const res = await fetch(`${this.baseUrl}${path}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers ?? {}),
      },
      body: method === 'GET' ? undefined : JSON.stringify(options.body ?? {}),
      signal: controller.signal,
    });

    if (!res.ok) {
      const err = new Error(`HTTP ${res.status} ${res.statusText}`);
      this.events.emit('NETWORK_ERROR', err);
      throw err;
    }
    const data = (await res.json()) as T;
    this.events.emit('NETWORK_RESPONSE', path, data);
    return data;
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private toWsUrl(path: string): string {
    if (this.baseUrl.startsWith('https')) {
      return `${this.baseUrl.replace('https', 'wss')}${path}`;
    }
    if (this.baseUrl.startsWith('http')) {
      return `${this.baseUrl.replace('http', 'ws')}${path}`;
    }
    return `ws://${this.baseUrl}${path}`;
  }
}
