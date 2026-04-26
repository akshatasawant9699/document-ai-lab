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
      {
        title: "Einstein Trust Layer & Prompt Builder",
        url: "https://help.salesforce.com/s/articleView?id=sf.prompt_builder_grounding.htm&type=5",
        description: "Understanding prompt grounding and the Einstein Trust Layer used by Document AI for secure LLM interactions.",
        tag: "Salesforce Help",
      },
      {
        title: "Data Cloud Developer Guide",
        url: "https://developer.salesforce.com/docs/data/data-cloud-int/overview",
        description: "Complete Data Cloud integration guide covering setup, APIs, streaming, and unstructured data processing.",
        tag: "Developer Docs",
      },
    ],
  },
  {
    title: "Community & Support",
    color: "border-purple-500",
    items: [
      {
        title: "Salesforce Stack Exchange",
        url: "https://salesforce.stackexchange.com/questions/tagged/data-cloud",
        description: "Ask and answer questions about Data Cloud and Document AI on Salesforce Stack Exchange. Active community of developers and architects.",
        tag: "Q&A Forum",
      },
      {
        title: "Salesforce Developers Slack",
        url: "https://developer.salesforce.com/slack",
        description: "Join the official Salesforce Developers Community Slack workspace. Channels cover Data Cloud, AI, Apex, LWC, and integration topics.",
        tag: "Community Slack",
      },
      {
        title: "Trailblazer Community - Data Cloud",
        url: "https://trailblazers.salesforce.com/_ui/core/chatter/groups/GroupProfilePage?g=0F94V000000kHiu",
        description: "Trailblazer Community group for Data Cloud discussions, best practices, and peer-to-peer support.",
        tag: "Community Forum",
      },
      {
        title: "Success Community - Einstein AI",
        url: "https://trailblazers.salesforce.com/ideaSearch?filter=Einstein",
        description: "Submit and vote on Einstein AI feature requests, including Document AI enhancements. Track upcoming releases and product roadmap.",
        tag: "Feature Requests",
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
        title: "Apex Integration with Document AI",
        url: "https://developer.salesforce.com/docs/data/data-cloud-int/guide/c360-a-document-ai.html",
        description: "Official guide covering Apex invocable methods, HTTP callouts to the Document AI API, and integration patterns for Screen Flows.",
        tag: "Developer Guide",
      },
      {
        title: "Agentforce Developer Guide",
        url: "https://developer.salesforce.com/docs/einstein/genai/guide/agents-intro.htm",
        description: "Build autonomous agents with Agentforce. Covers agent topics, actions, and integration with Document AI for document processing workflows.",
        tag: "Developer Guide",
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
        title: "Document AI Learning Lab (This Portal)",
        url: "https://document-ai-lab.vercel.app/python-app",
        description: "Use the Try It section of this portal to connect to your Salesforce org and test Document AI extraction in real-time.",
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
        title: "Document AI + Agentforce Playlist",
        url: "https://youtube.com/playlist?list=PLgIMQe2PKPSI3azxe6ypZy4e9iXIFHK_u",
        description: "YouTube playlist covering Document AI setup, Flow integration, Apex patterns, and Agentforce agent configuration.",
        tag: "YouTube Playlist",
      },
      {
        title: "Data Cloud Overview - Salesforce+",
        url: "https://www.salesforce.com/plus/experience/dreamforce_2024/series/developer",
        description: "Salesforce+ sessions covering Data Cloud architecture, Document AI capabilities, and real-world use cases from Dreamforce.",
        tag: "Salesforce+",
      },
      {
        title: "Trailhead Live: Data Cloud Sessions",
        url: "https://trailhead.salesforce.com/live/videos/a2r3k000001n2KN",
        description: "Recorded Trailhead Live sessions featuring Data Cloud demos, Document AI walkthroughs, and Q&A with product experts.",
        tag: "Trailhead Live",
      },
      {
        title: "Salesforce Hulk: Document AI Walkthrough",
        url: "https://www.youtube.com/watch?v=tdace-XIGSs",
        description: "Community YouTube walkthrough covering Document AI features and setup.",
        tag: "YouTube",
      },
      {
        title: "Dreamforce 2024: Document AI Session",
        url: "https://www.salesforce.com/plus/experience/dreamforce_2024/series/ai_innovations",
        description: "Latest Document AI announcements, use cases, and roadmap from Dreamforce 2024.",
        tag: "Conference",
      },
    ],
  },
  {
    title: "Knowledge Base & Best Practices",
    color: "border-teal-500",
    items: [
      {
        title: "Schema Design Best Practices",
        url: "https://developer.salesforce.com/docs/data/data-cloud-int/guide/c360-a-document-ai.html#schema-design",
        description: "Guidelines for designing effective extraction schemas: field descriptions, data types, nesting limits, and prompt engineering tips.",
        tag: "Best Practices",
      },
      {
        title: "Model Selection Guide",
        url: "https://help.salesforce.com/s/articleView?id=data.c360_a_document_ai_models.htm&type=5",
        description: "Comparison of supported LLM models (Gemini, GPT-4o, Claude, Nova) with use case recommendations and performance characteristics.",
        tag: "Knowledge Base",
      },
      {
        title: "Error Handling & Troubleshooting",
        url: "https://developer.salesforce.com/docs/data/data-cloud-int/guide/c360-a-document-ai-troubleshooting.html",
        description: "Common error codes, resolution steps, and debugging techniques for Document AI API failures.",
        tag: "Troubleshooting",
      },
      {
        title: "Performance Optimization Tips",
        url: "#performance-tips",
        description: "Optimize extraction speed and accuracy: batch processing strategies, caching, schema refinement, and model tuning.",
        tag: "Best Practices",
      },
      {
        title: "Security & Data Governance",
        url: "https://help.salesforce.com/s/articleView?id=sf.bi_integrate_data_governance.htm&type=5",
        description: "Data privacy, field-level security, masking, and compliance considerations when processing sensitive documents.",
        tag: "Security",
      },
    ],
  },
  {
    title: "Web Resources & Blogs",
    color: "border-indigo-500",
    items: [
      {
        title: "Salesforce Developers Blog",
        url: "https://developer.salesforce.com/blogs",
        description: "Latest articles covering Document AI use cases, integration patterns, and new feature announcements from the Salesforce engineering team.",
        tag: "Blog",
      },
      {
        title: "Salesforce Architects Blog",
        url: "https://www.salesforce.com/blog/category/architects/",
        description: "Architecture patterns, enterprise integration strategies, and large-scale Document AI deployments.",
        tag: "Blog",
      },
      {
        title: "Medium: Salesforce Document AI",
        url: "https://medium.com/tag/salesforce",
        description: "Community-contributed tutorials, case studies, and real-world implementations of Document AI solutions.",
        tag: "Community Blog",
      },
      {
        title: "GitHub: Salesforce Sample Gallery",
        url: "https://github.com/trailheadapps",
        description: "Official Salesforce sample applications repository including Data Cloud and AI integration examples.",
        tag: "GitHub",
      },
      {
        title: "Awesome Salesforce Repository",
        url: "https://github.com/mailtoharshit/awesome-salesforce",
        description: "Curated list of Salesforce libraries, tools, and learning resources. Includes sections on AI, Data Cloud, and APIs.",
        tag: "GitHub Awesome",
      },
    ],
  },
  {
    title: "Release Notes & Updates",
    color: "border-pink-500",
    items: [
      {
        title: "Winter '25 Release Notes",
        url: "https://help.salesforce.com/s/articleView?id=release-notes.rn_data.htm&type=5",
        description: "Latest Document AI enhancements including new models, visual schema builder improvements, and API updates.",
        tag: "Release Notes",
      },
      {
        title: "Data Cloud Roadmap",
        url: "https://www.salesforce.com/products/data-cloud/overview/#roadmap",
        description: "Upcoming features, beta programs, and planned enhancements for Document AI and Data Cloud.",
        tag: "Roadmap",
      },
      {
        title: "Known Issues & Limitations",
        url: "https://help.salesforce.com/s/articleView?id=data.c360_a_document_ai_limits.htm&type=5",
        description: "Current limitations, governor limits, and known issues affecting Document AI functionality.",
        tag: "Known Issues",
      },
      {
        title: "API Version History",
        url: "https://developer.salesforce.com/docs/data/data-cloud-int/guide/versions.html",
        description: "API versioning, deprecation schedule, and migration guides for Document AI endpoints.",
        tag: "Versioning",
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
      {
        title: "Confidence Score Interpretation",
        url: "#confidence-scores",
        description: "Understanding confidence scores (0.0-1.0): scoring methodology, thresholds for production use, and handling low-confidence extractions.",
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
          A comprehensive collection of documentation, tutorials, videos, tools, and API references
          for Salesforce Data Cloud Document AI. Sourced from official Salesforce docs,
          Trailblazer Community, developer blogs, and curated web resources.
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

      <div className="mt-12 bg-gradient-to-br from-[var(--sf-navy)] to-[var(--sf-blue)] rounded-2xl p-8 text-white" id="performance-tips">
        <h3 className="text-2xl font-bold mb-4">Performance Optimization Tips</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-blue-200 mb-2">Schema Design</h4>
            <ul className="text-sm space-y-2 text-blue-100">
              <li>• Use clear, specific field descriptions for better extraction accuracy</li>
              <li>• Limit root-level fields to essential data (max 50 fields)</li>
              <li>• Keep nested tables to 1 level deep for optimal performance</li>
              <li>• Use appropriate data types (string, number, boolean, array)</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-blue-200 mb-2">Model Selection</h4>
            <ul className="text-sm space-y-2 text-blue-100">
              <li>• Gemini 2.0 Flash: Best for PDFs and fast extraction</li>
              <li>• GPT-4o: Complex layouts, handwriting, and OCR-heavy docs</li>
              <li>• Gemini 2.5 Flash: Latest model with improved accuracy</li>
              <li>• Test multiple models to find the best fit for your use case</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-blue-200 mb-2">API Best Practices</h4>
            <ul className="text-sm space-y-2 text-blue-100">
              <li>• Enable confidence scores for quality monitoring</li>
              <li>• Implement retry logic with exponential backoff</li>
              <li>• Use IDP configurations for production workloads</li>
              <li>• Cache schemas and reuse configurations when possible</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-blue-200 mb-2">Batch Processing</h4>
            <ul className="text-sm space-y-2 text-blue-100">
              <li>• Use GCS UDLO for large-scale document ingestion</li>
              <li>• Process documents asynchronously for better throughput</li>
              <li>• Monitor governor limits and API quotas</li>
              <li>• Implement error handling and dead letter queues</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-xl p-6" id="confidence-scores">
        <h3 className="text-xl font-bold text-[var(--sf-navy)] mb-3">Understanding Confidence Scores</h3>
        <p className="text-gray-700 mb-4">
          Document AI returns a confidence score (0.0 to 1.0) for each extracted field. Use these guidelines
          to interpret and act on confidence levels:
        </p>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="font-semibold text-green-800">High (≥ 0.9)</span>
            </div>
            <p className="text-sm text-green-700">
              Very reliable. Safe for automated workflows and downstream processing.
            </p>
          </div>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span className="font-semibold text-yellow-800">Medium (0.7 - 0.89)</span>
            </div>
            <p className="text-sm text-yellow-700">
              Generally accurate. Consider human review for critical fields.
            </p>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="font-semibold text-red-800">Low (&lt; 0.7)</span>
            </div>
            <p className="text-sm text-red-700">
              Requires review. May indicate unclear documents or schema issues.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8 text-center">
        <p className="text-sm text-gray-500 mb-4">
          Ready to build with Document AI? Start with our hands-on recipes!
        </p>
        <Link
          href="/recipes"
          className="inline-flex items-center px-6 py-3 bg-[var(--sf-blue)] text-white font-semibold rounded-lg hover:bg-[var(--sf-blue-dark)] transition-colors shadow-lg"
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
