export const PRD_SECTIONS = [
  {
    title: "Executive Summary",
    content: `Document AI - Feature Proposal Package, 262 Release Enhancement.
This proposal introduces three strategic enhancements to Document AI that address critical customer blockers, reduce friction, and improve product stability. These features build upon existing 262 commitments and directly support the goal of scaling from 22 to 100+ production tenants.

Proposal Impact:
- Unblocks 8+ named enterprise customers (Aviva, Astra Zeneca, Zurich, Health Cloud, etc.)
- Reduces customer processing costs by 30-50% through intelligent controls
- Accelerates time-to-production by enabling safer configuration iteration
- Improves trust and accuracy validation through visual feedback

The three features are:
1. Smart Page Processing Controls (Deal Breaker Extension)
2. Configuration Lifecycle Management with Versioning (Hygiene Enhancement)
3. Enhanced Visual Citations with Confidence Overlay (UX/Hygiene)`,
  },
  {
    title: "Feature 1: Smart Page Processing Controls",
    content: `Category: Functional | Priority: Deal Breaker Extension.
Related PRD Feature: Sparse/Long Document Handling.

Problem Statement:
Current Document AI processes entire documents without customer control, creating three critical challenges:
1. Cost Uncertainty: Customers processing 40-50+ page documents (loan applications, medical records, contracts) cannot control AI processing costs
2. Performance Issues: Processing irrelevant pages wastes resources
3. Context Window Limitations: Large documents exceed LLM context windows

Blocked Customers: Aviva, Astra Zeneca, IQ Commercial Mortgage, Holchim, Tata AIG, Liberty Finance

Key Capabilities:
- Configurable Page Limits: Set maximum pages per document at Org or Configuration level (default: 50, max: 100)
- Intelligent Page Selection Strategies: First N Pages, Last N Pages, First & Last Pages, Custom Page Ranges, Smart Sampling (Future 264)
- LLM Context Window Configuration: Small (4K), Medium (16K), Large (32K), Extra Large (128K tokens)
- Processing Cost Dashboard: Analytics for token usage, page count, and cost projection

Success Metrics:
- 30-50% reduction in processing costs for customers with 20+ page documents
- 60%+ of customers configure custom page limits within 30 days
- <5% accuracy degradation vs. full document processing
- 40%+ reduction in average processing time for large documents`,
  },
  {
    title: "Page Processing API Changes",
    content: `Request Enhancement for page processing:
{
  "documentId": "abc123",
  "schemaId": "schema_loan_app",
  "pageConfig": {
    "maxPages": 30,
    "strategy": "FIRST_LAST",
    "firstPages": 5,
    "lastPages": 2,
    "contextWindow": "LARGE_32K"
  }
}

Response Enhancement:
{
  "status": "SUCCESS",
  "extractedData": {...},
  "processingMetadata": {
    "totalPages": 52,
    "pagesProcessed": 7,
    "pageRanges": ["1-5", "51-52"],
    "tokensUsed": 28500,
    "contextWindow": "LARGE_32K",
    "warnings": ["Document exceeds page limit."]
  }
}

When document exceeds limit: Process first N pages + return warning in API response.
Confidence scores adjusted based on partial processing.`,
  },
  {
    title: "Page Selection Strategies",
    content: `Five page selection strategies:
1. First N Pages (default): Process pages 1 through N. Use case: Invoices, forms with standardized layouts.
2. Last N Pages: Process final N pages. Use case: Signature pages, appendices.
3. First & Last Pages: Process first X + last Y pages. Example: First 5 + Last 2 pages. Use case: Contracts (header info + signature pages).
4. Custom Page Ranges: Specify exact pages like "1-5, 10-12, 45-50". Use case: Known document structures.
5. Smart Sampling (Future - 264): AI-driven relevant page detection. Samples pages based on schema requirements. Use case: Sparse documents with unknown key data locations.

LLM Context Window sizes:
- Small (4K tokens): Fast, low-cost, suitable for 1-3 page documents
- Medium (16K tokens): Balanced, suitable for 5-15 page documents
- Large (32K tokens): Comprehensive, suitable for 15-30 page documents
- Extra Large (128K tokens): Maximum accuracy, suitable for 30-50+ page documents`,
  },
  {
    title: "Feature 2: Configuration Lifecycle Management with Versioning",
    content: `Category: UX/Functional | Priority: Hygiene Enhancement.
Related PRD Features: Draft State Support, Collaborative Config Management.

Problem Statement:
1. No Version Control: Configurations cannot be tracked across iterations. No rollback capability.
2. Lost Configuration History: Teams cannot understand what changed between configurations.
3. Collaboration Friction: No native versioning to track iterations.
4. Risk of Breaking Changes: Customers fear publishing changes without ability to revert.

Blocked Customers: Zurich (Deal Breaker), CMS-Medicare, and all customers in iterative testing phases.

Key Capabilities:
- Schema Versioning: Every "Save & Publish" creates immutable, sequentially numbered version (v1, v2, v3).
- Version Metadata: version number, timestamp, created by user, change notes, full schema snapshot, test results.
- Version States: Draft (editable), Active (in production, one at a time), Archived (previous versions).
- Rollback Capability: Select archived version to create new active version. Maintains complete audit trail.
- Version Comparison: Side-by-side diff showing fields added/removed/modified, prompt changes, metadata changes.

Limits: Maximum 50 versions per configuration. Active and last 10 versions cannot be purged.

Success Metrics:
- 70%+ of active configurations have 3+ versions
- 15-20% of configurations use rollback at least once
- 40% reduction in time-to-production for collaborative configurations
- 80%+ feel confident making changes with rollback safety net`,
  },
  {
    title: "Versioning API Changes",
    content: `Get Configuration (Enhanced):
GET /api/docai/config/{configId}?version=5
Returns config with version number, state, createdAt, createdBy, notes, totalVersions, and schema.

Version History Endpoint (New):
GET /api/docai/config/{configId}/versions
Returns list of all versions with number, state, createdAt, createdBy, and notes.

Rollback Endpoint (New):
POST /api/docai/config/{configId}/rollback
Request: { "targetVersion": 3, "notes": "Rolling back due to accuracy regression" }
Response: { "configId": "cfg_123", "newVersion": 6, "rolledBackFrom": 5, "rolledBackTo": 3, "state": "ACTIVE" }

Rollback creates a NEW version (not true revert). Maintains complete audit trail. Previous active version moves to archived state. All versions preserved (no data loss).

Integration with Draft State: Draft -> Publish creates Version 1. Subsequent Draft -> Publish creates Version 2, 3, etc.
Integration with JSON Export/Import: Export includes version number in filename. Import as new configuration starts at v1.`,
  },
  {
    title: "Feature 3: Enhanced Visual Citations with Confidence Overlay",
    content: `Category: UX | Priority: Hygiene (Promoted from Good to Have).
Related PRD Features: Visual Citation/Bounding Boxes, Confidence Score UI Display.

Problem Statement:
1. Trust Gap: Cannot verify extraction accuracy without manually searching documents.
2. No Confidence Context: Confidence scores exist in API but not in UI with spatial context.
3. Debugging Friction: Users cannot see what the AI "saw" or why it failed.
4. Training Overhead: New users don't understand how prompts relate to document structure.

Blocked/Requesting Customers: Health Cloud (explicitly requested), applies to all customers.

Key Capabilities:
- Interactive Bounding Boxes: Click extracted field to highlight corresponding region in document preview. Color-coded border based on confidence (green >0.9, yellow 0.7-0.9, red <0.7).
- Confidence Score Visualization: Badge Mode (percentage next to each value), Heat Map Mode (document overlay), Field-Level Warnings (auto-warning for <70% confidence).
- Annotated Document Export: Export test results as annotated PDF with bounding boxes, field labels, values, and confidence scores.
- Debugging: Extraction Timeline View, Failed Extraction Analysis with suggestions.
- Confidence Threshold: Per-schema minimum confidence threshold setting (default 70%).

Success Metrics:
- 80%+ of test runs use bounding box visualization
- 25% reduction in iterations needed to reach production
- 30% reduction in "extraction not working" support tickets
- 90%+ rate visual citations as helpful or very helpful`,
  },
  {
    title: "Visual Citations API Changes",
    content: `Get Extraction Results with Bounding Boxes (Enhanced):
GET /api/docai/extract/{extractionId}?includeBoundingBoxes=true
Returns fields with name, value, confidence, and boundingBox (page, coordinates x/y/width/height, vertices).
Also returns overallConfidence and warnings for low confidence fields.

Export Annotated Document (New):
POST /api/docai/extract/{extractionId}/export
Request: { "format": "PDF", "includeBoundingBoxes": true, "includeConfidenceScores": true, "includeFieldLabels": true }
Response: { "exportId": "exp_456", "downloadUrl": "https://...", "expiresAt": "..." }`,
  },
  {
    title: "Cross-Feature Integration",
    content: `The three features work together synergistically:

1. Cost Optimization + Versioning: Version comparison shows token usage changes. Customers can test different page strategies and version the best one. Cost dashboard links to configuration versions.

2. Versioning + Visual Citations: Version comparison includes confidence score changes. Track accuracy improvements across versions using bounding box feedback. Annotated exports can be attached to version notes.

3. Page Controls + Visual Citations: Bounding boxes show which pages were processed vs. skipped. Confidence scores validate if page selection strategy is optimal. Export annotated documents showing page range decisions.`,
  },
  {
    title: "Implementation Timeline & Resources",
    content: `Phase 1: 262 Release (Core Features)
Feature 1 (Smart Page Processing): 18 eng-weeks (3 backend + 2 frontend engineers)
Feature 2 (Configuration Versioning): 14 eng-weeks (2 backend + 2 frontend engineers)
Feature 3 (Visual Citations): 14 eng-weeks (1 backend + 3 frontend engineers)
Phase 1 Total: 46 eng-weeks (~11.5 weeks with 4 engineers parallelized)

Phase 2: 264 Release (Advanced Features) - Estimated 25 eng-weeks
- Smart page sampling (AI-driven)
- Advanced version comparison and analytics
- Heat maps and extraction timeline

Phase 1 deliverables:
- Feature 1: Org/config-level page limits, First N/Last N/First&Last strategies, basic cost dashboard
- Feature 2: Version creation on publish, version history view, rollback, basic comparison, JSON export with version info
- Feature 3: Bounding box visualization, confidence score badges/colors, basic annotated PDF export, confidence threshold warnings`,
  },
  {
    title: "Risk Assessment",
    content: `Technical Risks:
1. Page Selection May Reduce Accuracy - Mitigation: Extensive testing, configurable defaults, warnings when data likely missed
2. Version Storage Growth - Mitigation: 50-version limit, admin purge, lightweight JSON storage
3. Bounding Box Performance on Large Docs - Mitigation: Lazy loading, render only visible pages, optional toggle

Business Risks:
1. Customers Set Page Limits Too Low - Mitigation: Smart defaults, warnings, recommendations based on test runs
2. Version Rollback Creates Data Inconsistency - Mitigation: Rollback only affects future processing, clear warnings, audit trails
3. Feature Complexity Overwhelms Low-Code Users - Mitigation: Sensible defaults, progressive disclosure, guided setup flows`,
  },
  {
    title: "Customer Validation & Beta Program",
    content: `Recommended Beta Customers:
Feature 1 (Page Controls): Primary - Aviva, Astra Zeneca. Secondary - Liberty Finance, Tata AIG.
Feature 2 (Versioning): Primary - Zurich, CMS-Medicare. Secondary - All iterative testing customers.
Feature 3 (Visual Citations): Primary - Health Cloud. Secondary - Zurich, Novartis.

Beta Success Criteria:
- 90%+ of beta customers successfully configure features without support
- 80%+ report features meet or exceed expectations
- <5 critical bugs identified
- Feature adoption rate >60% within beta period`,
  },
  {
    title: "Competitive Analysis",
    content: `AWS Textract: Has bounding boxes and confidence scores. Missing page selection strategies and versioning. Our advantage: Superior configuration management.

Google Document AI: Has bounding boxes and page limits. Missing version control and rollback. Our advantage: Better collaboration and iteration support.

Microsoft Azure Form Recognizer: Has confidence scores and model versioning. Missing visual UI for citations and flexible page strategies. Our advantage: No-code experience, visual debugging.

Salesforce Differentiators: Native integration with Salesforce platform, collaborative configuration management, visual low-code experience, version control with rollback safety.`,
  },
  {
    title: "Document AI General Knowledge",
    content: `Document AI is a Salesforce Data Cloud feature that uses LLMs to extract structured data from unstructured documents (PDFs, images, scanned files).

Core API endpoint: POST /services/data/v63.0/ssot/document-processing/actions/extract-data
Supports: PDF, PNG, JPG, JPEG, TIFF, BMP files.
Max 50 fields extractable per document schema at root DLO level.
Table extraction supports one level of nesting.

Supported LLM Models: Gemini 2.0 Flash (recommended for PDFs), Gemini 2.5 Flash, GPT-4o (supports OCR), GPT-4.1 (recommended for Prompt Templates), Claude variants, Amazon Nova, NVIDIA Nemotron, BYOLLM via Einstein Studio.

Three processing modalities: API (real-time/transactional), Batch (via UDLO from AWS S3 or GCS), and RAG with Agentforce.

Authentication: OAuth 2.0 via External Client App (not Connected App). Requires Einstein AI features enabled in the org.

Current GA features: Visual Schema Builder UI, AI-powered field detection, built-in testing, simplified 2-parameter API payload with idpConfigurationIdOrName.

Known limitations: PDFs >250 pages not feasible for transactional calls (async endpoint planned for release 264). LLM non-determinism acknowledged as known issue.`,
  },
];

export function searchPRD(query: string): string[] {
  const lower = query.toLowerCase();
  const keywords = lower.split(/\s+/).filter((w) => w.length > 2);

  const scored = PRD_SECTIONS.map((section) => {
    const text = (section.title + " " + section.content).toLowerCase();
    let score = 0;
    for (const kw of keywords) {
      const regex = new RegExp(kw, "g");
      const matches = text.match(regex);
      if (matches) score += matches.length;
    }
    if (lower.includes(section.title.toLowerCase())) score += 10;
    return { section, score };
  });

  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 4)
    .map((s) => `## ${s.section.title}\n${s.section.content}`);
}
