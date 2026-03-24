import Link from "next/link";

const recipes = [
  {
    title: "Basic Salesforce Setup",
    description: "Enable Document AI in your org, configure schemas, and extract data from the Salesforce UI.",
    href: "/recipes/basic-setup",
    difficulty: "Beginner",
    duration: "30 min",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    title: "Document AI with APIs",
    description: "Authenticate via OAuth 2.0, call the extract endpoint from Postman, and parse confidence scores.",
    href: "/recipes/api-postman",
    difficulty: "Intermediate",
    duration: "45 min",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    title: "End-to-End Integration",
    description: "Build a full pipeline with Apex, Screen Flows, custom objects, and an Agentforce agent.",
    href: "/recipes/end-to-end",
    difficulty: "Advanced",
    duration: "90 min",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
      </svg>
    ),
  },
];

const highlights = [
  {
    title: "Sample Documents",
    description: "Download Medico Pharma invoices, prescriptions, and lab reports to test with Document AI.",
    href: "/samples",
    color: "from-teal-500 to-emerald-500",
  },
  {
    title: "Try It Live",
    description: "Upload documents, pick an LLM model, and extract structured data with confidence scores in your browser.",
    href: "/python-app",
    color: "from-purple-500 to-indigo-500",
  },
  {
    title: "Resources & Links",
    description: "Curated collection of docs, videos, Trailhead modules, and community guides.",
    href: "/resources",
    color: "from-orange-500 to-red-500",
  },
];

export default function Home() {
  return (
    <div>
      <section className="relative bg-gradient-to-br from-[var(--sf-navy)] via-[#0a3d6e] to-[var(--sf-blue)] text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-20 w-96 h-96 bg-blue-300 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="max-w-3xl">
            <div className="inline-block px-3 py-1 bg-white/10 rounded-full text-sm font-medium mb-6 backdrop-blur-sm">
              Salesforce Data Cloud
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 leading-tight">
              Document AI
              <br />
              <span className="text-blue-200">Learning Lab</span>
            </h1>
            <p className="text-lg md:text-xl text-blue-100 mb-8 max-w-2xl leading-relaxed">
              Hands-on recipes, sample documents, and ready-to-use code for building
              intelligent document processing with Salesforce Data Cloud Document AI.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/recipes"
                className="inline-flex items-center justify-center px-6 py-3 bg-white text-[var(--sf-navy)] font-semibold rounded-lg hover:bg-blue-50 transition-colors shadow-lg"
              >
                Start Learning
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
              <Link
                href="/samples"
                className="inline-flex items-center justify-center px-6 py-3 bg-white/10 text-white font-semibold rounded-lg hover:bg-white/20 transition-colors backdrop-blur-sm border border-white/20"
              >
                View Sample Docs
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[var(--sf-navy)] mb-3">Step-by-Step Recipes</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Follow these progressive recipes to go from zero to a fully integrated Document AI solution
            for <strong>Medico Pharmaceuticals</strong>.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {recipes.map((recipe, idx) => (
            <Link
              key={recipe.href}
              href={recipe.href}
              className="group relative bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-xl hover:border-[var(--sf-blue)]/30 transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 rounded-xl bg-[var(--sf-cloud)] text-[var(--sf-blue)] flex items-center justify-center group-hover:bg-[var(--sf-blue)] group-hover:text-white transition-colors">
                  {recipe.icon}
                </div>
                <span className="text-2xl font-bold text-gray-200 group-hover:text-[var(--sf-blue)]/20 transition-colors">
                  {String(idx + 1).padStart(2, "0")}
                </span>
              </div>
              <h3 className="text-xl font-semibold text-[var(--sf-navy)] mb-2 group-hover:text-[var(--sf-blue)] transition-colors">
                {recipe.title}
              </h3>
              <p className="text-gray-600 text-sm mb-4 leading-relaxed">{recipe.description}</p>
              <div className="flex items-center gap-3 text-xs">
                <span className={`px-2 py-0.5 rounded-full font-medium ${
                  recipe.difficulty === "Beginner" ? "bg-green-100 text-green-700" :
                  recipe.difficulty === "Intermediate" ? "bg-yellow-100 text-yellow-700" :
                  "bg-red-100 text-red-700"
                }`}>
                  {recipe.difficulty}
                </span>
                <span className="text-gray-400">{recipe.duration}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-6">
            {highlights.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group relative bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all border border-gray-100"
              >
                <div className={`w-12 h-1 bg-gradient-to-r ${item.color} rounded-full mb-4`} />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{item.description}</p>
                <div className="mt-4 text-sm font-medium text-[var(--sf-blue)] group-hover:underline">
                  Explore &rarr;
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gradient-to-r from-[var(--sf-navy)] to-[var(--sf-blue)] rounded-2xl p-8 md:p-12 text-white">
          <div className="max-w-2xl">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">About Medico Pharmaceuticals</h2>
            <p className="text-blue-100 mb-6 leading-relaxed">
              Throughout these recipes, we use <strong className="text-white">Medico Pharma</strong> as
              our fictional company. Medico is a mid-sized pharmaceutical distributor that receives
              hundreds of invoices, doctor prescriptions, lab reports, and purchase orders daily.
              They want to automate data extraction using Salesforce Document AI.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              {[
                { label: "Invoices", value: "500+/mo" },
                { label: "Prescriptions", value: "1000+/mo" },
                { label: "Suppliers", value: "120+" },
                { label: "Products", value: "2500+" },
              ].map((stat) => (
                <div key={stat.label} className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
                  <div className="text-xl font-bold">{stat.value}</div>
                  <div className="text-xs text-blue-200">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
