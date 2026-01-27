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
