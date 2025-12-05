export interface ReelConfig {
  id: number;
  symbols: string[];
  symbolCount: number;
  spinDuration: number; // seconds per spin cycle
  stopDelay: number; // delay before stopping after result
  speed: number; // pixels per second
  topY: number; // top position for strip
  bottomY: number; // bottom position for strip
}

export interface ReelGroupConfig {
  reels: ReelConfig[];
  easing?: string;
}
