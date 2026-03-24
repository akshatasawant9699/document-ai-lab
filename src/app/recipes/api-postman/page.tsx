import RecipeLayout from "@/components/RecipeLayout";
import StepCard from "@/components/StepCard";
import CodeBlock from "@/components/CodeBlock";
import InfoBox from "@/components/InfoBox";

export const metadata = {
  title: "Recipe 2: Document AI with APIs & Postman - Document AI Lab",
};

export default function ApiPostmanRecipe() {
  return (
    <RecipeLayout
      title="Document AI with REST APIs & Postman"
      description="Authenticate using OAuth 2.0, call the Document AI extraction endpoint from Postman, send Medico Pharma documents as base64 payloads, and parse responses with confidence scores."
      difficulty="Intermediate"
      duration="45 min"
      prerequisites={[
        "Completed Recipe 1 (Document AI configuration active in your org)",
        "Postman installed (or any REST API client)",
        "Basic understanding of REST APIs and OAuth 2.0",
        "Sample Medico documents from the Sample Documents page",
      ]}
      prevRecipe={{ label: "Basic Salesforce Setup", href: "/recipes/basic-setup" }}
      nextRecipe={{ label: "End-to-End Integration", href: "/recipes/end-to-end" }}
    >
      <h2>What You Will Build</h2>
      <p>
        In this recipe, you will call the Document AI REST API directly from Postman
        to extract data from Medico Pharma invoices and prescriptions. You will learn to
        authenticate with OAuth 2.0, construct the API payload with base64-encoded documents,
        and interpret the structured JSON response with confidence scores.
      </p>

      <h2>Architecture Overview</h2>
      <InfoBox type="info" title="API Flow">
        <ol className="list-decimal list-inside space-y-1">
          <li>Create an External Client App in Salesforce for API access</li>
          <li>Obtain an access token via OAuth 2.0 Authorization Code + PKCE</li>
          <li>Base64-encode your document (invoice PDF or image)</li>
          <li>POST to the Document AI extract endpoint with schema + file</li>
          <li>Parse the JSON response with extracted values and confidence scores</li>
        </ol>
      </InfoBox>

      <h2>Step-by-Step Instructions</h2>

      <StepCard step={1} title="Create an External Client App">
        <p>
          Document AI uses <strong>External Client Apps</strong> (not Connected Apps) for API authentication:
        </p>
        <ol>
          <li>Go to <strong>Setup</strong> &gt; search <strong>&quot;External Client App Manager&quot;</strong></li>
          <li>Click <strong>New External Client App</strong></li>
          <li>Fill in:
            <ul className="list-disc list-inside ml-4 mt-1">
              <li><strong>Name:</strong> DocAI_Postman_Client</li>
              <li><strong>Distribution State:</strong> Local</li>
            </ul>
          </li>
          <li>Under <strong>OAuth Settings</strong>:
            <ul className="list-disc list-inside ml-4 mt-1">
              <li>Enable <strong>Authorization Code and Credentials Flow</strong></li>
              <li>Set the <strong>Callback URL:</strong> <code>https://oauth.pstmn.io/v1/callback</code> (for Postman)</li>
              <li>Add scopes: <code>cdp_api</code>, <code>api</code>, <code>refresh_token</code></li>
            </ul>
          </li>
          <li>Save and note the <strong>Client ID</strong> and <strong>Client Secret</strong></li>
        </ol>
        <InfoBox type="warning">
          Use <strong>External Client App</strong>, not a standard Connected App.
          The Document AI Connect APIs require this specific app type.
        </InfoBox>
      </StepCard>

      <StepCard step={2} title="Configure Postman OAuth 2.0">
        <p>Set up a new Postman collection with OAuth 2.0 authorization:</p>
        <ol>
          <li>Create a new Collection: <strong>Document AI - Medico</strong></li>
          <li>Go to the <strong>Authorization</strong> tab</li>
          <li>Select <strong>OAuth 2.0</strong></li>
          <li>Configure:
            <ul className="list-disc list-inside ml-4 mt-1">
              <li><strong>Grant Type:</strong> Authorization Code (With PKCE)</li>
              <li><strong>Auth URL:</strong> <code>https://YOUR_DOMAIN.my.salesforce.com/services/oauth2/authorize</code></li>
              <li><strong>Token URL:</strong> <code>https://YOUR_DOMAIN.my.salesforce.com/services/oauth2/token</code></li>
              <li><strong>Client ID:</strong> (from Step 1)</li>
              <li><strong>Client Secret:</strong> (from Step 1)</li>
              <li><strong>Scope:</strong> <code>cdp_api api refresh_token</code></li>
              <li><strong>Code Challenge Method:</strong> S256</li>
            </ul>
          </li>
          <li>Click <strong>Get New Access Token</strong> and authenticate</li>
        </ol>
      </StepCard>

      <StepCard step={3} title="Prepare the Document Payload">
        <p>
          The API expects documents as base64-encoded strings. Here is how to encode a document:
        </p>

        <h4 className="font-semibold mt-4 mb-2">Using the command line (macOS/Linux):</h4>
        <CodeBlock
          language="bash"
          code={`# Encode a PDF to base64
base64 -i medico-invoice-001.pdf -o invoice-base64.txt

# Encode a PNG/JPG image
base64 -i medico-invoice-001.png -o invoice-base64.txt`}
        />

        <h4 className="font-semibold mt-4 mb-2">Using Python:</h4>
        <CodeBlock
          language="python"
          code={`import base64

with open("medico-invoice-001.pdf", "rb") as f:
    encoded = base64.b64encode(f.read()).decode("utf-8")

print(encoded[:100] + "...")  # Preview first 100 chars`}
        />
      </StepCard>

      <StepCard step={4} title="Call the Extract API (with Inline Schema)">
        <p>Create a new POST request in Postman:</p>
        <CodeBlock
          language="plaintext"
          code={`POST {{instance_url}}/services/data/v63.0/ssot/document-processing/actions/extract-data?htmlEncode=false&extractDataWithConfidenceScore=true`}
        />
        <p>Set the request body to <strong>raw JSON</strong>:</p>
        <CodeBlock
          language="json"
          filename="extract-with-schema.json"
          code={`{
  "mlModel": "llmgateway__VertexAIGemini20Flash001",
  "schemaConfig": "{\\\"type\\\":\\\"object\\\",\\\"properties\\\":{\\\"invoice_number\\\":{\\\"type\\\":\\\"string\\\",\\\"description\\\":\\\"The unique invoice identifier\\\"},\\\"invoice_date\\\":{\\\"type\\\":\\\"string\\\",\\\"description\\\":\\\"The date the invoice was issued\\\"},\\\"vendor_name\\\":{\\\"type\\\":\\\"string\\\",\\\"description\\\":\\\"Name of the vendor\\\"},\\\"bill_to_name\\\":{\\\"type\\\":\\\"string\\\",\\\"description\\\":\\\"Name of the billing recipient\\\"},\\\"total_due\\\":{\\\"type\\\":\\\"number\\\",\\\"description\\\":\\\"Total amount due\\\"},\\\"line_items\\\":{\\\"type\\\":\\\"array\\\",\\\"description\\\":\\\"List of items on the invoice\\\",\\\"items\\\":{\\\"type\\\":\\\"object\\\",\\\"properties\\\":{\\\"description\\\":{\\\"type\\\":\\\"string\\\"},\\\"quantity\\\":{\\\"type\\\":\\\"number\\\"},\\\"unit_price\\\":{\\\"type\\\":\\\"number\\\"},\\\"amount\\\":{\\\"type\\\":\\\"number\\\"}}}}}}",
  "files": [
    {
      "mimeType": "application/pdf",
      "data": "YOUR_BASE64_ENCODED_PDF_CONTENT_HERE"
    }
  ]
}`}
        />
        <InfoBox type="tip" title="Schema as String">
          Notice <code>schemaConfig</code> is a <strong>stringified JSON</strong>. The entire schema
          must be escaped and passed as a single string value. Use <code>JSON.stringify()</code> in
          JavaScript or <code>json.dumps()</code> in Python to generate this.
        </InfoBox>
      </StepCard>

      <StepCard step={5} title="Call the Extract API (with IDP Configuration)">
        <p>
          If you created a Document AI configuration in Recipe 1, you can use it directly
          instead of passing an inline schema. This is the <strong>simplified payload</strong>:
        </p>
        <CodeBlock
          language="json"
          filename="extract-with-config.json"
          code={`{
  "idpConfigurationIdOrName": "Medico_Invoice_Extractor",
  "files": [
    {
      "mimeType": "application/pdf",
      "data": "YOUR_BASE64_ENCODED_PDF_CONTENT_HERE"
    }
  ]
}`}
        />
        <InfoBox type="success">
          This is the recommended approach for production use. The configuration stores the schema,
          model selection, and other settings centrally in Salesforce.
        </InfoBox>
      </StepCard>

      <StepCard step={6} title="Parse the Response">
        <p>The API returns a structured JSON response:</p>
        <CodeBlock
          language="json"
          filename="api-response.json"
          code={`{
  "data": [
    {
      "extractedValues": {
        "invoice_number": {
          "value": "INV-2026-001",
          "confidenceScore": 0.98
        },
        "invoice_date": {
          "value": "March 15, 2026",
          "confidenceScore": 0.97
        },
        "vendor_name": {
          "value": "Medico Pharmaceuticals",
          "confidenceScore": 0.99
        },
        "bill_to_name": {
          "value": "City General Hospital",
          "confidenceScore": 0.96
        },
        "total_due": {
          "value": 4013.40,
          "confidenceScore": 0.99
        },
        "line_items": {
          "value": [
            {
              "description": "Amoxicillin 500mg Capsules (100ct)",
              "quantity": 50,
              "unit_price": 24.50,
              "amount": 1225.00
            },
            {
              "description": "Lisinopril 10mg Tablets (90ct)",
              "quantity": 30,
              "unit_price": 18.75,
              "amount": 562.50
            }
          ],
          "confidenceScore": 0.94
        }
      },
      "pageRange": "1-1"
    }
  ]
}`}
        />
        <p>Key points about the response:</p>
        <ul className="list-disc list-inside space-y-1">
          <li><strong>confidenceScore</strong> ranges from 0.0 to 1.0 (higher is better)</li>
          <li>Scores above <strong>0.90</strong> are generally reliable</li>
          <li>Scores between <strong>0.70-0.90</strong> should be reviewed</li>
          <li>Scores below <strong>0.70</strong> may need human verification</li>
          <li><strong>pageRange</strong> indicates which pages the data was extracted from</li>
        </ul>
      </StepCard>

      <StepCard step={7} title="Test with Multiple Document Types">
        <p>
          Try extracting data from different Medico document types to see how the API handles varied formats:
        </p>
        <table className="w-full text-sm border-collapse my-3">
          <thead>
            <tr className="border-b-2 border-gray-200">
              <th className="text-left py-2 px-3">Document</th>
              <th className="text-left py-2 px-3">MIME Type</th>
              <th className="text-left py-2 px-3">Key Fields</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-100">
              <td className="py-2 px-3">Invoice (PDF)</td>
              <td className="py-2 px-3"><code>application/pdf</code></td>
              <td className="py-2 px-3">Invoice #, total, line items</td>
            </tr>
            <tr className="border-b border-gray-100">
              <td className="py-2 px-3">Prescription (Image)</td>
              <td className="py-2 px-3"><code>image/png</code></td>
              <td className="py-2 px-3">Doctor, patient, medications</td>
            </tr>
            <tr className="border-b border-gray-100">
              <td className="py-2 px-3">Lab Report (PDF)</td>
              <td className="py-2 px-3"><code>application/pdf</code></td>
              <td className="py-2 px-3">Test results, reference ranges</td>
            </tr>
            <tr className="border-b border-gray-100">
              <td className="py-2 px-3">Purchase Order (PDF)</td>
              <td className="py-2 px-3"><code>application/pdf</code></td>
              <td className="py-2 px-3">PO #, vendor, line items</td>
            </tr>
          </tbody>
        </table>
      </StepCard>

      <h2>Postman Environment Variables</h2>
      <p>Set up these environment variables in Postman for easy reuse:</p>
      <CodeBlock
        language="json"
        filename="postman-environment.json"
        code={`{
  "values": [
    { "key": "login_url", "value": "https://YOUR_DOMAIN.my.salesforce.com" },
    { "key": "instance_url", "value": "https://YOUR_DOMAIN.my.salesforce.com" },
    { "key": "api_version", "value": "v63.0" },
    { "key": "client_id", "value": "YOUR_CLIENT_ID" },
    { "key": "client_secret", "value": "YOUR_CLIENT_SECRET" },
    { "key": "access_token", "value": "" },
    { "key": "idp_config_name", "value": "Medico_Invoice_Extractor" },
    { "key": "ml_model", "value": "llmgateway__VertexAIGemini20Flash001" }
  ]
}`}
      />

      <h2>Postman Pre-request Script</h2>
      <p>
        Add this script to automatically refresh the token before each request:
      </p>
      <CodeBlock
        language="javascript"
        filename="pre-request-script.js"
        code={`// Auto-refresh token if expired
const tokenExpiry = pm.environment.get("token_expiry");
const now = Date.now();

if (!tokenExpiry || now > parseInt(tokenExpiry)) {
    console.log("Token expired or missing, refreshing...");

    const refreshToken = pm.environment.get("refresh_token");
    if (refreshToken) {
        pm.sendRequest({
            url: pm.environment.get("login_url") + "/services/oauth2/token",
            method: "POST",
            header: { "Content-Type": "application/x-www-form-urlencoded" },
            body: {
                mode: "urlencoded",
                urlencoded: [
                    { key: "grant_type", value: "refresh_token" },
                    { key: "client_id", value: pm.environment.get("client_id") },
                    { key: "client_secret", value: pm.environment.get("client_secret") },
                    { key: "refresh_token", value: refreshToken }
                ]
            }
        }, function (err, res) {
            if (!err) {
                const json = res.json();
                pm.environment.set("access_token", json.access_token);
                pm.environment.set("instance_url", json.instance_url);
                pm.environment.set("token_expiry", String(now + 7200000));
            }
        });
    }
}`}
      />

      <h2>Error Handling</h2>
      <InfoBox type="warning" title="Common API Errors">
        <ul className="list-disc list-inside space-y-2">
          <li>
            <strong>401 Unauthorized:</strong> Access token expired. Re-authenticate via OAuth.
          </li>
          <li>
            <strong>400 Bad Request:</strong> Check your JSON payload format. Ensure <code>schemaConfig</code> is
            a properly escaped JSON string.
          </li>
          <li>
            <strong>504 Timeout:</strong> Document may be too large. For PDFs over ~50 pages,
            consider splitting the document. An async endpoint is planned.
          </li>
          <li>
            <strong>HTML entities in response:</strong> The API may return HTML-encoded characters
            (e.g., <code>&amp;quot;</code>). Add <code>?htmlEncode=false</code> to the URL to get clean JSON.
          </li>
        </ul>
      </InfoBox>
    </RecipeLayout>
  );
}
