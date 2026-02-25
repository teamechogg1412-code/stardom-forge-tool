import React from 'react';
import SectionWrapper from '../SectionWrapper';
import DraggableList from '../DraggableList';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function TagSection({ tags, setTags }: any) {
  return (
    <SectionWrapper title="프로젝트 태그 (Tags)">
      <DraggableList items={tags} droppableId="tags" onReorder={setTags} renderItem={(t: any, i: number) => (
        <div className="flex gap-2 items-center mb-2 bg-slate-50 p-2 rounded-md">
          <Input 
            placeholder="태그 텍스트" 
            value={t.tag_text} 
            onChange={e => {
              const n = [...tags]; n[i].tag_text = e.target.value; setTags(n);
            }} 
            className="flex-1 font-bold" 
          />
          <select 
            value={t.tag_style} 
            onChange={e => {
              const n = [...tags]; n[i].tag_style = e.target.value; setTags(n);
            }} 
            className="border-2 border-slate-200 rounded-md px-3 py-2 text-xs font-black bg-white outline-none"
          >
            <option value="normal">Normal</option>
            <option value="important">Important</option>
            <option value="award">Award</option>
          </select>
          <Button variant="ghost" size="sm" onClick={() => setTags(tags.filter((_: any, j: number) => j !== i))} className="text-destructive">✕</Button>
        </div>
      )} />
      <Button variant="outline" size="sm" onClick={() => setTags([...tags, { tag_text: '', tag_style: 'normal' }])}>+ 태그 추가</Button>
    </SectionWrapper>
  );
}