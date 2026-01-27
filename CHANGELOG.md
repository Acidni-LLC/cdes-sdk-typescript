# CDES TypeScript SDK - Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.1] - 2026-01-27

### Fixed

- Removed UTF-8 BOM from package files that was breaking webpack builds

## [1.1.0] - 2026-01-27

### Added

- First public release to npm
- All terpene and cannabinoid data, colors, and utilities

## [1.0.0] - 2026-01-27

### Added

- Initial release of CDES TypeScript SDK
- **CDESParser** - Parse cannabis data from multiple formats:
  - Power BI DataView (categorical data)
  - Standard format (Batch | Cannabinoid | Percentage)
  - CDES format (Batch | THC | CBD | CBN | CBG | ... measures)
  - JSON batch objects and arrays
- **CDESAnalyzer** - Comprehensive analysis utilities:
  - `compareProfiles()` - Compare two cannabinoid profiles with similarity scoring
  - `findSimilarProfiles()` - Find similar profiles from a collection
  - `classifyStrain()` - Classify strain type (THC-Dominant, CBD-Dominant, Balanced)
  - `scoreProfileCompleteness()` - Rate profile quality and coverage
  - `scoreFlavorProfile()` - Calculate complexity and flavor profile
  - `profileToBatch()` - Convert profile to Batch object
- **Cannabinoid Utilities**:
  - `STANDARD_CANNABINOIDS` - Standard color palette (9 cannabinoids)
  - `getCannabioidColor()` - Get color and therapeutic info
  - `normalizeCannabioidName()` - Normalize cannabinoid names
  - `calculateEuclideanDistance()` - Distance-based similarity
  - `findSimilarProfiles()` - Find similar profiles by threshold
  - `getCannabioidCategory()` - Categorize cannabinoid levels
  - `formatCannabioidValue()` - Format for display
  - `calculateTotalCannabinoids()` - Sum total percentage
- **Data Models** - TypeScript interfaces:
  - `Cannabinoid` - Individual cannabinoid compound
  - `Terpene` - Individual terpene compound
  - `Batch` - Batch information
  - `LabResult` - Lab test results (COA)
  - `CannabinoidProfile` - Parsed cannabinoid profile
  - `TerpeneProfile` - Terpene profile (future)
  - `PowerBICategoricalData` - Power BI data structure
  - `CDESParsedData` - Parser result
- **Testing** - Jest test suite with 15+ test cases covering:
  - Cannabinoid utilities
  - Standard format parsing
  - CDES format parsing
  - JSON batch parsing
  - Profile comparison
  - Profile similarity
  - Strain classification
  - Distance calculations
- **Documentation**:
  - Comprehensive README with examples
  - API reference for all public methods
  - Data format specifications
  - Installation and usage guides
  - Contributing guidelines
- **Build Configuration**:
  - `package.json` with npm metadata and scripts
  - `tsconfig.json` with strict TypeScript settings
  - ESLint configuration for code quality
  - Jest configuration for testing

### Features

- ✅ Multi-format data parsing (Power BI, standard, CDES, JSON)
- ✅ Cannabinoid color palette with therapeutic information
- ✅ Similarity scoring and batch comparison
- ✅ Strain classification (THC/CBD content, ratios)
- ✅ Profile quality assessment
- ✅ Type-safe TypeScript with strict mode
- ✅ Zero external runtime dependencies
- ✅ Comprehensive test coverage
- ✅ npm-ready package structure
- ✅ Detailed documentation and examples

### Technical Details

- **Language**: TypeScript 5.3+
- **Target**: ES2020
- **Module**: CommonJS
- **License**: MIT
- **Author**: Acidni LLC

---

## Planned Features (Future Releases)

### v1.1.0

- Terpene parsing and analysis (similar to cannabinoids)
- Terpene-cannabinoid interaction profiles
- Power BI specific helpers (cross-filtering, bookmarks)
- Extended strain classification (Landrace, Hybrid, Sativa, Indica)

### v1.2.0

- Marketplace integration helpers
- Dispensary metadata handling
- Pricing analysis utilities
- Regulatory compliance checking (Metrc format)

### v2.0.0

- Browser/Node.js isomorphic support
- React hooks for Power BI integration
- GraphQL schema generation
- Event streaming support

---

## Migration Guides

None yet - this is the initial release.

---

## Support

For issues, questions, or feature requests:
- GitHub: https://github.com/Acidni-LLC/cdes-sdk-typescript
- Email: support@terprint.com
