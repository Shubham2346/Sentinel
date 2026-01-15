import type { DetectedObject, Region, DangerLevel, CollisionZone } from '../types';

class CollisionService {
  private readonly DANGER_DISTANCE = 2; // meters - IMMEDIATE DANGER
  private readonly CAUTION_DISTANCE = 4; // meters - CAUTION ZONE
  
  /**
   * Determine which region (left/center/right) an object is in
   */
  getObjectRegion(bbox: number[], videoWidth: number): Region {
    const [x, , width] = bbox;
    const centerX = x + width / 2;
    const leftBoundary = videoWidth / 3;
    const rightBoundary = (videoWidth * 2) / 3;

    if (centerX < leftBoundary) return 'left';
    if (centerX > rightBoundary) return 'right';
    return 'center';
  }

  /**
   * Evaluate danger level based on distance
   */
  evaluateDangerLevel(distance: number): DangerLevel {
    if (distance <= this.DANGER_DISTANCE) return 'danger';
    if (distance <= this.CAUTION_DISTANCE) return 'caution';
    return 'none';
  }

  /**
   * Analyze detections and group by zones
   */
  analyzeCollisionZones(
    detections: DetectedObject[],
    videoWidth: number
  ): CollisionZone[] {
    const zones: Map<Region, CollisionZone> = new Map([
      ['left', { region: 'left', dangerLevel: 'none', objects: [], closestDistance: Infinity }],
      ['center', { region: 'center', dangerLevel: 'none', objects: [], closestDistance: Infinity }],
      ['right', { region: 'right', dangerLevel: 'none', objects: [], closestDistance: Infinity }]
    ]);

    // Filter for high-priority objects only (critical and high)
    const criticalObjects = detections.filter(
      det => (det.priority === 'critical' || det.priority === 'high') && det.distance
    );

    criticalObjects.forEach(detection => {
      if (!detection.distance) return;

      const region = this.getObjectRegion(detection.bbox, videoWidth);
      const zone = zones.get(region)!;

      // Update zone with object info
      zone.objects.push(detection.class);
      
      // Track closest object in this zone
      if (detection.distance < zone.closestDistance) {
        zone.closestDistance = detection.distance;
        zone.dangerLevel = this.evaluateDangerLevel(detection.distance);
      }
    });

    return Array.from(zones.values()).filter(zone => zone.dangerLevel !== 'none');
  }

  /**
   * Get the most dangerous zone (prioritizes DANGER over CAUTION, then closest)
   */
  getMostDangerousZone(zones: CollisionZone[]): CollisionZone | null {
    if (zones.length === 0) return null;

    return zones.reduce((most, current) => {
      // Always prioritize danger level
      if (current.dangerLevel === 'danger' && most.dangerLevel !== 'danger') {
        return current;
      }
      // If same danger level, choose closest
      if (current.closestDistance < most.closestDistance) {
        return current;
      }
      return most;
    });
  }
}

export const collisionService = new CollisionService();