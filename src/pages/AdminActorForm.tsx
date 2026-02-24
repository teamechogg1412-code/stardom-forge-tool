import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useActorById } from '@/hooks/useActorData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';

export default function AdminActorForm() {
  const { id } = useParams<{ id: string }>();
  const isNew = id === 'new';
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { data: existingActor } = useActorById(id || '');

  const [form, setForm] = useState({
    name_ko: '', name_en: '', slug: '', profile_image_url: '', instagram_id: '',
    followers: '', posts: '', following: '', avg_likes: '', avg_comments: '',
    height: '', language: '', brand_keyword: '',
  });

  const [careers, setCareers] = useState<{ category: string; year_label: string; title: string; description: string }[]>([]);
  const [insight, setInsight] = useState({ monthly_search: '', content_saturation: '', audience_interest: '', gender_female_pct: '', regional_impact: '', age_20s: '', age_30s: '', age_40s: '', core_age_description: '' });
  const [keywords, setKeywords] = useState<{ keyword: string; size_class: string }[]>([]);
  const [videos, setVideos] = useState<{ project_name: string; youtube_url: string }[]>([]);
  const [awards, setAwards] = useState<{ title: string; tag_style: string }[]>([]);
  const [tags, setTags] = useState<{ tag_text: string; tag_style: string }[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!existingActor) return;
    setForm({
      name_ko: existingActor.name_ko || '', name_en: existingActor.name_en || '', slug: existingActor.slug || '',
      profile_image_url: existingActor.profile_image_url || '', instagram_id: existingActor.instagram_id || '',
      followers: existingActor.followers || '', posts: existingActor.posts || '', following: existingActor.following || '',
      avg_likes: existingActor.avg_likes || '', avg_comments: existingActor.avg_comments || '',
      height: existingActor.height || '', language: existingActor.language || '', brand_keyword: existingActor.brand_keyword || '',
    });
    setCareers(existingActor.careers.map(c => ({ category: c.category, year_label: c.year_label, title: c.title, description: c.description || '' })));
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
    setVideos(existingActor.videos.map(v => ({ project_name: v.project_name, youtube_url: v.youtube_url })));
    setAwards(existingActor.awards.map(a => ({ title: a.title, tag_style: a.tag_style })));
    setTags(existingActor.actor_tags.map(t => ({ tag_text: t.tag_text, tag_style: t.tag_style })));
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
        // Delete existing related data
        await Promise.all([
          supabase.from('careers').delete().eq('actor_id', id),
          supabase.from('insights').delete().eq('actor_id', id),
          supabase.from('keywords').delete().eq('actor_id', id),
          supabase.from('videos').delete().eq('actor_id', id),
          supabase.from('awards').delete().eq('actor_id', id),
          supabase.from('actor_tags').delete().eq('actor_id', id),
        ]);
      }

      // Insert related data
      const promises: Promise<any>[] = [];

      if (careers.length > 0) {
        promises.push(supabase.from('careers').insert(careers.map((c, i) => ({ ...c, actor_id: actorId, sort_order: i }))));
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
        promises.push(supabase.from('videos').insert(videos.map((v, i) => ({ ...v, actor_id: actorId, sort_order: i }))));
      }
      if (awards.length > 0) {
        promises.push(supabase.from('awards').insert(awards.map(a => ({ ...a, actor_id: actorId }))));
      }
      if (tags.length > 0) {
        promises.push(supabase.from('actor_tags').insert(tags.map(t => ({ ...t, actor_id: actorId }))));
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
            {field('profile_image_url', '프로필 이미지 URL')}
            {field('instagram_id', '인스타그램 ID')}
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

        {/* 경력 */}
        <Section title="경력 (Career)">
          {careers.map((c, i) => (
            <div key={i} className="flex gap-2 items-start mb-2">
              <select value={c.category} onChange={e => { const n = [...careers]; n[i].category = e.target.value; setCareers(n); }}
                className="border border-input rounded-md px-2 py-2 text-sm bg-background">
                <option value="drama_film">Drama & Film</option>
                <option value="brand_editorial">Brand & Editorial</option>
              </select>
              <Input placeholder="연도" value={c.year_label} onChange={e => { const n = [...careers]; n[i].year_label = e.target.value; setCareers(n); }} className="w-20" />
              <Input placeholder="제목" value={c.title} onChange={e => { const n = [...careers]; n[i].title = e.target.value; setCareers(n); }} className="flex-1" />
              <Input placeholder="설명" value={c.description} onChange={e => { const n = [...careers]; n[i].description = e.target.value; setCareers(n); }} className="flex-1" />
              <Button variant="outline" size="sm" onClick={() => setCareers(careers.filter((_, j) => j !== i))} className="text-destructive shrink-0">✕</Button>
            </div>
          ))}
          <Button variant="outline" size="sm" onClick={() => setCareers([...careers, { category: 'drama_film', year_label: '', title: '', description: '' }])}>+ 경력 추가</Button>
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
          {keywords.map((k, i) => (
            <div key={i} className="flex gap-2 items-center mb-2">
              <Input placeholder="키워드" value={k.keyword} onChange={e => { const n = [...keywords]; n[i].keyword = e.target.value; setKeywords(n); }} className="flex-1" />
              <select value={k.size_class} onChange={e => { const n = [...keywords]; n[i].size_class = e.target.value; setKeywords(n); }}
                className="border border-input rounded-md px-2 py-2 text-sm bg-background">
                <option value="tag-xl">XL</option>
                <option value="tag-l">L</option>
                <option value="tag-m">M</option>
                <option value="tag-s">S</option>
              </select>
              <Button variant="outline" size="sm" onClick={() => setKeywords(keywords.filter((_, j) => j !== i))} className="text-destructive">✕</Button>
            </div>
          ))}
          <Button variant="outline" size="sm" onClick={() => setKeywords([...keywords, { keyword: '', size_class: 'tag-m' }])}>+ 키워드 추가</Button>
        </Section>

        {/* 영상 */}
        <Section title="영상 (YouTube)">
          {videos.map((v, i) => (
            <div key={i} className="flex gap-2 items-center mb-2">
              <Input placeholder="작품명" value={v.project_name} onChange={e => { const n = [...videos]; n[i].project_name = e.target.value; setVideos(n); }} className="flex-1" />
              <Input placeholder="YouTube URL" value={v.youtube_url} onChange={e => { const n = [...videos]; n[i].youtube_url = e.target.value; setVideos(n); }} className="flex-1" />
              <Button variant="outline" size="sm" onClick={() => setVideos(videos.filter((_, j) => j !== i))} className="text-destructive">✕</Button>
            </div>
          ))}
          <Button variant="outline" size="sm" onClick={() => setVideos([...videos, { project_name: '', youtube_url: '' }])}>+ 영상 추가</Button>
        </Section>

        {/* 수상 */}
        <Section title="수상 내역">
          {awards.map((a, i) => (
            <div key={i} className="flex gap-2 items-center mb-2">
              <Input placeholder="수상명" value={a.title} onChange={e => { const n = [...awards]; n[i].title = e.target.value; setAwards(n); }} className="flex-1" />
              <select value={a.tag_style} onChange={e => { const n = [...awards]; n[i].tag_style = e.target.value; setAwards(n); }}
                className="border border-input rounded-md px-2 py-2 text-sm bg-background">
                <option value="award">Award</option>
                <option value="important">Important</option>
                <option value="normal">Normal</option>
              </select>
              <Button variant="outline" size="sm" onClick={() => setAwards(awards.filter((_, j) => j !== i))} className="text-destructive">✕</Button>
            </div>
          ))}
          <Button variant="outline" size="sm" onClick={() => setAwards([...awards, { title: '', tag_style: 'award' }])}>+ 수상 추가</Button>
        </Section>

        {/* 태그 */}
        <Section title="프로젝트 태그">
          {tags.map((t, i) => (
            <div key={i} className="flex gap-2 items-center mb-2">
              <Input placeholder="태그" value={t.tag_text} onChange={e => { const n = [...tags]; n[i].tag_text = e.target.value; setTags(n); }} className="flex-1" />
              <select value={t.tag_style} onChange={e => { const n = [...tags]; n[i].tag_style = e.target.value; setTags(n); }}
                className="border border-input rounded-md px-2 py-2 text-sm bg-background">
                <option value="normal">Normal</option>
                <option value="important">Important</option>
                <option value="award">Award</option>
              </select>
              <Button variant="outline" size="sm" onClick={() => setTags(tags.filter((_, j) => j !== i))} className="text-destructive">✕</Button>
            </div>
          ))}
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
