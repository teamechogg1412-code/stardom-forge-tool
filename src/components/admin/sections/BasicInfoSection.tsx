import React from 'react';
import SectionWrapper from '../SectionWrapper';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';

export default function BasicInfoSection({ form, setForm }: any) {
  const fields = [
    { k: 'name_ko', l: '이름 (한글) *' }, { k: 'name_en', l: '이름 (영문)' }, { k: 'slug', l: 'URL 슬러그 *' },
    { k: 'instagram_id', l: '인스타그램 ID' }, { k: 'homepage_url', l: '공식 홈페이지' }, { k: 'namuwiki_url', l: '나무위키' },
    { k: 'followers', l: '팔로워' }, { k: 'posts', l: '게시물' }, { k: 'following', l: '팔로잉' },
    { k: 'height', l: '키' }, { k: 'language', l: '언어' }, { k: 'brand_keyword', l: '브랜드 키워드' }
  ];

  return (
    <SectionWrapper title="기본 정보 및 Artist Bio">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
        {fields.map(f => (
          <div key={f.k}>
            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{f.l}</Label>
            <Input 
              value={(form as any)[f.k]} 
              onChange={e => setForm({ ...form, [f.k]: e.target.value })} 
              className="mt-1 font-bold border-2 border-slate-100 focus:border-primary" 
            />
          </div>
        ))}
        <div className="col-span-full mt-4 text-left">
          <Label className="text-[10px] font-black uppercase tracking-widest text-primary">Headline (굵은 강조 문구)</Label>
          <Input 
            value={form.bio_headline} 
            onChange={e => setForm({ ...form, bio_headline: e.target.value })} 
            placeholder="예: 경계를 허물고 매 순간 낯선 얼굴을 꺼내놓는, 변주의 귀재." 
            className="mt-1 border-primary/30 font-black text-primary" 
          />
        </div>
        <div className="col-span-full mt-2 text-left">
          <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Artist Bio (본문 상세 소개)</Label>
          <textarea 
            value={form.bio_text} 
            onChange={e => setForm({ ...form, bio_text: e.target.value })} 
            className="w-full mt-1 min-h-[150px] p-3 border-2 border-slate-100 rounded-md bg-background text-sm leading-relaxed outline-none focus:border-primary" 
          />
        </div>
        {/* 노출 제어 */}
        <div className="col-span-full mt-6 flex items-center gap-8 p-4 bg-muted/50 rounded-lg border">
          <div className="flex items-center gap-2">
            <Checkbox
              id="is_published"
              checked={form.is_published}
              onCheckedChange={(checked) => setForm({ ...form, is_published: !!checked })}
            />
            <Label htmlFor="is_published" className="text-sm font-bold cursor-pointer">공개 (is_published)</Label>
          </div>
          <div className="flex-1">
            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">그룹 태그 (group_tag)</Label>
            <Input
              value={form.group_tag}
              onChange={e => setForm({ ...form, group_tag: e.target.value })}
              placeholder="예: general, echo, hidden"
              className="mt-1 font-bold border-2 border-slate-100 focus:border-primary"
            />
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}