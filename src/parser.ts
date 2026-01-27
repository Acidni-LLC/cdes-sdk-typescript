/**
 * CDES Parser
 * Parse cannabis data from Power BI DataView and other sources
 */

import {
  CannabinoidProfile,
  CDESParsedData,
  PowerBICategoricalData,
} from "./models";
import {
  getCannabioidDisplayName,
} from "./cannabinoids";

/**
 * Parse Power BI DataView into CDES cannabis profiles
 *
 * Supports two data structures:
 * 1. Standard: categories[0]=batch, categories[1]=cannabinoid, values[0]=percentage
 * 2. CDES: categories[0]=batch, values[0..N]=individual cannabinoid columns
 */
export class CDESParser {
  /**
   * Parse Power BI categorical data
   */
  static parseDataView(data: PowerBICategoricalData): CDESParsedData {
    if (!data?.categories || data.categories.length === 0) {
      return {
        profiles: [],
        parseMode: "unknown",
        recordsProcessed: 0,
      };
    }

    // Try standard structure first
    if (
      data.categories.length >= 2 &&
      data.values &&
      data.values.length > 0
    ) {
      const standardResult = this.parseStandardStructure(data);
      if (standardResult.profiles.length > 0) {
        return standardResult;
      }
    }

    // Fall back to CDES structure
    if (data.categories.length >= 1 && data.values) {
      const cdesResult = this.parseCDESStructure(data);
      if (cdesResult.profiles.length > 0) {
        return cdesResult;
      }
    }

    return {
      profiles: [],
      parseMode: "unknown",
      recordsProcessed: 0,
    };
  }

  /**
   * Parse standard structure: batch | cannabinoid | value
   *
   * Categories:
   * - [0]: Batch IDs
   * - [1]: Cannabinoid names
   *
   * Values:
   * - [0]: Percentages
   */
  private static parseStandardStructure(
    data: PowerBICategoricalData
  ): CDESParsedData {
    const profiles = new Map<string, Map<string, number>>();
    const profileNames = new Map<string, string>();
    let recordsProcessed = 0;

    const batchIds = data.categories[0]?.values || [];
    const cannabinoidNames = data.categories[1]?.values || [];
    const percentages = data.values[0]?.values || [];

    for (let i = 0; i < Math.min(batchIds.length, cannabinoidNames.length); i++) {
      const batchId = String(batchIds[i]);
      const cannabinoidName = String(cannabinoidNames[i]);
      const percentage = Number(percentages[i]) || 0;

      if (!profiles.has(batchId)) {
        profiles.set(batchId, new Map());
        profileNames.set(batchId, batchId);
      }

      const profile = profiles.get(batchId)!;
      const displayName = getCannabioidDisplayName(cannabinoidName);

      if (percentage > 0) {
        profile.set(displayName, percentage);
      }

      recordsProcessed++;
    }

    const result: CannabinoidProfile[] = [];
    for (const [batchId, cannabinoids] of profiles) {
      result.push({
        batchId,
        batchName: profileNames.get(batchId) || batchId,
        cannabinoids,
        totalCannabinoids: Array.from(cannabinoids.values()).reduce(
          (sum, val) => sum + val,
          0
        ),
      });
    }

    return {
      profiles: result,
      parseMode: "standard",
      recordsProcessed,
    };
  }

  /**
   * Parse CDES structure: batch | THC | CBD | CBN | CBG | CBC | THCV | CBDV
   *
   * Categories:
   * - [0]: Batch IDs
   *
   * Values:
   * - [0..N]: Individual cannabinoid percentages in order
   *   Expected order: THC, CBD, CBN, CBG, CBC, THCV, CBDV
   */
  private static parseCDESStructure(
    data: PowerBICategoricalData
  ): CDESParsedData {
    const profiles = new Map<string, Map<string, number>>();
    const profileNames = new Map<string, string>();
    let recordsProcessed = 0;

    const batchIds = data.categories[0]?.values || [];

    // Standard CDES column order
    const cdesColumns = [
      "THC",
      "CBD",
      "CBN",
      "CBG",
      "CBC",
      "THCV",
      "CBDV",
      "THCA",
      "CBDA",
    ];

    for (let i = 0; i < batchIds.length; i++) {
      const batchId = String(batchIds[i]);

      if (!profiles.has(batchId)) {
        profiles.set(batchId, new Map());
        profileNames.set(batchId, batchId);
      }

      const profile = profiles.get(batchId)!;

      // Extract cannabinoid values from measure columns
      for (let colIdx = 0; colIdx < Math.min(cdesColumns.length, data.values.length); colIdx++) {
        const valueArray = data.values[colIdx]?.values || [];
        const percentage = Number(valueArray[i]) || 0;

        if (percentage > 0) {
          profile.set(cdesColumns[colIdx], percentage);
        }
      }

      recordsProcessed++;
    }

    const result: CannabinoidProfile[] = [];
    for (const [batchId, cannabinoids] of profiles) {
      result.push({
        batchId,
        batchName: profileNames.get(batchId) || batchId,
        cannabinoids,
        totalCannabinoids: Array.from(cannabinoids.values()).reduce(
          (sum, val) => sum + val,
          0
        ),
      });
    }

    return {
      profiles: result,
      parseMode: "cdes",
      recordsProcessed,
    };
  }

  /**
   * Parse raw JSON batch data
   */
  static parseBatchJSON(batch: Record<string, unknown>): CannabinoidProfile {
    const batchId = String(batch.id || batch.batchId || "unknown");
    const cannabinoids = new Map<string, number>();

    // Standard CDES cannabinoid fields
    const cdesFields = [
      "THC",
      "CBD",
      "CBN",
      "CBG",
      "CBC",
      "THCV",
      "CBDV",
      "THCA",
      "CBDA",
    ];

    for (const field of cdesFields) {
      const value = batch[field.toLowerCase()] || batch[field];
      if (typeof value === "number" && value > 0) {
        cannabinoids.set(field, value);
      }
    }

    return {
      batchId,
      batchName: String(batch.name || batch.strain || batchId),
      cannabinoids,
      totalCannabinoids: Array.from(cannabinoids.values()).reduce(
        (sum, val) => sum + val,
        0
      ),
    };
  }

  /**
   * Parse array of batch JSON records
   */
  static parseBatchesJSON(
    batches: Record<string, unknown>[]
  ): CannabinoidProfile[] {
    return batches.map((batch) => this.parseBatchJSON(batch));
  }
}
