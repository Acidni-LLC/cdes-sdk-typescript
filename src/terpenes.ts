/**
 * CDES Terpene Color Palette
 * Authoritative color definitions for 30 standard cannabis terpenes
 * 
 * @module terpenes
 * @version 1.1.0
 * 
 * @deprecated STANDARD_TERPENES is maintained for backward compatibility.
 * For new code, use the reference module:
 * ```typescript
 * import { fetchTerpeneColors, getTerpeneColor } from '@cdes/sdk-typescript';
 * 
 * // Fetch all colors from the single source of truth
 * const colors = await fetchTerpeneColors();
 * 
 * // Or get a specific color
 * const myrceneColor = await getTerpeneColor("myrcene");
 * ```
 * 
 * The canonical reference data lives at:
 * https://github.com/Acidni-LLC/cdes-reference-data
 */

export interface TerpeneColor {
  hex: string;
  rgb: { r: number; g: number; b: number };
  hsl?: { h: number; s: number; l: number };
  aroma?: string;
  therapeutic?: string[];
  boilingPointC?: number;
}

export interface TerpeneDefinition extends TerpeneColor {
  id: number;
  canonicalName: string;
  displayName: string;
  category: "monoterpene" | "sesquiterpene" | "monoterpenoid" | "sesquiterpenoid" | "ester";
  displayOrder: number;
  aliases: string[];
}

/**
 * CDES Standard Terpene Definitions (30 Total)
 * Colors organized by:
 * - Aroma family (citrus = blues, earthy = yellows/greens, floral = pinks)
 * - Chemical class (monoterpenes, sesquiterpenes, terpenoids)
 * - Abundance (common terpenes get more vibrant colors)
 */
