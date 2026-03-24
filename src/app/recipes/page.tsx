import Link from "next/link";

const recipes = [
  {
    number: 1,
    title: "Basic Document AI Setup in Salesforce",
    description:
      "Learn how to enable Document AI in your Salesforce org, create a Document AI configuration, define extraction schemas, upload sample Medico Pharma invoices, and test extraction directly from the Salesforce UI.",
    href: "/recipes/basic-setup",
    difficulty: "Beginner",
    duration: "30 min",
    topics: ["Enable Document AI", "Schema Configuration", "Field Mapping", "UI Testing"],
  },
  {
    number: 2,
    title: "Document AI with REST APIs & Postman",
    description:
      "Authenticate with OAuth 2.0 client credentials, call the Document AI extract endpoint from Postman, send Medico Pharma invoices and prescriptions as base64 payloads, and parse structured responses with confidence scores.",
    href: "/recipes/api-postman",
    difficulty: "Intermediate",
    duration: "45 min",
    topics: ["OAuth 2.0", "REST API", "Postman Collection", "Confidence Scores"],
  },
  {
    number: 3,
    title: "End-to-End: Apex, Flows & Agentforce",
    description:
      "Build a complete document processing pipeline for Medico Pharma: custom objects for invoices, an Apex class to call Document AI, a Screen Flow for user-driven extraction, and an Agentforce agent for autonomous processing.",
    href: "/recipes/end-to-end",
    difficulty: "Advanced",
    duration: "90 min",
    topics: ["Custom Objects", "Apex Class", "Screen Flow", "Agentforce Agent"],
  },
];

export default function RecipesPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-[var(--sf-navy)] mb-3">
          Document AI Recipes
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl">
          Progressive, hands-on tutorials that take you from basic setup to a fully
          automated document processing pipeline for{" "}
          <strong>Medico Pharmaceuticals</strong>.
        </p>
      </div>

      <div className="space-y-6">
        {recipes.map((recipe) => (
          <Link
            key={recipe.href}
            href={recipe.href}
            className="group block bg-white border border-gray-200 rounded-2xl p-6 md:p-8 hover:shadow-lg hover:border-[var(--sf-blue)]/30 transition-all"
          >
            <div className="flex items-start gap-6">
              <div className="hidden sm:flex shrink-0 w-16 h-16 rounded-2xl bg-[var(--sf-cloud)] text-[var(--sf-blue)] items-center justify-center text-2xl font-bold group-hover:bg-[var(--sf-blue)] group-hover:text-white transition-colors">
                {recipe.number}
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <h2 className="text-xl font-semibold text-[var(--sf-navy)] group-hover:text-[var(--sf-blue)] transition-colors">
                    {recipe.title}
                  </h2>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      recipe.difficulty === "Beginner"
                        ? "bg-green-100 text-green-700"
                        : recipe.difficulty === "Intermediate"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {recipe.difficulty}
                  </span>
                  <span className="text-xs text-gray-400">{recipe.duration}</span>
                </div>
                <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                  {recipe.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {recipe.topics.map((topic) => (
                    <span
                      key={topic}
                      className="px-2.5 py-1 bg-gray-100 text-gray-600 rounded-md text-xs"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
