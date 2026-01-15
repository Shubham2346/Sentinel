import { useState, useEffect, useRef } from "react";
import type {
  DetectedObject,
  CollisionAlert,
  CollisionZone,
} from "../types";
import { collisionService } from "../services/collisionService";

/**
 * Collision detection hook
 * - Consumes object detections
 * - Determines LEFT / CENTER / RIGHT danger
 * - Returns the most dangerous active zone
 */
export const useCollisionDetection = (
  detections: DetectedObject[],
  videoWidth: number,
  enabled: boolean = true
) => {
  const [collisionAlert, setCollisionAlert] =
    useState<CollisionAlert>({
      isActive: false,
      zone: null,
      timestamp: Date.now(),
    });

  const lastUpdateRef = useRef<number>(0);
  const UPDATE_INTERVAL = 80; // ms (safe + responsive)

  useEffect(() => {
    if (!enabled || detections.length === 0 || videoWidth === 0) {
      setCollisionAlert({
        isActive: false,
        zone: null,
        timestamp: Date.now(),
      });
      return;
    }

    const now = Date.now();

    // Throttle updates
    if (now - lastUpdateRef.current < UPDATE_INTERVAL) {
      return;
    }
    lastUpdateRef.current = now;

    // Analyze zones
    const zones: CollisionZone[] =
      collisionService.analyzeCollisionZones(
        detections,
        videoWidth
      );

    // Pick the most dangerous zone
    const dangerousZone =
      collisionService.getMostDangerousZone(zones);

    if (dangerousZone) {
      setCollisionAlert({
        isActive: true,
        zone: dangerousZone,
        timestamp: now,
      });
    } else {
      setCollisionAlert({
        isActive: false,
        zone: null,
        timestamp: now,
      });
    }
  }, [detections, videoWidth, enabled]);

  return collisionAlert;
};
