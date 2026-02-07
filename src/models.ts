/**
 * CDES Data Models
 * Cannabis Data Exchange Standard types and interfaces
 */

/**
 * Cannabinoid compound with percentage value
 * Used in LabResult arrays to represent analyzed cannabinoid compounds
 */
export interface Cannabinoid {
  name: string;
  displayName?: string;
  percentage: number;
  unit?: "mg/g" | "%" | "mg";
}

/** Terpene compound with percentage value */
export interface Terpene {
  name: string;
  displayName?: string;
  percentage: number;
  unit?: "mg/g" | "%" | "mg";
}

/** Lab test result (COA - Certificate of Analysis) */
export interface LabResult {
  cannabinoids: Cannabinoid[];
  terpenes: Terpene[];
  testDate: Date;
  expirationDate?: Date;
  labId?: string;
  labName?: string;
  testMethod?: "HPLC" | "GC-MS" | "LC-MS";
}

/** Batch information */
export interface Batch {
  id: string;
  name: string;
  strain: string;
  dispensaryId: string;
  dispensaryName?: string;
  processedDate: Date;
  labResult?: LabResult;
  metadata?: Record<string, unknown>;
}

/** Cannabinoid profile comparison */
export interface CannabinoidProfile {
  batchId: string;
  batchName: string;
  cannabinoids: Map<string, number>;
  totalCannabinoids: number;
}

/** Terpene profile comparison */
export interface TerpeneProfile {
  batchId: string;
  batchName: string;
  terpenes: Map<string, number>;
  totalTerpenes: number;
}

/** Power BI categorical data structure */
export interface PowerBICategoricalData {
  categories: Array<{
    values: (string | number)[];
    source?: { displayName: string };
  }>;
  values: Array<{
    values: (number | null)[];
    source?: { displayName: string };
  }>;
}

/** Parsed CDES data from Power BI */
export interface CDESParsedData {
  profiles: CannabinoidProfile[];
  terpeneProfiles?: TerpeneProfile[];
  parseMode: "standard" | "cdes" | "unknown";
  recordsProcessed: number;
}

// =============================================================================
// COA / Lab Result Models (CDES v1.0)
// =============================================================================

/** Test result status */
export type TestStatus = "pass" | "fail" | "pending" | "not-tested" | "not-applicable" | "detected" | "not-detected";

/** Analytical test method */
export type TestMethod = "HPLC" | "GC-MS" | "LC-MS" | "GC-FID" | "ICP-MS" | "PCR";

/** Testing laboratory information */
export interface LabInfo {
  name: string;
  licenseNumber?: string;
  phone?: string;
  website?: string;
  accreditations?: string[];
}

/** Sample information on a COA */
export interface SampleInfo {
  batchNumber: string;
  productName: string;
  sampleId?: string;
  strainName?: string;
  productType?: "flower" | "pre-roll" | "concentrate" | "vape" | "edible" | "tincture" | "topical" | "capsule" | "other";
  receivedDate?: string;
  testedDate?: string;
  harvestDate?: string;
  producerName?: string;
  producerLicense?: string;
}

/** A single safety analyte test result */
export interface SafetyTestResult {
  analyte: string;
  result?: number;
  resultText?: string;
  limit?: number;
  unit?: string;
  status: TestStatus;
}

/** A category of safety tests */
export interface SafetyTestCategory {
  status: TestStatus;
  analytes?: SafetyTestResult[];
}

/** All safety and compliance test results */
export interface SafetyTests {
  microbials?: SafetyTestCategory;
  pesticides?: SafetyTestCategory;
  heavyMetals?: SafetyTestCategory;
  residualSolvents?: SafetyTestCategory;
  mycotoxins?: SafetyTestCategory;
  moisture?: SafetyTestCategory;
  waterActivity?: SafetyTestCategory;
  foreignMatter?: SafetyTestCategory;
}

/** Potency test summary */
export interface PotencyResults {
  status: TestStatus;
  totalThc?: number;
  totalCbd?: number;
  totalCannabinoids?: number;
}

/**
 * Certificate of Analysis (COA) - Full lab report (CDES v1.0)
 *
 * A comprehensive lab test report for a cannabis sample, including
 * cannabinoid and terpene profiles, potency, and safety test results.
 *
 * Schema: https://schemas.terprint.com/cdes/v1/coa.json
 */
export interface COA {
  id: string;
  lab: LabInfo;
  sample: SampleInfo;
  overallStatus: "pass" | "fail" | "pending" | "partial";
  coaNumber?: string;
  cannabinoids?: Cannabinoid[];
  terpenes?: Terpene[];
  potencyResults?: PotencyResults;
  safetyTests?: SafetyTests;
  issuedDate?: string;
  expirationDate?: string;
  pdfUrl?: string;
  qrCode?: string;
  notes?: string;
  testMethod?: TestMethod;
  metadata?: Record<string, unknown>;
}