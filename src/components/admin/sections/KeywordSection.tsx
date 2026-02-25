import React from 'react';
import SectionWrapper from '../SectionWrapper';
import DraggableList from '../DraggableList';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function KeywordSection({ keywords, setKeywords }: any) {
  return (
    <SectionWrapper title="Reputation Keywords">
      <DraggableList items={keywords} droppableId="keywords" onReorder={setKeywords} renderItem={(k: any, i: number) => (
        <div className="flex gap-2 items-center mb-2 bg-slate-50 p-2 rounded-md">
          <Input 
            placeholder="키워드" 
            value={k.keyword} 
            onChange={e => {
              const n = [...keywords]; n[i].keyword = e.target.value; setKeywords(n);
            }} 
            className="flex-1 font-bold" 
          />
          <select 
            value={k.size_class} 
            onChange={e => {
              const n = [...keywords]; n[i].size_class = e.target.value; setKeywords(n);
            }} 
            className="border-2 border-slate-200 rounded-md px-3 py-2 text-xs font-black bg-white outline-none"
          >
            <option value="tag-xl">XL</option>
            <option value="tag-l">L</option>
            <option value="tag-m">M</option>
            <option value="tag-s">S</option>
          </select>
          <Button variant="ghost" size="sm" onClick={() => setKeywords(keywords.filter((_: any, j: number) => j !== i))} className="text-destructive">✕</Button>
        </div>
      )} />
      <Button variant="outline" size="sm" onClick={() => setKeywords([...keywords, { keyword: '', size_class: 'tag-m' }])}>+ 키워드 추가</Button>
    </SectionWrapper>
  );
}