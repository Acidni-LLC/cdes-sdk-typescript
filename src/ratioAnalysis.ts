/**
 * CDES v1.5 Terpene Ratio Analysis Module
 *
 * Provides compositional data analysis methods for terpene profiles:
 * - Dominance Index
 * - Balance Score (Shannon Entropy)
 * - CLR (Centered Log-Ratio) Coordinates
 * - Ratio Signatures
 * - Archetype Classification
 *
 * @module ratioAnalysis
 * @version 1.5.0
 * CDES Standard: Cannabis Data Exchange Standard v1.5
 */

// =============================================================================
// ENUMERATIONS
// =============================================================================

/** CDES v1.5: Terpene profile archetypes based on clustering analysis. */
export enum TerpeneArchetype {
  ARCH_MYR = "ARCH_MYR", // Myrcene Dominant
  ARCH_LIM = "ARCH_LIM", // Limonene Forward
  ARCH_BAL = "ARCH_BAL", // Balanced Trio
  ARCH_PIN = "ARCH_PIN", // Pinene Sharp
  ARCH_CAR = "ARCH_CAR", // Caryophyllene Spicy
  ARCH_TER = "ARCH_TER", // Terpinolene Rare
  ARCH_LIN = "ARCH_LIN", // Linalool Floral
  ARCH_OCI = "ARCH_OCI", // Ocimene Sweet
  ARCH_UNK = "ARCH_UNK", // Unknown/Unclassified
}

/** CDES v1.5: Qualitative dominance level based on Dominance Index. */
export enum DominanceLevel {
  BALANCED = "balanced",   // DI < 0.25
  SLIGHT = "slight",       // DI 0.25-0.50
  MODERATE = "moderate",   // DI 0.50-0.75
  STRONG = "strong",       // DI > 0.75
}

// =============================================================================
// TERPENE CODES AND ORDERING
// =============================================================================

export const TERPENE_CODES: Record<string, string> = {
  myrcene: "MYR",
  limonene: "LIM",
  caryophyllene: "CAR",
  pinene: "PIN",
  linalool: "LIN",
  humulene: "HUM",
  terpinolene: "TER",
  ocimene: "OCI",
  bisabolol: "BIS",
};

export const TERPENE_NAMES: Record<string, string> = {
  myrcene: "\u03B2-Myrcene",
  limonene: "\u03B4-Limonene",
  caryophyllene: "\u03B2-Caryophyllene",
  pinene: "\u03B1-Pinene",
  linalool: "Linalool",
  humulene: "\u03B1-Humulene",
  terpinolene: "Terpinolene",
  ocimene: "Ocimene",
  bisabolol: "\u03B1-Bisabolol",
};

export const FIXED_TERPENE_ORDER: string[] = [
  "myrcene", "limonene", "caryophyllene", "pinene", "linalool",
  "humulene", "terpinolene", "ocimene", "bisabolol",
];