export const STANDARD_TERPENES: Record<string, TerpeneDefinition> = {
  // ═══════════════════════════════════════════════════════════════════════
  // PRIMARY TERPENES (Top 8 - Most Common in Cannabis)
  // ═══════════════════════════════════════════════════════════════════════

  "β-Myrcene": {
    id: 1,
    canonicalName: "β-Myrcene",
    displayName: "Myrcene",
    category: "monoterpene",
    displayOrder: 1,
    hex: "#FFFF00",
    rgb: { r: 255, g: 255, b: 0 },
    hsl: { h: 60, s: 100, l: 50 },
    aroma: "Earthy, musky, herbal, mango",
    therapeutic: ["Relaxation", "Sedation", "Anti-inflammatory", "Pain Relief"],
    boilingPointC: 167,
    aliases: ["beta-myrcene", "b-myrcene", "myrcene"],
  },

  "δ-Limonene": {
    id: 2,
    canonicalName: "δ-Limonene",
    displayName: "Limonene",
    category: "monoterpene",
    displayOrder: 2,
    hex: "#66CCFF",
    rgb: { r: 102, g: 204, b: 255 },
    hsl: { h: 200, s: 100, l: 70 },
    aroma: "Citrus, lemon, orange, bright",
    therapeutic: ["Mood Elevation", "Stress Relief", "Energy", "Anti-anxiety"],
    boilingPointC: 176,
    aliases: ["d-limonene", "limonene", "delta-limonene", "+limonene", "r-limonene"],
  },

  "β-Caryophyllene": {
    id: 3,
    canonicalName: "β-Caryophyllene",
    displayName: "Caryophyllene",
    category: "sesquiterpene",
    displayOrder: 3,
    hex: "#92D050",
    rgb: { r: 146, g: 208, b: 80 },
    hsl: { h: 89, s: 56, l: 56 },
    aroma: "Spicy, peppery, warm, woody",
    therapeutic: ["Pain Relief", "Anti-anxiety", "Anti-inflammatory", "CB2 Agonist"],
    boilingPointC: 130,
    aliases: ["caryophyllene", "beta-caryophyllene", "b-caryophyllene", "bcp"],
  },

  "α-Pinene": {
    id: 4,
    canonicalName: "α-Pinene",
    displayName: "Pinene",
    category: "monoterpene",
    displayOrder: 4,
    hex: "#00B0F0",
    rgb: { r: 0, g: 176, b: 240 },
    hsl: { h: 196, s: 100, l: 47 },
    aroma: "Pine, fresh, crisp, forest",
    therapeutic: ["Memory", "Focus", "Energy", "Anti-inflammatory", "Bronchodilator"],
    boilingPointC: 155,
    aliases: ["alpha-pinene", "a-pinene", "pinene"],
  },

  "Linalool": {
    id: 5,
    canonicalName: "Linalool",
    displayName: "Linalool",
    category: "monoterpenoid",
    displayOrder: 5,
    hex: "#FF7C80",
    rgb: { r: 255, g: 124, b: 128 },
    hsl: { h: 358, s: 100, l: 74 },
    aroma: "Floral, lavender, sweet, calming",
    therapeutic: ["Relaxation", "Sleep", "Anti-anxiety", "Stress Relief"],
    boilingPointC: 198,
    aliases: ["d-linalool", "l-linalool"],
  },

  "α-Humulene": {
    id: 6,
    canonicalName: "α-Humulene",
    displayName: "Humulene",
    category: "sesquiterpene",
    displayOrder: 6,
    hex: "#0070C0",
    rgb: { r: 0, g: 112, b: 192 },
    hsl: { h: 205, s: 100, l: 38 },
    aroma: "Hoppy, earthy, spicy, herbal",
    therapeutic: ["Anti-inflammatory", "Appetite Suppression", "Antibacterial"],
    boilingPointC: 106,
    aliases: ["humulene", "alpha-humulene", "a-humulene"],
  },

  "Terpinolene": {
    id: 7,
    canonicalName: "Terpinolene",
    displayName: "Terpinolene",
    category: "monoterpene",
    displayOrder: 7,
    hex: "#0000CC",
    rgb: { r: 0, g: 0, b: 204 },
    hsl: { h: 240, s: 100, l: 40 },
    aroma: "Fresh, herbal, piney, floral",
    therapeutic: ["Energy", "Alertness", "Uplifting", "Antioxidant"],
    boilingPointC: 186,
    aliases: ["alpha-terpinolene"],
  },

  "Ocimene": {
    id: 8,
    canonicalName: "Ocimene",
    displayName: "Ocimene",
    category: "monoterpene",
    displayOrder: 8,
    hex: "#00CC00",
    rgb: { r: 0, g: 204, b: 0 },
    hsl: { h: 120, s: 100, l: 40 },
    aroma: "Fresh, minty, herbal, citrus",
    therapeutic: ["Mood Elevation", "Uplifting", "Antimicrobial", "Decongestant"],
    boilingPointC: 100,
    aliases: ["beta-ocimene", "trans-ocimene", "b-ocimene"],
  },

  // ═══════════════════════════════════════════════════════════════════════
  // SECONDARY TERPENES (9-16)
  // ═══════════════════════════════════════════════════════════════════════

  "Camphene": {
    id: 9,
    canonicalName: "Camphene",
    displayName: "Camphene",
    category: "monoterpene",
    displayOrder: 9,
    hex: "#33CC33",
    rgb: { r: 51, g: 204, b: 51 },
    hsl: { h: 120, s: 60, l: 50 },
    aroma: "Woody, camphor, spicy, pungent",
    therapeutic: ["Anti-inflammatory", "Antimicrobial", "Cardiovascular"],
    boilingPointC: 159,
    aliases: ["d-camphene", "alpha-camphene"],
  },

  "Caryophyllene Oxide": {
    id: 10,
    canonicalName: "Caryophyllene Oxide",
    displayName: "Caryophyllene Oxide",
    category: "sesquiterpene",
    displayOrder: 10,
    hex: "#66FF66",
    rgb: { r: 102, g: 255, b: 102 },
    hsl: { h: 120, s: 100, l: 70 },
    aroma: "Peppery, woody, warm, oxidized",
    therapeutic: ["Stress Relief", "Anti-inflammatory", "Antifungal"],
    boilingPointC: 257,
    aliases: ["caryophyllene-oxide"],
  },

  "Eucalyptol": {
    id: 11,
    canonicalName: "Eucalyptol",
    displayName: "Eucalyptol",
    category: "monoterpenoid",
    displayOrder: 11,
    hex: "#CCFFCC",
    rgb: { r: 204, g: 255, b: 204 },
    hsl: { h: 120, s: 100, l: 90 },
    aroma: "Minty, cool, fresh, eucalyptus",
    therapeutic: ["Respiratory Support", "Mental Clarity", "Pain Relief"],
    boilingPointC: 176,
    aliases: ["1,8-cineole", "cineole"],
  },

  "Fenchyl Alcohol": {
    id: 12,
    canonicalName: "Fenchyl Alcohol",
    displayName: "Fenchol",
    category: "monoterpenoid",
    displayOrder: 12,
    hex: "#FFCCFF",
    rgb: { r: 255, g: 204, b: 255 },
    hsl: { h: 300, s: 100, l: 90 },
    aroma: "Sweet, herbaceous, minty, piney",
    therapeutic: ["Relaxation", "Anti-anxiety", "Antibacterial"],
    boilingPointC: 201,
    aliases: ["fenchol", "endo-fenchol"],
  },

  "Geraniol": {
    id: 13,
    canonicalName: "Geraniol",
    displayName: "Geraniol",
    category: "monoterpenoid",
    displayOrder: 13,
    hex: "#FF99FF",
    rgb: { r: 255, g: 153, b: 255 },
    hsl: { h: 300, s: 100, l: 80 },
    aroma: "Floral, rose, sweet, citrus",
    therapeutic: ["Neuroprotection", "Antioxidant", "Cancer Research"],
    boilingPointC: 230,
    aliases: ["trans-geraniol"],
  },

  "Guaiol": {
    id: 14,
    canonicalName: "Guaiol",
    displayName: "Guaiol",
    category: "sesquiterpenoid",
    displayOrder: 14,
    hex: "#CC00CC",
    rgb: { r: 204, g: 0, b: 204 },
    hsl: { h: 300, s: 100, l: 40 },
    aroma: "Woody, smoky, warm, piney",
    therapeutic: ["Anti-inflammatory", "Antifungal", "Antimicrobial"],
    boilingPointC: 92,
    aliases: ["alpha-guaiol"],
  },

  "Isopulegol": {
    id: 15,
    canonicalName: "Isopulegol",
    displayName: "Isopulegol",
    category: "monoterpenoid",
    displayOrder: 15,
    hex: "#FFCCCC",
    rgb: { r: 255, g: 204, b: 204 },
    hsl: { h: 0, s: 100, l: 90 },
    aroma: "Minty, cooling, fresh, menthol-like",
    therapeutic: ["Antimicrobial", "Anti-inflammatory", "Gastroprotective"],
    boilingPointC: 212,
    aliases: ["iso-pulegol", "l-isopulegol"],
  },

  "Menthol": {
    id: 16,
    canonicalName: "Menthol",
    displayName: "Menthol",
    category: "monoterpenoid",
    displayOrder: 16,
    hex: "#CC0000",
    rgb: { r: 204, g: 0, b: 0 },
    hsl: { h: 0, s: 100, l: 40 },
    aroma: "Minty, cool, strong, medicinal",
    therapeutic: ["Cooling Sensation", "Anti-inflammatory", "Pain Relief"],
    boilingPointC: 212,
    aliases: ["l-menthol", "dl-menthol"],
  },

  // ═══════════════════════════════════════════════════════════════════════
  // TERTIARY TERPENES (17-24)
  // ═══════════════════════════════════════════════════════════════════════

  "Terpineol": {
    id: 17,
    canonicalName: "Terpineol",
    displayName: "Terpineol",
    category: "monoterpenoid",
    displayOrder: 17,
    hex: "#0066FF",
    rgb: { r: 0, g: 102, b: 255 },
    hsl: { h: 216, s: 100, l: 50 },
    aroma: "Piney, floral, woody, lilac",
    therapeutic: ["Mood Elevation", "Sedation", "Antibacterial"],
    boilingPointC: 217,
    aliases: ["alpha-terpineol", "total terpineol"],
  },

  "Valencene": {
    id: 18,
    canonicalName: "Valencene",
    displayName: "Valencene",
    category: "sesquiterpene",
    displayOrder: 18,
    hex: "#006666",
    rgb: { r: 0, g: 102, b: 102 },
    hsl: { h: 180, s: 100, l: 20 },
    aroma: "Citrus, sweet orange, fresh",
    therapeutic: ["Mood Elevation", "Anti-inflammatory", "Insect Repellent"],
    boilingPointC: 123,
    aliases: ["d-valencene"],
  },

  "cis-Nerolidol": {
    id: 19,
    canonicalName: "cis-Nerolidol",
    displayName: "cis-Nerolidol",
    category: "sesquiterpenoid",
    displayOrder: 19,
    hex: "#339966",
    rgb: { r: 51, g: 153, b: 102 },
    hsl: { h: 150, s: 50, l: 40 },
    aroma: "Woody, floral, earthy, fruity",
    therapeutic: ["Sleep Induction", "Anti-anxiety", "Sedation"],
    boilingPointC: 276,
    aliases: ["z-nerolidol"],
  },

  "trans-Nerolidol": {
    id: 20,
    canonicalName: "trans-Nerolidol",
    displayName: "trans-Nerolidol",
    category: "sesquiterpenoid",
    displayOrder: 20,
    hex: "#CC3399",
    rgb: { r: 204, g: 51, b: 153 },
    hsl: { h: 320, s: 60, l: 50 },
    aroma: "Floral, woody, herbal, apple",
    therapeutic: ["Sleep Support", "Neuroprotection", "Antimicrobial"],
    boilingPointC: 276,
    aliases: ["e-nerolidol", "t-nerolidol"],
  },

  "p-Cymene": {
    id: 21,
    canonicalName: "p-Cymene",
    displayName: "p-Cymene",
    category: "monoterpene",
    displayOrder: 21,
    hex: "#FF6699",
    rgb: { r: 255, g: 102, b: 153 },
    hsl: { h: 340, s: 100, l: 70 },
    aroma: "Herbal, thyme-like, warm, earthy",
    therapeutic: ["Anti-inflammatory", "Antimicrobial", "Analgesic"],
    boilingPointC: 177,
    aliases: ["para-cymene"],
  },

  "trans-Caryophyllene": {
    id: 22,
    canonicalName: "trans-Caryophyllene",
    displayName: "trans-Caryophyllene",
    category: "sesquiterpene",
    displayOrder: 22,
    hex: "#FF3399",
    rgb: { r: 255, g: 51, b: 153 },
    hsl: { h: 330, s: 100, l: 60 },
    aroma: "Spicy, peppery, hot, herbal",
    therapeutic: ["Pain Relief", "CB2 Agonist", "Anti-inflammatory"],
    boilingPointC: 130,
    aliases: ["t-caryophyllene", "e-caryophyllene"],
  },

  "α-Bisabolol": {
    id: 23,
    canonicalName: "α-Bisabolol",
    displayName: "Bisabolol",
    category: "sesquiterpenoid",
    displayOrder: 23,
    hex: "#002060",
    rgb: { r: 0, g: 32, b: 96 },
    hsl: { h: 220, s: 100, l: 19 },
    aroma: "Sweet, floral, warm, chamomile",
    therapeutic: ["Anti-inflammatory", "Calming", "Skin Healing"],
    boilingPointC: 153,
    aliases: ["bisabolol", "alpha-bisabolol"],
  },

  "α-Terpinene": {
    id: 24,
    canonicalName: "α-Terpinene",
    displayName: "α-Terpinene",
    category: "monoterpene",
    displayOrder: 24,
    hex: "#00B050",
    rgb: { r: 0, g: 176, b: 80 },
    hsl: { h: 147, s: 100, l: 35 },
    aroma: "Piney, herbal, fresh, lemony",
    therapeutic: ["Energy", "Antimicrobial", "Antioxidant"],
    boilingPointC: 174,
    aliases: ["alpha-terpinene", "gamma-terpinene"],
  },

  // ═══════════════════════════════════════════════════════════════════════
  // MINOR TERPENES (25-30)
  // ═══════════════════════════════════════════════════════════════════════

  "β-Pinene": {
    id: 25,
    canonicalName: "β-Pinene",
    displayName: "β-Pinene",
    category: "monoterpene",
    displayOrder: 25,
    hex: "#FFC000",
    rgb: { r: 255, g: 192, b: 0 },
    hsl: { h: 45, s: 100, l: 50 },
    aroma: "Pine, woody, fresh, herbal",
    therapeutic: ["Anti-inflammatory", "Memory Support", "Bronchodilator"],
    boilingPointC: 166,
    aliases: ["beta-pinene", "b-pinene"],
  },

  "δ-3-Carene": {
    id: 26,
    canonicalName: "δ-3-Carene",
    displayName: "Carene",
    category: "monoterpene",
    displayOrder: 26,
    hex: "#C00000",
    rgb: { r: 192, g: 0, b: 0 },
    hsl: { h: 0, s: 100, l: 38 },
    aroma: "Sweet, piney, woodsy, cypress",
    therapeutic: ["Anti-inflammatory", "Bone Growth Research", "Drying"],
    boilingPointC: 171,
    aliases: ["3-carene", "delta-3-carene", "carene"],
  },

  "Borneol": {
    id: 27,
    canonicalName: "Borneol",
    displayName: "Borneol",
    category: "monoterpenoid",
    displayOrder: 27,
    hex: "#99FF33",
    rgb: { r: 153, g: 255, b: 51 },
    hsl: { h: 90, s: 100, l: 60 },
    aroma: "Camphor, minty, woody, herbal",
    therapeutic: ["Anti-inflammatory", "Analgesic", "Blood-Brain Barrier"],
    boilingPointC: 210,
    aliases: ["isoborneol", "d-borneol"],
  },

  "Sabinene": {
    id: 28,
    canonicalName: "Sabinene",
    displayName: "Sabinene",
    category: "monoterpene",
    displayOrder: 28,
    hex: "#C0C0C0",
    rgb: { r: 192, g: 192, b: 192 },
    hsl: { h: 0, s: 0, l: 75 },
    aroma: "Spicy, woody, warm, piney",
    therapeutic: ["Anti-inflammatory", "Antimicrobial", "Antioxidant"],
    boilingPointC: 163,
    aliases: ["alpha-sabinene"],
  },

  "Farnesene": {
    id: 29,
    canonicalName: "Farnesene",
    displayName: "Farnesene",
    category: "sesquiterpene",
    displayOrder: 29,
    hex: "#00CC99",
    rgb: { r: 0, g: 204, b: 153 },
    hsl: { h: 165, s: 100, l: 40 },
    aroma: "Sweet, woody, apple-like, floral",
    therapeutic: ["Anti-inflammatory", "Mood Elevation", "Antimicrobial"],
    boilingPointC: 125,
    aliases: ["alpha-farnesene", "beta-farnesene"],
  },

  "Geranyl Acetate": {
    id: 30,
    canonicalName: "Geranyl Acetate",
    displayName: "Geranyl Acetate",
    category: "ester",
    displayOrder: 30,
    hex: "#996633",
    rgb: { r: 153, g: 102, b: 51 },
    hsl: { h: 30, s: 50, l: 40 },
    aroma: "Floral, fruity, sweet, rose-like",
    therapeutic: ["Uplifting", "Anti-inflammatory", "Antimicrobial"],
    boilingPointC: 245,
    aliases: ["geranylacetate"],
  },
};

