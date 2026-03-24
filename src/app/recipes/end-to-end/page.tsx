import RecipeLayout from "@/components/RecipeLayout";
import StepCard from "@/components/StepCard";
import CodeBlock from "@/components/CodeBlock";
import InfoBox from "@/components/InfoBox";

export const metadata = {
  title: "Recipe 3: End-to-End Integration - Document AI Lab",
};

export default function EndToEndRecipe() {
  return (
    <RecipeLayout
      title="End-to-End: Apex, Flows & Agentforce"
      description="Build a complete document processing pipeline for Medico Pharma with custom objects, an invocable Apex class, a Screen Flow for guided extraction, and an Agentforce agent for autonomous document processing."
      difficulty="Advanced"
      duration="90 min"
      prerequisites={[
        "Completed Recipe 1 and 2",
        "Familiarity with Apex, Flows, and Salesforce development",
        "A Salesforce org with Agentforce enabled (for the agent portion)",
        "Medico Document AI configuration active (from Recipe 1)",
      ]}
      prevRecipe={{ label: "API with Postman", href: "/recipes/api-postman" }}
    >
      <h2>What You Will Build</h2>
      <p>
        This recipe ties everything together into a production-ready pipeline for Medico Pharma:
      </p>
      <ol>
        <li><strong>Custom Objects</strong> to store extracted invoice data</li>
        <li><strong>Apex Class</strong> that calls the Document AI API as an invocable action</li>
        <li><strong>Screen Flow</strong> that guides users through uploading and reviewing extractions</li>
        <li><strong>Agentforce Agent</strong> that autonomously processes incoming documents</li>
      </ol>

      <InfoBox type="info" title="Architecture">
        <p>
          <strong>User uploads document</strong> &rarr; <strong>Screen Flow</strong> captures the file &rarr;
          <strong>Apex calls Document AI API</strong> &rarr; <strong>Extracted data populates custom objects</strong> &rarr;
          <strong>User reviews &amp; approves</strong>. Alternatively, <strong>Agentforce</strong> can process
          documents autonomously when triggered by a platform event.
        </p>
      </InfoBox>

      <h2>Part 1: Custom Objects</h2>

      <StepCard step={1} title="Create the Medico Invoice Object">
        <p>
          Create a custom object to store extracted invoice data. Go to <strong>Setup</strong> &gt;
          <strong> Object Manager</strong> &gt; <strong>Create</strong> &gt; <strong>Custom Object</strong>:
        </p>
        <CodeBlock
          language="plaintext"
          filename="Medico_Invoice__c"
          code={`Object: Medico_Invoice__c
Label: Medico Invoice
Plural Label: Medico Invoices

Custom Fields:
  Invoice_Number__c          Text(50)        "Unique invoice identifier"
  Invoice_Date__c            Date            "Date invoice was issued"
  Due_Date__c                Date            "Payment due date"
  PO_Number__c               Text(50)        "Associated purchase order number"
  Vendor_Name__c             Text(255)       "Vendor/seller name"
  Bill_To__c                 Text(255)       "Billing recipient"
  Subtotal__c                Currency(16,2)  "Subtotal before tax"
  Tax_Amount__c              Currency(16,2)  "Tax amount"
  Total_Due__c               Currency(16,2)  "Total amount due"
  Processing_Status__c       Picklist        Values: Pending, Extracted, Reviewed, Approved
  Confidence_Score__c        Percent(3,0)    "Average extraction confidence"
  Source_Document_Id__c      Text(18)        "ContentDocument ID of source file"
  Raw_Extraction_JSON__c     Long Text Area  "Full JSON response from Document AI"`}
        />
      </StepCard>

      <StepCard step={2} title="Create the Invoice Line Item Object">
        <CodeBlock
          language="plaintext"
          filename="Medico_Invoice_Line__c"
          code={`Object: Medico_Invoice_Line__c
Label: Medico Invoice Line
Plural Label: Medico Invoice Lines

Custom Fields:
  Medico_Invoice__c          Master-Detail(Medico_Invoice__c)
  Description__c             Text(255)       "Product or service description"
  NDC_Code__c                Text(20)        "National Drug Code"
  Quantity__c                Number(10,0)    "Quantity ordered"
  Unit_Price__c              Currency(16,2)  "Price per unit"
  Line_Amount__c             Currency(16,2)  "Line total"`}
        />
      </StepCard>

      <h2>Part 2: Apex Class</h2>

      <StepCard step={3} title="Create the Document AI Apex Service">
        <p>
          This Apex class calls the Document AI API and can be invoked from Flows, Agents, or other Apex.
          It uses <strong>Named Credentials</strong> or direct auth for the API call.
        </p>
        <CodeBlock
          language="java"
          filename="DocumentAIService.cls"
          code={`public class DocumentAIService {

    @InvocableMethod(
        label='Extract Document Data'
        description='Calls Document AI to extract structured data from a document'
        category='Document AI'
    )
    public static List<ExtractionResult> extractData(List<ExtractionRequest> requests) {
        List<ExtractionResult> results = new List<ExtractionResult>();

        for (ExtractionRequest req : requests) {
            try {
                ExtractionResult result = processDocument(req);
                results.add(result);
            } catch (Exception e) {
                ExtractionResult errorResult = new ExtractionResult();
                errorResult.success = false;
                errorResult.errorMessage = e.getMessage();
                results.add(errorResult);
            }
        }

        return results;
    }

    private static ExtractionResult processDocument(ExtractionRequest req) {
        ContentVersion cv = [
            SELECT VersionData, FileType, ContentDocumentId, Title
            FROM ContentVersion
            WHERE ContentDocumentId = :req.contentDocumentId
            AND IsLatest = true
            LIMIT 1
        ];

        String base64Data = EncodingUtil.base64Encode(cv.VersionData);
        String mimeType = getMimeType(cv.FileType);

        String endpoint = URL.getOrgDomainURL().toExternalForm()
            + '/services/data/v63.0/ssot/document-processing/actions/extract-data'
            + '?htmlEncode=false&extractDataWithConfidenceScore=true';

        Map<String, Object> payload = new Map<String, Object>();

        if (String.isNotBlank(req.idpConfigName)) {
            payload.put('idpConfigurationIdOrName', req.idpConfigName);
        } else {
            payload.put('mlModel', 'llmgateway__VertexAIGemini20Flash001');
            payload.put('schemaConfig', req.schemaJson);
        }

        List<Map<String, String>> files = new List<Map<String, String>>();
        files.add(new Map<String, String>{
            'mimeType' => mimeType,
            'data' => base64Data
        });
        payload.put('files', files);

        HttpRequest httpReq = new HttpRequest();
        httpReq.setEndpoint(endpoint);
        httpReq.setMethod('POST');
        httpReq.setHeader('Content-Type', 'application/json');
        httpReq.setHeader('Authorization', 'Bearer ' + UserInfo.getSessionId());
        httpReq.setBody(JSON.serialize(payload));
        httpReq.setTimeout(120000);

        Http http = new Http();
        HttpResponse res = http.send(httpReq);

        ExtractionResult result = new ExtractionResult();

        if (res.getStatusCode() == 200) {
            result.success = true;
            result.rawJson = res.getBody();
            result.contentDocumentId = req.contentDocumentId;
            parseAndStore(result, req);
        } else {
            result.success = false;
            result.errorMessage = 'API returned ' + res.getStatusCode() + ': ' + res.getBody();
        }

        return result;
    }

    private static void parseAndStore(ExtractionResult result, ExtractionRequest req) {
        Map<String, Object> response = (Map<String, Object>) JSON.deserializeUntyped(result.rawJson);
        List<Object> dataList = (List<Object>) response.get('data');

        if (dataList == null || dataList.isEmpty()) return;

        Map<String, Object> firstResult = (Map<String, Object>) dataList[0];
        Map<String, Object> extracted = (Map<String, Object>) firstResult.get('extractedValues');

        Medico_Invoice__c invoice = new Medico_Invoice__c();
        invoice.Source_Document_Id__c = req.contentDocumentId;
        invoice.Processing_Status__c = 'Extracted';
        invoice.Raw_Extraction_JSON__c = result.rawJson;

        Decimal totalConfidence = 0;
        Integer fieldCount = 0;

        for (String field : extracted.keySet()) {
            Map<String, Object> fieldData = (Map<String, Object>) extracted.get(field);
            Object value = fieldData.get('value');
            Decimal confidence = fieldData.containsKey('confidenceScore')
                ? (Decimal) fieldData.get('confidenceScore') : 0;
            totalConfidence += confidence;
            fieldCount++;

            if (field == 'invoice_number') invoice.Invoice_Number__c = String.valueOf(value);
            else if (field == 'vendor_name') invoice.Vendor_Name__c = String.valueOf(value);
            else if (field == 'bill_to_name') invoice.Bill_To__c = String.valueOf(value);
            else if (field == 'po_number') invoice.PO_Number__c = String.valueOf(value);
            else if (field == 'total_due') invoice.Total_Due__c = value instanceof Decimal
                ? (Decimal) value : Decimal.valueOf(String.valueOf(value));
            else if (field == 'subtotal') invoice.Subtotal__c = value instanceof Decimal
                ? (Decimal) value : Decimal.valueOf(String.valueOf(value));
            else if (field == 'tax_amount') invoice.Tax_Amount__c = value instanceof Decimal
                ? (Decimal) value : Decimal.valueOf(String.valueOf(value));
        }

        if (fieldCount > 0) {
            invoice.Confidence_Score__c = (totalConfidence / fieldCount) * 100;
        }

        insert invoice;
        result.invoiceId = invoice.Id;

        Object lineItemsObj = extracted.get('line_items');
        if (lineItemsObj != null) {
            Map<String, Object> lineItemsField = (Map<String, Object>) lineItemsObj;
            List<Object> lineItems = (List<Object>) lineItemsField.get('value');

            if (lineItems != null) {
                List<Medico_Invoice_Line__c> lines = new List<Medico_Invoice_Line__c>();
                for (Object li : lineItems) {
                    Map<String, Object> item = (Map<String, Object>) li;
                    Medico_Invoice_Line__c line = new Medico_Invoice_Line__c();
                    line.Medico_Invoice__c = invoice.Id;
                    line.Description__c = String.valueOf(item.get('description'));
                    line.NDC_Code__c = String.valueOf(item.get('ndc_code'));
                    line.Quantity__c = item.get('quantity') != null
                        ? Decimal.valueOf(String.valueOf(item.get('quantity'))) : 0;
                    line.Unit_Price__c = item.get('unit_price') != null
                        ? Decimal.valueOf(String.valueOf(item.get('unit_price'))) : 0;
                    line.Line_Amount__c = item.get('amount') != null
                        ? Decimal.valueOf(String.valueOf(item.get('amount'))) : 0;
                    lines.add(line);
                }
                insert lines;
            }
        }
    }

    private static String getMimeType(String fileType) {
        Map<String, String> mimeTypes = new Map<String, String>{
            'PDF' => 'application/pdf',
            'PNG' => 'image/png',
            'JPG' => 'image/jpeg',
            'JPEG' => 'image/jpeg',
            'TIFF' => 'image/tiff',
            'BMP' => 'image/bmp'
        };
        return mimeTypes.containsKey(fileType.toUpperCase())
            ? mimeTypes.get(fileType.toUpperCase())
            : 'application/pdf';
    }

    public class ExtractionRequest {
        @InvocableVariable(label='Content Document ID' required=true)
        public String contentDocumentId;

        @InvocableVariable(label='IDP Configuration Name')
        public String idpConfigName;

        @InvocableVariable(label='Schema JSON (if no IDP config)')
        public String schemaJson;
    }

    public class ExtractionResult {
        @InvocableVariable(label='Success')
        public Boolean success;

        @InvocableVariable(label='Raw JSON Response')
        public String rawJson;

        @InvocableVariable(label='Error Message')
        public String errorMessage;

        @InvocableVariable(label='Created Invoice ID')
        public String invoiceId;

        @InvocableVariable(label='Content Document ID')
        public String contentDocumentId;
    }
}`}
        />
        <InfoBox type="tip" title="Remote Site Setting">
          Remember to add your org&apos;s domain as a <strong>Remote Site Setting</strong> in Setup
          so that Apex can make HTTP callouts to the Document AI endpoint. Alternatively, use a Named Credential.
        </InfoBox>
      </StepCard>

      <h2>Part 3: Screen Flow</h2>

      <StepCard step={4} title="Build the Invoice Processing Flow">
        <p>
          Create a Screen Flow that guides Medico users through the extraction process.
          Go to <strong>Setup</strong> &gt; <strong>Flows</strong> &gt; <strong>New Flow</strong> &gt;
          <strong> Screen Flow</strong>.
        </p>
        <p>The flow has these elements:</p>
        <ol>
          <li>
            <strong>Screen 1 &mdash; Upload Document:</strong> A file upload component where the user
            selects a Medico invoice PDF or image. Use a <code>File Upload</code> screen component.
          </li>
          <li>
            <strong>Get Records:</strong> Query the <code>ContentDocument</code> for the uploaded file
            to get the <code>ContentDocumentId</code>.
          </li>
          <li>
            <strong>Apex Action:</strong> Invoke <code>DocumentAIService.extractData</code> passing
            the <code>ContentDocumentId</code> and <code>idpConfigName</code> = <code>Medico_Invoice_Extractor</code>.
          </li>
          <li>
            <strong>Decision:</strong> Check if <code>success</code> is <code>true</code>.
          </li>
          <li>
            <strong>Screen 2 &mdash; Review Results:</strong> Display the extracted fields (invoice number,
            vendor, total, line items) with confidence indicators. Use display text components with
            conditional formatting.
          </li>
          <li>
            <strong>Screen 3 &mdash; Approve/Edit:</strong> Allow the user to edit any fields that had
            low confidence scores before final approval.
          </li>
          <li>
            <strong>Update Records:</strong> Update the <code>Medico_Invoice__c</code> record with
            <code>Processing_Status__c = &apos;Approved&apos;</code>.
          </li>
        </ol>
      </StepCard>

      <StepCard step={5} title="Flow Configuration Details">
        <p><strong>Flow Variables:</strong></p>
        <CodeBlock
          language="plaintext"
          filename="flow-variables.txt"
          code={`Variables:
  varContentDocumentId     Text        Input/Output
  varIdpConfigName         Text        Default: "Medico_Invoice_Extractor"
  varExtractionResult      Apex-Defined (ExtractionResult)
  varInvoiceId             Text
  varSuccess               Boolean

Screen 1 - Upload:
  Component: File Upload
    -> Stores to: varContentDocumentId

Apex Action:
  Action: DocumentAIService.extractData
  Input:
    contentDocumentId = {!varContentDocumentId}
    idpConfigName     = {!varIdpConfigName}
  Output:
    success   -> {!varSuccess}
    invoiceId -> {!varInvoiceId}
    rawJson   -> (for display)

Decision: Check {!varSuccess}
  If TRUE  -> Screen 2 (Review)
  If FALSE -> Error Screen

Screen 2 - Review:
  Get Records: Medico_Invoice__c WHERE Id = {!varInvoiceId}
  Display: Invoice fields with confidence badges
  Get Records: Medico_Invoice_Line__c WHERE Medico_Invoice__c = {!varInvoiceId}
  Display: Line items data table

Screen 3 - Approve:
  Input fields for editable corrections
  Approve button

Update Records:
  Medico_Invoice__c.Processing_Status__c = "Approved"`}
        />
      </StepCard>

      <h2>Part 4: Agentforce Integration</h2>

      <StepCard step={6} title="Create an Agent Topic for Document Processing">
        <p>
          In <strong>Setup</strong> &gt; <strong>Agents</strong> &gt; select your agent &gt;
          <strong> Topics</strong>:
        </p>
        <CodeBlock
          language="plaintext"
          filename="agent-topic.txt"
          code={`Topic: Medico Invoice Processing
Description: Handle Medico Pharmaceuticals invoice document processing, extraction, and review

Instructions:
  When a user asks to process an invoice or document:
  1. Ask for the ContentDocument ID or have them upload the file
  2. Call the Document AI extraction action with the Medico_Invoice_Extractor config
  3. Present the extracted data to the user with confidence scores
  4. Ask the user to confirm or correct any low-confidence fields
  5. Update the invoice record status to Approved

Classification:
  Scope: "Process invoice", "Extract document data", "Review extraction",
         "Medico invoice", "pharmaceutical invoice"

Guardrails:
  - Only process documents that are invoices, prescriptions, or purchase orders
  - Flag any invoice over $50,000 for additional review
  - Always show confidence scores to the user`}
        />
      </StepCard>

      <StepCard step={7} title="Create Agent Actions">
        <p>
          Add agent actions that map to our Apex invocable methods. The agent will use these
          to autonomously process documents:
        </p>
        <CodeBlock
          language="plaintext"
          filename="agent-actions.txt"
          code={`Action 1: Extract Invoice Data
  Type: Apex Invocable
  Class: DocumentAIService
  Method: extractData
  Inputs:
    contentDocumentId: (from conversation or platform event)
    idpConfigName: "Medico_Invoice_Extractor"
  Outputs:
    success, invoiceId, rawJson, errorMessage

Action 2: Get Invoice Details
  Type: Flow
  Flow: Get_Medico_Invoice_Details
  Description: Retrieves a Medico Invoice record with all line items
  Inputs: invoiceId
  Outputs: invoice record, line items collection

Action 3: Approve Invoice
  Type: Flow
  Flow: Approve_Medico_Invoice
  Description: Updates invoice status to Approved after user confirmation
  Inputs: invoiceId
  Outputs: success confirmation`}
        />
      </StepCard>

      <StepCard step={8} title="Test the Complete Pipeline">
        <p>Test each component of the pipeline:</p>
        <ol>
          <li>
            <strong>Apex Test:</strong> Run the Apex test class to verify the Document AI service
            works correctly with a mock response.
          </li>
          <li>
            <strong>Flow Test:</strong> Launch the Screen Flow, upload a Medico invoice, and verify
            extraction results populate the custom objects.
          </li>
          <li>
            <strong>Agent Test:</strong> Chat with the Agentforce agent and ask it to &quot;process a
            new Medico invoice&quot; to verify the end-to-end autonomous workflow.
          </li>
        </ol>
        <CodeBlock
          language="java"
          filename="DocumentAIServiceTest.cls"
          code={`@isTest
public class DocumentAIServiceTest {

    @isTest
    static void testExtractData() {
        ContentVersion cv = new ContentVersion(
            Title = 'Test Invoice',
            PathOnClient = 'test-invoice.pdf',
            VersionData = Blob.valueOf('test content')
        );
        insert cv;

        ContentVersion inserted = [
            SELECT ContentDocumentId FROM ContentVersion WHERE Id = :cv.Id
        ];

        Test.setMock(HttpCalloutMock.class, new DocumentAIMock());

        DocumentAIService.ExtractionRequest req = new DocumentAIService.ExtractionRequest();
        req.contentDocumentId = inserted.ContentDocumentId;
        req.idpConfigName = 'Medico_Invoice_Extractor';

        Test.startTest();
        List<DocumentAIService.ExtractionResult> results =
            DocumentAIService.extractData(new List<DocumentAIService.ExtractionRequest>{ req });
        Test.stopTest();

        System.assertEquals(1, results.size());
        System.assertEquals(true, results[0].success);
        System.assertNotEquals(null, results[0].invoiceId);

        Medico_Invoice__c invoice = [
            SELECT Invoice_Number__c, Total_Due__c, Processing_Status__c
            FROM Medico_Invoice__c WHERE Id = :results[0].invoiceId
        ];
        System.assertEquals('INV-2026-001', invoice.Invoice_Number__c);
        System.assertEquals('Extracted', invoice.Processing_Status__c);
    }

    public class DocumentAIMock implements HttpCalloutMock {
        public HttpResponse respond(HttpRequest req) {
            HttpResponse res = new HttpResponse();
            res.setStatusCode(200);
            res.setBody('{"data":[{"extractedValues":{"invoice_number":{"value":"INV-2026-001","confidenceScore":0.98},"vendor_name":{"value":"Medico Pharmaceuticals","confidenceScore":0.99},"total_due":{"value":4013.40,"confidenceScore":0.99},"line_items":{"value":[{"description":"Amoxicillin 500mg","quantity":50,"unit_price":24.50,"amount":1225.00}],"confidenceScore":0.94}},"pageRange":"1-1"}]}');
            return res;
        }
    }
}`}
        />
      </StepCard>

      <h2>Complete Data Flow Diagram</h2>
      <div className="bg-gray-50 rounded-xl p-6 my-6 font-mono text-sm">
        <pre className="text-gray-700 whitespace-pre-wrap">{`
 Medico User                  Salesforce                      Document AI
 ===========                  ==========                      ===========

 Upload Invoice ──────> Screen Flow
                         │
                         ├──> Get ContentDocumentId
                         │
                         ├──> Apex: DocumentAIService
                         │         │
                         │         ├──> Base64 encode file
                         │         │
                         │         ├──> POST /extract-data ────────> LLM Processing
                         │         │                                     │
                         │         │    JSON Response <──────────────────┘
                         │         │
                         │         ├──> Parse response
                         │         │
                         │         ├──> Create Medico_Invoice__c
                         │         │
                         │         └──> Create Medico_Invoice_Line__c records
                         │
                         ├──> Display results with confidence
                         │
 Review & Approve ─────> Update Status = "Approved"

 ═══════════════════════════════════════════════════════════

 Agentforce Agent          (Autonomous Processing)

 DocProcessingStatusEvent ──> Agent Topic triggers
                               │
                               ├──> Calls Extract Invoice Data action
                               │
                               ├──> Reviews confidence scores
                               │
                               ├──> If high confidence: auto-approve
                               │
                               └──> If low confidence: notify user for review
        `}</pre>
      </div>

      <h2>Next Steps</h2>
      <InfoBox type="success" title="You have built a complete Document AI pipeline!">
        <p>From here you can extend the solution with:</p>
        <ul className="list-disc list-inside space-y-1">
          <li><strong>Batch processing:</strong> Connect to AWS S3 or GCS via UDLO for bulk document ingestion</li>
          <li><strong>Prompt Templates:</strong> Use Prompt Builder to refine raw JSON into business-friendly summaries</li>
          <li><strong>Platform Events:</strong> Listen for <code>DocProcessingStatusEvent</code> to trigger downstream processing</li>
          <li><strong>Experience Cloud:</strong> Build an external portal for Medico suppliers to submit invoices</li>
          <li><strong>Reports &amp; Dashboards:</strong> Track extraction accuracy, volume, and processing times</li>
        </ul>
      </InfoBox>
    </RecipeLayout>
  );
}
