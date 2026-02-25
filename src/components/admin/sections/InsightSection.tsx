import React from 'react';
import SectionWrapper from '../SectionWrapper';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

export default function InsightSection({ insight, setInsight }: any) {
  const fields = [
    'monthly_search', 'content_saturation', 'audience_interest', 
    'gender_female_pct', 'regional_impact', 'age_20s', 
    'age_30s', 'age_40s', 'core_age_description'
  ];

  return (
    <SectionWrapper title="마켓 인사이트 (Data)">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
        {fields.map(key => (
          <div key={key} className="text-left">
            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{key.replace(/_/g, ' ')}</Label>
            <Input 
              value={insight[key]} 
              onChange={e => setInsight({ ...insight, [key]: e.target.value })} 
              className="mt-1 font-bold" 
            />
          </div>
        ))}
      </div>
    </SectionWrapper>
  );
}