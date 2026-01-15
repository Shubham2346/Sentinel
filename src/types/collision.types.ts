export type Region = 'left' | 'center' | 'right';
export type DangerLevel = 'none' | 'caution' | 'danger';

export interface CollisionZone {
  region: Region;
  dangerLevel: DangerLevel;
  objects: string[]; // Object classes in this zone
  closestDistance: number;
}

export interface CollisionAlert {
  isActive: boolean;
  zone: CollisionZone | null;
  timestamp: number;
}