/** Archetype centroids (CLR coordinates) - trained from Terprint data */
const ARCHETYPE_CENTROIDS: Partial<Record<TerpeneArchetype, Record<string, number>>> = {
  [TerpeneArchetype.ARCH_MYR]: { myrcene: 1.2, limonene: -0.3, caryophyllene: -0.4, pinene: -0.5, linalool: -0.2, humulene: -0.6, terpinolene: -0.8, ocimene: -0.7, bisabolol: -0.5 },
  [TerpeneArchetype.ARCH_LIM]: { myrcene: -0.2, limonene: 1.1, caryophyllene: -0.2, pinene: 0.3, linalool: -0.4, humulene: -0.5, terpinolene: 0.2, ocimene: -0.3, bisabolol: -0.4 },
  [TerpeneArchetype.ARCH_BAL]: { myrcene: 0.3, limonene: 0.2, caryophyllene: 0.2, pinene: 0.1, linalool: 0.1, humulene: -0.1, terpinolene: -0.2, ocimene: -0.2, bisabolol: -0.1 },
  [TerpeneArchetype.ARCH_PIN]: { myrcene: -0.4, limonene: 0.2, caryophyllene: -0.3, pinene: 1.0, linalool: -0.3, humulene: -0.4, terpinolene: 0.1, ocimene: -0.2, bisabolol: -0.3 },
  [TerpeneArchetype.ARCH_CAR]: { myrcene: -0.3, limonene: -0.4, caryophyllene: 1.0, pinene: -0.2, linalool: 0.2, humulene: 0.6, terpinolene: -0.5, ocimene: -0.4, bisabolol: -0.3 },
  [TerpeneArchetype.ARCH_TER]: { myrcene: -0.5, limonene: -0.3, caryophyllene: -0.4, pinene: 0.2, linalool: -0.3, humulene: -0.5, terpinolene: 1.3, ocimene: 0.1, bisabolol: -0.4 },
  [TerpeneArchetype.ARCH_LIN]: { myrcene: 0.2, limonene: -0.2, caryophyllene: 0.1, pinene: -0.3, linalool: 1.0, humulene: -0.2, terpinolene: -0.4, ocimene: -0.3, bisabolol: 0.3 },
  [TerpeneArchetype.ARCH_OCI]: { myrcene: -0.3, limonene: -0.2, caryophyllene: -0.3, pinene: -0.2, linalool: -0.2, humulene: -0.4, terpinolene: 0.2, ocimene: 1.1, bisabolol: -0.2 },
};

// =============================================================================
// INTERFACES
// =============================================================================

/** CDES v1.5: A terpene with its rank position in the profile. */
export interface RankedTerpene {
  rank: number;
  terpeneId: string;
  name: string;
  concentration: number;
  unit: string;
  percentOfTotal: number;
}

/** CDES v1.5: Compact ratio representation for similarity matching. */
export interface RatioSignature {
  encoded: string;      // "MYR:LIM:CAR|0.57:0.38:0.24"
  t1T2Ratio: number;    // T1/T2
  t1T3Ratio: number;    // T1/T3
  t2T3Ratio: number;    // T2/T3
}

/** CDES v1.5: Archetype classification results. */
export interface ArchetypeClassification {
  primaryArchetype: TerpeneArchetype;
  archetypeConfidence: number;
  archetypeDistances: Record<string, number>;
}

/** CDES v1.5: Computed ratio analysis metrics for terpene profiles. */
export interface TerpeneRatioMetrics {
  dominanceIndex: number;
  dominanceLevel: DominanceLevel;
  balanceScore: number;
  balanceScoreNormalized: number;
  hhi: number;
  topTerpeneCount: number;
  rankedTerpenes: RankedTerpene[];
  ratioSignature: RatioSignature | null;
  clrCoordinates: Record<string, number>;
  keyRatios: Record<string, number>;
  archetypeClassification: ArchetypeClassification | null;
}

/** Human-readable archetype description. */
export interface ArchetypeDescription {
  name: string;
  description: string;
  typicalEffects: string[];
  signaturePattern: string;
}

// =============================================================================
// INTERNAL HELPERS
// =============================================================================

/** Multiplicative replacement of zeros before CLR transform. */
function prepareForClr(values: number[], delta = 0.001): number[] {
  const result = [...values];
  const zeroIndices: number[] = [];

  for (let i = 0; i < result.length; i++) {
    if (result[i] === 0 || result[i] == null) {
      zeroIndices.push(i);
    }
  }

  if (zeroIndices.length > 0) {
    const totalDelta = delta * zeroIndices.length;
    const nonZeroSum = result.reduce(
      (sum, v) => sum + (v && v > 0 ? v : 0),
      0
    );

    if (nonZeroSum > 0) {
      const scale = (1 - totalDelta) / nonZeroSum;
      for (let i = 0; i < result.length; i++) {
        if (result[i] && result[i] > 0) {
          result[i] = result[i] * scale;
        } else {
          result[i] = delta;
        }
      }
    } else {
      result.fill(delta);
    }
  }

  return result;
}