/**
 * Quick lookup of terpene hex colors
 */
export const TERPENE_COLORS: Record<string, string> = Object.fromEntries(
  Object.entries(STANDARD_TERPENES).map(([name, def]) => [name, def.hex])
);

/**
 * Terpene display order (for consistent visualization)
 */
export const TERPENE_DISPLAY_ORDER: string[] = Object.entries(STANDARD_TERPENES)
  .sort((a, b) => a[1].displayOrder - b[1].displayOrder)
  .map(([name]) => name);

/**
 * Build alias lookup map for normalization
 */
const ALIAS_MAP: Map<string, string> = new Map();
for (const [canonical, def] of Object.entries(STANDARD_TERPENES)) {
  ALIAS_MAP.set(canonical.toLowerCase(), canonical);
  ALIAS_MAP.set(def.displayName.toLowerCase(), canonical);
  for (const alias of def.aliases) {
    ALIAS_MAP.set(alias.toLowerCase(), canonical);
  }
}

/**
 * Normalize a terpene name to CDES canonical format
 * 
 * @param rawName - Input terpene name in any format
 * @returns Canonical name or original if not found
 */
export function normalizeTerpeneName(rawName: string): string {
  const cleaned = rawName.toLowerCase().trim();
  return ALIAS_MAP.get(cleaned) ?? rawName;
}

