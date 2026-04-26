export const PRD_SECTIONS = [
  {
    title: "Document AI Overview",
    content: `Document AI is a Salesforce Data Cloud feature that uses Large Language Models (LLMs) to extract structured data from unstructured documents like PDFs, images, and scanned files.

Key Capabilities:
- Extract structured data from PDFs, images, and scanned documents
- Support for multiple document types: invoices, forms, contracts, medical records, resumes
- AI-powered field detection with confidence scores
- Visual schema builder with no-code configuration
- REST API for programmatic access
- Integration with Salesforce Flows, Apex, and Agentforce

Use Cases:
- Invoice and receipt processing
- Form data extraction
- Contract analysis and key term identification
- Medical records processing
- Resume and application screening
- Identity document verification`,
  },
  {
    title: "Supported LLM Models",
    content: `Document AI supports multiple state-of-the-art LLM models for document extraction, each with different strengths:

Supported Models:
- **Gemini 2.0 Flash** (llmgateway__VertexAIGemini20Flash001) - Recommended for PDFs, fast processing, good accuracy
- **Gemini 2.5 Flash** (llmgateway__VertexAIGemini25Flash) - Latest Gemini model with improved accuracy
- **GPT-4o** (llmgateway__OpenAIGPT4Omni_08_06) - Excellent for OCR, handwriting, and complex layouts
- **GPT-4.1** (llmgateway__OpenAIGPT41) - Recommended for Prompt Templates
- **Claude 3.7 Sonnet** (llmgateway__AnthropicClaude37Sonnet) - Strong reasoning for complex documents
- **Amazon Nova Pro** (llmgateway__AmazonNovaPro) - Cost-effective option
- **BYOLLM** - Bring your own LLM via Einstein Studio for custom models

Model Selection Guidelines:
- Use Gemini 2.0 Flash for standard PDFs and forms
- Use GPT-4o for handwritten documents or poor-quality scans
- Use Claude for documents requiring contextual understanding
- Test multiple models to find the best fit for your use case`,
  },
  {
    title: "Document AI REST API",
    content: `The Document AI REST API allows you to programmatically extract data from documents.

API Endpoint:
POST /services/data/v63.0/ssot/document-processing/actions/extract-data

Query Parameters:
- htmlEncode=false - Prevent HTML entity encoding in response
- extractDataWithConfidenceScore=true - Include confidence scores for each field

Request Headers:
- Authorization: Bearer <access_token>
- Content-Type: application/json

Request Body (Inline Schema):
{
  "documentInBase64": "<base64_encoded_document>",
  "mimeType": "application/pdf",
  "llmModelName": "llmgateway__VertexAIGemini20Flash001",
  "extractionSchemaInJson": {
    "fields": [
      {"name": "invoice_number", "type": "string", "description": "Invoice number"},
      {"name": "total_amount", "type": "number", "description": "Total invoice amount"}
    ]
  }
}

Request Body (Using IDP Configuration):
{
  "documentInBase64": "<base64_encoded_document>",
  "idpConfigurationIdOrName": "Invoice_Extraction_Config"
}

Response includes extracted data with confidence scores (0.0 to 1.0) for each field.`,
  },
  {
    title: "Authentication",
    content: `Document AI uses OAuth 2.0 for authentication. You must create an External Client App (not a Connected App) in Salesforce.

Setup Steps:
1. In Setup, search for "External Client Apps"
2. Click "New" to create an External Client App
3. Enter App Name and Description
4. Add callback URL (e.g., http://localhost:3000/auth/callback)
5. Select OAuth Scopes: api, refresh_token, offline_access
6. Enable PKCE (Proof Key for Code Exchange) for enhanced security
7. Save and note your Client ID

OAuth 2.0 Flow:
1. Authorization Request: Redirect user to Salesforce login with client_id, redirect_uri, and code_challenge
2. Authorization Code: Salesforce redirects back with authorization code
3. Token Exchange: Exchange code for access token using client_id, code, and code_verifier
4. API Calls: Include access token in Authorization header

PKCE Parameters:
- code_challenge: Base64 URL-encoded SHA-256 hash of code_verifier
- code_challenge_method: S256
- code_verifier: Cryptographically random string (43-128 characters)

Prerequisites:
- Einstein AI features must be enabled in your org
- Data Cloud must be provisioned
- User must have appropriate permissions`,
  },
  {
    title: "Schema Design Best Practices",
    content: `Effective schema design is crucial for accurate document extraction. Follow these best practices:

Schema Structure:
- Maximum 50 fields at root level
- Table extraction supports 1 level of nesting
- Use clear, descriptive field names
- Include detailed field descriptions to guide the LLM

Field Descriptions:
- Be specific: "Invoice number in format INV-YYYY-####" instead of "Invoice number"
- Include context: "Total amount including tax" vs "Total amount"
- Specify format: "Date in MM/DD/YYYY format"
- Mention location: "Patient name from header section"

Data Types:
- string: Text values (names, addresses, IDs)
- number: Numeric values (amounts, quantities, percentages)
- boolean: Yes/No or True/False values
- array: Lists of items (line items, medications, test results)
- object: Nested structures

Table Extraction:
- Define array fields for repeating data (invoice line items, prescriptions)
- Specify column names clearly in nested field definitions
- Include descriptions for each column
- Test with documents containing various table sizes

Tips for Accuracy:
- Start with fewer fields and add more iteratively
- Test with multiple sample documents
- Review confidence scores to identify problematic fields
- Refine field descriptions based on extraction results
- Use examples in descriptions when helpful`,
  },
  {
    title: "Confidence Scores",
    content: `Document AI returns confidence scores for each extracted field, indicating the LLM's certainty about the extraction accuracy.

Confidence Score Range: 0.0 to 1.0 (or 0% to 100%)

Interpretation Guidelines:
- **High (≥ 0.9 or 90%)**: Very reliable, safe for automated workflows
- **Medium (0.7 - 0.89 or 70-89%)**: Generally accurate, consider human review for critical fields
- **Low (< 0.7 or <70%)**: Requires review, may indicate unclear documents or schema issues

Enabling Confidence Scores:
Add query parameter to API request: ?extractDataWithConfidenceScore=true

Response Format:
{
  "extractedData": {
    "invoice_number": "INV-2026-001",
    "total_amount": 1234.56
  },
  "confidenceScores": {
    "invoice_number": 0.98,
    "total_amount": 0.85
  }
}

Best Practices:
- Set minimum confidence thresholds for automated processing
- Route low-confidence extractions to human review queues
- Monitor confidence trends to identify schema improvements
- Test with various document qualities to understand typical scores
- Use confidence scores to prioritize schema refinement efforts

Factors Affecting Confidence:
- Document quality (resolution, clarity, scan quality)
- Field description specificity in schema
- Document layout consistency
- LLM model selection
- Presence of expected data patterns`,
  },
  {
    title: "Supported File Types and Limits",
    content: `Document AI supports various file formats and has specific limitations you should be aware of.

Supported File Types:
- **PDF** (.pdf) - Portable Document Format, recommended for best results
- **PNG** (.png) - Portable Network Graphics
- **JPG/JPEG** (.jpg, .jpeg) - Joint Photographic Experts Group
- **TIFF** (.tiff, .tif) - Tagged Image File Format
- **BMP** (.bmp) - Bitmap Image File

Document Limits:
- Maximum 50 fields at root schema level
- Table extraction supports 1 level of nesting
- Recommended page limit: Up to 25 pages for optimal performance
- Large documents (50+ pages) may experience longer processing times
- File size limits depend on Salesforce API limits (typically up to 35MB base64 encoded)

Best Practices:
- Use PDF format when possible for best accuracy
- Ensure images have sufficient resolution (300 DPI recommended)
- For multi-page documents, ensure all pages are included in single file
- Compress images to reduce file size while maintaining readability
- Test with representative sample documents before production deployment

Image Quality Guidelines:
- Minimum resolution: 150 DPI
- Recommended resolution: 300 DPI or higher
- Ensure text is clearly readable
- Avoid excessive compression that creates artifacts
- Use high-contrast documents for better OCR results
- Straighten skewed or rotated documents before processing`,
  },
  {
    title: "Integration with Salesforce",
    content: `Document AI integrates seamlessly with Salesforce platform features for end-to-end document processing workflows.

Apex Integration:
- Use @InvocableMethod to create Apex actions callable from Flows
- Make HTTP callouts to Document AI REST API
- Parse JSON responses and create/update Salesforce records
- Handle errors and implement retry logic
- Use Named Credentials for authentication management

Flow Integration:
- Create Screen Flows with file upload components
- Call Apex actions to extract document data
- Display extraction results for user review
- Update records based on extracted data
- Implement approval workflows

Agentforce Integration:
- Create Agent Topics for document processing
- Define Actions that invoke Document AI extraction
- Configure autonomous processing rules
- Enable agents to extract, validate, and store document data
- Use Data Cloud connectors for batch processing

Data Cloud Integration:
- Set up Unstructured Data Lake Objects (UDLO)
- Connect Google Cloud Storage or AWS S3
- Configure batch document ingestion
- Map extracted data to Data Model Objects (DMOs)
- Use in Data Cloud segments and insights

Common Use Cases:
- Invoice approval workflows with automated data extraction
- Resume screening for recruiting processes
- Medical records processing in Healthcare Cloud
- Contract analysis and clause extraction
- Identity verification document processing`,
  },
  {
    title: "Error Handling and Troubleshooting",
    content: `Common errors when working with Document AI and how to resolve them.

Common HTTP Status Codes:
- **401 Unauthorized**: Access token expired or invalid. Refresh token and retry.
- **400 Bad Request**: Invalid request format. Check JSON schema, base64 encoding, and required fields.
- **403 Forbidden**: User lacks permissions. Verify Einstein AI and Data Cloud are enabled.
- **500 Internal Server Error**: Temporary service issue. Implement retry with exponential backoff.
- **504 Gateway Timeout**: Processing took too long. Consider splitting large documents.

Common Issues:

1. **HTML Entity Encoding in Response**
   Problem: Response contains &amp;, &lt;, etc.
   Solution: Add query parameter htmlEncode=false

2. **Missing Confidence Scores**
   Problem: Response doesn't include confidence scores
   Solution: Add query parameter extractDataWithConfidenceScore=true

3. **Low Extraction Accuracy**
   Solutions:
   - Improve field descriptions in schema
   - Try different LLM models
   - Ensure document quality is sufficient
   - Test with clearer sample documents

4. **Fields Not Extracted**
   Solutions:
   - Verify field exists in document
   - Improve field description specificity
   - Check if field name matches expected data
   - Review document quality and readability

5. **Authentication Fails**
   Solutions:
   - Use External Client App (not Connected App)
   - Verify Einstein AI features are enabled
   - Check OAuth scopes include api, refresh_token
   - Ensure PKCE is properly implemented

Debugging Tips:
- Start with simple schemas and add complexity iteratively
- Test with high-quality sample documents first
- Review confidence scores to identify problem fields
- Compare results across different LLM models
- Enable debug logging in your application`,
  },
  {
    title: "Getting Started",
    content: `Follow these steps to start using Document AI in your Salesforce org.

Prerequisites:
- Salesforce org with Data Cloud provisioned
- Einstein AI features enabled
- User with appropriate permissions
- Sample documents for testing

Setup Steps:

1. **Enable Einstein AI**
   - Go to Setup → Einstein Setup
   - Enable Einstein AI features
   - Review and accept terms

2. **Access Document AI**
   - Navigate to Data Cloud app
   - Click on Document AI tab
   - Or access via App Launcher → Document AI

3. **Create Configuration**
   - Click "New Configuration"
   - Enter configuration name and description
   - Define your extraction schema

4. **Define Schema**
   - Add fields with names, types, and descriptions
   - For tables, define array fields with nested structure
   - Keep descriptions specific and detailed

5. **Select LLM Model**
   - Choose model based on document type
   - Gemini 2.0 Flash for standard PDFs
   - GPT-4o for handwriting/OCR

6. **Test Extraction**
   - Upload sample document
   - Review extracted data
   - Check confidence scores
   - Refine schema as needed

7. **Activate Configuration**
   - Once testing is successful, activate the configuration
   - Use in production via API or Salesforce Flows

For API Integration:
- Create External Client App in Setup
- Implement OAuth 2.0 PKCE flow
- Make POST requests to extraction endpoint
- Handle responses and confidence scores`,
  },
  {
    title: "Use Cases and Examples",
    content: `Real-world use cases and implementation examples for Document AI.

Financial Services:
- Invoice processing: Extract vendor, amounts, line items, dates
- Bank statement analysis: Transaction history, account details
- Loan applications: Income verification, employment data, credit history
- Insurance claims: Policy numbers, claim amounts, incident details

Healthcare:
- Medical records: Patient demographics, diagnoses, medications
- Lab reports: Test results, reference ranges, abnormal flags
- Prescriptions: Medications, dosages, patient instructions
- Insurance forms: Coverage details, authorization numbers

Human Resources:
- Resume parsing: Skills, experience, education, certifications
- Employment applications: Contact info, work history, references
- Onboarding documents: I-9 forms, tax forms, benefits enrollment
- Performance reviews: Ratings, comments, goals

Legal:
- Contract analysis: Parties, terms, dates, obligations
- Legal briefs: Case numbers, citations, arguments
- Court documents: Filing dates, case details, judgments

Retail/Supply Chain:
- Purchase orders: Items, quantities, prices, delivery terms
- Packing slips: Shipment details, tracking numbers
- Receipts: Transaction details, payment methods
- Shipping labels: Addresses, package details

Example Schema (Invoice):
{
  "fields": [
    {"name": "invoice_number", "type": "string"},
    {"name": "date", "type": "string"},
    {"name": "total", "type": "number"},
    {"name": "line_items", "type": "array", "fields": [
      {"name": "description", "type": "string"},
      {"name": "quantity", "type": "number"},
      {"name": "unit_price", "type": "number"}
    ]}
  ]
}`,
  },
];

