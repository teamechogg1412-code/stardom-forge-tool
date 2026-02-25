import React from 'react';
import SectionWrapper from '../SectionWrapper';
import DraggableList from '../DraggableList';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

export default function AwardSection({ awards, setAwards }: any) {
  const updateItem = (index: number, updates: any) => {
    const n = [...awards];
    n[index] = { ...n[index], ...updates };
    setAwards(n);
  };

  return (
    <SectionWrapper title="수상 내역 (Awards)">
      <DraggableList items={awards} droppableId="awards" onReorder={setAwards} renderItem={(a: any, i: number) => (
        <div className="bg-slate-50 p-4 rounded-xl mb-3 border-2 border-slate-200 shadow-sm text-left">
          <div className="flex gap-3 items-center mb-3">
            <label className="flex items-center gap-2 shrink-0 cursor-pointer">
              <input 
                type="checkbox" 
                checked={a.show_on_profile} 
                onChange={e => updateItem(i, { show_on_profile: e.target.checked })} 
                className="w-4 h-4 accent-primary" 
              />
              <span className="text-[10px] font-black text-slate-500 uppercase">표시</span>
            </label>
            <Input placeholder="연도" value={a.year_label} onChange={e => updateItem(i, { year_label: e.target.value })} className="w-24 font-bold" />
            <Input placeholder="수상명" value={a.title} onChange={e => updateItem(i, { title: e.target.value })} className="flex-1 font-bold" />
            <Button variant="ghost" size="sm" onClick={() => setAwards(awards.filter((_: any, j: number) => j !== i))} className="text-destructive">✕</Button>
          </div>
          <div className="flex gap-3 items-center pl-8">
            <Label className="text-[10px] font-black text-primary uppercase shrink-0">수상장면 영상:</Label>
            <Input placeholder="YouTube URL" value={a.youtube_url || ''} onChange={e => updateItem(i, { youtube_url: e.target.value })} className="text-xs h-8" />
          </div>
        </div>
      )} />
      <Button variant="outline" size="sm" onClick={() => setAwards([...awards, { title: '', year_label: '', tag_style: 'award', show_on_profile: true, youtube_url: '' }])}>+ 수상 내역 추가</Button>
    </SectionWrapper>
  );
}