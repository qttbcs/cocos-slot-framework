import { PlayerPrefs } from './PlayerPrefs';

interface AudioSettings {
  bgm: number;
  sfx: number;
  voice: number;
}

interface UserSettings {
  audio: AudioSettings;
  lastBet?: number;
  autoSpinCount?: number;
}

const KEY = 'slot_settings';

export class SettingsRepository {
  private readonly prefs: PlayerPrefs;

  constructor(prefs = new PlayerPrefs()) {
    this.prefs = prefs;
  }

  load(): UserSettings {
    const raw = this.prefs.getString(KEY, '');
    if (!raw) {
      return { audio: { bgm: 1, sfx: 1, voice: 1 } };
    }
    try {
      return JSON.parse(raw) as UserSettings;
    } catch (err) {
      console.warn('Failed to parse settings', err);
      return { audio: { bgm: 1, sfx: 1, voice: 1 } };
    }
  }

  save(settings: UserSettings): void {
    this.prefs.setString(KEY, JSON.stringify(settings));
  }
}