/** Compute centered log-ratio transformation. */
function computeClr(values: number[]): number[] {
  const logValues = values.map((v) => Math.log(v));
  const geoMeanLog = logValues.reduce((sum, v) => sum + v, 0) / logValues.length;
  return logValues.map((lv) => lv - geoMeanLog);
}

/** Compute Aitchison distance between two CLR coordinate sets. */
function aitchisonDistance(
  clr1: Record<string, number>,
  clr2: Record<string, number>
): number {
  let squaredDiffSum = 0;
  for (const key of FIXED_TERPENE_ORDER) {
    const diff = (clr1[key] ?? 0) - (clr2[key] ?? 0);
    squaredDiffSum += diff * diff;
  }
  return Math.sqrt(squaredDiffSum);
}

function round(value: number, decimals: number): number {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}

// =============================================================================
// PUBLIC FUNCTIONS
// =============================================================================

/**
 * Compute CLR coordinates for a terpene profile.
 *
 * @param terpeneValues - Map of terpene name to concentration (%)
 * @returns Map of terpene name to CLR coordinate
 */
export function computeClrCoordinates(
  terpeneValues: Record<string, number>
): Record<string, number> {
  const values = FIXED_TERPENE_ORDER.map((t) => terpeneValues[t] ?? 0);
  const prepared = prepareForClr(values);
  const clrValues = computeClr(prepared);

  const result: Record<string, number> = {};
  for (let i = 0; i < FIXED_TERPENE_ORDER.length; i++) {
    result[FIXED_TERPENE_ORDER[i]] = clrValues[i];
  }
  return result;
}

/**
 * Compute all CDES v1.5 ratio metrics for a terpene profile.
 *
 * @param terpeneValues - Map of terpene name to concentration (%)
 * @returns TerpeneRatioMetrics with all computed values
 */
