/**
 * Cannabinoid Utilities
 * Color mapping, naming conventions, and calculations for cannabinoids
 * CDES v1.3.0 — Deep jewel tone palette with accessibility support
 */

export interface CannabioidColor {
  hex: string;
  rgb: { r: number; g: number; b: number };
  therapeutic?: string;
  threshold?: { min: number; max: number };
  /** SVG pattern identifier for color-blind rendering */
  pattern?: string;
  /** Unicode shape for legend icons */
  shape?: string;
  /** v1.2 hex for migration reference */
  legacyHex?: string;
}

/**
 * Standard cannabinoid definitions with CDES v1.3 deep jewel tone palette.
 * "Bright Terpenes, Deep Cannabinoids" — cannabinoids use L 25-50 for
 * visual separation from bright terpene colors (L 45-80).
 */
export const STANDARD_CANNABINOIDS: Record<string, CannabioidColor> = {
  THC: {
    hex: "#B71C1C",
    rgb: { r: 183, g: 28, b: 28 },
    therapeutic: "Psychoactive, Pain Relief, Nausea",
    threshold: { min: 0, max: 35 },
    pattern: "diagonal-right",
    shape: "\u25C6",
    legacyHex: "#E74C3C",
  },
  CBD: {
    hex: "#1565C0",
    rgb: { r: 21, g: 101, b: 192 },
    therapeutic: "Anti-inflammatory, Anxiety, Seizures",
    threshold: { min: 0, max: 25 },
    pattern: "horizontal-lines",
    shape: "\u25A0",
    legacyHex: "#3498DB",
  },
  CBN: {
    hex: "#A0522D",
    rgb: { r: 160, g: 82, b: 45 },
    therapeutic: "Sedation, Sleep, Anti-inflammatory",
    threshold: { min: 0, max: 5 },
    pattern: "crosshatch",
    shape: "\u25CF",
    legacyHex: "#E67E22",
  },
  CBG: {
    hex: "#6A1B9A",
    rgb: { r: 106, g: 27, b: 154 },
    therapeutic: "Uplift, Focus, Appetite Stimulant",
    threshold: { min: 0, max: 5 },
    pattern: "dots-coarse",
    shape: "\u25B2",
    legacyHex: "#9B59B6",
  },
  CBC: {
    hex: "#00695C",
    rgb: { r: 0, g: 105, b: 92 },
    therapeutic: "Anti-inflammatory, Mood Support",
    threshold: { min: 0, max: 1 },
    pattern: "dots-fine",
    shape: "\u25BC",
    legacyHex: "#16A085",
  },
  THCV: {
    hex: "#C77C02",
    rgb: { r: 199, g: 124, b: 2 },
    therapeutic: "Energy, Appetite Suppression, Focus",
    threshold: { min: 0, max: 3 },
    pattern: "zigzag",
    shape: "\u2B21",
    legacyHex: "#F39C12",
  },
  CBDV: {
    hex: "#00796B",
    rgb: { r: 0, g: 121, b: 107 },
    therapeutic: "Seizure Support, Nausea",
    threshold: { min: 0, max: 1 },
    pattern: "waves",
    shape: "\u2B20",
    legacyHex: "#1ABC9C",
  },
  CBDA: {
    hex: "#9E7C1F",
    rgb: { r: 158, g: 124, b: 31 },
    therapeutic: "Raw Form, Anti-inflammatory",
    threshold: { min: 0, max: 5 },
    pattern: "vertical-lines",
    shape: "\u25A1",
    legacyHex: "#D4AF37",
  },
  THCA: {
    hex: "#880E0E",
    rgb: { r: 136, g: 14, b: 14 },
    therapeutic: "Raw Psychoactive, Anti-inflammatory",
    threshold: { min: 0, max: 35 },
    pattern: "diagonal-left",
    shape: "\u25C7",
    legacyHex: "#C0392B",
  },
  CBGA: {
    hex: "#4A148C",
    rgb: { r: 74, g: 20, b: 140 },
    therapeutic: "Raw CBG Precursor, Mother of All Cannabinoids",
    threshold: { min: 0, max: 5 },
    pattern: "checkerboard",
    shape: "\u25B3",
    legacyHex: "#8E44AD",
  },
  "Delta-8 THC": {
    hex: "#C62828",
    rgb: { r: 198, g: 40, b: 40 },
    therapeutic: "Mild Psychoactive, Anti-nausea, Appetite",
    threshold: { min: 0, max: 15 },
    pattern: "diagonal-dense",
    shape: "\u25C7",
    legacyHex: "#E67E22",
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
