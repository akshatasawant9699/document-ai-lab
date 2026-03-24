import Link from "next/link";

export const metadata = {
  title: "Resources - Document AI Lab",
};

const sections = [
  {
    title: "Official Documentation",
    color: "border-[var(--sf-blue)]",
    items: [
      {
        title: "Document AI Overview",
        url: "https://help.salesforce.com/s/articleView?id=data.c360_a_document_ai.htm&type=5",
        description: "Official Salesforce Help article covering Document AI setup, features, and configuration.",
        tag: "Salesforce Help",
      },
      {
        title: "Data 360 Connect API Reference",
        url: "https://developer.salesforce.com/docs/data/data-cloud-int/guide/c360-a-document-ai.html",
        description: "Complete API documentation including the Document AI Configuration Output specification.",
        tag: "Developer Docs",
      },
      {
        title: "GCS UDLO Setup for Batch Processing",
        url: "https://developer.salesforce.com/docs/data/data-cloud-int/guide/c360-a-gcs-udlo.html",
        description: "Guide for setting up Google Cloud Storage Unstructured Data Lake Objects for batch document ingestion.",
        tag: "Developer Docs",
      },
    ],
  },
  {
    title: "Trailhead & Learning",
    color: "border-[var(--sf-teal)]",
    items: [
      {
        title: "Data 360: Process Content Module",
        url: "https://trailhead.salesforce.com/content/learn/modules/data-360-process-content",
        description: "Official Trailhead module (~15 min, 2 units) covering Document AI extraction and RAG with Agentforce.",
        tag: "Trailhead",
      },
      {
        title: "Data 360: Explore Setup to Activation Trail",
        url: "https://trailhead.salesforce.com/content/learn/trails/data-360-explore-setup-to-activation",
        description: "Comprehensive trail covering the full Data Cloud setup journey including Document AI.",
        tag: "Trailhead Trail",
      },
    ],
  },
  {
    title: "Tutorials & Implementation Guides",
    color: "border-[var(--sf-purple)]",
    items: [
      {
        title: "Resume Processing Tutorial (5-Step)",
        url: "https://developer.salesforce.com/docs/data/data-cloud-int/guide/c360-a-document-ai-resume.html",
        description: "Official end-to-end tutorial for processing resumes with Document AI, covering schema design, API calls, and data extraction.",
        tag: "Official Tutorial",
      },
      {
        title: "Loan Prequalification Agent Tutorial",
        url: "https://developer.salesforce.com/docs/data/data-cloud-int/guide/c360-a-document-ai-loan.html",
        description: "Build an Agentforce agent that processes loan applications using Document AI for document extraction.",
        tag: "Official Tutorial",
      },
      {
        title: "Contact Enrichment Screen Flow Guide",
        url: "https://docs.google.com/document/d/1yy7EDfQRf9RgmLbVE1c1p6FquSMJBMJM6ZEXyB6Xwsg/edit",
        description: "Implementation guide for building a contact enrichment Screen Flow using the Transactional API.",
        tag: "Community Guide",
      },
      {
        title: "Loan Prequalification Agentforce Guide",
        url: "https://docs.google.com/document/d/1pE1Yr8xXTO0Z3cwhpPO9yJ4zAJ_meNvpfMpIWG0Bls8/edit",
        description: "Step-by-step implementation guide for the Loan Prequalification Agentforce agent demo.",
        tag: "Community Guide",
      },
    ],
  },
  {
    title: "Developer Tools & Code",
    color: "border-[var(--sf-success)]",
    items: [
      {
        title: "Document AI Testbed (GitHub)",
        url: "https://github.com/ananth-anto/sf-datacloud-idp-testbed",
        description: "Open-source test application for Document AI APIs by Ananth Anto. Includes live demo, request/response examples, and Apex snippets.",
        tag: "GitHub",
      },
      {
        title: "Document AI Testbed (Live Demo)",
        url: "https://docai-testbed-1698352246fd.herokuapp.com/",
        description: "Deployed version of the testbed app on Heroku for quick API testing without local setup.",
        tag: "Live Demo",
      },
      {
        title: "Document AI + Agentforce Playlist",
        url: "https://youtube.com/playlist?list=PLgIMQe2PKPSI3azxe6ypZy4e9iXIFHK_u",
        description: "YouTube playlist covering Flow, Apex, and Agentforce integration patterns with Document AI.",
        tag: "YouTube",
      },
    ],
  },
  {
    title: "Videos & Demos",
    color: "border-[var(--sf-warning)]",
    items: [
      {
        title: "Visual Schema Builder Demo",
        url: "https://drive.google.com/file/d/1UMHgsyQ4_RjZ4CbGYWRWkkdoj8E7x9_7/view",
        description: "5-minute walkthrough of the Visual Schema Builder UI for Document AI configuration.",
        tag: "Video Demo",
      },
      {
        title: "Contact Enrichment Flow Demo",
        url: "https://drive.google.com/file/d/1osG-CF4hSYS1KmBo61H0fCNUMAinS5Ef/view",
        description: "Demo video showing the transactional API contact enrichment Screen Flow in action.",
        tag: "Video Demo",
      },
      {
        title: "Loan Prequalification Agent Demo",
        url: "https://drive.google.com/file/d/1nxHECsA96px-spkjEhCyo7xAe0HuVBus/view",
        description: "Demo video of the Loan Prequalification Agentforce agent processing loan documents.",
        tag: "Video Demo",
      },
      {
        title: "Salesforce Hulk: Document AI Walkthrough",
        url: "https://www.youtube.com/watch?v=tdace-XIGSs",
        description: "Community YouTube walkthrough covering Document AI features and setup.",
        tag: "YouTube",
      },
    ],
  },
  {
    title: "API Reference",
    color: "border-gray-400",
    items: [
      {
        title: "Extract Endpoint",
        url: "#api-extract",
        description: "POST /services/data/v63.0/ssot/document-processing/actions/extract-data — The core API for document extraction. Supports inline schema or IDP configuration.",
        tag: "REST API",
      },
      {
        title: "Supported Models",
        url: "#models",
        description: "Gemini 2.0 Flash (recommended for PDFs), Gemini 2.5 Flash, GPT-4o (recommended for OCR), Claude variants, Amazon Nova, NVIDIA Nemotron, and BYOLLM via Einstein Studio.",
        tag: "Reference",
      },
      {
        title: "Supported File Types",
        url: "#file-types",
        description: "PDF, PNG, JPG/JPEG, TIFF, BMP. Max 50 fields at root level. Table extraction supports 1 level of nesting.",
        tag: "Reference",
      },
    ],
  },
];