export function computeRatioMetrics(
  terpeneValues: Record<string, number>
): TerpeneRatioMetrics {
  // Get values in fixed order
  const values: Array<[string, number]> = FIXED_TERPENE_ORDER.map((t) => [
    t,
    terpeneValues[t] ?? 0,
  ]);

  // Sort by concentration descending
  const sortedValues = [...values].sort((a, b) => b[1] - a[1]);

  // Total terpenes
  let total = values.reduce((sum, [, v]) => sum + v, 0);
  if (total === 0) total = 1.0;

  // Ranked terpenes
  const rankedTerpenes: RankedTerpene[] = sortedValues.map(
    ([terpene, conc], i) => ({
      rank: i + 1,
      terpeneId: `terpene:${terpene}`,
      name: TERPENE_NAMES[terpene] ?? terpene,
      concentration: conc,
      unit: "percent",
      percentOfTotal: total > 0 ? (conc / total) * 100 : 0,
    })
  );

  // T1..T4 values
  const t1 = sortedValues[0]?.[1] ?? 0;
  const t2 = sortedValues[1]?.[1] ?? 0;
  const t3 = sortedValues[2]?.[1] ?? 0;
  const t4 = sortedValues[3]?.[1] ?? 0;

  // Dominance Index: (T1 - T2) / (T1 + T2)
  const dominanceIndex = t1 + t2 > 0 ? (t1 - t2) / (t1 + t2) : 0;

  // Dominance Level
  let dominanceLevel: DominanceLevel;
  if (dominanceIndex < 0.25) dominanceLevel = DominanceLevel.BALANCED;
  else if (dominanceIndex < 0.5) dominanceLevel = DominanceLevel.SLIGHT;
  else if (dominanceIndex < 0.75) dominanceLevel = DominanceLevel.MODERATE;
  else dominanceLevel = DominanceLevel.STRONG;

  // Balance Score (Shannon Entropy)
  let balanceScore = 0;
  for (const [, conc] of values) {
    if (conc > 0 && total > 0) {
      const p = conc / total;
      balanceScore -= p * Math.log(p);
    }
  }

  // Normalized balance score (0-1)
  const n = values.filter(([, v]) => v > 0).length;
  let balanceScoreNormalized = 0;
  if (n > 1) {
    const maxEntropy = Math.log(n);
    balanceScoreNormalized = maxEntropy > 0 ? balanceScore / maxEntropy : 0;
  }

  // HHI (Herfindahl-Hirschman Index)
  const hhi = values.reduce((sum, [, conc]) => {
    return total > 0 ? sum + Math.pow(conc / total, 2) : sum;
  }, 0);

  // Top terpene count (> 5% of total)
  const topTerpeneCount = values.filter(
    ([, conc]) => (conc / total) * 100 > 5
  ).length;

  // Ratio Signature
  const t1Name = TERPENE_CODES[sortedValues[0]?.[0]] ?? "UNK";
  const t2Name = TERPENE_CODES[sortedValues[1]?.[0]] ?? "UNK";
  const t3Name = TERPENE_CODES[sortedValues[2]?.[0]] ?? "UNK";

  const t1T2Ratio = t2 > 0 ? t1 / t2 : 99.99;
  const t1T3Ratio = t3 > 0 ? t1 / t3 : 99.99;
  const t2T3Ratio = t3 > 0 ? t2 / t3 : 99.99;

  const r2 = t1 > 0 ? t2 / t1 : 0;
  const r3 = t1 > 0 ? t3 / t1 : 0;
  const r4 = t1 > 0 ? t4 / t1 : 0;

  const encoded = `${t1Name}:${t2Name}:${t3Name}|${r2.toFixed(2)}:${r3.toFixed(2)}:${r4.toFixed(2)}`;

  const ratioSignature: RatioSignature = {
    encoded,
    t1T2Ratio: Math.min(t1T2Ratio, 99.99),
    t1T3Ratio: Math.min(t1T3Ratio, 99.99),
    t2T3Ratio: Math.min(t2T3Ratio, 99.99),
  };

  // CLR Coordinates
  const clrCoords = computeClrCoordinates(terpeneValues);
  const clrCoordinates: Record<string, number> = {};
  for (const [k, v] of Object.entries(clrCoords)) {
    clrCoordinates[k] = round(v, 4);
  }

  // Key Ratios (pairwise log-ratios)
  const myrcene = Math.max(terpeneValues["myrcene"] ?? 0.001, 0.001);
  const limonene = Math.max(terpeneValues["limonene"] ?? 0.001, 0.001);
  const pinene = Math.max(terpeneValues["pinene"] ?? 0.001, 0.001);
  const caryophyllene = Math.max(terpeneValues["caryophyllene"] ?? 0.001, 0.001);
  const humulene = Math.max(terpeneValues["humulene"] ?? 0.001, 0.001);
  const terpinolene = Math.max(terpeneValues["terpinolene"] ?? 0.001, 0.001);

  const keyRatios: Record<string, number> = {
    myrceneLimoneneLr: round(Math.log(myrcene / limonene), 3),
    myrcenePineneLr: round(Math.log(myrcene / pinene), 3),
    caryophylleneHumuleneLr: round(Math.log(caryophyllene / humulene), 3),
    limoneneTerpinoleneLr: round(Math.log(limonene / terpinolene), 3),
  };

  // Classify archetype
  const archetypeClassification = classifyArchetype(clrCoords);

  return {
    dominanceIndex: round(dominanceIndex, 4),
    dominanceLevel,
    balanceScore: round(balanceScore, 4),
    balanceScoreNormalized: round(balanceScoreNormalized, 4),
    hhi: round(hhi, 4),
    topTerpeneCount,
    rankedTerpenes,
    ratioSignature,
    clrCoordinates,
    keyRatios,
    archetypeClassification,
  };
}

/**
 * Classify a terpene profile into an archetype based on CLR coordinates.
 *
 * @param clrCoordinates - CLR-transformed coordinates
 * @returns ArchetypeClassification with primary archetype and confidence
 */
