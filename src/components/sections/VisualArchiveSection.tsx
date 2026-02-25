import React from 'react';
import SectionWrapper from '../SectionWrapper';
import DraggableList from '../DraggableList';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function VisualArchiveSection({ videos, setVideos }: any) {
  return (
    <SectionWrapper title="비주얼 아카이브 (Visual Archive)">
      <DraggableList items={videos} droppableId="videos" onReorder={setVideos} renderItem={(v: any, i: number) => (
        <div className="mb-6 p-5 border-2 border-slate-200 rounded-xl bg-slate-50/50">
          <div className="flex gap-3 items-center mb-4 text-left">
            <select 
              value={v.category} 
              onChange={e => {
                const n = [...videos]; n[i].category = e.target.value; setVideos(n);
              }} 
              className="border-2 border-slate-200 rounded-md px-2 py-2 text-xs font-black bg-white"
            >
              <option value="drama_film">Drama & Film</option>
              <option value="advertising">Advertising</option>
              <option value="magazine">Magazine</option>
              <option value="event_diary">Event & Diary</option>
              <option value="music_video">Music Video</option>
              <option value="awards_other">Awards & Other</option>
            </select>
            <Input 
              placeholder="작품명" 
              value={v.project_name} 
              onChange={e => {
                const n = [...videos]; n[i].project_name = e.target.value; setVideos(n);
              }} 
              className="flex-1 font-bold" 
            />
            <Input 
              placeholder="연도" 
              value={v.year_label} 
              onChange={e => {
                const n = [...videos]; n[i].year_label = e.target.value; setVideos(n);
              }} 
              className="w-24 font-bold" 
            />
            <Button variant="ghost" size="sm" onClick={() => setVideos(videos.filter((_: any, j: number) => j !== i))} className="text-destructive">✕</Button>
          </div>
          <div className="pl-4 space-y-2">
            {v.links?.map((link: any, li: number) => (
              <div key={li} className="flex gap-2">
                <Input 
                  placeholder="영상 라벨" 
                  value={link.link_label} 
                  onChange={e => {
                    const n = [...videos]; n[i].links[li].link_label = e.target.value; setVideos(n);
                  }} 
                  className="w-40 text-xs h-9" 
                />
                <Input 
                  placeholder="YouTube URL" 
                  value={link.youtube_url} 
                  onChange={e => {
                    const n = [...videos]; n[i].links[li].youtube_url = e.target.value; setVideos(n);
                  }} 
                  className="flex-1 text-xs h-9" 
                />
              </div>
            ))}
            <Button variant="outline" size="xs" onClick={() => {
              const n = [...videos]; n[i].links = [...(n[i].links || []), { youtube_url: '', link_label: '' }]; setVideos(n);
            }} className="text-[10px] font-bold">+ 영상 링크 추가</Button>
          </div>
        </div>
      )} />
      <Button variant="outline" onClick={() => setVideos([...videos, { category: 'drama_film', project_name: '', year_label: '', links: [] }])}>+ 아카이브 항목 추가</Button>
    </SectionWrapper>
  );
}