export function searchPRD(query: string): string[] {
  const lower = query.toLowerCase();
  const keywords = lower.split(/\s+/).filter((w) => w.length > 2);

  // Special case: if asking "what is document ai" or general overview questions
  if (
    (lower.includes("what is document ai") ||
     lower.includes("what is doc ai") ||
     (lower.includes("what") && lower.includes("document") && lower.includes("ai") && lower.includes("do"))) &&
    lower.split(" ").length < 15
  ) {
    const overview = PRD_SECTIONS.find(s => s.title === "Document AI Overview");
    if (overview) {
      return [`## ${overview.title}\n${overview.content}`];
    }
  }

  const scored = PRD_SECTIONS.map((section) => {
    const text = (section.title + " " + section.content).toLowerCase();
    let score = 0;

    // Boost score for title matches
    if (lower.includes(section.title.toLowerCase())) score += 20;

    // Boost score for overview section on general questions
    if (section.title === "Document AI Overview" &&
        (lower.includes("what is") || lower.includes("overview") || lower.includes("about"))) {
      score += 15;
    }

    // Score based on keyword matches
    for (const kw of keywords) {
      // Skip common words that don't add value
      if (["what", "how", "can", "the", "and", "for"].includes(kw)) continue;

      const regex = new RegExp(`\\b${kw}`, "gi");
      const matches = text.match(regex);
      if (matches) score += matches.length * 2;
    }

    return { section, score };
  });

  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 4)
    .map((s) => `## ${s.section.title}\n${s.section.content}`);
}
