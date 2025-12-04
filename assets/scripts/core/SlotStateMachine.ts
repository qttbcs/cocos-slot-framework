import { EventBus, GlobalEventBus } from './EventBus';

export type SlotState =
  | 'INIT'
  | 'IDLE'
  | 'SPIN_ACCEL'
  | 'SPIN_CONST'
  | 'STOPPING'
  | 'RESULT'
  | 'PAUSED';

interface TransitionOptions {
  silent?: boolean;
  payload?: Record<string, unknown>;
}

/**
 * Simple finite state machine to drive slot flow.
 */
export class SlotStateMachine {
  private currentState: SlotState = 'INIT';
  private readonly eventBus: EventBus;
  private readonly transitions: Record<SlotState, SlotState[]> = {
    INIT: ['IDLE'],
    IDLE: ['SPIN_ACCEL', 'PAUSED'],
    SPIN_ACCEL: ['SPIN_CONST', 'PAUSED'],
    SPIN_CONST: ['STOPPING', 'PAUSED'],
    STOPPING: ['RESULT', 'PAUSED'],
    RESULT: ['IDLE', 'PAUSED'],
    PAUSED: ['IDLE'],
  };

  constructor(eventBus: EventBus = GlobalEventBus) {
    this.eventBus = eventBus;
  }

  get state(): SlotState {
    return this.currentState;
  }

  canTransition(next: SlotState): boolean {
    if (this.currentState === next) return false;
    const allowed = this.transitions[this.currentState] ?? [];
    return allowed.indexOf(next) !== -1;
  }

  changeState(next: SlotState, options: TransitionOptions = {}): void {
    if (!this.canTransition(next)) return;
    this.currentState = next;
    if (!options.silent) {
      this.eventBus.emit(SlotStateEvents.STATE_CHANGED, next, options.payload ?? {});
    }
  }
}

export const SlotStateEvents = {
  STATE_CHANGED: 'SLOT_STATE_CHANGED',
};
