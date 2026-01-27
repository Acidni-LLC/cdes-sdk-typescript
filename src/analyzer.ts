/**
 * CDES Analysis Utilities
 * Compare, score, and analyze cannabinoid profiles
 */

import {
  CannabinoidProfile,
  Batch,
  LabResult,
} from "./models";
import {
  calculateEuclideanDistance,
} from "./cannabinoids";

/**
 * Comparison result between two profiles
 */
export interface ComparisonResult {
  profile1: CannabinoidProfile;
  profile2: CannabinoidProfile;
  distance: number;
  similarity: number; // 0-100, higher is more similar
  differences: Map<string, { val1: number; val2: number; delta: number }>;
}

/**
 * Similarity score result
 */
export interface SimilarityResult {
  profile: CannabinoidProfile;
  distance: number;
  similarity: number; // 0-100
  rank: number;
}

/**
 * Batch comparison with all metrics
 */
export interface BatchComparison {
  batch1: Batch;
  batch2: Batch;
  cannabinoidSimilarity: ComparisonResult;
  timestamp: Date;
}

/** Analyze and compare cannabinoid profiles */
export class CDESAnalyzer {
  /**
   * Compare two cannabinoid profiles
   */
  static compareProfiles(
    profile1: CannabinoidProfile,
    profile2: CannabinoidProfile
  ): ComparisonResult {
    const distance = calculateEuclideanDistance(
      profile1.cannabinoids,
      profile2.cannabinoids
    );

    // Convert distance to similarity (0-100, higher is more similar)
    // Using inverse exponential decay: similarity = 100 * e^(-distance/10)
    const similarity = Math.max(0, Math.min(100, 100 * Math.exp(-distance / 10)));

    // Calculate differences
    const differences = new Map<
      string,
      { val1: number; val2: number; delta: number }
    >();
    const allKeys = new Set([
      ...profile1.cannabinoids.keys(),
      ...profile2.cannabinoids.keys(),
    ]);

    for (const key of allKeys) {
      const val1 = profile1.cannabinoids.get(key) || 0;
      const val2 = profile2.cannabinoids.get(key) || 0;
      if (val1 !== val2) {
        differences.set(key, {
          val1,
          val2,
          delta: val2 - val1,
        });
      }
    }

    return {
      profile1,
      profile2,
      distance,
      similarity,
      differences,
    };
  }

