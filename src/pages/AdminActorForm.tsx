import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useActorById } from '@/hooks/useActorData';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';

// 나뉜 섹션들 임포트
import BasicInfoSection from '../components/admin/sections/BasicInfoSection';
import ProfileImageSection from '../components/admin/sections/ProfileImageSection';
import CareerSection from '../components/admin/sections/CareerSection';
import InsightSection from '../components/admin/sections/InsightSection';
import KeywordSection from '../components/admin/sections/KeywordSection';
import VisualArchiveSection from '../components/admin/sections/VisualArchiveSection';
import EditorialSection from '../components/admin/sections/EditorialSection';
import AwardSection from '../components/admin/sections/AwardSection';
import TagSection from '../components/admin/sections/TagSection';

export default function AdminActorForm() {
  const { id } = useParams<{ id: string }>();
  const isNew = id === 'new';
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { data: existingActor } = useActorById(id || '');

  // --- 상태 통합 관리 ---
  const [form, setForm] = useState({
    name_ko: '', name_en: '', slug: '', profile_image_url: '', instagram_id: '',
    homepage_url: '', namuwiki_url: '', followers: '', posts: '', following: '',
    avg_likes: '', avg_comments: '', height: '', language: '', brand_keyword: '',
    bio_headline: '', bio_text: '',
  });

  const [careers, setCareers] = useState([]);
  const [insight, setInsight] = useState({ monthly_search: '', content_saturation: '', audience_interest: '', gender_female_pct: '', regional_impact: '', age_20s: '', age_30s: '', age_40s: '', core_age_description: '' });
  const [keywords, setKeywords] = useState([]);
  const [videos, setVideos] = useState([]);
  const [awards, setAwards] = useState([]);
  const [tags, setTags] = useState([]);
  const [images, setImages] = useState([]);
  const [editorials, setEditorials] = useState([]);
  const [saving, setSaving] = useState(false);

  // --- 기존 데이터 로드 로직 (기존과 동일) ---
  useEffect(() => {
    if (!existingActor) return;
    setForm({
      name_ko: existingActor.name_ko || '', name_en: existingActor.name_en || '', slug: existingActor.slug || '',
      profile_image_url: existingActor.profile_image_url || '', instagram_id: existingActor.instagram_id || '',
      homepage_url: (existingActor as any).homepage_url || '', namuwiki_url: (existingActor as any).namuwiki_url || '',
      followers: existingActor.followers || '', posts: existingActor.posts || '', following: existingActor.following || '',
      avg_likes: existingActor.avg_likes || '', avg_comments: existingActor.avg_comments || '',
      height: existingActor.height || '', language: existingActor.language || '', brand_keyword: existingActor.brand_keyword || '',
      bio_headline: (existingActor as any).bio_headline || '',
      bio_text: (existingActor as any).bio_text || '',
    });
    setCareers(existingActor.careers.map(c => ({ 
      category: c.category, sub_category: (c as any).sub_category || '', 
      year_label: c.year_label, title: c.title, description: c.description || '', 
      role_image_url: (c as any).role_image_url || '',
      links: (c as any).career_links?.map((l: any) => ({ link_url: l.link_url, link_label: l.link_label })) || [],
      images: (c.career_images || []).map(ci => ({ image_url: ci.image_url })) 
    })));
    if (existingActor.insights) setInsight({...existingActor.insights});
    setKeywords(existingActor.keywords || []);
    setVideos(existingActor.videos || []);
    setAwards(existingActor.awards || []);
    setTags(existingActor.actor_tags || []);
    setImages(existingActor.images || []);
    setEditorials(existingActor.editorials || []);
  }, [existingActor]);

  // --- 저장 로직 (기존 handleSave 그대로 유지) ---
  const handleSave = async () => {
    /* 기존 저장 로직 코드 (supabase insert/update/delete) */
    // ...
  };

  return (
    <div className="min-h-screen bg-background">
      <nav className="px-[6%] py-5 flex items-center gap-4 border-b-2 border-primary text-foreground sticky top-0 bg-white/80 backdrop-blur-md z-50">
        <Link to="/admin" className="text-sm font-black tracking-[2px] text-primary uppercase">← Admin</Link>
        <span className="text-sm font-bold text-muted-foreground">{isNew ? '새 배우 등록' : '배우 편집'}</span>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-10">
        <BasicInfoSection form={form} setForm={setForm} />
        <ProfileImageSection images={images} setImages={setImages} />
        <CareerSection careers={careers} setCareers={setCareers} />
        <InsightSection insight={insight} setInsight={setInsight} />
        <KeywordSection keywords={keywords} setKeywords={setKeywords} />
        <VisualArchiveSection videos={videos} setVideos={setVideos} />
        <EditorialSection editorials={editorials} setEditorials={setEditorials} />
        <AwardSection awards={awards} setAwards={setAwards} />
        <TagSection tags={tags} setTags={setTags} />

        <div className="flex gap-4 pt-10 border-t-4 border-slate-900">
          <Button onClick={handleSave} disabled={saving} className="bg-slate-900 text-white font-black px-12 h-16 text-xl shadow-xl hover:bg-primary transition-all rounded-xl flex-1">
            {saving ? '저장 중...' : '포트폴리오 전체 업데이트 저장'}
          </Button>
          <Link to="/admin"><Button variant="outline" className="h-16 px-10 font-black rounded-xl">취소</Button></Link>
        </div>
      </div>
    </div>
  );
}
