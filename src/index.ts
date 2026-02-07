/**
 * CDES SDK - Cannabis Data Exchange Standard TypeScript Library
 *
 * A comprehensive TypeScript SDK for parsing, analyzing, and working with
 * cannabis data from Power BI visuals and other sources.
 *
 * Usage:
 * ```typescript
 * import { CDESParser, CDESAnalyzer, STANDARD_CANNABINOIDS } from '@cdes/sdk-typescript';
 *
 * // Parse Power BI data
 * const parsed = CDESParser.parseDataView(powerBIDataView);
 *
 * // Compare profiles
 * const comparison = CDESAnalyzer.compareProfiles(profile1, profile2);
 *
 * // Find similar batches
 * const similar = CDESAnalyzer.findSimilarProfiles(targetProfile, allProfiles);
 * ```
 */

// Data Models
export * from "./models";

// Cannabinoid Utilities
export * from "./cannabinoids";
export {
  STANDARD_CANNABINOIDS,
  normalizeCannabioidName,
  getCannabioidColor,
  getCannabioidDisplayName,
  calculateEuclideanDistance,
  findSimilarProfiles,
  getCannabioidCategory,
  formatCannabioidValue,
  calculateTotalCannabinoids,
} from "./cannabinoids";

// CDES Parser
export { CDESParser } from "./parser";

// Analyzer
export * from "./analyzer";
export {
  CDESAnalyzer,
  type ComparisonResult,
  type SimilarityResult,
  type BatchComparison,
} from "./analyzer";

// Reference Data (Single Source of Truth from cdes-reference-data repo)
export * from "./reference";
export {
  fetchTerpeneColors,
  fetchTerpeneLibrary,
  fetchCannabinoidLibrary,
  getTerpeneColor,
  getCannabinoidColor,
  preloadReferenceData,
  clearReferenceCache,
  type TerpeneColorRef,
  type TerpeneRef,
  type CannabinoidRef,
} from "./reference";

// Terpene Utilities (uses reference data)
export * from "./terpenes";

// Version
export const SDK_VERSION = "1.2.0";

// Library metadata
export const LIBRARY_INFO = {
  name: "@cdes/sdk-typescript",
  version: SDK_VERSION,
  description:
    "Cannabis Data Exchange Standard (CDES) TypeScript SDK for Power BI and other applications",
  author: "Acidni LLC",
  license: "MIT",
  repository: "https://github.com/Acidni-LLC/cdes-sdk-typescript",
  referenceData: "https://github.com/Acidni-LLC/cdes-reference-data",
};