  /**
   * Find similar profiles from a list
   */
  static findSimilarProfiles(
    targetProfile: CannabinoidProfile,
    allProfiles: CannabinoidProfile[],
    limit: number = 5,
    minSimilarity: number = 50
  ): SimilarityResult[] {
    return allProfiles
      .map((profile) => {
        const distance = calculateEuclideanDistance(
          targetProfile.cannabinoids,
          profile.cannabinoids
        );
        const similarity = Math.max(
          0,
          Math.min(100, 100 * Math.exp(-distance / 10))
        );
        return { profile, distance, similarity };
      })
      .filter(
        (result) =>
          result.similarity >= minSimilarity &&
          result.profile.batchId !== targetProfile.batchId
      )
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, limit)
      .map((result, index) => ({
        profile: result.profile,
        distance: result.distance,
        similarity: result.similarity,
        rank: index + 1,
      }));
  }

  /**
   * Score profile completeness
   */
  static scoreProfileCompleteness(profile: CannabinoidProfile): {
    score: number;
    coverage: number;
    message: string;
  } {
    const detectedCount = profile.cannabinoids.size;
    const maxCannabinoids = 9; // THC, CBD, CBN, CBG, CBC, THCV, CBDV, THCA, CBDA

    const coverage = (detectedCount / maxCannabinoids) * 100;
    let score = coverage;

    // Bonus points for high-quality profiles
    if (detectedCount >= 7) score += 20;
    if (profile.totalCannabinoids > 10) score += 10;

    score = Math.min(100, score);

    let message = "";
    if (coverage < 30) message = "Incomplete profile - limited cannabinoid data";
    else if (coverage < 60) message = "Partial profile - some cannabinoid data";
    else if (coverage < 90) message = "Good profile - most cannabinoids detected";
    else message = "Complete profile - all major cannabinoids detected";

    return { score, coverage, message };
  }

  /**
   * Classify strain by cannabinoid profile
   */
  static classifyStrain(
    profile: CannabinoidProfile
  ): {
    type: "THC-Dominant" | "CBD-Dominant" | "Balanced" | "Unknown";
    thcContent: "High" | "Moderate" | "Low" | "Trace";
    cbdContent: "High" | "Moderate" | "Low" | "Trace";
    ratio: string;
  } {
    const thc = profile.cannabinoids.get("THC") || 0;
    const cbd = profile.cannabinoids.get("CBD") || 0;

    let type: "THC-Dominant" | "CBD-Dominant" | "Balanced" | "Unknown" =
      "Unknown";
    if (thc > cbd * 2) type = "THC-Dominant";
    else if (cbd > thc * 2) type = "CBD-Dominant";
    else if (thc > 0 || cbd > 0) type = "Balanced";

    let thcContent: "High" | "Moderate" | "Low" | "Trace" = "Trace";
    if (thc > 20) thcContent = "High";
    else if (thc > 10) thcContent = "Moderate";
    else if (thc > 0.5) thcContent = "Low";

    let cbdContent: "High" | "Moderate" | "Low" | "Trace" = "Trace";
    if (cbd > 15) cbdContent = "High";
    else if (cbd > 7) cbdContent = "Moderate";
    else if (cbd > 0.5) cbdContent = "Low";

    let ratio = "N/A";
    if (thc > 0 && cbd > 0) {
      const ratioParts = Math.max(thc, cbd) / Math.min(thc, cbd);
      if (thc > cbd) {
        ratio = `${ratioParts.toFixed(1)}:1 THC:CBD`;
      } else {
        ratio = `${ratioParts.toFixed(1)}:1 CBD:THC`;
      }
    } else if (thc > 0) {
      ratio = `${thc.toFixed(1)}% THC`;
    } else if (cbd > 0) {
      ratio = `${cbd.toFixed(1)}% CBD`;
    }

    return { type, thcContent, cbdContent, ratio };
  }

  /**
   * Calculate terpene-equivalent scores for flavor/aroma
   */
  static scoreFlavorProfile(profile: CannabinoidProfile): {
    score: number;
    profile: string;
    description: string;
  } {
    const cannabinoids = profile.cannabinoids;
    let score = 0;
    let profile_type = "Unknown";
    let description = "";

    // Score based on cannabinoid diversity and balance
    const cannabinoidCount = cannabinoids.size;
    score += cannabinoidCount * 5;

    // Check for specific cannabinoid combinations
    const hasMinorCannabinoids =
      cannabinoids.has("CBN") ||
      cannabinoids.has("CBG") ||
      cannabinoids.has("CBC");
    if (hasMinorCannabinoids) score += 15;

    const isTerpene_Rich =
      cannabinoids.get("THCV") && cannabinoids.get("THCV")! > 0.5;
    if (isTerpene_Rich) score += 10;

    // Profile classification
    if (score > 70) {
      profile_type = "Complex & Rich";
      description =
        "Full spectrum with multiple cannabinoids - expect nuanced effects";
    } else if (score > 50) {
      profile_type = "Balanced";
      description =
        "Good cannabinoid diversity - moderate complexity expected";
    } else if (score > 30) {
      profile_type = "Simple";
      description = "Limited cannabinoid profile - straightforward effects";
    } else {
      profile_type = "Basic";
      description = "Very limited cannabinoid data";
    }

    score = Math.min(100, score);

    return { score, profile: profile_type, description };
  }

  /**
   * Create batch object from profile (for compatibility)
   */
  static profileToBatch(profile: CannabinoidProfile): Batch {
    const labResult: LabResult = {
      cannabinoids: Array.from(profile.cannabinoids.entries()).map(
        ([name, percentage]) => ({
          name,
          percentage,
          unit: "%",
        })
      ),
      terpenes: [],
      testDate: new Date(),
    };

    return {
      id: profile.batchId,
      name: profile.batchName,
      strain: profile.batchName,
      dispensaryId: "unknown",
      processedDate: new Date(),
      labResult,
    };
  }
}
