# CDES TypeScript SDK

**Cannabis Data Exchange Standard (CDES)** TypeScript library for parsing, analyzing, and working with cannabis data. Built for Power BI visuals, web applications, and any TypeScript/JavaScript project.

## Features

✅ **Multi-format Parser** - Parse cannabis data from Power BI DataViews, JSON, or API responses
✅ **Cannabinoid Analysis** - Compare profiles, find similarities, classify strains
✅ **Color Mapping** - Built-in therapeutic color palette (THC🔴, CBD🔵, CBN🟠, etc.)
✅ **Type-Safe** - Full TypeScript support with strict mode
✅ **Well-Tested** - Jest test suite with comprehensive coverage
✅ **Zero Dependencies** - Pure TypeScript, no external runtime dependencies
✅ **npm Published** - Installable via `npm install @cdes-world/sdk-typescript`

## Installation

```bash
npm install @cdes-world/sdk-typescript
```

## Quick Start

### Parse Power BI Data

```typescript
import { CDESParser } from "@cdes-world/sdk-typescript";

// Parse a Power BI DataView
const parsed = CDESParser.parseDataView(dataView.categorical);

console.log(`Parsed ${parsed.profiles.length} cannabinoid profiles`);
console.log(`Mode: ${parsed.parseMode}`); // "standard" or "cdes"

parsed.profiles.forEach((profile) => {
  console.log(`${profile.batchName}: ${profile.totalCannabinoids}% total`);
  profile.cannabinoids.forEach((percentage, name) => {
    console.log(`  ${name}: ${percentage}%`);
  });
});
```

### Parse JSON Data

```typescript
import { CDESParser } from "@cdes-world/sdk-typescript";

const batches = [
  { id: "batch1", name: "Strain A", thc: 20, cbd: 15, cbn: 2 },
  { id: "batch2", name: "Strain B", thc: 18, cbd: 12, cbn: 1.5 },
];

const profiles = CDESParser.parseBatchesJSON(batches);
// profiles is now CannabinoidProfile[]
```

### Analyze & Compare Profiles

```typescript
import { CDESAnalyzer, CDESParser } from "@cdes-world/sdk-typescript";

// Parse profiles
const profiles = CDESParser.parseDataView(data);

// Compare two profiles
const comparison = CDESAnalyzer.compareProfiles(
  profiles[0],
  profiles[1]
);

console.log(`Similarity: ${comparison.similarity.toFixed(1)}%`); // 0-100
console.log(`Distance: ${comparison.distance.toFixed(2)}`);

// Show differences
comparison.differences.forEach((diff, name) => {
  const sign = diff.delta > 0 ? "+" : "";
  console.log(`${name}: ${diff.val1}% → ${diff.val2}% (${sign}${diff.delta}%)`);
});
```

### Find Similar Profiles

```typescript
const targetProfile = profiles[0];
const similar = CDESAnalyzer.findSimilarProfiles(
  targetProfile,
  profiles,
  5, // max 5 results
  50 // minimum 50% similarity
);

similar.forEach((result) => {
  console.log(
    `#${result.rank}: ${result.profile.batchName} (${result.similarity.toFixed(1)}% match)`
  );
});
```

### Classify Strains

```typescript
const classification = CDESAnalyzer.classifyStrain(profile);

console.log(`Type: ${classification.type}`); // "THC-Dominant", "CBD-Dominant", etc.
console.log(`Ratio: ${classification.ratio}`); // "10.5:1 THC:CBD"
console.log(`THC: ${classification.thcContent}`); // "High", "Moderate", "Low", "Trace"
console.log(`CBD: ${classification.cbdContent}`);
```

### Get Cannabinoid Colors

```typescript
import { getCannabioidColor, STANDARD_CANNABINOIDS } from "@cdes-world/sdk-typescript";

// Get color for specific cannabinoid
const thcColor = getCannabioidColor("THC");
console.log(thcColor.hex); // "#E74C3C"
console.log(thcColor.therapeutic); // "Psychoactive, Pain Relief, Nausea"

