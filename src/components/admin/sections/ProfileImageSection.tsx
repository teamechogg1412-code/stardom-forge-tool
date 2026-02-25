import React from 'react';
import SectionWrapper from '../SectionWrapper';
import DraggableList from '../DraggableList';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function ProfileImageSection({ images, setImages }: any) {
  return (
    <SectionWrapper title="프로필 이미지 관리 (Carousel)">
      <DraggableList items={images} droppableId="images" onReorder={setImages} renderItem={(img: any, i: number) => (
        <div className="flex gap-2 items-center mb-2 bg-slate-50 p-2 rounded-md border border-slate-100 shadow-sm">
          <Input 
            placeholder="이미지 URL" 
            value={img.image_url} 
            onChange={e => {
              const n = [...images]; n[i].image_url = e.target.value; setImages(n);
            }} 
            className="flex-1" 
          />
          {img.image_url && <img src={img.image_url} alt="" className="w-10 h-10 rounded object-cover border border-slate-200" />}
          <Button variant="ghost" size="sm" onClick={() => setImages(images.filter((_: any, j: number) => j !== i))} className="text-destructive">✕</Button>
        </div>
      )} />
      <Button variant="outline" size="sm" onClick={() => setImages([...images, { image_url: '' }])}>+ 프로필 사진 추가</Button>
    </SectionWrapper>
  );
}