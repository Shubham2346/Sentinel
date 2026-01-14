import { useCallback } from 'react';

export const useHaptics = () => {
  const vibrate = useCallback((pattern: number | number[]) => {
    if ('vibrate' in navigator) {
      navigator.vibrate(pattern);
    }
  }, []);

  const vibrateForPriority = useCallback((priority: 'critical' | 'high' | 'medium' | 'low') => {
    const patterns = {
      critical: [200, 100, 200, 100, 200], // Rapid
      high: [300, 200, 300], // Long
      medium: [150], // Medium
      low: [50] // Short
    };
    vibrate(patterns[priority]);
  }, [vibrate]);

  return { vibrate, vibrateForPriority };
};