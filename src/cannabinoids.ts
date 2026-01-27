/**
 * Cannabinoid Utilities
 * Color mapping, naming conventions, and calculations for cannabinoids
 */

export interface CannabioidColor {
  hex: string;
  rgb: { r: number; g: number; b: number };
  therapeutic?: string;
  threshold?: { min: number; max: number };
}

/** Standard cannabinoid definitions with medical/therapeutic colors */
export const STANDARD_CANNABINOIDS: Record<string, CannabioidColor> = {
  THC: {
    hex: "#E74C3C",
    rgb: { r: 231, g: 76, b: 60 },
    therapeutic: "Psychoactive, Pain Relief, Nausea",
    threshold: { min: 0, max: 35 },
  },
  CBD: {
    hex: "#3498DB",
    rgb: { r: 52, g: 152, b: 219 },
    therapeutic: "Anti-inflammatory, Anxiety, Seizures",
    threshold: { min: 0, max: 25 },
  },
  CBN: {
    hex: "#E67E22",
    rgb: { r: 230, g: 126, b: 34 },
    therapeutic: "Sedation, Sleep, Anti-inflammatory",
    threshold: { min: 0, max: 5 },
  },
  CBG: {
    hex: "#9B59B6",
    rgb: { r: 155, g: 89, b: 182 },
    therapeutic: "Uplift, Focus, Appetite Stimulant",
    threshold: { min: 0, max: 5 },
  },
  CBC: {
    hex: "#16A085",
    rgb: { r: 22, g: 160, b: 133 },
    therapeutic: "Anti-inflammatory, Mood Support",
    threshold: { min: 0, max: 1 },
  },
  THCV: {
    hex: "#F39C12",
    rgb: { r: 243, g: 156, b: 18 },
    therapeutic: "Energy, Appetite Suppression, Focus",
    threshold: { min: 0, max: 3 },
  },
  CBDV: {
    hex: "#1ABC9C",
    rgb: { r: 26, g: 188, b: 156 },
    therapeutic: "Seizure Support, Nausea",
    threshold: { min: 0, max: 1 },
  },
  CBDA: {
    hex: "#D4AF37",
    rgb: { r: 212, g: 175, b: 55 },
    therapeutic: "Raw Form, Anti-inflammatory",
    threshold: { min: 0, max: 5 },
  },
  THCA: {
    hex: "#C0392B",
    rgb: { r: 192, g: 57, b: 43 },
    therapeutic: "Raw Psychoactive, Anti-inflammatory",
    threshold: { min: 0, max: 35 },
  },
};

/** Normalize cannabinoid names for matching */
export function normalizeCannabioidName(name: string): string {
  return name
    .toUpperCase()
    .trim()
    .replace(/[\s\-_]/g, "")
    .replace(/%/g, "")
    .substring(0, 5);
}

/** Get color for cannabinoid */
export function getCannabioidColor(
  name: string
): CannabioidColor | undefined {
  const normalized = normalizeCannabioidName(name);
  for (const [key, color] of Object.entries(STANDARD_CANNABINOIDS)) {
    if (key.includes(normalized) || normalized.includes(key)) {
      return color;
    }
  }
  return undefined;
}

/** Find cannabinoid display name */
export function getCannabioidDisplayName(name: string): string {
  const normalized = normalizeCannabioidName(name);
  for (const key of Object.keys(STANDARD_CANNABINOIDS)) {
    if (key.includes(normalized) || normalized.includes(key)) {
      return key;
    }
  }
  return name;
}

/** Calculate Euclidean distance between two cannabinoid profiles */
export function calculateEuclideanDistance(
  profile1: Map<string, number>,
  profile2: Map<string, number>
): number {
  const allKeys = new Set([...profile1.keys(), ...profile2.keys()]);
  let sumSquares = 0;

  for (const key of allKeys) {
    const val1 = profile1.get(key) || 0;
    const val2 = profile2.get(key) || 0;
    sumSquares += Math.pow(val1 - val2, 2);
  }

  return Math.sqrt(sumSquares);
}

/** Find similar profiles by distance threshold */
export function findSimilarProfiles(
  targetProfile: Map<string, number>,
  allProfiles: Array<{ id: string; profile: Map<string, number> }>,
  threshold: number = 5
): Array<{ id: string; distance: number }> {
  return allProfiles
    .map(({ id, profile }) => ({
      id,
      distance: calculateEuclideanDistance(targetProfile, profile),
    }))
    .filter(({ distance }) => distance <= threshold)
    .sort((a, b) => a.distance - b.distance);
}

/** Get percentage category for cannabinoid level */
export function getCannabioidCategory(
  name: string,
  percentage: number
): "low" | "medium" | "high" | "very-high" {
  const color = getCannabioidColor(name);
  if (!color?.threshold) return "low";

  const { min, max } = color.threshold;
  const range = max - min;

  if (percentage <= min + range * 0.25) return "low";
  if (percentage <= min + range * 0.5) return "medium";
  if (percentage <= min + range * 0.75) return "high";
  return "very-high";
}

/** Format cannabinoid value for display */
export function formatCannabioidValue(
  value: number,
  decimals: number = 2
): string {
  return value.toFixed(decimals) + "%";
}

/** Calculate total cannabinoid content */
export function calculateTotalCannabinoids(
  profile: Map<string, number>
): number {
  return Array.from(profile.values()).reduce((sum, val) => sum + val, 0);
}