/**
 * Get terpene definition by name (supports aliases)
 * 
 * @param name - Terpene name (canonical or alias)
 * @returns TerpeneDefinition or undefined
 */
export function getTerpeneDefinition(name: string): TerpeneDefinition | undefined {
  const canonical = normalizeTerpeneName(name);
  return STANDARD_TERPENES[canonical];
}

/**
 * Get terpene color by name (supports aliases)
 * 
 * @param name - Terpene name (canonical or alias)
 * @returns Hex color string or undefined
 */
export function getTerpeneColor(name: string): string | undefined {
  const def = getTerpeneDefinition(name);
  return def?.hex;
}

/**
 * Get terpene RGB color by name
 * 
 * @param name - Terpene name (canonical or alias)
 * @returns RGB object or undefined
 */
export function getTerpeneRGB(name: string): { r: number; g: number; b: number } | undefined {
  const def = getTerpeneDefinition(name);
  return def?.rgb;
}

/**
 * Check if a terpene is recognized in CDES standard
 * 
 * @param name - Terpene name to check
 * @returns true if recognized
 */
export function isRecognizedTerpene(name: string): boolean {
  return getTerpeneDefinition(name) !== undefined;
}

/**
 * Get all canonical terpene names
 * 
 * @returns Array of all 30 CDES canonical terpene names
 */
