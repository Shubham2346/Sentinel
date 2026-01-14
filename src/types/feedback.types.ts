export type FeedbackMode = 'visual' | 'hearing' | 'mobility';
export type AlertPriority = 'critical' | 'high' | 'medium' | 'low';

export interface FeedbackConfig {
  enableTTS: boolean;
  enableHaptics: boolean;
  enableVisualAlerts: boolean;
  ttsRate: number;
  ttsVolume: number;
}

export interface HapticPattern {
  duration: number;
  intensity?: number;
}