export default function ResourcesPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-[var(--sf-navy)] mb-3">
          Document AI Resources
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl">
          A curated collection of documentation, tutorials, videos, tools, and API references
          for Salesforce Data Cloud Document AI. Sourced from official Salesforce docs, the
          <code className="mx-1 px-1.5 py-0.5 bg-gray-100 rounded text-sm">#dc-document-ai-support</code>
          Slack channel, and the developer community.
        </p>
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        {sections.map((section) => (
          <a
            key={section.title}
            href={`#${section.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
            className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-[var(--sf-cloud)] hover:text-[var(--sf-blue)] transition-colors"
          >
            {section.title}
          </a>
        ))}
      </div>

      <div className="space-y-10">
        {sections.map((section) => (
          <div key={section.title} id={section.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}>
            <h2 className={`text-xl font-bold text-[var(--sf-navy)] mb-4 pb-2 border-b-2 ${section.color}`}>
              {section.title}
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {section.items.map((item) => (
                <a
                  key={item.title}
                  href={item.url}
                  target={item.url.startsWith("http") ? "_blank" : undefined}
                  rel={item.url.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="group block bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md hover:border-[var(--sf-blue)]/30 transition-all"
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h3 className="font-semibold text-gray-900 group-hover:text-[var(--sf-blue)] transition-colors">
                      {item.title}
                    </h3>
                    <span className="shrink-0 px-2 py-0.5 bg-gray-100 text-gray-500 rounded text-xs">
                      {item.tag}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">{item.description}</p>
                  {item.url.startsWith("http") && (
                    <div className="mt-3 text-xs text-gray-400 truncate">{item.url}</div>
                  )}
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 bg-[var(--sf-cloud)] rounded-xl p-6">
        <h3 className="font-bold text-[var(--sf-navy)] mb-3" id="api-extract">Quick API Reference</h3>
        <div className="bg-white rounded-lg p-4 font-mono text-sm overflow-x-auto">
          <div className="mb-4">
            <div className="text-gray-500 text-xs mb-1">Extract Endpoint</div>
            <code className="text-[var(--sf-blue)]">
              POST /services/data/v63.0/ssot/document-processing/actions/extract-data
            </code>
          </div>
          <div className="mb-4">
            <div className="text-gray-500 text-xs mb-1">Query Parameters</div>
            <code className="text-gray-700">?htmlEncode=false&extractDataWithConfidenceScore=true</code>
          </div>
          <div className="mb-4">
            <div className="text-gray-500 text-xs mb-1">Required Headers</div>
            <code className="text-gray-700">
              Authorization: Bearer &lt;access_token&gt;<br />
              Content-Type: application/json
            </code>
          </div>
          <div>
            <div className="text-gray-500 text-xs mb-1" id="models">Supported LLM Models</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-xs">
              <code>llmgateway__VertexAIGemini20Flash001</code>
              <code>llmgateway__VertexAIGemini25Flash</code>
              <code>llmgateway__OpenAIGPT4Omni_08_06</code>
              <code>llmgateway__OpenAIGPT41</code>
              <code>llmgateway__AnthropicClaude37Sonnet</code>
              <code>llmgateway__AmazonNovaPro</code>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 text-center">
        <p className="text-sm text-gray-500 mb-4">
          Want to jump into hands-on learning?
        </p>
        <Link
          href="/recipes"
          className="inline-flex items-center px-6 py-3 bg-[var(--sf-blue)] text-white font-semibold rounded-lg hover:bg-[var(--sf-blue-dark)] transition-colors"
        >
          Start the Recipes
          <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </div>
  );
}
