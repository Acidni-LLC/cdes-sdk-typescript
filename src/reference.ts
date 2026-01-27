/**
 * CDES Reference Data Module
 * 
 * Fetches terpene and cannabinoid definitions from the official
 * cdes-reference-data repository - the single source of truth.
 * 
 * @module reference
 * @version 1.1.0
 */

// GitHub raw URLs for reference data
const GITHUB_RAW_BASE = "https://raw.githubusercontent.com/Acidni-LLC/cdes-reference-data/master";
const TERPENE_COLORS_URL = `${GITHUB_RAW_BASE}/terpenes/terpene-colors.json`;
const TERPENE_LIBRARY_URL = `${GITHUB_RAW_BASE}/terpenes/terpene-library.json`;
const TERPENE_EXTENDED_URL = `${GITHUB_RAW_BASE}/terpenes/terpene-library-extended.json`;
const CANNABINOID_LIBRARY_URL = `${GITHUB_RAW_BASE}/cannabinoids/cannabinoid-library.json`;

// Types for reference data
export interface TerpeneColorRef {
  id: string;
  name: string;
  color: {
    hex: string;
    rgb: { r: number; g: number; b: number };
  };
  colorRationale: string;
}

export interface TerpeneRef {
  id: string;
  name: string;
  alternateName?: string[];
  casNumber: string;
  pubchemId: string;
  molecularFormula: string;
  molecularWeight?: number;
  category: string;
  boilingPoint: { celsius: number; fahrenheit: number };
  aroma: string[];
  flavor?: string[];
  naturalSources: string[];
  effects: Array<{
    effect: string;
    strength: string;
    evidence: string;
  }>;
  prevalence: string;
  typicalRange: { min: number; max: number; unit: string };
  notes?: string;
}

export interface CannabinoidRef {
  id: string;
  name: string;
  fullName: string;
  alternateName?: string[];
  casNumber: string;
  pubchemId: string;
  molecularFormula: string;
  molecularWeight: number;
  category: "major" | "minor";
  psychoactive: boolean;
  effects: Array<{
    effect: string;
    strength: string;
    evidence: string;
  }>;
  threshold?: { medical: number; unit: string; notes: string };
  notes?: string;
  color: {
    hex: string;
    rgb: { r: number; g: number; b: number };
  };
  colorRationale: string;
}

export interface TerpeneColorsData {
  $schema: string;
  title: string;
  description: string;
  version: string;
  lastUpdated: string;
  terpenes: TerpeneColorRef[];
}

export interface TerpeneLibraryData {
  $schema: string;
  title: string;
  description: string;
  version: string;
  lastUpdated: string;
  terpenes: TerpeneRef[];
}

export interface CannabinoidLibraryData {
  $schema: string;
  title: string;
  description: string;
  version: string;
  lastUpdated: string;
  cannabinoids: CannabinoidRef[];
}

// Cache for fetched data
let terpeneColorsCache: TerpeneColorsData | null = null;
let terpeneLibraryCache: TerpeneLibraryData | null = null;
let terpeneExtendedCache: TerpeneLibraryData | null = null;
let cannabinoidLibraryCache: CannabinoidLibraryData | null = null;

/**
 * Fetch terpene color definitions from reference data
 */
export async function fetchTerpeneColors(): Promise<TerpeneColorsData> {
  if (terpeneColorsCache) return terpeneColorsCache;
  
  const response = await fetch(TERPENE_COLORS_URL);
  if (!response.ok) {
    throw new Error(`Failed to fetch terpene colors: ${response.statusText}`);
  }
  
  terpeneColorsCache = await response.json();
  return terpeneColorsCache!;
}

/**
 * Fetch main terpene library (10 most common)
 */
