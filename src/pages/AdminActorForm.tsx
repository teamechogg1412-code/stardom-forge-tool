import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useActorById } from '@/hooks/useActorData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';
import DraggableList from '@/components/admin/DraggableList';

type CareerImageItem = { image_url: string };
type CareerItem = { category: string; year_label: string; title: string; description: string; youtube_url: string; images: CareerImageItem[] };
type KeywordItem = { keyword: string; size_class: string };
type VideoLink = { youtube_url: string; link_label: string };
type VideoItem = { category: string; project_name: string; year_label: string; links: VideoLink[] };
type AwardItem = { title: string; year_label: string; tag_style: string };
type TagItem = { tag_text: string; tag_style: string };
type ImageItem = { image_url: string };
type EditorialMediaItem = { media_url: string; media_type: 'image' | 'video' };
type EditorialItem = { year_label: string; media_name: string; media: EditorialMediaItem[] };

export default function AdminActorForm() {
  const { id } = useParams<{ id: string }>();
  const isNew = id === 'new';
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { data: existingActor } = useActorById(id || '');

  const [form, setForm] = useState({
    name_ko: '', name_en: '', slug: '', profile_image_url: '', instagram_id: '',
    homepage_url: '', namuwiki_url: '',
    followers: '', posts: '', following: '', avg_likes: '', avg_comments: '',
    height: '', language: '', brand_keyword: '',
  });

  const [careers, setCareers] = useState<CareerItem[]>([]);
  const [insight, setInsight] = useState({ monthly_search: '', content_saturation: '', audience_interest: '', gender_female_pct: '', regional_impact: '', age_20s: '', age_30s: '', age_40s: '', core_age_description: '' });
  const [keywords, setKeywords] = useState<KeywordItem[]>([]);
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [awards, setAwards] = useState<AwardItem[]>([]);
  const [tags, setTags] = useState<TagItem[]>([]);
  const [images, setImages] = useState<ImageItem[]>([]);
  const [editorials, setEditorials] = useState<EditorialItem[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!existingActor) return;
    setForm({
      name_ko: existingActor.name_ko || '', name_en: existingActor.name_en || '', slug: existingActor.slug || '',
      profile_image_url: existingActor.profile_image_url || '', instagram_id: existingActor.instagram_id || '',
      homepage_url: (existingActor as any).homepage_url || '', namuwiki_url: (existingActor as any).namuwiki_url || '',
      followers: existingActor.followers || '', posts: existingActor.posts || '', following: existingActor.following || '',
      avg_likes: existingActor.avg_likes || '', avg_comments: existingActor.avg_comments || '',
      height: existingActor.height || '', language: existingActor.language || '', brand_keyword: existingActor.brand_keyword || '',
    });
    setCareers(existingActor.careers.map(c => ({ category: c.category, year_label: c.year_label, title: c.title, description: c.description || '', youtube_url: c.youtube_url || '', images: (c.career_images || []).map(ci => ({ image_url: ci.image_url })) })));
    if (existingActor.insights) {
      const ins = existingActor.insights;
      setInsight({
        monthly_search: ins.monthly_search || '', content_saturation: ins.content_saturation || '',
        audience_interest: ins.audience_interest || '', gender_female_pct: ins.gender_female_pct?.toString() || '',
        regional_impact: ins.regional_impact || '', age_20s: ins.age_20s?.toString() || '',
        age_30s: ins.age_30s?.toString() || '', age_40s: ins.age_40s?.toString() || '',
        core_age_description: ins.core_age_description || '',
      });
    }
    setKeywords(existingActor.keywords.map(k => ({ keyword: k.keyword, size_class: k.size_class })));
    setVideos(existingActor.videos.map(v => ({ category: v.category || 'drama_film', project_name: v.project_name, year_label: v.year_label || '', links: (v.video_links || []).map(l => ({ youtube_url: l.youtube_url, link_label: l.link_label || '' })) })));
    setAwards(existingActor.awards.map(a => ({ title: a.title, year_label: a.year_label || '', tag_style: a.tag_style })));
    setTags(existingActor.actor_tags.map(t => ({ tag_text: t.tag_text, tag_style: t.tag_style })));
    setImages(existingActor.images.map(img => ({ image_url: img.image_url })));
    setEditorials(existingActor.editorials.map(e => ({
      year_label: e.year_label || '', media_name: e.media_name || '',
      media: (e.editorial_media || []).map(m => ({ media_url: m.media_url, media_type: m.media_type })),
    })));
  }, [existingActor]);

  const handleSave = async () => {
    if (!form.name_ko || !form.slug) {
      toast({ title: '오류', description: '이름과 슬러그는 필수입니다.', variant: 'destructive' });
      return;
    }
    setSaving(true);
    try {
      let actorId = id;

      if (isNew) {
        const { data, error } = await supabase.from('actors').insert([form]).select().single();
        if (error) throw error;
        actorId = data.id;
      } else {
        const { error } = await supabase.from('actors').update(form).eq('id', id);
        if (error) throw error;
        await Promise.all([
          supabase.from('actor_images').delete().eq('actor_id', id),
          supabase.from('careers').delete().eq('actor_id', id),
          supabase.from('insights').delete().eq('actor_id', id),
          supabase.from('keywords').delete().eq('actor_id', id),
          supabase.from('videos').delete().eq('actor_id', id),
          supabase.from('awards').delete().eq('actor_id', id),
          supabase.from('actor_tags').delete().eq('actor_id', id),
          supabase.from('editorials').delete().eq('actor_id', id),
        ]);
      }

      const promises: PromiseLike<any>[] = [];

      if (careers.length > 0) {
        for (let i = 0; i < careers.length; i++) {
          const c = careers[i];
          const { data: careerRow, error: cErr } = await supabase.from('careers').insert([{
            actor_id: actorId, category: c.category, year_label: c.year_label, title: c.title, description: c.description || null, youtube_url: c.youtube_url || null, sort_order: i,
          }]).select().single();
          if (cErr) throw cErr;
          const validImages = c.images.filter(img => img.image_url.trim());
          if (validImages.length > 0) {
            const { error: ciErr } = await supabase.from('career_images').insert(
              validImages.map((img, si) => ({ career_id: careerRow.id, image_url: img.image_url, sort_order: si }))
            );
            if (ciErr) throw ciErr;
          }
        }
      }
      if (Object.values(insight).some(v => v)) {
        promises.push(supabase.from('insights').insert([{
          actor_id: actorId,
          monthly_search: insight.monthly_search || null,
          content_saturation: insight.content_saturation || null,
          audience_interest: insight.audience_interest || null,
          gender_female_pct: insight.gender_female_pct ? parseInt(insight.gender_female_pct) : null,
          regional_impact: insight.regional_impact || null,
          age_20s: insight.age_20s ? parseInt(insight.age_20s) : null,
          age_30s: insight.age_30s ? parseInt(insight.age_30s) : null,
          age_40s: insight.age_40s ? parseInt(insight.age_40s) : null,
          core_age_description: insight.core_age_description || null,
        }]));
      }
      if (keywords.length > 0) {
        promises.push(supabase.from('keywords').insert(keywords.map(k => ({ ...k, actor_id: actorId }))));
      }
      if (videos.length > 0) {
        for (let i = 0; i < videos.length; i++) {
          const v = videos[i];
          const normalizedLinks = v.links.filter(link => link.youtube_url.trim());
          const primaryYouTubeUrl = normalizedLinks[0]?.youtube_url ?? '';

          const { data: videoRow, error: vErr } = await supabase.from('videos').insert([{
            actor_id: actorId,
            category: v.category,
            project_name: v.project_name,
            year_label: v.year_label,
            youtube_url: primaryYouTubeUrl,
            sort_order: i,
          }]).select().single();
          if (vErr) throw vErr;

          if (normalizedLinks.length > 0) {
            const { error: lErr } = await supabase.from('video_links').insert(
              normalizedLinks.map((l, li) => ({
                video_id: videoRow.id,
                youtube_url: l.youtube_url,
                link_label: l.link_label,
                sort_order: li,
              }))
            );
            if (lErr) throw lErr;
          }
        }
      }
      if (awards.length > 0) {
        promises.push(supabase.from('awards').insert(awards.map(a => ({ title: a.title, year_label: a.year_label || null, tag_style: a.tag_style, actor_id: actorId }))));
      }
      if (tags.length > 0) {
        promises.push(supabase.from('actor_tags').insert(tags.map(t => ({ ...t, actor_id: actorId }))));
      }
      if (images.length > 0) {
        promises.push(supabase.from('actor_images').insert(images.map((img, i) => ({ ...img, actor_id: actorId, sort_order: i }))));
      }
      if (editorials.length > 0) {
        for (let i = 0; i < editorials.length; i++) {
          const ed = editorials[i];
          const { data: edRow, error: eErr } = await supabase.from('editorials').insert([{
            actor_id: actorId, year_label: ed.year_label, media_name: ed.media_name, sort_order: i,
          }]).select().single();
          if (eErr) throw eErr;
          if (ed.media.length > 0) {
            const { error: mErr } = await supabase.from('editorial_media').insert(
              ed.media.map((m, mi) => ({ editorial_id: edRow.id, media_url: m.media_url, media_type: m.media_type, sort_order: mi }))
            );
            if (mErr) throw mErr;
          }
        }
      }

      await Promise.all(promises);
      qc.invalidateQueries({ queryKey: ['actors'] });
      toast({ title: '저장 완료' });
      navigate('/admin');
    } catch (err: any) {
      toast({ title: '오류', description: err.message, variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const field = (key: keyof typeof form, label: string) => (
    <div key={key}>
      <Label className="text-xs font-extrabold uppercase">{label}</Label>
      <Input value={form[key]} onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))} className="mt-1" />
    </div>
  );

  const updateItem = <T,>(list: T[], index: number, updates: Partial<T>, setter: (v: T[]) => void) => {
    const n = [...list];
    n[index] = { ...n[index], ...updates };
    setter(n);
  };

  return (
    <div className="min-h-screen bg-background">
      <nav className="px-[6%] py-5 flex items-center gap-4 border-b-2 border-primary">
        <Link to="/admin" className="text-sm font-black tracking-[2px] text-primary uppercase">← Admin</Link>
        <span className="text-border">/</span>
        <span className="text-sm font-bold text-muted-foreground">{isNew ? '새 배우 등록' : '배우 편집'}</span>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-10 space-y-10">
        {/* 기본 정보 */}
        <Section title="기본 정보">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {field('name_ko', '이름 (한글) *')}
            {field('name_en', '이름 (영문)')}
            {field('slug', 'URL 슬러그 *')}
            {field('instagram_id', '인스타그램 ID')}
            {field('homepage_url', '공식 홈페이지 URL')}
            {field('namuwiki_url', '나무위키 URL (관리자용)')}
            {field('followers', '팔로워')}
            {field('posts', '게시물 수')}
            {field('following', '팔로잉')}
            {field('avg_likes', '평균 좋아요')}
            {field('avg_comments', '평균 댓글')}
            {field('height', '키')}
            {field('language', '언어')}
            {field('brand_keyword', '브랜드 키워드')}
          </div>
        </Section>

        {/* 이미지 */}
        <Section title="프로필 이미지 (여러 장)">
          <DraggableList items={images} droppableId="images" onReorder={setImages} renderItem={(img, i) => (
            <div className="flex gap-2 items-center mb-2">
              <span className="text-xs font-bold text-muted-foreground w-6 shrink-0">{i + 1}</span>
              <Input placeholder="이미지 URL" value={img.image_url} onChange={e => updateItem(images, i, { image_url: e.target.value }, setImages)} className="flex-1" />
              {img.image_url && <img src={img.image_url} alt="" className="w-10 h-10 rounded object-cover shrink-0 border border-border" />}
              <Button variant="outline" size="sm" onClick={() => setImages(images.filter((_, j) => j !== i))} className="text-destructive shrink-0">✕</Button>
            </div>
          )} />
          <Button variant="outline" size="sm" onClick={() => setImages([...images, { image_url: '' }])}>+ 이미지 추가</Button>
          <p className="text-xs text-muted-foreground mt-2">⠿ 아이콘을 드래그하여 순서를 변경할 수 있습니다.</p>
        </Section>

        {/* 경력 */}
        <Section title="경력 (Career)">
          <DraggableList items={careers} droppableId="careers" onReorder={setCareers} renderItem={(c, i) => (
            <div className="mb-4 p-4 border border-border rounded-lg bg-secondary/30">
              <div className="flex gap-2 items-start mb-2">
                <select value={c.category} onChange={e => updateItem(careers, i, { category: e.target.value }, setCareers)}
                  className="border border-input rounded-md px-2 py-2 text-sm bg-background">
                  <option value="drama_film">Drama & Film</option>
                  <option value="brand_editorial">Brand & Editorial</option>
                </select>
                <Input placeholder="연도" value={c.year_label} onChange={e => updateItem(careers, i, { year_label: e.target.value }, setCareers)} className="w-20" />
                <Input placeholder="제목" value={c.title} onChange={e => updateItem(careers, i, { title: e.target.value }, setCareers)} className="flex-1" />
                <Input placeholder="설명" value={c.description} onChange={e => updateItem(careers, i, { description: e.target.value }, setCareers)} className="flex-1" />
                <Button variant="outline" size="sm" onClick={() => setCareers(careers.filter((_, j) => j !== i))} className="text-destructive shrink-0">✕</Button>
              </div>
              <div className="flex gap-2 items-center mb-2">
                <Input placeholder="YouTube URL (선택)" value={c.youtube_url} onChange={e => updateItem(careers, i, { youtube_url: e.target.value }, setCareers)} className="flex-1" />
              </div>
              <div className="pl-2">
                <p className="text-xs font-bold text-muted-foreground mb-1">스틸컷 이미지 (최대 4장)</p>
                {c.images.map((img, ii) => (
                  <div key={ii} className="flex gap-2 items-center mb-1">
                    <Input placeholder="이미지 URL" value={img.image_url} onChange={e => {
                      const n = [...careers]; n[i].images[ii] = { image_url: e.target.value }; setCareers(n);
                    }} className="flex-1" />
                    {img.image_url && <img src={img.image_url} alt="" className="w-8 h-8 rounded object-cover shrink-0 border border-border" />}
                    <Button variant="outline" size="sm" onClick={() => {
                      const n = [...careers]; n[i].images = n[i].images.filter((_, j) => j !== ii); setCareers(n);
                    }} className="text-destructive shrink-0">✕</Button>
                  </div>
                ))}
                {c.images.length < 4 && (
                  <Button variant="outline" size="sm" onClick={() => {
                    const n = [...careers]; n[i].images = [...n[i].images, { image_url: '' }]; setCareers(n);
                  }}>+ 스틸컷 추가</Button>
                )}
              </div>
            </div>
          )} />
          <Button variant="outline" size="sm" onClick={() => setCareers([...careers, { category: 'drama_film', year_label: '', title: '', description: '', youtube_url: '', images: [] }])}>+ 경력 추가</Button>
        </Section>

        {/* 인사이트 */}
        <Section title="마켓 인사이트">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {(['monthly_search', 'content_saturation', 'audience_interest', 'gender_female_pct', 'regional_impact', 'age_20s', 'age_30s', 'age_40s', 'core_age_description'] as const).map(key => (
              <div key={key}>
                <Label className="text-xs font-extrabold uppercase">{key.replace(/_/g, ' ')}</Label>
                <Input value={insight[key]} onChange={e => setInsight(p => ({ ...p, [key]: e.target.value }))} className="mt-1" />
              </div>
            ))}
          </div>
        </Section>

        {/* 키워드 */}
        <Section title="키워드 클라우드">
          <DraggableList items={keywords} droppableId="keywords" onReorder={setKeywords} renderItem={(k, i) => (
            <div className="flex gap-2 items-center mb-2">
              <Input placeholder="키워드" value={k.keyword} onChange={e => updateItem(keywords, i, { keyword: e.target.value }, setKeywords)} className="flex-1" />
              <select value={k.size_class} onChange={e => updateItem(keywords, i, { size_class: e.target.value }, setKeywords)}
                className="border border-input rounded-md px-2 py-2 text-sm bg-background">
                <option value="tag-xl">XL</option>
                <option value="tag-l">L</option>
                <option value="tag-m">M</option>
                <option value="tag-s">S</option>
              </select>
              <Button variant="outline" size="sm" onClick={() => setKeywords(keywords.filter((_, j) => j !== i))} className="text-destructive">✕</Button>
            </div>
          )} />
          <Button variant="outline" size="sm" onClick={() => setKeywords([...keywords, { keyword: '', size_class: 'tag-m' }])}>+ 키워드 추가</Button>
        </Section>

        {/* 영상 */}
        <Section title="비주얼 아카이브 (Visual Archive)">
          <DraggableList items={videos} droppableId="videos" onReorder={setVideos} renderItem={(v, i) => (
            <div className="mb-6 p-4 border border-border rounded-lg bg-secondary/30">
              <div className="flex gap-2 items-center mb-3">
                <select value={v.category} onChange={e => updateItem(videos, i, { category: e.target.value }, setVideos)}
                  className="border border-input rounded-md px-2 py-2 text-sm bg-background">
                  <option value="drama_film">Drama & Film</option>
                  <option value="advertising">Advertising</option>
                  <option value="magazine">Magazine</option>
                  <option value="event_diary">Event & Diary</option>
                  <option value="music_video">Music Video</option>
                  <option value="awards_other">Awards & Other</option>
                </select>
                <Input placeholder="작품명" value={v.project_name} onChange={e => updateItem(videos, i, { project_name: e.target.value }, setVideos)} className="flex-1" />
                <Input placeholder="연도" value={v.year_label} onChange={e => updateItem(videos, i, { year_label: e.target.value }, setVideos)} className="w-20" />
                <Button variant="outline" size="sm" onClick={() => setVideos(videos.filter((_, j) => j !== i))} className="text-destructive shrink-0">✕</Button>
              </div>
              <div className="pl-4 space-y-2">
                <p className="text-xs font-bold text-muted-foreground">영상 링크 (여러 개 등록 가능)</p>
                {v.links.map((link, li) => (
                  <div key={li} className="flex gap-2 items-center">
                    <Input placeholder="라벨 (예: 예고편)" value={link.link_label} onChange={e => {
                      const n = [...videos]; n[i].links[li] = { ...link, link_label: e.target.value }; setVideos(n);
                    }} className="w-40" />
                    <Input placeholder="YouTube URL" value={link.youtube_url} onChange={e => {
                      const n = [...videos]; n[i].links[li] = { ...link, youtube_url: e.target.value }; setVideos(n);
                    }} className="flex-1" />
                    <Button variant="outline" size="sm" onClick={() => {
                      const n = [...videos]; n[i].links = n[i].links.filter((_, j) => j !== li); setVideos(n);
                    }} className="text-destructive shrink-0">✕</Button>
                  </div>
                ))}
                <Button variant="outline" size="sm" onClick={() => {
                  const n = [...videos]; n[i].links = [...n[i].links, { youtube_url: '', link_label: '' }]; setVideos(n);
                }}>+ 영상 링크 추가</Button>
              </div>
            </div>
          )} />
          <Button variant="outline" size="sm" onClick={() => setVideos([...videos, { category: 'drama_film', project_name: '', year_label: '', links: [] }])}>+ 아카이브 항목 추가</Button>
        </Section>

        {/* 화보 */}
        <Section title="화보 / 에디토리얼 (Editorial & Pictorial)">
          <DraggableList items={editorials} droppableId="editorials" onReorder={setEditorials} renderItem={(ed, i) => (
            <div className="mb-6 p-4 border border-border rounded-lg bg-secondary/30">
              <div className="flex gap-2 items-center mb-3">
                <Input placeholder="연도" value={ed.year_label} onChange={e => updateItem(editorials, i, { year_label: e.target.value }, setEditorials)} className="w-20" />
                <Input placeholder="매체명 (예: W Korea, Vogue)" value={ed.media_name} onChange={e => updateItem(editorials, i, { media_name: e.target.value }, setEditorials)} className="flex-1" />
                <Button variant="outline" size="sm" onClick={() => setEditorials(editorials.filter((_, j) => j !== i))} className="text-destructive shrink-0">✕</Button>
              </div>
              <div className="pl-4 space-y-2">
                <p className="text-xs font-bold text-muted-foreground">미디어 (이미지 또는 영상 URL, 여러 개 가능)</p>
                {ed.media.map((m, mi) => (
                  <div key={mi} className="flex gap-2 items-center">
                    <select value={m.media_type} onChange={e => {
                      const n = [...editorials]; n[i].media[mi] = { ...m, media_type: e.target.value as 'image' | 'video' }; setEditorials(n);
                    }} className="border border-input rounded-md px-2 py-2 text-sm bg-background w-24">
                      <option value="image">이미지</option>
                      <option value="video">영상</option>
                    </select>
                    <Input placeholder={m.media_type === 'video' ? 'YouTube URL' : '이미지 URL'} value={m.media_url} onChange={e => {
                      const n = [...editorials]; n[i].media[mi] = { ...m, media_url: e.target.value }; setEditorials(n);
                    }} className="flex-1" />
                    {m.media_type === 'image' && m.media_url && <img src={m.media_url} alt="" className="w-10 h-10 rounded object-cover shrink-0 border border-border" />}
                    <Button variant="outline" size="sm" onClick={() => {
                      const n = [...editorials]; n[i].media = n[i].media.filter((_, j) => j !== mi); setEditorials(n);
                    }} className="text-destructive shrink-0">✕</Button>
                  </div>
                ))}
                <Button variant="outline" size="sm" onClick={() => {
                  const n = [...editorials]; n[i].media = [...n[i].media, { media_url: '', media_type: 'image' }]; setEditorials(n);
                }}>+ 미디어 추가</Button>
              </div>
            </div>
          )} />
          <Button variant="outline" size="sm" onClick={() => setEditorials([...editorials, { year_label: '', media_name: '', media: [] }])}>+ 화보 추가</Button>
        </Section>

        {/* 수상 */}
        <Section title="수상 내역">
          <DraggableList items={awards} droppableId="awards" onReorder={setAwards} renderItem={(a, i) => (
            <div className="flex gap-2 items-center mb-2">
              <Input placeholder="연도" value={a.year_label} onChange={e => updateItem(awards, i, { year_label: e.target.value }, setAwards)} className="w-20" />
              <Input placeholder="수상명" value={a.title} onChange={e => updateItem(awards, i, { title: e.target.value }, setAwards)} className="flex-1" />
              <select value={a.tag_style} onChange={e => updateItem(awards, i, { tag_style: e.target.value }, setAwards)}
                className="border border-input rounded-md px-2 py-2 text-sm bg-background">
                <option value="award">Award</option>
                <option value="important">Important</option>
                <option value="normal">Normal</option>
              </select>
              <Button variant="outline" size="sm" onClick={() => setAwards(awards.filter((_, j) => j !== i))} className="text-destructive">✕</Button>
            </div>
          )} />
          <Button variant="outline" size="sm" onClick={() => setAwards([...awards, { title: '', year_label: '', tag_style: 'award' }])}>+ 수상 추가</Button>
        </Section>

        {/* 태그 */}
        <Section title="프로젝트 태그">
          <DraggableList items={tags} droppableId="tags" onReorder={setTags} renderItem={(t, i) => (
            <div className="flex gap-2 items-center mb-2">
              <Input placeholder="태그" value={t.tag_text} onChange={e => updateItem(tags, i, { tag_text: e.target.value }, setTags)} className="flex-1" />
              <select value={t.tag_style} onChange={e => updateItem(tags, i, { tag_style: e.target.value }, setTags)}
                className="border border-input rounded-md px-2 py-2 text-sm bg-background">
                <option value="normal">Normal</option>
                <option value="important">Important</option>
                <option value="award">Award</option>
              </select>
              <Button variant="outline" size="sm" onClick={() => setTags(tags.filter((_, j) => j !== i))} className="text-destructive">✕</Button>
            </div>
          )} />
          <Button variant="outline" size="sm" onClick={() => setTags([...tags, { tag_text: '', tag_style: 'normal' }])}>+ 태그 추가</Button>
        </Section>

        <div className="flex gap-4 pt-6 border-t border-border">
          <Button onClick={handleSave} disabled={saving} className="bg-primary text-primary-foreground font-bold px-10">
            {saving ? '저장 중...' : '저장'}
          </Button>
          <Link to="/admin"><Button variant="outline">취소</Button></Link>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-lg font-black text-primary mb-4 pb-2 border-b-2 border-primary uppercase tracking-wide">{title}</h2>
      {children}
    </div>
  );
}