export function getAllTerpeneNames(): string[] {
  return Object.keys(STANDARD_TERPENES);
}

/**
 * Get terpenes by category
 * 
 * @param category - Terpene category to filter by
 * @returns Array of TerpeneDefinitions
 */
export function getTerpenesByCategory(
  category: "monoterpene" | "sesquiterpene" | "monoterpenoid" | "sesquiterpenoid" | "ester"
): TerpeneDefinition[] {
  return Object.values(STANDARD_TERPENES).filter(t => t.category === category);
}

/**
 * Get terpenes sorted by display order
 * 
 * @returns Array of TerpeneDefinitions in display order
 */
export function getTerpenesInDisplayOrder(): TerpeneDefinition[] {
  return Object.values(STANDARD_TERPENES).sort((a, b) => a.displayOrder - b.displayOrder);
}

/**
 * Find terpenes by therapeutic effect
 * 
 * @param effect - Effect to search for (partial match)
 * @returns Array of matching TerpeneDefinitions
 */
export function findTerpenesByEffect(effect: string): TerpeneDefinition[] {
  const searchTerm = effect.toLowerCase();
  return Object.values(STANDARD_TERPENES).filter(t =>
    t.therapeutic?.some(e => e.toLowerCase().includes(searchTerm))
  );
}

/**
 * Get color palette for Power BI or charting
 * 
 * @param count - Number of colors to return (default: all 30)
 * @returns Array of hex color strings in display order
 */
export function getTerpenePalette(count: number = 30): string[] {
  return getTerpenesInDisplayOrder()
    .slice(0, count)
    .map(t => t.hex);
}

/**
 * Unknown/fallback terpene color
 */
export const UNKNOWN_TERPENE_COLOR = "#808080";

/**
 * Get terpene color with fallback for unknown terpenes
 * 
 * @param name - Terpene name
 * @returns Hex color string (never undefined)
 */
export function getTerpeneColorSafe(name: string): string {
  return getTerpeneColor(name) ?? UNKNOWN_TERPENE_COLOR;
}
