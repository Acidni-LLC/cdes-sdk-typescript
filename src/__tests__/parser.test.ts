/**
 * CDES SDK Tests
 * Jest test suite for parser, analyzer, and utilities
 */

import { CDESParser } from "../parser";
import { CDESAnalyzer } from "../analyzer";
import {
  normalizeCannabioidName,
  getCannabioidColor,
  calculateEuclideanDistance,
  STANDARD_CANNABINOIDS,
} from "../cannabinoids";
import { CannabinoidProfile, PowerBICategoricalData } from "../models";

describe("CDES SDK", () => {
  describe("Cannabinoid Utilities", () => {
    test("normalizeCannabioidName works correctly", () => {
      expect(normalizeCannabioidName("THC")).toBe("THC");
      expect(normalizeCannabioidName("thc %")).toBe("THC");
      expect(normalizeCannabioidName("THC %")).toBe("THC");
      expect(normalizeCannabioidName("  cbd  ")).toBe("CBD");
    });

    test("getCannabioidColor returns correct color", () => {
      const thcColor = getCannabioidColor("THC");
      expect(thcColor).toBeDefined();
      expect(thcColor?.hex).toBe("#E74C3C");

      const cbdColor = getCannabioidColor("CBD");
      expect(cbdColor?.hex).toBe("#3498DB");
    });

    test("STANDARD_CANNABINOIDS has all major cannabinoids", () => {
      expect(STANDARD_CANNABINOIDS["THC"]).toBeDefined();
      expect(STANDARD_CANNABINOIDS["CBD"]).toBeDefined();
      expect(STANDARD_CANNABINOIDS["CBN"]).toBeDefined();
      expect(STANDARD_CANNABINOIDS["CBG"]).toBeDefined();
    });
  });

  describe("CDES Parser - Standard Structure", () => {
    test("parseStandardStructure with valid data", () => {
      const data: PowerBICategoricalData = {
        categories: [
          {
            values: ["batch1", "batch1", "batch1"],
            source: { displayName: "Batch" },
          },
          {
            values: ["THC", "CBD", "CBN"],
            source: { displayName: "Cannabinoid" },
          },
        ],
        values: [
          {
            values: [20, 15, 2],
            source: { displayName: "Percentage" },
          },
        ],
      };

      const result = CDESParser.parseDataView(data);

      expect(result.parseMode).toBe("standard");
      expect(result.profiles.length).toBe(1);
      expect(result.profiles[0].batchId).toBe("batch1");
      expect(result.profiles[0].cannabinoids.get("THC")).toBe(20);
      expect(result.profiles[0].cannabinoids.get("CBD")).toBe(15);
      expect(result.recordsProcessed).toBe(3);
    });

    test("parseStandardStructure with multiple batches", () => {
      const data: PowerBICategoricalData = {
        categories: [
          {
            values: ["batch1", "batch2", "batch1", "batch2"],
            source: { displayName: "Batch" },
          },
          {
            values: ["THC", "THC", "CBD", "CBD"],
            source: { displayName: "Cannabinoid" },
          },
        ],
        values: [
          {
            values: [20, 18, 15, 12],
            source: { displayName: "Percentage" },
          },
        ],
      };

      const result = CDESParser.parseDataView(data);

      expect(result.profiles.length).toBe(2);
      expect(result.profiles[0].batchId).toBe("batch1");
      expect(result.profiles[1].batchId).toBe("batch2");
    });
  });

  describe("CDES Parser - CDES Structure", () => {
    test("parseCDESStructure with cannabinoid columns", () => {
      const data: PowerBICategoricalData = {
        categories: [
          {
            values: ["batch1"],
            source: { displayName: "Batch" },
          },
        ],
        values: [
          { values: [20], source: { displayName: "THC" } },
          { values: [15], source: { displayName: "CBD" } },
          { values: [2], source: { displayName: "CBN" } },
          { values: [1], source: { displayName: "CBG" } },
        ],
      };

      const result = CDESParser.parseDataView(data);

      expect(result.parseMode).toBe("cdes");
      expect(result.profiles.length).toBe(1);
      expect(result.profiles[0].cannabinoids.get("THC")).toBe(20);
      expect(result.profiles[0].cannabinoids.get("CBD")).toBe(15);
    });
  });

  describe("CDES Parser - JSON Batch", () => {
    test("parseBatchJSON from object", () => {
      const batch = {
        id: "batch123",
        name: "Strain Name",
        thc: 20,
        cbd: 15,
        cbn: 2,
      };

      const profile = CDESParser.parseBatchJSON(batch);

      expect(profile.batchId).toBe("batch123");
      expect(profile.batchName).toBe("Strain Name");
      expect(profile.cannabinoids.get("THC")).toBe(20);
      expect(profile.cannabinoids.get("CBD")).toBe(15);
    });

    test("parseBatchesJSON from array", () => {
      const batches = [
        { id: "batch1", thc: 20, cbd: 15 },
        { id: "batch2", thc: 18, cbd: 12 },
      ];

      const profiles = CDESParser.parseBatchesJSON(batches);

      expect(profiles.length).toBe(2);
      expect(profiles[0].batchId).toBe("batch1");
      expect(profiles[1].batchId).toBe("batch2");
    });
  });

  describe("CDES Analyzer", () => {
    const profile1: CannabinoidProfile = {
      batchId: "batch1",
      batchName: "Batch 1",
      cannabinoids: new Map([
        ["THC", 20],
        ["CBD", 15],
        ["CBN", 2],
      ]),
      totalCannabinoids: 37,
    };

    const profile2: CannabinoidProfile = {
      batchId: "batch2",
      batchName: "Batch 2",
      cannabinoids: new Map([
        ["THC", 21],
        ["CBD", 14],
        ["CBN", 2.5],
      ]),
      totalCannabinoids: 37.5,
    };

    test("compareProfiles calculates similarity", () => {
      const comparison = CDESAnalyzer.compareProfiles(profile1, profile2);

      expect(comparison.similarity).toBeGreaterThan(80); // Very similar profiles
      expect(comparison.distance).toBeLessThan(2);
      expect(comparison.differences.size).toBeGreaterThan(0);
    });

    test("findSimilarProfiles returns ranked results", () => {
      const profiles = [profile1, profile2];
      const similar = CDESAnalyzer.findSimilarProfiles(profile1, profiles, 5);

      expect(similar.length).toBeGreaterThan(0);
      expect(similar[0].rank).toBe(1);
    });

    test("scoreProfileCompleteness rates profiles", () => {
      const score = CDESAnalyzer.scoreProfileCompleteness(profile1);

      expect(score.score).toBeGreaterThan(0);
      expect(score.coverage).toBeGreaterThan(0);
      expect(score.message.length).toBeGreaterThan(0);
    });

    test("classifyStrain identifies strain type", () => {
      const classification = CDESAnalyzer.classifyStrain(profile1);

      expect(classification.type).toBe("Balanced"); // 20% THC vs 15% CBD
      expect(classification.ratio).toContain("THC");
    });
  });

  describe("Distance Calculations", () => {
    test("calculateEuclideanDistance works correctly", () => {
      const profile1 = new Map<string, number>([
        ["THC", 20],
        ["CBD", 15],
      ]);
      const profile2 = new Map<string, number>([
        ["THC", 20],
        ["CBD", 15],
      ]);

      const distance = calculateEuclideanDistance(profile1, profile2);
      expect(distance).toBe(0); // Identical profiles

      profile2.set("THC", 25);
      const distance2 = calculateEuclideanDistance(profile1, profile2);
      expect(distance2).toBe(5); // Changed by 5
    });
  });
});
