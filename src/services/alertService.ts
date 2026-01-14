import type { DetectedObject } from '../types';
import { ttsService } from './ttsService';

class AlertService {
  private lastAlertTimes: Map<string, number> = new Map();
  private alertCooldown = 3000; // 3 seconds

  processDetections(detections: DetectedObject[], enableTTS: boolean, enableHaptics: boolean) {
    const now = Date.now();
    
    // Sort by priority
    const sorted = [...detections].sort((a, b) => {
      const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });

    sorted.forEach(detection => {
      const key = `${detection.class}-${detection.distance}`;
      const lastAlert = this.lastAlertTimes.get(key) || 0;

      if (now - lastAlert > this.alertCooldown) {
        this.alert(detection, enableTTS, enableHaptics);
        this.lastAlertTimes.set(key, now);
      }
    });
  }

  private alert(detection: DetectedObject, enableTTS: boolean, enableHaptics: boolean) {
    const message = this.generateMessage(detection);

    if (enableTTS && (detection.priority === 'critical' || detection.priority === 'high')) {
      ttsService.speak(message, detection.priority);
    }

    if (enableHaptics && 'vibrate' in navigator) {
      const patterns = {
        critical: [200, 100, 200, 100, 200],
        high: [300, 200, 300],
        medium: [150],
        low: [50]
      };
      navigator.vibrate(patterns[detection.priority]);
    }
  }

  private generateMessage(detection: DetectedObject): string {
    const templates = {
      car: 'Warning: Vehicle approaching',
      truck: 'Warning: Large vehicle nearby',
      person: `Person ${detection.distance} meters ahead`,
      stairs: 'Stairs detected ahead',
      door: 'Door nearby',
      chair: 'Obstacle detected'
    };

    return templates[detection.class as keyof typeof templates] || 
           `${detection.class} detected`;
  }
}

export const alertService = new AlertService();