// Access all cannabinoids
Object.entries(STANDARD_CANNABINOIDS).forEach(([name, color]) => {
  console.log(`${name}: ${color.hex} - ${color.therapeutic}`);
});
```

## API Reference

### CDESParser

Static methods for parsing cannabis data:

#### `parseDataView(data: PowerBICategoricalData): CDESParsedData`

Parse a Power BI categorical data view. Automatically detects format:

- **Standard**: `Batch | Cannabinoid Name | Percentage`
- **CDES**: `Batch | THC | CBD | CBN | CBG | ...`

```typescript
const result = CDESParser.parseDataView(dataView.categorical);
// Returns: { profiles: CannabinoidProfile[], parseMode: "standard" | "cdes", recordsProcessed: number }
```

#### `parseBatchJSON(batch: Record<string, unknown>): CannabinoidProfile`

Parse a single batch object:

```typescript
const profile = CDESParser.parseBatchJSON({
  id: "batch123",
  name: "OG Kush",
  thc: 20,
  cbd: 1.5,
  cbn: 0.5,
});
```

#### `parseBatchesJSON(batches: Record<string, unknown>[]): CannabinoidProfile[]`

Parse an array of batch objects:

```typescript
const profiles = CDESParser.parseBatchesJSON(batchArray);
```

### CDESAnalyzer

Static methods for analyzing cannabis profiles:

#### `compareProfiles(profile1, profile2): ComparisonResult`

Compare two cannabinoid profiles:

```typescript
const result = CDESAnalyzer.compareProfiles(profile1, profile2);
// Returns: { profile1, profile2, distance, similarity, differences }
```

#### `findSimilarProfiles(target, profiles, limit?, minSimilarity?): SimilarityResult[]`

Find similar profiles:

```typescript
const similar = CDESAnalyzer.findSimilarProfiles(
  targetProfile,
  allProfiles,
  10, // max results
  60  // minimum 60% similarity
);
```

#### `classifyStrain(profile): StrainClassification`

Classify strain type:

```typescript
const classification = CDESAnalyzer.classifyStrain(profile);
// Returns: { type, thcContent, cbdContent, ratio }
```

#### `scoreProfileCompleteness(profile): { score, coverage, message }`

Rate profile quality:

```typescript
const score = CDESAnalyzer.scoreProfileCompleteness(profile);
// Returns score 0-100, coverage %, and descriptive message
```

### Cannabinoid Utilities

#### `getCannabioidColor(name: string): CannabioidColor | undefined`

Get color and metadata for cannabinoid:

```typescript
const color = getCannabioidColor("THC");
// Returns: { hex, rgb, therapeutic, threshold }
```

#### `normalizeCannabioidName(name: string): string`

Normalize cannabinoid names for comparison:

```typescript
normalizeCannabioidName("THC %"); // → "THC"
normalizeCannabioidName("  cbd  "); // → "CBD"
```

#### `calculateEuclideanDistance(profile1, profile2): number`

Calculate similarity distance between two profiles:

```typescript
const distance = calculateEuclideanDistance(p1.cannabinoids, p2.cannabinoids);
```

## Data Structures

### CannabinoidProfile

```typescript
interface CannabinoidProfile {
  batchId: string; // Unique batch identifier
  batchName: string; // Display name
  cannabinoids: Map<string, number>; // {name: percentage}
  totalCannabinoids: number; // Sum of all cannabinoid percentages
}
```

### Cannabinoid Colors

**Standard Cannabinoids:**

| Name | Color | Hex | Therapeutic |
| --- | --- | --- | --- |
| THC | 🔴 | #E74C3C | Psychoactive, Pain Relief, Nausea |
| CBD | 🔵 | #3498DB | Anti-inflammatory, Anxiety, Seizures |
| CBN | 🟠 | #E67E22 | Sedation, Sleep, Anti-inflammatory |
| CBG | 🟣 | #9B59B6 | Uplift, Focus, Appetite Stimulant |
| CBC | 🟢 | #16A085 | Anti-inflammatory, Mood Support |
| THCV | 🟡 | #F39C12 | Energy, Appetite Suppression, Focus |
| CBDV | 🩵 | #1ABC9C | Seizure Support, Nausea |

## Supported Data Formats

### Power BI Standard Format

| Field | Type | Example |
| --- | --- | --- |
| Category 1 (Batch ID) | string | "batch-001" |
| Category 2 (Cannabinoid) | string | "THC", "CBD" |
| Measure (Percentage) | number | 20.5 |

### CDES Format (Multiple Measures)

| Measure | Type | Example |
| --- | --- | --- |
| THC | number | 20.5 |
| CBD | number | 15.0 |
| CBN | number | 2.1 |
| CBG | number | 1.0 |

### JSON Batch Format

```json
{
  "id": "batch-001",
  "name": "OG Kush",
  "strain": "OG Kush",
  "thc": 20.5,
  "cbd": 1.0,
  "cbn": 0.5,
  "cbg": 0.2,
  "cbc": 0.1,
  "thcv": 0.3,
  "cbdv": 0.0
}
```

## Testing

Run the Jest test suite:

```bash
npm test
```

Generate coverage report:

```bash
npm test -- --coverage
```

## Building

Build TypeScript to JavaScript:

```bash
npm run build
```

Output files go to `dist/`:

- `dist/index.js` - CommonJS bundle
- `dist/index.d.ts` - TypeScript definitions
- `dist/models.js`, `dist/cannabinoids.js`, etc. - Individual modules

## Publishing to npm

```bash
npm version patch # or minor, major
npm run build
npm publish
```

## Usage in Power BI Visual

```typescript
import { CDESParser, CDESAnalyzer, getCannabioidColor } from "@cdes-world/sdk-typescript";

export class CannabinoidVisual implements IVisual {
  public update(options: VisualUpdateOptions) {
    // Parse Power BI data using SDK
    const parsed = CDESParser.parseDataView(
      options.dataViews[0].categorical
    );

    // Use cannabinoid utilities
    parsed.profiles.forEach((profile) => {
      profile.cannabinoids.forEach((percentage, name) => {
        const color = getCannabioidColor(name);
        // Render using color.hex, etc.
      });
    });
  }
}
```

## Contributing

Contributions welcome! Please:

1. Write tests for new features
2. Follow TypeScript best practices
3. Update README with API changes
4. Use conventional commit messages

## License

MIT - Acidni LLC

## Support

- GitHub Issues: [Acidni-LLC/cdes-sdk-typescript](https://github.com/Acidni-LLC/cdes-sdk-typescript/issues)
- Email: support@terprint.com

---

**Made by Acidni LLC for the cannabis data ecosystem** 🌿
