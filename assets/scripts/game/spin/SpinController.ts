import { _decorator, Component } from 'cc';
import { ReelGroupController } from '../reel/ReelGroupController';
import { ResultMatrix } from '../result/ResultMatrix';
import { SlotStateMachine } from '../../core/SlotStateMachine';
import { EventBus, GlobalEventBus } from '../../core/EventBus';

const { ccclass, property } = _decorator;

@ccclass('SpinController')
export class SpinController extends Component {
  @property(ReelGroupController)
  reelGroup: ReelGroupController | null = null;

  @property
  accelDuration = 0.2;

  @property
  minSpinTime = 1.5;

  private readonly state: SlotStateMachine;
  private readonly events: EventBus;
  private resultProvider?: () => Promise<ResultMatrix>;
  private pendingResult: ResultMatrix | null = null;
  private spinStartTime = 0;

  constructor() {
    super();
    this.events = GlobalEventBus;
    this.state = new SlotStateMachine(this.events);
  }

  onLoad(): void {
    this.events.on('SLOT_SPIN_REQUESTED', this.handleSpinRequested);
  }

  onDestroy(): void {
    this.events.off('SLOT_SPIN_REQUESTED', this.handleSpinRequested);
  }

  setResultProvider(provider: () => Promise<ResultMatrix>): void {
    this.resultProvider = provider;
  }

  private handleSpinRequested = (): void => {
    if (!this.canStartSpin()) return;
    this.startSpin();
    this.fetchResult();
  };

  private canStartSpin(): boolean {
    return this.state.canTransition('SPIN_ACCEL');
  }

  startSpin(): void {
    if (!this.reelGroup || !this.state.canTransition('SPIN_ACCEL')) return;
    this.state.changeState('SPIN_ACCEL');
    this.reelGroup.startSpin();
    this.spinStartTime = Date.now();
    this.events.emit('SLOT_SPIN_STARTED');
    this.scheduleOnce(() => this.state.changeState('SPIN_CONST'), this.accelDuration);
  }

  stopWithResult(result: ResultMatrix, onStopped?: () => void): void {
    if (!this.reelGroup) return;
    this.state.changeState('STOPPING');
    this.reelGroup.stopSpin(() => {
      this.state.changeState('RESULT', { payload: { result } });
      this.events.emit('SLOT_RESULT_READY', result);
      onStopped?.();
    });
  }

  private async fetchResult(): Promise<void> {
    try {
      const result = await (this.resultProvider?.() ?? Promise.resolve(new ResultMatrix([])));
      this.pendingResult = result;
      this.tryStopWithResult();
    } catch (err) {
      console.error('Spin result error', err);
      this.events.emit('SLOT_RESULT_ERROR', err);
    }
  }

  private tryStopWithResult(): void {
    if (!this.pendingResult || !this.reelGroup) return;
    const elapsed = (Date.now() - this.spinStartTime) / 1000;
    const waitTime = Math.max(0, this.minSpinTime - elapsed);
    this.scheduleOnce(() => {
      this.stopWithResult(this.pendingResult!);
      this.pendingResult = null;
    }, waitTime);
  }
}