export function classifyArchetype(
  clrCoordinates: Record<string, number>
): ArchetypeClassification {
  const distances: Record<string, number> = {};

  for (const archetype of Object.values(TerpeneArchetype)) {
    if (archetype === TerpeneArchetype.ARCH_UNK) continue;
    const centroid = ARCHETYPE_CENTROIDS[archetype];
    if (centroid) {
      distances[archetype] = round(aitchisonDistance(clrCoordinates, centroid), 4);
    }
  }

  const sortedDistances = Object.entries(distances).sort(
    ([, a], [, b]) => a - b
  );

  let primaryArchetype = TerpeneArchetype.ARCH_UNK;
  let confidence = 0;

  if (sortedDistances.length >= 2) {
    primaryArchetype = sortedDistances[0][0] as TerpeneArchetype;
    const primaryDist = sortedDistances[0][1];
    const secondDist = sortedDistances[1][1];

    if (secondDist > 0 && primaryDist < secondDist) {
      confidence = 1 - primaryDist / secondDist;
    } else {
      confidence = 0.5;
    }

    confidence = Math.max(0, Math.min(1, confidence));
  }

  return {
    primaryArchetype,
    archetypeConfidence: round(confidence, 4),
    archetypeDistances: distances,
  };
}

/**
 * Get human-readable description of an archetype.
 *
 * @param archetype - TerpeneArchetype enum value
 * @returns ArchetypeDescription with name, description, effects, and signature
 */
export function getArchetypeDescription(
  archetype: TerpeneArchetype
): ArchetypeDescription {
  const descriptions: Record<TerpeneArchetype, ArchetypeDescription> = {
    [TerpeneArchetype.ARCH_MYR]: {
      name: "Myrcene Dominant",
      description: "High myrcene content (>40%), classic indica-leaning profile",
      typicalEffects: ["sedating", "body-focused", "relaxing"],
      signaturePattern: "MYR > 40%, others < 15% each",
    },
    [TerpeneArchetype.ARCH_LIM]: {
      name: "Limonene Forward",
      description: "Limonene-led profile with citrus notes",
      typicalEffects: ["uplifting", "energizing", "mood-enhancing"],
      signaturePattern: "LIM > 25%, MYR secondary",
    },
    [TerpeneArchetype.ARCH_BAL]: {
      name: "Balanced Trio",
      description: "Top 3 terpenes within 80-100% of each other",
      typicalEffects: ["complex", "nuanced", "full-spectrum"],
      signaturePattern: "Top 3 close in concentration",
    },
    [TerpeneArchetype.ARCH_PIN]: {
      name: "Pinene Sharp",
      description: "Pinene-dominant with cognitive clarity effects",
      typicalEffects: ["alert", "focused", "clear-headed"],
      signaturePattern: "PIN > 15%, low MYR",
    },
    [TerpeneArchetype.ARCH_CAR]: {
      name: "Caryophyllene Spicy",
      description: "Caryophyllene-led with humulene support",
      typicalEffects: ["peppery", "therapeutic", "anti-inflammatory"],
      signaturePattern: "CAR > 20%, HUM present",
    },
    [TerpeneArchetype.ARCH_TER]: {
      name: "Terpinolene Rare",
      description: "Unusual terpinolene-dominant profile",
      typicalEffects: ["unique", "energizing", "creative"],
      signaturePattern: "TER dominant (rare)",
    },
    [TerpeneArchetype.ARCH_LIN]: {
      name: "Linalool Floral",
      description: "Linalool-forward with floral/lavender notes",
      typicalEffects: ["calming", "floral", "anxiety-reducing"],
      signaturePattern: "LIN > 15%",
    },
    [TerpeneArchetype.ARCH_OCI]: {
      name: "Ocimene Sweet",
      description: "Ocimene-led sweet and herbaceous profile",
      typicalEffects: ["sweet", "herbaceous", "uplifting"],
      signaturePattern: "OCI > 10%",
    },
    [TerpeneArchetype.ARCH_UNK]: {
      name: "Unknown",
      description: "Profile does not match known archetypes",
      typicalEffects: ["variable"],
      signaturePattern: "N/A",
    },
  };

  return descriptions[archetype] ?? descriptions[TerpeneArchetype.ARCH_UNK];
}
