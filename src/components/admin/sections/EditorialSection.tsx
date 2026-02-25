import React from 'react';
import SectionWrapper from '../SectionWrapper';
import DraggableList from '../DraggableList';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function EditorialSection({ editorials, setEditorials }: any) {
  return (
    <SectionWrapper title="화보 / 에디토리얼 (Editorial)">
      <DraggableList items={editorials} droppableId="editorials" onReorder={setEditorials} renderItem={(ed: any, i: number) => (
        <div className="mb-6 p-5 border-2 border-slate-200 rounded-xl bg-slate-50/50 text-left">
          <div className="flex gap-3 items-center mb-4">
            <Input placeholder="연도" value={ed.year_label} onChange={e => {
              const n = [...editorials]; n[i].year_label = e.target.value; setEditorials(n);
            }} className="w-24 font-bold" />
            <Input placeholder="매체명" value={ed.media_name} onChange={e => {
              const n = [...editorials]; n[i].media_name = e.target.value; setEditorials(n);
            }} className="flex-1 font-bold" />
            <Button variant="ghost" size="sm" onClick={() => setEditorials(editorials.filter((_: any, j: number) => j !== i))} className="text-destructive">✕</Button>
          </div>
          <div className="pl-4 space-y-2">
            {ed.media?.map((m: any, mi: number) => (
              <div key={mi} className="flex gap-2">
                <select 
                  value={m.media_type} 
                  onChange={e => {
                    const n = [...editorials]; n[i].media[mi].media_type = e.target.value; setEditorials(n);
                  }} 
                  className="border-2 border-slate-200 rounded-md px-2 py-2 text-xs font-black bg-white outline-none w-28"
                >
                  <option value="image">이미지</option>
                  <option value="video">영상(유튜브)</option>
                </select>
                <Input 
                  placeholder="URL" 
                  value={m.media_url} 
                  onChange={e => {
                    const n = [...editorials]; n[i].media[mi].media_url = e.target.value; setEditorials(n);
                  }} 
                  className="flex-1 text-xs h-9" 
                />
              </div>
            ))}
            <Button variant="outline" size="xs" onClick={() => {
              const n = [...editorials]; n[i].media = [...(n[i].media || []), { media_url: '', media_type: 'image' }]; setEditorials(n);
            }} className="text-[10px] font-bold">+ 미디어 추가</Button>
          </div>
        </div>
      )} />
      <Button variant="outline" onClick={() => setEditorials([...editorials, { year_label: '', media_name: '', media: [] }])}>+ 화보 추가</Button>
    </SectionWrapper>
  );
}