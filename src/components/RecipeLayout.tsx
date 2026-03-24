import Link from "next/link";

interface RecipeLayoutProps {
  title: string;
  description: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  duration: string;
  prerequisites?: string[];
  children: React.ReactNode;
  prevRecipe?: { label: string; href: string };
  nextRecipe?: { label: string; href: string };
}

const difficultyColors = {
  Beginner: "bg-green-100 text-green-800",
  Intermediate: "bg-yellow-100 text-yellow-800",
  Advanced: "bg-red-100 text-red-800",
};

export default function RecipeLayout({
  title,
  description,
  difficulty,
  duration,
  prerequisites,
  children,
  prevRecipe,
  nextRecipe,
}: RecipeLayoutProps) {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Link
        href="/recipes"
        className="inline-flex items-center text-sm text-[var(--sf-blue)] hover:underline mb-6"
      >
        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        All Recipes
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[var(--sf-navy)] mb-3">{title}</h1>
        <p className="text-lg text-gray-600 mb-4">{description}</p>
        <div className="flex flex-wrap items-center gap-3">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${difficultyColors[difficulty]}`}>
            {difficulty}
          </span>
          <span className="text-sm text-gray-500 flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {duration}
          </span>
        </div>
      </div>

      {prerequisites && prerequisites.length > 0 && (
        <div className="bg-[var(--sf-cloud)] border border-blue-100 rounded-xl p-5 mb-8">
          <h3 className="font-semibold text-[var(--sf-navy)] mb-2">Prerequisites</h3>
          <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
            {prerequisites.map((p, i) => (
              <li key={i}>{p}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="recipe-content">{children}</div>

      <div className="flex justify-between mt-12 pt-6 border-t border-gray-200">
        {prevRecipe ? (
          <Link
            href={prevRecipe.href}
            className="inline-flex items-center text-sm font-medium text-[var(--sf-blue)] hover:underline"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            {prevRecipe.label}
          </Link>
        ) : <div />}
        {nextRecipe ? (
          <Link
            href={nextRecipe.href}
            className="inline-flex items-center text-sm font-medium text-[var(--sf-blue)] hover:underline"
          >
            {nextRecipe.label}
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        ) : <div />}
      </div>
    </div>
  );
}
