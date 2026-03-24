interface StepCardProps {
  step: number;
  title: string;
  children: React.ReactNode;
}

export default function StepCard({ step, title, children }: StepCardProps) {
  return (
    <div className="relative pl-12 pb-8 border-l-2 border-[var(--sf-cloud)] last:border-l-0 last:pb-0 ml-4">
      <div className="absolute -left-5 top-0 w-10 h-10 rounded-full bg-[var(--sf-blue)] text-white flex items-center justify-center font-bold text-sm shadow-md">
        {step}
      </div>
      <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
        <h3 className="text-lg font-semibold text-[var(--sf-navy)] mb-3">{title}</h3>
        <div className="text-gray-600 leading-relaxed">{children}</div>
      </div>
    </div>
  );
}
