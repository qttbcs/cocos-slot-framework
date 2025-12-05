export interface DeviceProfile {
  os: string;
  osVersion: string;
  platform: string;
  language: string;
  screen: { width: number; height: number; pixelRatio: number };
}

export class DeviceInfo {
  getProfile(): DeviceProfile {
    const ua = navigator.userAgent;
    return {
      os: this.detectOS(ua),
      osVersion: this.detectOSVersion(ua),
      platform: navigator.platform,
      language: navigator.language,
      screen: {
        width: window.screen.width,
        height: window.screen.height,
        pixelRatio: window.devicePixelRatio || 1,
      },
    };
  }

  private detectOS(ua: string): string {
    if (/Windows/i.test(ua)) return 'Windows';
    if (/Android/i.test(ua)) return 'Android';
    if (/iPhone|iPad|iPod/i.test(ua)) return 'iOS';
    if (/Mac OS X/i.test(ua)) return 'macOS';
    return 'Unknown';
  }

  private detectOSVersion(ua: string): string {
    const match = ua.match(/(Windows NT|Android|CPU (?:iPhone )?OS|Mac OS X) ([\d_\.]+)/i);
    return match ? match[2].replace(/_/g, '.') : '0';
  }
}
