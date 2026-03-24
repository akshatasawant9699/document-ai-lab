import Link from "next/link";
import CodeBlock from "@/components/CodeBlock";
import InfoBox from "@/components/InfoBox";

export const metadata = {
  title: "Sample Documents - Document AI Lab",
};

const documents = [
  {
    title: "Invoice INV-2026-001",
    type: "Invoice",
    file: "/samples/medico-invoice-001.html",
    description:
      "Standard pharmaceutical invoice from Medico to City General Hospital. 6 line items including antibiotics, antihypertensives, and surgical supplies. Total: $4,013.40.",
    fields: ["Invoice #", "Date", "PO Number", "Bill To", "Ship To", "Line Items", "Tax", "Total Due"],
    color: "bg-blue-50 border-blue-200",
    badge: "bg-blue-100 text-blue-700",
  },
  {
    title: "Invoice INV-2026-002",
    type: "Invoice",
    file: "/samples/medico-invoice-002.html",
    description:
      "High-value invoice to Bay Area Medical Center featuring insulin pens and IV solutions. Includes cold chain handling. Total: $17,836.23.",
    fields: ["Invoice #", "Date", "PO Number", "Bill To", "Ship To", "Line Items", "Insurance Handling", "Total Due"],
    color: "bg-blue-50 border-blue-200",
    badge: "bg-blue-100 text-blue-700",
  },
  {
    title: "Prescription - Dr. James Wilson",
    type: "Prescription",
    file: "/samples/medico-prescription-001.html",
    description:
      "Prescription from Pacific Heights Medical Clinic for patient Robert Martinez. 3 medications for diabetes, hypertension, and hyperlipidemia.",
    fields: ["Doctor Name", "DEA #", "NPI", "Patient Name", "DOB", "Medications", "Diagnosis Codes", "Allergies"],
    color: "bg-green-50 border-green-200",
    badge: "bg-green-100 text-green-700",
  },
  {
    title: "Lab Report LR-2026-03-4421",
    type: "Lab Report",
    file: "/samples/medico-lab-report-001.html",
    description:
      "Complete lab results for Robert Martinez including CBC, CMP, and Lipid Panel. Multiple high flags for glucose, HbA1c, cholesterol, and triglycerides.",
    fields: ["Report #", "Patient", "Ordering Physician", "Collection Date", "Test Results", "Flags", "Reference Ranges"],
    color: "bg-teal-50 border-teal-200",
    badge: "bg-teal-100 text-teal-700",
  },
  {
    title: "Purchase Order PO-MED-4521",
    type: "Purchase Order",
    file: "/samples/medico-purchase-order-001.html",
    description:
      "Purchase order from City General Hospital to Medico Pharmaceuticals. Corresponds to Invoice INV-2026-001. Includes shipping terms and special instructions.",
    fields: ["PO #", "Date", "Required By", "Vendor", "Ship To", "Line Items", "Terms", "Total"],
    color: "bg-purple-50 border-purple-200",
    badge: "bg-purple-100 text-purple-700",
  },
];