export async function fetchTerpeneLibrary(): Promise<TerpeneLibraryData> {
  if (terpeneLibraryCache) return terpeneLibraryCache;
  
  const response = await fetch(TERPENE_LIBRARY_URL);
  if (!response.ok) {
    throw new Error(`Failed to fetch terpene library: ${response.statusText}`);
  }
  
  terpeneLibraryCache = await response.json();
  return terpeneLibraryCache!;
}

/**
 * Fetch extended terpene library (additional 14 terpenes)
 */
export async function fetchTerpeneExtended(): Promise<TerpeneLibraryData> {
  if (terpeneExtendedCache) return terpeneExtendedCache;
  
  const response = await fetch(TERPENE_EXTENDED_URL);
  if (!response.ok) {
    throw new Error(`Failed to fetch extended terpene library: ${response.statusText}`);
  }
  
  terpeneExtendedCache = await response.json();
  return terpeneExtendedCache!;
}

/**
 * Fetch cannabinoid library with colors
 */
export async function fetchCannabinoidLibrary(): Promise<CannabinoidLibraryData> {
  if (cannabinoidLibraryCache) return cannabinoidLibraryCache;
  
  const response = await fetch(CANNABINOID_LIBRARY_URL);
  if (!response.ok) {
    throw new Error(`Failed to fetch cannabinoid library: ${response.statusText}`);
  }
  
  cannabinoidLibraryCache = await response.json();
  return cannabinoidLibraryCache!;
}

/**
 * Get all terpenes (main + extended) with their colors
 */
export async function fetchAllTerpenes(): Promise<Array<TerpeneRef & { color?: TerpeneColorRef["color"] }>> {
  const [mainLib, extendedLib, colors] = await Promise.all([
    fetchTerpeneLibrary(),
    fetchTerpeneExtended(),
    fetchTerpeneColors(),
  ]);
  
  const colorMap = new Map(colors.terpenes.map(t => [t.id, t.color]));
  
  const allTerpenes = [...mainLib.terpenes, ...extendedLib.terpenes];
  
  return allTerpenes.map(t => ({
    ...t,
    color: colorMap.get(t.id),
  }));
}

/**
 * Get color for a specific terpene by name or ID
 */
export async function getTerpeneColor(nameOrId: string): Promise<TerpeneColorRef["color"] | undefined> {
  const colors = await fetchTerpeneColors();
  
  const normalizedSearch = nameOrId.toLowerCase().replace(/[^a-z0-9]/g, "");
  
  const found = colors.terpenes.find(t => 
    t.id.toLowerCase() === nameOrId.toLowerCase() ||
    t.name.toLowerCase().replace(/[^a-z0-9]/g, "") === normalizedSearch
  );
  
  return found?.color;
}

/**
 * Get color for a specific cannabinoid by name or ID
 */
export async function getCannabinoidColor(nameOrId: string): Promise<CannabinoidRef["color"] | undefined> {
  const library = await fetchCannabinoidLibrary();
  
  const normalizedSearch = nameOrId.toLowerCase().replace(/[^a-z0-9]/g, "");
  
  const found = library.cannabinoids.find(c =>
    c.id.toLowerCase() === nameOrId.toLowerCase() ||
    c.name.toLowerCase() === nameOrId.toLowerCase() ||
    c.name.toLowerCase().replace(/[^a-z0-9]/g, "") === normalizedSearch ||
    c.alternateName?.some(alt => alt.toLowerCase() === nameOrId.toLowerCase())
  );
  
  return found?.color;
}

/**
 * Clear all cached data (useful for testing or forcing refresh)
 */
export function clearReferenceCache(): void {
  terpeneColorsCache = null;
  terpeneLibraryCache = null;
  terpeneExtendedCache = null;
  cannabinoidLibraryCache = null;
}

/**
 * Pre-load all reference data into cache
 */
export async function preloadReferenceData(): Promise<void> {
  await Promise.all([
    fetchTerpeneColors(),
    fetchTerpeneLibrary(),
    fetchTerpeneExtended(),
    fetchCannabinoidLibrary(),
  ]);
}
