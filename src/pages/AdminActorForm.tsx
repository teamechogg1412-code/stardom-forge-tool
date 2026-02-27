import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useActorById } from '@/hooks/useActorData';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import BasicInfoSection from '../components/admin/sections/BasicInfoSection';
import ProfileImageSection from '../components/admin/sections/ProfileImageSection';
import CareerSection from '../components/admin/sections/CareerSection';
import InsightSection from '../components/admin/sections/InsightSection';
import KeywordSection from '../components/admin/sections/KeywordSection';
import VisualArchiveSection from '../components/admin/sections/VisualArchiveSection';
import EditorialSection from '../components/admin/sections/EditorialSection';
import AwardSection from '../components/admin/sections/AwardSection';
import TagSection from '../components/admin/sections/TagSection';
import StaffAssignmentSection from '../components/admin/sections/StaffAssignmentSection';

export default function AdminActorForm() {
  const { id } = useParams<{ id: string }>();
  const isNew = id === 'new';
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { data: existingActor } = useActorById(id || '');

  const [form, setForm] = useState({
    name_ko: '', name_en: '', slug: '', profile_image_url: '', instagram_id: '',
    homepage_url: '', namuwiki_url: '', followers: '', posts: '', following: '',
    height: '', language: '', brand_keyword: '', bio_headline: '', bio_text: '',
    is_published: true, group_tag: 'general',
  });

  const [careers, setCareers] = useState<any[]>([]);
  const [insight, setInsight] = useState<any>({ monthly_search: '', content_saturation: '', audience_interest: '', gender_female_pct: 0, regional_impact: '', age_20s: 0, age_30s: 0, age_40s: 0, core_age_description: '' });
  const [keywords, setKeywords] = useState<any[]>([]);
  const [videos, setVideos] = useState<any[]>([]);
  const [awards, setAwards] = useState<any[]>([]);
  const [tags, setTags] = useState<any[]>([]);
  const [images, setImages] = useState<any[]>([]);
  const [editorials, setEditorials] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!existingActor) return;
    setForm({
      name_ko: existingActor.name_ko || '',
      name_en: existingActor.name_en || '',
      slug: existingActor.slug || '',
      profile_image_url: existingActor.profile_image_url || '',
      instagram_id: existingActor.instagram_id || '',
      homepage_url: (existingActor as any).homepage_url || '',
      namuwiki_url: (existingActor as any).namuwiki_url || '',
      followers: existingActor.followers || '',
      posts: existingActor.posts || '',
      following: existingActor.following || '',
      height: existingActor.height || '',
      language: existingActor.language || '',
      brand_keyword: existingActor.brand_keyword || '',
      bio_headline: (existingActor as any).bio_headline || '',
      bio_text: (existingActor as any).bio_text || '',
      is_published: existingActor.is_published ?? true,
      group_tag: (existingActor as any).group_tag || 'general',
    });

    // 커리어 데이터 매핑 (career_links -> links)
    setCareers(existingActor.careers.map(c => ({
      ...c,
      links: (c as any).career_links || [],
      images: c.career_images || []
    })));

    if (existingActor.insights) setInsight({...existingActor.insights});
    setKeywords(existingActor.keywords || []);
    setVideos(existingActor.videos?.map(v => ({ ...v, links: v.video_links || [] })) || []);
    setAwards(existingActor.awards || []);
    setTags(existingActor.actor_tags || []);
    setImages(existingActor.images || []);
    setEditorials(existingActor.editorials || []);
  }, [existingActor]);

  const handleSave = async () => {
    setSaving(true);
    try {
      let actorId = id;

      // 1. 기본 정보 저장
      if (isNew) {
        const { data, error } = await supabase.from('actors').insert([form]).select().single();
        if (error) throw error;
        actorId = data.id;
      } else {
        const { error } = await supabase.from('actors').update(form).eq('id', id);
        if (error) throw error;
      }

      // 2. 하위 데이터 초기화 및 재등록 (트랜잭션 대신 순차 처리)
      // 이 방식이 가장 확실하게 저장됩니다.
      await Promise.all([
        supabase.from('actor_images').delete().eq('actor_id', actorId),
        supabase.from('actor_tags').delete().eq('actor_id', actorId),
        supabase.from('keywords').delete().eq('actor_id', actorId),
        supabase.from('awards').delete().eq('actor_id', actorId),
        supabase.from('insights').delete().eq('actor_id', actorId),
      ]);

      // 기본 하위 테이블들 인서트
      if (images.length > 0) await supabase.from('actor_images').insert(images.map((img, idx) => ({ actor_id: actorId, image_url: img.image_url, sort_order: idx })));
      if (tags.length > 0) await supabase.from('actor_tags').insert(tags.map(t => ({ actor_id: actorId, tag_text: t.tag_text, tag_style: t.tag_style })));
      if (keywords.length > 0) await supabase.from('keywords').insert(keywords.map(k => ({ actor_id: actorId, keyword: k.keyword, size_class: k.size_class })));
      if (awards.length > 0) await supabase.from('awards').insert(awards.map(a => ({ actor_id: actorId, title: a.title, year_label: a.year_label, tag_style: a.tag_style, show_on_profile: a.show_on_profile, youtube_url: a.youtube_url })));
      await supabase.from('insights').insert([{ ...insight, actor_id: actorId }]);

      // 3. 복잡한 관계 데이터 (Careers, Editorials, Videos)
      // 커리어 저장
      await supabase.from('careers').delete().eq('actor_id', actorId);
      for (const [idx, c] of careers.entries()) {
        const { data: savedCareer } = await supabase.from('careers').insert([{
          actor_id: actorId, category: c.category, sub_category: c.sub_category,
          year_label: c.year_label, title: c.title, description: c.description,
          role_image_url: c.role_image_url, sort_order: idx
        }]).select().single();
        
        if (c.links?.length > 0) {
          await supabase.from('career_links').insert(c.links.map((l: any, lidx: number) => ({
            career_id: savedCareer.id, link_url: l.link_url, link_label: l.link_label, sort_order: lidx
          })));
        }
      }

      // 화보 저장 (category 포함)
      await supabase.from('editorials').delete().eq('actor_id', actorId);
      for (const [idx, ed] of editorials.entries()) {
        const { data: savedEd } = await supabase.from('editorials').insert([{
          actor_id: actorId, year_label: ed.year_label, media_name: ed.media_name,
          category: ed.category, sort_order: idx
        }]).select().single();
        
        if (ed.editorial_media?.length > 0) {
          await supabase.from('editorial_media').insert(ed.editorial_media.map((m: any, midx: number) => ({
            editorial_id: savedEd.id, media_url: m.media_url, media_type: m.media_type, sort_order: midx
          })));
        }
      }

      // 비주얼 아카이브 저장
      await supabase.from('videos').delete().eq('actor_id', actorId);
      for (const [idx, v] of videos.entries()) {
        const { data: savedVid } = await supabase.from('videos').insert([{
          actor_id: actorId, category: v.category, project_name: v.project_name,
          year_label: v.year_label, sort_order: idx
        }]).select().single();
        
        if (v.links?.length > 0) {
          await supabase.from('video_links').insert(v.links.map((l: any, lidx: number) => ({
            video_id: savedVid.id, youtube_url: l.youtube_url, link_label: l.link_label, sort_order: lidx
          })));
        }
      }

      toast({ title: '저장 완료', description: '모든 데이터가 성공적으로 업데이트되었습니다.' });
      qc.invalidateQueries({ queryKey: ['actor-edit', actorId] });
      navigate('/admin');
    } catch (e: any) {
      console.error(e);
      toast({ title: '오류 발생', description: e.message, variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="px-[6%] py-5 flex items-center justify-between border-b-2 border-primary text-foreground sticky top-0 bg-white/90 backdrop-blur-md z-[100]">
        <div className="flex items-center gap-4">
          <Link to="/admin" className="text-sm font-black tracking-[2px] text-primary uppercase">← Admin</Link>
          <span className="text-sm font-bold text-muted-foreground">{isNew ? '새 배우 등록' : '배우 편집'}</span>
        </div>
        <div className="flex gap-3">
          <Link to="/admin"><Button variant="ghost" className="font-bold">취소</Button></Link>
          <Button onClick={handleSave} disabled={saving} className="bg-slate-900 text-white font-black px-8 hover:bg-primary shadow-lg transition-all">
            {saving ? '저장 중...' : '전체 저장'}
          </Button>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-10">
        <Tabs defaultValue="basic" className="w-full space-y-8">
          <TabsList className="grid grid-cols-4 w-full h-auto p-1 bg-slate-200/50 sticky top-[84px] z-[90] shadow-sm">
            <TabsTrigger value="basic" className="py-3 font-black text-xs uppercase tracking-tighter data-[state=active]:bg-white data-[state=active]:text-primary">기본 정보 / 소개</TabsTrigger>
            <TabsTrigger value="career" className="py-3 font-black text-xs uppercase tracking-tighter data-[state=active]:bg-white data-[state=active]:text-primary">커리어 (Career)</TabsTrigger>
            <TabsTrigger value="media" className="py-3 font-black text-xs uppercase tracking-tighter data-[state=active]:bg-white data-[state=active]:text-primary">화보 / 아카이브</TabsTrigger>
            <TabsTrigger value="data" className="py-3 font-black text-xs uppercase tracking-tighter data-[state=active]:bg-white data-[state=active]:text-primary">데이터 / 수상</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-6 focus-visible:outline-none">
            <BasicInfoSection form={form} setForm={setForm} />
            <ProfileImageSection images={images} setImages={setImages} />
            <TagSection tags={tags} setTags={setTags} />
          </TabsContent>

          <TabsContent value="career" className="focus-visible:outline-none">
            <CareerSection careers={careers} setCareers={setCareers} />
          </TabsContent>

          <TabsContent value="media" className="space-y-6 focus-visible:outline-none">
            <EditorialSection editorials={editorials} setEditorials={setEditorials} />
            <VisualArchiveSection videos={videos} setVideos={setVideos} />
          </TabsContent>

          <TabsContent value="data" className="space-y-6 focus-visible:outline-none">
            <InsightSection insight={insight} setInsight={setInsight} />
            <KeywordSection keywords={keywords} setKeywords={setKeywords} />
            <AwardSection awards={awards} setAwards={setAwards} />
          </TabsContent>
        </Tabs>

        <div className="mt-20 pt-10 border-t-4 border-slate-900">
           <Button onClick={handleSave} disabled={saving} className="w-full bg-slate-900 text-white font-black h-20 text-2xl shadow-2xl hover:bg-primary transition-all rounded-2xl">
            {saving ? '저장 처리 중...' : '포트폴리오 전체 업데이트 완료'}
          </Button>
        </div>
      </div>
    </div>
  );
}