export default function SamplesPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-[var(--sf-navy)] mb-3">
          Medico Pharma Sample Documents
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl">
          Download these sample documents to use with the Document AI recipes. Each document
          is designed to test different extraction capabilities with realistic pharmaceutical
          industry data.
        </p>
      </div>

      <InfoBox type="tip" title="How to Use These Documents">
        <ol className="list-decimal list-inside space-y-1">
          <li>Open or download the HTML document</li>
          <li>Print to PDF using your browser (Cmd/Ctrl + P &gt; Save as PDF)</li>
          <li>Use the PDF in the Document AI recipes for extraction testing</li>
          <li>Alternatively, take a screenshot and save as PNG/JPG for image-based extraction</li>
        </ol>
      </InfoBox>

      <div className="grid gap-6 mt-8">
        {documents.map((doc) => (
          <div
            key={doc.title}
            className={`border rounded-2xl p-6 ${doc.color}`}
          >
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-bold text-gray-900">{doc.title}</h3>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${doc.badge}`}>
                    {doc.type}
                  </span>
                </div>
                <p className="text-sm text-gray-700 mb-4 leading-relaxed">
                  {doc.description}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {doc.fields.map((field) => (
                    <span
                      key={field}
                      className="px-2 py-0.5 bg-white/70 border border-gray-200 text-gray-600 rounded text-xs"
                    >
                      {field}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex gap-3 shrink-0">
                <a
                  href={doc.file}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  Preview
                </a>
                <a
                  href={doc.file}
                  download
                  className="inline-flex items-center px-4 py-2 bg-[var(--sf-blue)] text-white text-sm font-medium rounded-lg hover:bg-[var(--sf-blue-dark)] transition-colors"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      <h2 className="text-2xl font-bold text-[var(--sf-navy)] mb-4 mt-12 border-b-2 border-[var(--sf-cloud)] pb-2">
        About the Medico Pharma Scenario
      </h2>
      <div className="prose max-w-none text-gray-600">
        <p className="mb-4">
          <strong>Medico Pharmaceuticals</strong> is a fictional mid-sized pharmaceutical distributor
          based in San Francisco. They supply medications, medical supplies, and diagnostics to
          hospitals and clinics across the Bay Area.
        </p>
        <div className="grid md:grid-cols-2 gap-6 my-6">
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <h4 className="font-semibold text-gray-900 mb-2">Document Relationships</h4>
            <p className="text-sm mb-3">The sample documents tell a connected story:</p>
            <ul className="text-sm space-y-2">
              <li>
                <strong>PO-MED-4521</strong> &mdash; City General Hospital orders supplies
              </li>
              <li>
                <strong>INV-2026-001</strong> &mdash; Medico invoices for the order (matches the PO)
              </li>
              <li>
                <strong>Prescription</strong> &mdash; Dr. Wilson prescribes medications for patient Martinez
              </li>
              <li>
                <strong>Lab Report</strong> &mdash; Martinez&apos;s lab results (same patient, same doctor)
              </li>
              <li>
                <strong>INV-2026-002</strong> &mdash; Separate high-value order to Bay Area Medical Center
              </li>
            </ul>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <h4 className="font-semibold text-gray-900 mb-2">Extraction Challenges</h4>
            <p className="text-sm mb-3">These documents are designed to test various capabilities:</p>
            <ul className="text-sm space-y-2">
              <li><strong>Table extraction</strong> &mdash; Line items with multiple columns</li>
              <li><strong>Nested data</strong> &mdash; Medications within prescriptions</li>
              <li><strong>Number precision</strong> &mdash; Currency and quantity fields</li>
              <li><strong>Date formats</strong> &mdash; Various date representations</li>
              <li><strong>Domain codes</strong> &mdash; NDC codes, ICD-10 codes, DEA numbers</li>
              <li><strong>Cross-reference</strong> &mdash; PO numbers that match across documents</li>
            </ul>
          </div>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-[var(--sf-navy)] mb-4 mt-8 border-b-2 border-[var(--sf-cloud)] pb-2">
        Quick Schema Reference
      </h2>
      <p className="text-gray-600 mb-4">
        Use these JSON schemas with the Document AI API to extract data from each document type.
        Full schemas are available in <Link href="/recipes/basic-setup" className="text-[var(--sf-blue)] underline">Recipe 1</Link>.
      </p>
      <CodeBlock
        language="json"
        filename="universal-medico-schema.json"
        code={`{
  "type": "object",
  "properties": {
    "document_type": {
      "type": "string",
      "description": "Type: invoice, prescription, lab_report, or purchase_order"
    },
    "document_id": {
      "type": "string",
      "description": "Primary identifier (invoice #, report #, PO #, etc.)"
    },
    "date": {
      "type": "string",
      "description": "Primary date on the document"
    },
    "from_party": {
      "type": "string",
      "description": "Sender, vendor, or issuing organization"
    },
    "to_party": {
      "type": "string",
      "description": "Recipient, buyer, or patient"
    },
    "total_amount": {
      "type": "number",
      "description": "Total monetary amount (if applicable)"
    },
    "key_items": {
      "type": "array",
      "description": "Main items: line items, medications, test results, etc.",
      "items": {
        "type": "object",
        "properties": {
          "name": { "type": "string", "description": "Item name or test name" },
          "detail": { "type": "string", "description": "Additional detail" },
          "value": { "type": "string", "description": "Amount, result, or quantity" }
        }
      }
    }
  }
}`}
      />

      <div className="mt-8 text-center">
        <Link
          href="/recipes/basic-setup"
          className="inline-flex items-center px-6 py-3 bg-[var(--sf-blue)] text-white font-semibold rounded-lg hover:bg-[var(--sf-blue-dark)] transition-colors"
        >
          Start Extracting with Recipe 1
          <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </div>
  );
}
