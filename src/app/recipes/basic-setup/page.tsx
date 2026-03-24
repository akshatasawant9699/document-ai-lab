import RecipeLayout from "@/components/RecipeLayout";
import StepCard from "@/components/StepCard";
import CodeBlock from "@/components/CodeBlock";
import InfoBox from "@/components/InfoBox";

export const metadata = {
  title: "Recipe 1: Basic Document AI Setup - Document AI Lab",
};

export default function BasicSetupRecipe() {
  return (
    <RecipeLayout
      title="Basic Document AI Setup in Salesforce"
      description="Enable Document AI in your Salesforce org, create a configuration with extraction schema, and test it with Medico Pharma invoices directly from the UI."
      difficulty="Beginner"
      duration="30 min"
      prerequisites={[
        "A Salesforce org with Data Cloud enabled (Developer Edition or sandbox)",
        "Einstein AI features enabled in Setup",
        "System Administrator profile or equivalent permissions",
      ]}
      nextRecipe={{ label: "API with Postman", href: "/recipes/api-postman" }}
    >
      <h2>What You Will Build</h2>
      <p>
        In this recipe, you will configure Salesforce Document AI to automatically extract
        structured data from Medico Pharmaceuticals invoices. By the end, you will have a
        working Document AI configuration that can pull out invoice numbers, dates, line items,
        and totals from uploaded documents.
      </p>

      <InfoBox type="info" title="About Document AI">
        <p>
          Document AI is a Data Cloud feature that uses large language models (LLMs) to extract
          structured data from unstructured documents like PDFs, images, and scanned files. It
          supports models from Google (Gemini), OpenAI (GPT-4o), Anthropic (Claude), and more.
        </p>
      </InfoBox>

      <h2>Step-by-Step Instructions</h2>

      <StepCard step={1} title="Enable Einstein AI Features">
        <p>First, ensure Einstein is enabled in your org:</p>
        <ol>
          <li>Go to <strong>Setup</strong> &gt; search for <strong>&quot;Einstein Setup&quot;</strong></li>
          <li>Toggle <strong>Turn on Einstein</strong> to enabled</li>
          <li>Accept the terms of service if prompted</li>
          <li>Wait a few minutes for the Hawking tenant to provision</li>
        </ol>
        <InfoBox type="warning" title="Common Issue">
          If you see a 403 error later, it usually means Einstein setup hasn&apos;t fully provisioned.
          Wait 10-15 minutes and try again.
        </InfoBox>
      </StepCard>

      <StepCard step={2} title="Navigate to Document AI">
        <p>Document AI lives within the Data Cloud setup area:</p>
        <ol>
          <li>Go to <strong>Setup</strong> &gt; search for <strong>&quot;Data Cloud&quot;</strong></li>
          <li>Under Data Cloud, find <strong>&quot;Document AI&quot;</strong> in the left sidebar</li>
          <li>You should see the Document AI home page with options to create new configurations</li>
        </ol>
        <InfoBox type="info">
          Document AI is GA (Generally Available) and no longer behind Feature Manager. It appears
          under the &quot;Unstructured&quot; tab in Data Cloud setup.
        </InfoBox>
      </StepCard>

      <StepCard step={3} title="Create a New Document AI Configuration">
        <p>
          Click <strong>&quot;New&quot;</strong> to create a configuration. For this recipe, select
          <strong> &quot;Without Source Object&quot;</strong> since we are doing standalone extraction.
        </p>
        <ol>
          <li>Enter a name: <code>Medico_Invoice_Extractor</code></li>
          <li>Add a description: &quot;Extracts data from Medico Pharma invoices&quot;</li>
          <li>Click <strong>Next</strong></li>
        </ol>
      </StepCard>

      <StepCard step={4} title="Upload Sample Documents">
        <p>
          Upload one or more sample Medico Pharma invoices. You can download the sample invoices
          from the <a href="/samples" className="text-[var(--sf-blue)] underline">Sample Documents</a> page,
          print them to PDF, and upload here.
        </p>
        <p>
          The Visual Schema Builder will analyze your documents and suggest fields to extract.
          Supported formats: PDF, PNG, JPG, JPEG, TIFF, BMP.
        </p>
      </StepCard>

      <StepCard step={5} title="Define the Extraction Schema">
        <p>
          The schema tells Document AI what fields to extract. For a Medico invoice, define
          these fields:
        </p>
        <CodeBlock
          language="json"
          filename="invoice-schema.json"
          code={`{
  "type": "object",
  "properties": {
    "invoice_number": {
      "type": "string",
      "description": "The unique invoice identifier (e.g., INV-2026-001)"
    },
    "invoice_date": {
      "type": "string",
      "description": "The date the invoice was issued"
    },
    "due_date": {
      "type": "string",
      "description": "The payment due date"
    },
    "po_number": {
      "type": "string",
      "description": "The associated purchase order number"
    },
    "vendor_name": {
      "type": "string",
      "description": "Name of the vendor/seller"
    },
    "bill_to_name": {
      "type": "string",
      "description": "Name of the billing recipient organization"
    },
    "subtotal": {
      "type": "number",
      "description": "Subtotal amount before tax and shipping"
    },
    "tax_amount": {
      "type": "number",
      "description": "Total tax amount"
    },
    "total_due": {
      "type": "number",
      "description": "Total amount due for payment"
    },
    "line_items": {
      "type": "array",
      "description": "List of items on the invoice",
      "items": {
        "type": "object",
        "properties": {
          "description": {
            "type": "string",
            "description": "Product or service description"
          },
          "ndc_code": {
            "type": "string",
            "description": "National Drug Code for pharmaceuticals"
          },
          "quantity": {
            "type": "number",
            "description": "Number of units ordered"
          },
          "unit_price": {
            "type": "number",
            "description": "Price per unit"
          },
          "amount": {
            "type": "number",
            "description": "Line item total (quantity x unit_price)"
          }
        }
      }
    }
  }
}`}
        />
        <InfoBox type="tip" title="Schema Tips">
          <ul className="list-disc list-inside space-y-1">
            <li>Use clear <code>description</code> fields &mdash; the LLM uses them to understand what to extract</li>
            <li>Maximum 50 fields at the root DLO level</li>
            <li>Table extraction supports 1 level of nesting (1 table at parent, up to 5 at child level)</li>
            <li>The Visual Schema Builder can auto-detect fields from your uploaded samples</li>
          </ul>
        </InfoBox>
      </StepCard>

      <StepCard step={6} title="Select the LLM Model">
        <p>Choose which AI model to use for extraction:</p>
        <table className="w-full text-sm border-collapse my-3">
          <thead>
            <tr className="border-b-2 border-gray-200">
              <th className="text-left py-2 px-3">Model</th>
              <th className="text-left py-2 px-3">Best For</th>
              <th className="text-left py-2 px-3">ID</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-100">
              <td className="py-2 px-3 font-medium">Gemini 2.0 Flash</td>
              <td className="py-2 px-3">PDFs, fast extraction</td>
              <td className="py-2 px-3"><code className="text-xs">llmgateway__VertexAIGemini20Flash001</code></td>
            </tr>
            <tr className="border-b border-gray-100">
              <td className="py-2 px-3 font-medium">GPT-4o</td>
              <td className="py-2 px-3">Complex documents, OCR</td>
              <td className="py-2 px-3"><code className="text-xs">llmgateway__OpenAIGPT4Omni_08_06</code></td>
            </tr>
            <tr className="border-b border-gray-100">
              <td className="py-2 px-3 font-medium">Gemini 2.5 Flash</td>
              <td className="py-2 px-3">Latest, improved accuracy</td>
              <td className="py-2 px-3"><code className="text-xs">llmgateway__VertexAIGemini25Flash</code></td>
            </tr>
          </tbody>
        </table>
        <p>
          For Medico invoices, <strong>Gemini 2.0 Flash</strong> is recommended as it provides the
          best balance of speed and accuracy for PDF documents.
        </p>
      </StepCard>

      <StepCard step={7} title="Test the Configuration">
        <p>
          Use the built-in <strong>Test</strong> button to upload a Medico invoice and see the
          extraction results. The response will include:
        </p>
        <ul className="list-disc list-inside space-y-1">
          <li>Extracted field values mapped to your schema</li>
          <li>Confidence scores (0-1 scale) for each extracted field</li>
          <li>Raw JSON output for debugging</li>
        </ul>
        <CodeBlock
          language="json"
          filename="sample-response.json"
          code={`{
  "extractedValues": {
    "invoice_number": "INV-2026-001",
    "invoice_date": "March 15, 2026",
    "due_date": "April 14, 2026",
    "po_number": "PO-MED-4521",
    "vendor_name": "Medico Pharmaceuticals",
    "bill_to_name": "City General Hospital",
    "subtotal": 3653.30,
    "tax_amount": 315.10,
    "total_due": 4013.40,
    "line_items": [
      {
        "description": "Amoxicillin 500mg Capsules (100ct)",
        "ndc_code": "0093-3109-01",
        "quantity": 50,
        "unit_price": 24.50,
        "amount": 1225.00
      }
    ]
  },
  "confidenceScores": {
    "invoice_number": 0.98,
    "invoice_date": 0.97,
    "total_due": 0.99
  }
}`}
        />
      </StepCard>

      <StepCard step={8} title="Save and Activate">
        <p>
          Once you are satisfied with the test results, <strong>Save</strong> the configuration.
          Note down the <strong>API Name</strong> (e.g., <code>Medico_Invoice_Extractor</code>) &mdash;
          you will need it in the next recipe when calling Document AI via the API.
        </p>
        <InfoBox type="success" title="Configuration Complete">
          Your Document AI configuration is ready. You can now use it from the Salesforce UI,
          via the REST API (Recipe 2), or integrate it into Apex and Flows (Recipe 3).
        </InfoBox>
      </StepCard>

      <h2>Schema Reference for Other Medico Documents</h2>
      <p>
        Here are schemas for other Medico document types you will use in later recipes:
      </p>

      <h3>Prescription Schema</h3>
      <CodeBlock
        language="json"
        filename="prescription-schema.json"
        code={`{
  "type": "object",
  "properties": {
    "clinic_name": { "type": "string", "description": "Name of the medical clinic" },
    "doctor_name": { "type": "string", "description": "Full name of the prescribing physician" },
    "doctor_dea": { "type": "string", "description": "DEA registration number" },
    "doctor_npi": { "type": "string", "description": "National Provider Identifier" },
    "patient_name": { "type": "string", "description": "Full name of the patient" },
    "patient_dob": { "type": "string", "description": "Patient date of birth" },
    "patient_mrn": { "type": "string", "description": "Medical Record Number" },
    "prescription_date": { "type": "string", "description": "Date the prescription was written" },
    "diagnosis_codes": { "type": "string", "description": "ICD-10 diagnosis codes" },
    "allergies": { "type": "string", "description": "Known patient allergies" },
    "medications": {
      "type": "array",
      "description": "List of prescribed medications",
      "items": {
        "type": "object",
        "properties": {
          "name": { "type": "string", "description": "Medication name and strength" },
          "sig": { "type": "string", "description": "Dosage instructions" },
          "quantity": { "type": "string", "description": "Quantity to dispense" },
          "refills": { "type": "string", "description": "Number of refills authorized" }
        }
      }
    }
  }
}`}
      />

      <h3>Lab Report Schema</h3>
      <CodeBlock
        language="json"
        filename="lab-report-schema.json"
        code={`{
  "type": "object",
  "properties": {
    "lab_name": { "type": "string", "description": "Name of the laboratory" },
    "report_number": { "type": "string", "description": "Unique lab report identifier" },
    "report_date": { "type": "string", "description": "Date results were reported" },
    "patient_name": { "type": "string", "description": "Full name of the patient" },
    "patient_dob": { "type": "string", "description": "Patient date of birth" },
    "ordering_physician": { "type": "string", "description": "Doctor who ordered the tests" },
    "collection_date": { "type": "string", "description": "Date and time specimen was collected" },
    "test_results": {
      "type": "array",
      "description": "Individual test results",
      "items": {
        "type": "object",
        "properties": {
          "test_name": { "type": "string", "description": "Name of the lab test" },
          "result": { "type": "string", "description": "Test result value" },
          "units": { "type": "string", "description": "Unit of measurement" },
          "reference_range": { "type": "string", "description": "Normal reference range" },
          "flag": { "type": "string", "description": "Normal, HIGH, or LOW" }
        }
      }
    }
  }
}`}
      />

      <h2>Troubleshooting</h2>
      <InfoBox type="warning" title="Common Issues">
        <ul className="list-disc list-inside space-y-2">
          <li>
            <strong>Document AI not visible:</strong> Ensure Data Cloud is enabled and you have the correct
            permissions. Check under the &quot;Unstructured&quot; tab.
          </li>
          <li>
            <strong>403 Forbidden errors:</strong> Einstein setup may not be fully provisioned. Wait 10-15 minutes.
          </li>
          <li>
            <strong>Inconsistent results:</strong> LLMs are non-deterministic. Run the same document multiple
            times and compare. Using more descriptive field descriptions improves consistency.
          </li>
          <li>
            <strong>Missing fields in response:</strong> Check your schema descriptions. The LLM relies heavily
            on the <code>description</code> field to know what to look for.
          </li>
        </ul>
      </InfoBox>
    </RecipeLayout>
  );
}
