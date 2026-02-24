import type { Keyword } from '@/types/actor';

const sizeMap: Record<string, string> = {
  'tag-xl': 'text-4xl font-black text-primary',
  'tag-l': 'text-2xl font-extrabold text-primary/80',
  'tag-m': 'text-xl font-bold text-muted-foreground',
  'tag-s': 'text-base font-medium text-muted-foreground/60',
};

export default function KeywordCloud({ keywords }: { keywords: Keyword[] }) {
  if (keywords.length === 0) return null;

  return (
    <section className="py-20 px-[8%] border-b border-border">
      <h2 className="text-3xl font-black text-center tracking-[4px] uppercase text-primary mb-12">Audience Reputation Keywords</h2>
      <div className="bg-card border border-border rounded-[30px] p-16 max-w-[1200px] mx-auto min-h-[400px] flex flex-wrap justify-center items-center gap-x-10 gap-y-7 shadow-sm">
        {keywords.map((kw, i) => (
          <span
            key={kw.id}
            className={`inline-block whitespace-nowrap cursor-default transition-all duration-300 hover:text-accent hover:scale-110 animate-float-tag ${sizeMap[kw.size_class] || sizeMap['tag-m']}`}
            style={{ animationDelay: `${i * 0.4}s` }}
          >
            {kw.keyword}
          </span>
        ))}
      </div>
    </section>
  );
}
