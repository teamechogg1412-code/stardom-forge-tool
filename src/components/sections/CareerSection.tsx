import React from 'react';
import SectionWrapper from '../SectionWrapper';
import DraggableList from '../DraggableList';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

export default function CareerSection({ careers, setCareers }: any) {
  const updateItem = (index: number, updates: any) => {
    const n = [...careers];
    n[index] = { ...n[index], ...updates };
    setCareers(n);
  };

  return (
    <SectionWrapper title="커리어 포트폴리오 (Career Portfolio)">
      <DraggableList items={careers} droppableId="careers" onReorder={setCareers} renderItem={(c, i) => (
        <div className="mb-8 p-6 border-2 border-slate-200 rounded-xl bg-slate-50/50 shadow-sm">
          <div className="flex flex-wrap gap-3 items-start mb-5">
            <select value={c.category} onChange={e => updateItem(i, { category: e.target.value })} className="border-2 border-slate-200 rounded-md px-2 py-2 text-xs font-black bg-white">
              <option value="drama_film">기둥: Drama & Film</option>
              <option value="brand_editorial">기둥: Brand & Editorial</option>
            </select>
            <select value={c.sub_category} onChange={e => updateItem(i, { sub_category: e.target.value })} className="border-2 border-slate-200 rounded-md px-2 py-2 text-xs font-black bg-white focus:border-primary text-primary">
              <option value="">구분 선택</option>
              <option value="Drama">Drama</option>
              <option value="Movie">Movie</option>
              <option value="Editorial">Editorial</option>
              <option value="MV">MV</option>
              <option value="CF">CF</option>
              <option value="etc">etc</option>
            </select>
            <Input placeholder="연도" value={c.year_label} onChange={e => updateItem(i, { year_label: e.target.value })} className="w-20 font-bold" />
            <Input placeholder="작품명/활동명" value={c.title} onChange={e => updateItem(i, { title: e.target.value })} className="flex-1 font-black" />
            <Button variant="ghost" size="sm" onClick={() => setCareers(careers.filter((_: any, j: number) => j !== i))} className="text-destructive">✕</Button>
          </div>

          <div className="pl-4 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label className="text-[10px] font-black uppercase text-muted-foreground block mb-1">배역명</Label>
                <Input placeholder="예: 김건 역" value={c.description} onChange={e => updateItem(i, { description: e.target.value })} className="text-sm font-bold" />
              </div>
              <div>
                <Label className="text-[10px] font-black uppercase text-primary block mb-1">배역 프로필 이미지 URL (호버용)</Label>
                <Input placeholder="이미지 URL" value={c.role_image_url} onChange={e => updateItem(i, { role_image_url: e.target.value })} className="text-sm" />
              </div>
            </div>

            {/* 다중 링크 관리 */}
            <div className="bg-white p-4 rounded-lg border border-slate-200 space-y-3">
              <p className="text-[10px] font-black text-primary uppercase tracking-wider text-left">Links (영상/외부 페이지)</p>
              {c.links.map((link: any, li: number) => (
                <div key={li} className="flex gap-2">
                  <Input placeholder="라벨" value={link.link_label} onChange={e => {
                    const n = [...careers]; n[i].links[li].link_label = e.target.value; setCareers(n);
                  }} className="w-32 text-xs h-9" />
                  <Input placeholder="URL" value={link.link_url} onChange={e => {
                    const n = [...careers]; n[i].links[li].link_url = e.target.value; setCareers(n);
                  }} className="flex-1 text-xs h-9" />
                  <Button variant="ghost" size="sm" onClick={() => {
                    const n = [...careers]; n[i].links = n[i].links.filter((_: any, j: number) => j !== li); setCareers(n);
                  }}>✕</Button>
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={() => {
                const n = [...careers]; n[i].links = [...n[i].links, { link_url: '', link_label: '' }]; setCareers(n);
              }} className="text-[10px] font-bold">+ 링크 추가</Button>
            </div>
          </div>
        </div>
      )} />
      <Button variant="outline" className="w-full py-6 border-dashed border-2 font-black text-slate-400 hover:text-primary transition-all" onClick={() => setCareers([...careers, { category: 'drama_film', sub_category: '', year_label: '', title: '', description: '', role_image_url: '', links: [], images: [] }])}>
        + 새로운 커리어 항목 추가하기
      </Button>
    </SectionWrapper>
  );
}