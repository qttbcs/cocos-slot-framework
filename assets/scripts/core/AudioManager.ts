import { AudioClip, AudioSource, resources } from 'cc';
import { EventBus } from './EventBus';

/**
 * Handles BGM, SFX, and voice playback with simple controls.
 */
export class AudioManager {
  private bgmSource: AudioSource | null = null;
  private sfxSource: AudioSource | null = null;
  private voiceSource: AudioSource | null = null;
  private currentBGM: string | null = null;
  private bgmVolume = 1;
  private sfxVolume = 1;
  private voiceVolume = 1;
  private readonly eventBus?: EventBus;

  constructor(eventBus?: EventBus) {
    this.eventBus = eventBus;
  }

  bindBGMSource(source: AudioSource): void {
    this.bgmSource = source;
    this.bgmSource.volume = this.bgmVolume;
  }

  bindSFXSource(source: AudioSource): void {
    this.sfxSource = source;
    this.sfxSource.volume = this.sfxVolume;
  }

  bindVoiceSource(source: AudioSource): void {
    this.voiceSource = source;
    this.voiceSource.volume = this.voiceVolume;
  }

  async playBgm(path: string, loop = true): Promise<void> {
    if (!this.bgmSource) return;
    if (this.currentBGM === path && this.bgmSource.playing) return;
    const clip = await this.loadClip(path);
    this.currentBGM = path;
    this.bgmSource.clip = clip;
    this.bgmSource.loop = loop;
    this.bgmSource.volume = this.bgmVolume;
    this.bgmSource.play();
    this.eventBus?.emit(AudioEvents.BGM_PLAY, path);
  }

  stopBgm(): void {
    if (!this.bgmSource) return;
    this.bgmSource.stop();
    this.currentBGM = null;
    this.eventBus?.emit(AudioEvents.BGM_STOP);
  }

  async playSfx(path: string, volume?: number): Promise<void> {
    if (!this.sfxSource) return;
    const clip = await this.loadClip(path);
    this.sfxSource.playOneShot(clip, volume ?? this.sfxVolume);
    this.eventBus?.emit(AudioEvents.SFX_PLAY, path);
  }

  async playVoice(path: string, loop = false): Promise<void> {
    if (!this.voiceSource) return;
    const clip = await this.loadClip(path);
    this.voiceSource.clip = clip;
    this.voiceSource.loop = loop;
    this.voiceSource.volume = this.voiceVolume;
    this.voiceSource.play();
    this.eventBus?.emit(AudioEvents.VOICE_PLAY, path);
  }

  setVolume(type: 'bgm' | 'sfx' | 'voice', volume: number): void {
    const clamped = Math.max(0, Math.min(1, volume));
    if (type === 'bgm') {
      this.bgmVolume = clamped;
      if (this.bgmSource) this.bgmSource.volume = clamped;
    } else if (type === 'sfx') {
      this.sfxVolume = clamped;
      if (this.sfxSource) this.sfxSource.volume = clamped;
    } else {
      this.voiceVolume = clamped;
      if (this.voiceSource) this.voiceSource.volume = clamped;
    }
    this.eventBus?.emit(AudioEvents.VOLUME_CHANGED, type, clamped);
  }

  private loadClip(path: string): Promise<AudioClip> {
    return new Promise((resolve, reject) => {
      resources.load(path, AudioClip, (err, clip) => {
        if (err || !clip) {
          reject(err);
          return;
        }
        resolve(clip);
      });
    });
  }
}

export const AudioEvents = {
  BGM_PLAY: 'AUDIO_BGM_PLAY',
  BGM_STOP: 'AUDIO_BGM_STOP',
  SFX_PLAY: 'AUDIO_SFX_PLAY',
  VOICE_PLAY: 'AUDIO_VOICE_PLAY',
  VOLUME_CHANGED: 'AUDIO_VOLUME_CHANGED',
};
