import type { Insight } from '@/types/actor';

export default function MarketInsight({ insight }: { insight: Insight | null }) {
  if (!insight) return null;

  return (
    <section className="py-24 px-[8%] bg-secondary/50 border-b border-border">
      <h2 className="text-3xl font-black text-center tracking-[4px] uppercase text-primary mb-4">Market Insight</h2>
      <p className="text-center text-sm text-muted-foreground font-bold mb-12">DATA DRIVEN ANALYSIS</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-[1200px] mx-auto">
        <InsightCard label="Monthly Search (KR)" value={insight.monthly_search} sub="Total Buzz (PC+Mobile)" />
        <InsightCard label="Content Saturation" value={insight.content_saturation} sub="매우 낮음 (시장 희소성 최상)" />
        <InsightCard label="Audience Interest" value={insight.audience_interest} sub="지속적인 우상향 곡선 유지" />

        {insight.gender_female_pct != null && (
          <div className="bg-card rounded-2xl p-8 shadow-sm border border-border">
            <span className="text-xs text-muted-foreground font-extrabold uppercase tracking-wide block mb-3">Gender Ratio</span>
            <div className="flex items-center gap-5">
              <div className="w-[70px] h-[70px] rounded-full relative flex items-center justify-center"
                style={{ background: `conic-gradient(hsl(var(--primary)) 0% ${insight.gender_female_pct}%, hsl(var(--border)) ${insight.gender_female_pct}% 100%)` }}>
                <div className="w-[50px] h-[50px] bg-card rounded-full flex items-center justify-center text-sm font-black">
                  {insight.gender_female_pct}%
                </div>
              </div>
              <div>
                <p className="font-extrabold">여성 {insight.gender_female_pct}%</p>
                <p className="text-sm text-muted-foreground">여성 타겟 압도적 우위</p>
              </div>
            </div>
          </div>
        )}

        <InsightCard label="Regional Impact" value={insight.regional_impact} sub="수도권 및 대도시 집중형" />

        {(insight.age_20s != null || insight.age_30s != null || insight.age_40s != null) && (
          <div className="bg-card rounded-2xl p-8 shadow-sm border border-border">
            <span className="text-xs text-muted-foreground font-extrabold uppercase tracking-wide block mb-3">Core Age Target</span>
            <div className="space-y-3">
              {[
                { label: '20s', value: insight.age_20s },
                { label: '30s', value: insight.age_30s },
                { label: '40s', value: insight.age_40s },
              ].map(age => age.value != null ? (
                <div key={age.label} className="flex items-center gap-3">
                  <span className="w-8 text-xs font-extrabold text-muted-foreground">{age.label}</span>
                  <div className="flex-1 h-2 bg-border rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: `${age.value}%` }} />
                  </div>
                </div>
              ) : null)}
            </div>
            {insight.core_age_description && (
              <p className="text-sm text-muted-foreground font-bold mt-3">{insight.core_age_description}</p>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

function InsightCard({ label, value, sub }: { label: string; value: string | null; sub: string }) {
  if (!value) return null;
  return (
    <div className="bg-card rounded-2xl p-8 shadow-sm border border-border flex flex-col justify-center">
      <span className="text-xs text-muted-foreground font-extrabold uppercase tracking-wide block mb-3">{label}</span>
      <span className="text-3xl font-black text-primary">{value}</span>
      <span className="text-sm text-muted-foreground font-semibold mt-1">{sub}</span>
    </div>
  );
}
