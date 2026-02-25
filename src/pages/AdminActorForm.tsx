import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useActorById } from "@/hooks/useActorData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import DraggableList from "@/components/admin/DraggableList";

// --- 타입 정의 ---
type CareerImageItem = { image_url: string };
type CareerLinkItem = { link_url: string; link_label: string };
type CareerItem = {
  category: string;
  sub_category: string;
  year_label: string;
  title: string;
  description: string;
  role_image_url: string;
  links: CareerLinkItem[];
  images: CareerImageItem[];
};
type KeywordItem = { keyword: string; size_class: string };
type VideoLink = { youtube_url: string; link_label: string };
type VideoItem = { category: string; project_name: string; year_label: string; links: VideoLink[] };
type AwardItem = {
  title: string;
  year_label: string;
  tag_style: string;
  show_on_profile: boolean;
  youtube_url: string;
};
type TagItem = { tag_text: string; tag_style: string };
type ImageItem = { image_url: string };
type EditorialMediaItem = { media_url: string; media_type: "image" | "video" };
type EditorialItem = { year_label: string; media_name: string; media: EditorialMediaItem[] };

export default function AdminActorForm() {
  const { id } = useParams<{ id: string }>();
  const isNew = id === "new";
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { data: existingActor } = useActorById(id || "");

  // --- 상태 관리 ---
  const [form, setForm] = useState({
    name_ko: "",
    name_en: "",
    slug: "",
    profile_image_url: "",
    instagram_id: "",
    homepage_url: "",
    namuwiki_url: "",
    followers: "",
    posts: "",
    following: "",
    avg_likes: "",
    avg_comments: "",
    height: "",
    language: "",
    brand_keyword: "",
    bio_headline: "",
    bio_text: "",
  });

  const [careers, setCareers] = useState<CareerItem[]>([]);
  const [insight, setInsight] = useState({
    monthly_search: "",
    content_saturation: "",
    audience_interest: "",
    gender_female_pct: "",
    regional_impact: "",
    age_20s: "",
    age_30s: "",
    age_40s: "",
    core_age_description: "",
  });
  const [keywords, setKeywords] = useState<KeywordItem[]>([]);
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [awards, setAwards] = useState<AwardItem[]>([]);
  const [tags, setTags] = useState<TagItem[]>([]);
  const [images, setImages] = useState<ImageItem[]>([]);
  const [editorials, setEditorials] = useState<EditorialItem[]>([]);
  const [saving, setSaving] = useState(false);

  // --- 기존 데이터 불러오기 ---
  useEffect(() => {
    if (!existingActor) return;
    setForm({
      name_ko: existingActor.name_ko || "",
      name_en: existingActor.name_en || "",
      slug: existingActor.slug || "",
      profile_image_url: existingActor.profile_image_url || "",
      instagram_id: existingActor.instagram_id || "",
      homepage_url: (existingActor as any).homepage_url || "",
      namuwiki_url: (existingActor as any).namuwiki_url || "",
      followers: existingActor.followers || "",
      posts: existingActor.posts || "",
      following: existingActor.following || "",
      avg_likes: existingActor.avg_likes || "",
      avg_comments: existingActor.avg_comments || "",
      height: existingActor.height || "",
      language: existingActor.language || "",
      brand_keyword: existingActor.brand_keyword || "",
      bio_headline: (existingActor as any).bio_headline || "",
      bio_text: (existingActor as any).bio_text || "",
    });

    setCareers(
      existingActor.careers.map((c) => ({
        category: c.category,
        sub_category: (c as any).sub_category || "",
        year_label: c.year_label,
        title: c.title,
        description: c.description || "",
        role_image_url: (c as any).role_image_url || "",
        links: (c as any).career_links?.map((l: any) => ({ link_url: l.link_url, link_label: l.link_label })) || [],
        images: (c.career_images || []).map((ci) => ({ image_url: ci.image_url })),
      })),
    );

    if (existingActor.insights) {
      const ins = existingActor.insights;
      setInsight({
        monthly_search: ins.monthly_search || "",
        content_saturation: ins.content_saturation || "",
        audience_interest: ins.audience_interest || "",
        gender_female_pct: ins.gender_female_pct?.toString() || "",
        regional_impact: ins.regional_impact || "",
        age_20s: ins.age_20s?.toString() || "",
        age_30s: ins.age_30s?.toString() || "",
        age_40s: ins.age_40s?.toString() || "",
        core_age_description: ins.core_age_description || "",
      });
    }
    setKeywords(existingActor.keywords.map((k) => ({ keyword: k.keyword, size_class: k.size_class })));
    setVideos(
      existingActor.videos.map((v) => ({
        category: v.category || "drama_film",
        project_name: v.project_name,
        year_label: v.year_label || "",
        links: (v.video_links || []).map((l) => ({ youtube_url: l.youtube_url, link_label: l.link_label || "" })),
      })),
    );
    setAwards(
      existingActor.awards.map((a) => ({
        title: a.title,
        year_label: a.year_label || "",
        tag_style: a.tag_style,
        show_on_profile: (a as any).show_on_profile ?? true,
        youtube_url: (a as any).youtube_url || "",
      })),
    );
    setTags(existingActor.actor_tags.map((t) => ({ tag_text: t.tag_text, tag_style: t.tag_style })));
    setImages(existingActor.images.map((img) => ({ image_url: img.image_url })));
    setEditorials(
      existingActor.editorials.map((e) => ({
        year_label: e.year_label || "",
        media_name: e.media_name || "",
        media: (e.editorial_media || []).map((m) => ({ media_url: m.media_url, media_type: m.media_type })),
      })),
    );
  }, [existingActor]);

  // --- 저장 로직 ---
  const handleSave = async () => {
    if (!form.name_ko || !form.slug) {
      toast({ title: "오류", description: "이름과 슬러그는 필수입니다.", variant: "destructive" });
      return;
    }
    setSaving(true);
    try {
      let actorId = id;
      if (isNew) {
        const { data, error } = await supabase.from("actors").insert([form]).select().single();
        if (error) throw error;
        actorId = data.id;
      } else {
        const { error } = await supabase.from("actors").update(form).eq("id", id);
        if (error) throw error;
        // 기존 하위 데이터 삭제
        await Promise.all([
          supabase.from("actor_images").delete().eq("actor_id", id),
          supabase.from("careers").delete().eq("actor_id", id),
          supabase.from("insights").delete().eq("actor_id", id),
          supabase.from("keywords").delete().eq("actor_id", id),
          supabase.from("videos").delete().eq("actor_id", id),
          supabase.from("awards").delete().eq("actor_id", id),
          supabase.from("actor_tags").delete().eq("actor_id", id),
          supabase.from("editorials").delete().eq("actor_id", id),
        ]);
      }

      // 1. 커리어 저장 (다중 링크 및 배역 이미지 포함)
      if (careers.length > 0) {
        for (let i = 0; i < careers.length; i++) {
          const c = careers[i];
          const { data: careerRow, error: cErr } = await supabase
            .from("careers")
            .insert([
              {
                actor_id: actorId,
                category: c.category,
                sub_category: c.sub_category || null,
                role_image_url: c.role_image_url || null,
                year_label: c.year_label,
                title: c.title,
                description: c.description || null,
                sort_order: i,
              },
            ])
            .select()
            .single();
          if (cErr) throw cErr;

          if (c.images.length > 0) {
            await supabase
              .from("career_images")
              .insert(
                c.images
                  .filter((img) => img.image_url.trim())
                  .map((img, si) => ({ career_id: careerRow.id, image_url: img.image_url, sort_order: si })),
              );
          }
          if (c.links.length > 0) {
            await supabase
              .from("career_links")
              .insert(
                c.links
                  .filter((link) => link.link_url.trim())
                  .map((link, li) => ({
                    career_id: careerRow.id,
                    link_url: link.link_url,
                    link_label: link.link_label,
                    sort_order: li,
                  })),
              );
          }
        }
      }

      const promises: PromiseLike<any>[] = [];

      // 2. 인사이트
      if (Object.values(insight).some((v) => v)) {
        promises.push(
          supabase.from("insights").insert([
            {
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
            },
          ]),
        );
      }

      // 3. 키워드
      if (keywords.length > 0)
        promises.push(supabase.from("keywords").insert(keywords.map((k) => ({ ...k, actor_id: actorId }))));

      // 4. 비주얼 아카이브
      if (videos.length > 0) {
        for (let i = 0; i < videos.length; i++) {
          const v = videos[i];
          const { data: videoRow } = await supabase
            .from("videos")
            .insert([
              {
                actor_id: actorId,
                category: v.category,
                project_name: v.project_name,
                year_label: v.year_label,
                sort_order: i,
              },
            ])
            .select()
            .single();
          if (v.links.length > 0)
            await supabase
              .from("video_links")
              .insert(
                v.links.map((l, li) => ({
                  video_id: videoRow.id,
                  youtube_url: l.youtube_url,
                  link_label: l.link_label,
                  sort_order: li,
                })),
              );
        }
      }

      // 5. 수상 내역
      if (awards.length > 0)
        promises.push(
          supabase
            .from("awards")
            .insert(
              awards.map((a) => ({
                title: a.title,
                year_label: a.year_label || null,
                tag_style: a.tag_style,
                show_on_profile: a.show_on_profile,
                actor_id: actorId,
                youtube_url: a.youtube_url || null,
              })),
            ),
        );

      // 6. 태그
      if (tags.length > 0)
        promises.push(supabase.from("actor_tags").insert(tags.map((t) => ({ ...t, actor_id: actorId }))));

      // 7. 프로필 이미지
      if (images.length > 0)
        promises.push(
          supabase.from("actor_images").insert(images.map((img, i) => ({ ...img, actor_id: actorId, sort_order: i }))),
        );

      // 8. 화보/에디토리얼
      if (editorials.length > 0) {
        for (let i = 0; i < editorials.length; i++) {
          const ed = editorials[i];
          const { data: edRow } = await supabase
            .from("editorials")
            .insert([{ actor_id: actorId, year_label: ed.year_label, media_name: ed.media_name, sort_order: i }])
            .select()
            .single();
          if (ed.media.length > 0)
            await supabase
              .from("editorial_media")
              .insert(
                ed.media.map((m, mi) => ({
                  editorial_id: edRow.id,
                  media_url: m.media_url,
                  media_type: m.media_type,
                  sort_order: mi,
                })),
              );
        }
      }

      await Promise.all(promises);
      qc.invalidateQueries({ queryKey: ["actors"] });
      toast({ title: "저장 완료" });
      navigate("/admin");
    } catch (err: any) {
      toast({ title: "오류", description: err.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const updateItem = <T,>(list: T[], index: number, updates: Partial<T>, setter: (v: T[]) => void) => {
    const n = [...list];
    n[index] = { ...n[index], ...updates };
    setter(n);
  };

  // --- UI 렌더링 ---
  return (
    <div className="min-h-screen bg-background text-foreground">
      <nav className="px-[6%] py-5 flex items-center gap-4 border-b-2 border-primary">
        <Link to="/admin" className="text-sm font-black tracking-[2px] text-primary uppercase">
          ← Admin
        </Link>
        <span className="text-border">/</span>
        <span className="text-sm font-bold text-muted-foreground">{isNew ? "새 배우 등록" : "배우 편집"}</span>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-10 space-y-12">
        {/* 1. 기본 정보 & Bio */}
        <Section title="기본 정보 및 Artist Bio">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
            {[
              { k: "name_ko", l: "이름 (한글) *" },
              { k: "name_en", l: "이름 (영문)" },
              { k: "slug", l: "URL 슬러그 *" },
              { k: "instagram_id", l: "인스타그램 ID" },
              { k: "homepage_url", l: "공식 홈페이지" },
              { k: "namuwiki_url", l: "나무위키" },
              { k: "followers", l: "팔로워" },
              { k: "posts", l: "게시물" },
              { k: "following", l: "팔로잉" },
              { k: "height", l: "키" },
              { k: "language", l: "언어" },
              { k: "brand_keyword", l: "브랜드 키워드" },
            ].map((f) => (
              <div key={f.k}>
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{f.l}</Label>
                <Input
                  value={(form as any)[f.k]}
                  onChange={(e) => setForm((p) => ({ ...p, [f.k]: e.target.value }))}
                  className="mt-1 font-bold"
                />
              </div>
            ))}
            <div className="col-span-full mt-4">
              <Label className="text-[10px] font-black uppercase tracking-widest text-primary">
                Headline (굵은 강조 문구)
              </Label>
              <Input
                value={form.bio_headline}
                onChange={(e) => setForm((p) => ({ ...p, bio_headline: e.target.value }))}
                placeholder="예: 경계를 허물고 매 순간 낯선 얼굴을 꺼내놓는, 변주의 귀재."
                className="mt-1 border-primary/30 font-black text-primary"
              />
            </div>
            <div className="col-span-full mt-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                Artist Bio (본문 상세 소개)
              </Label>
              <textarea
                value={form.bio_text}
                onChange={(e) => setForm((p) => ({ ...p, bio_text: e.target.value }))}
                className="w-full mt-1 min-h-[150px] p-3 border border-input rounded-md bg-background text-sm leading-relaxed outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
        </Section>

        {/* 2. 프로필 이미지 관리 */}
        <Section title="프로필 이미지 관리 (Carousel)">
          <DraggableList
            items={images}
            droppableId="images"
            onReorder={setImages}
            renderItem={(img, i) => (
              <div className="flex gap-2 items-center mb-2 bg-slate-50 p-2 rounded-md border border-slate-100 shadow-sm">
                <Input
                  placeholder="이미지 URL"
                  value={img.image_url}
                  onChange={(e) => updateItem(images, i, { image_url: e.target.value }, setImages)}
                  className="flex-1"
                />
                {img.image_url && (
                  <img src={img.image_url} alt="" className="w-10 h-10 rounded object-cover border border-slate-200" />
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setImages(images.filter((_, j) => j !== i))}
                  className="text-destructive"
                >
                  ✕
                </Button>
              </div>
            )}
          />
          <Button variant="outline" size="sm" onClick={() => setImages([...images, { image_url: "" }])}>
            + 프로필 사진 추가
          </Button>
        </Section>

        {/* 3. 커리어 포트폴리오 (배역이미지 + 다중링크 통합) */}
        <Section title="커리어 포트폴리오 (Career Portfolio)">
          <DraggableList
            items={careers}
            droppableId="careers"
            onReorder={setCareers}
            renderItem={(c, i) => (
              <div className="mb-8 p-6 border-2 border-slate-200 rounded-xl bg-slate-50/50 shadow-sm">
                <div className="flex flex-wrap gap-3 items-start mb-5">
                  <select
                    value={c.category}
                    onChange={(e) => updateItem(careers, i, { category: e.target.value }, setCareers)}
                    className="border-2 border-slate-200 rounded-md px-2 py-2 text-xs font-black bg-white outline-none"
                  >
                    <option value="drama_film">기둥: Drama & Film</option>
                    <option value="brand_editorial">기둥: Brand & Editorial</option>
                  </select>

                  <select
                    value={c.sub_category}
                    onChange={(e) => updateItem(careers, i, { sub_category: e.target.value }, setCareers)}
                    className="border-2 border-slate-200 rounded-md px-2 py-2 text-xs font-black bg-white focus:border-primary outline-none text-primary"
                  >
                    <option value="">구분 선택</option>
                    <option value="Drama">Drama</option>
                    <option value="Movie">Movie</option>
                    <option value="Editorial">Editorial</option>
                    <option value="MV">MV</option>
                    <option value="CF">CF</option>
                    <option value="etc">etc</option>
                  </select>

                  <Input
                    placeholder="연도"
                    value={c.year_label}
                    onChange={(e) => updateItem(careers, i, { year_label: e.target.value }, setCareers)}
                    className="w-20 font-bold"
                  />
                  <Input
                    placeholder="작품명/활동명"
                    value={c.title}
                    onChange={(e) => updateItem(careers, i, { title: e.target.value }, setCareers)}
                    className="flex-1 font-black"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setCareers(careers.filter((_, j) => j !== i))}
                    className="text-destructive"
                  >
                    ✕
                  </Button>
                </div>

                <div className="pl-4 space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label className="text-[10px] font-black uppercase text-muted-foreground block mb-1">
                        배역명 (작품 아래 노출)
                      </Label>
                      <Input
                        placeholder="예: 김건 역"
                        value={c.description}
                        onChange={(e) => updateItem(careers, i, { description: e.target.value }, setCareers)}
                        className="text-sm font-bold"
                      />
                    </div>
                    <div>
                      <Label className="text-[10px] font-black uppercase text-primary block mb-1">
                        배역 프로필 이미지 URL (호버 시 노출)
                      </Label>
                      <Input
                        placeholder="이미지 주소 입력"
                        value={c.role_image_url}
                        onChange={(e) => updateItem(careers, i, { role_image_url: e.target.value }, setCareers)}
                        className="text-sm"
                      />
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-lg border border-slate-200 space-y-3">
                    <p className="text-[10px] font-black text-primary uppercase tracking-wider">
                      영상 및 외부 링크 관리
                    </p>
                    {c.links.map((link, li) => (
                      <div key={li} className="flex gap-2">
                        <Input
                          placeholder="라벨 (예: MV, 공식영상)"
                          value={link.link_label}
                          onChange={(e) => {
                            const n = [...careers];
                            n[i].links[li].link_label = e.target.value;
                            setCareers(n);
                          }}
                          className="w-32 text-xs h-9"
                        />
                        <Input
                          placeholder="URL (YouTube 등)"
                          value={link.link_url}
                          onChange={(e) => {
                            const n = [...careers];
                            n[i].links[li].link_url = e.target.value;
                            setCareers(n);
                          }}
                          className="flex-1 text-xs h-9"
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            const n = [...careers];
                            n[i].links = n[i].links.filter((_, j) => j !== li);
                            setCareers(n);
                          }}
                        >
                          ✕
                        </Button>
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      size="xs"
                      onClick={() => {
                        const n = [...careers];
                        n[i].links = [...n[i].links, { link_url: "", link_label: "" }];
                        setCareers(n);
                      }}
                      className="text-[10px] font-bold"
                    >
                      + 링크 추가
                    </Button>
                  </div>

                  <div className="space-y-3">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-wider">
                      📸 스틸컷 사진첩 (카메라 아이콘 모달)
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      {c.images.map((img, ii) => (
                        <div key={ii} className="flex gap-2">
                          <Input
                            placeholder="이미지 URL"
                            value={img.image_url}
                            onChange={(e) => {
                              const n = [...careers];
                              n[i].images[ii].image_url = e.target.value;
                              setCareers(n);
                            }}
                            className="text-xs h-9"
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              const n = [...careers];
                              n[i].images = n[i].images.filter((_, j) => j !== ii);
                              setCareers(n);
                            }}
                          >
                            ✕
                          </Button>
                        </div>
                      ))}
                    </div>
                    <Button
                      variant="outline"
                      size="xs"
                      onClick={() => {
                        const n = [...careers];
                        n[i].images = [...n[i].images, { image_url: "" }];
                        setCareers(n);
                      }}
                      className="text-[10px] font-bold"
                    >
                      + 스틸컷 추가
                    </Button>
                  </div>
                </div>
              </div>
            )}
          />
          <Button
            variant="outline"
            className="w-full py-6 border-dashed border-2 font-black text-slate-400 hover:text-primary hover:border-primary transition-all"
            onClick={() =>
              setCareers([
                ...careers,
                {
                  category: "drama_film",
                  sub_category: "",
                  year_label: "",
                  title: "",
                  description: "",
                  role_image_url: "",
                  links: [],
                  images: [],
                },
              ])
            }
          >
            + 새로운 커리어 항목 추가하기
          </Button>
        </Section>

        {/* 4. 마켓 인사이트 */}
        <Section title="마켓 인사이트 (Data)">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
            {(
              [
                "monthly_search",
                "content_saturation",
                "audience_interest",
                "gender_female_pct",
                "regional_impact",
                "age_20s",
                "age_30s",
                "age_40s",
                "core_age_description",
              ] as const
            ).map((key) => (
              <div key={key}>
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                  {key.replace(/_/g, " ")}
                </Label>
                <Input
                  value={insight[key]}
                  onChange={(e) => setInsight((p) => ({ ...p, [key]: e.target.value }))}
                  className="mt-1 font-bold"
                />
              </div>
            ))}
          </div>
        </Section>

        {/* 5. 키워드 클라우드 */}
        <Section title="키워드 클라우드">
          <DraggableList
            items={keywords}
            droppableId="keywords"
            onReorder={setKeywords}
            renderItem={(k, i) => (
              <div className="flex gap-2 items-center mb-2 bg-slate-50 p-2 rounded-md">
                <Input
                  placeholder="키워드"
                  value={k.keyword}
                  onChange={(e) => updateItem(keywords, i, { keyword: e.target.value }, setKeywords)}
                  className="flex-1 font-bold"
                />
                <select
                  value={k.size_class}
                  onChange={(e) => updateItem(keywords, i, { size_class: e.target.value }, setKeywords)}
                  className="border-2 border-slate-200 rounded-md px-3 py-2 text-xs font-black bg-white outline-none"
                >
                  <option value="tag-xl">XL (가장 큼)</option>
                  <option value="tag-l">L (큼)</option>
                  <option value="tag-m">M (중간)</option>
                  <option value="tag-s">S (작음)</option>
                </select>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setKeywords(keywords.filter((_, j) => j !== i))}
                  className="text-destructive"
                >
                  ✕
                </Button>
              </div>
            )}
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => setKeywords([...keywords, { keyword: "", size_class: "tag-m" }])}
          >
            + 키워드 추가
          </Button>
        </Section>

        {/* 6. 비주얼 아카이브 (영상) */}
        <Section title="비주얼 아카이브 (Visual Archive)">
          <DraggableList
            items={videos}
            droppableId="videos"
            onReorder={setVideos}
            renderItem={(v, i) => (
              <div className="mb-6 p-5 border-2 border-slate-200 rounded-xl bg-slate-50/50">
                <div className="flex gap-3 items-center mb-4">
                  <select
                    value={v.category}
                    onChange={(e) => updateItem(videos, i, { category: e.target.value }, setVideos)}
                    className="border-2 border-slate-200 rounded-md px-2 py-2 text-xs font-black bg-white outline-none"
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
                    onChange={(e) => updateItem(videos, i, { project_name: e.target.value }, setVideos)}
                    className="flex-1 font-bold"
                  />
                  <Input
                    placeholder="연도"
                    value={v.year_label}
                    onChange={(e) => updateItem(videos, i, { year_label: e.target.value }, setVideos)}
                    className="w-24 font-bold"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setVideos(videos.filter((_, j) => j !== i))}
                    className="text-destructive"
                  >
                    ✕
                  </Button>
                </div>
                <div className="pl-4 space-y-2">
                  <p className="text-[10px] font-black text-primary uppercase mb-2">영상 링크 목록</p>
                  {v.links.map((link, li) => (
                    <div key={li} className="flex gap-2">
                      <Input
                        placeholder="영상 라벨 (예: 티저, 메이킹)"
                        value={link.link_label}
                        onChange={(e) => {
                          const n = [...videos];
                          n[i].links[li].link_label = e.target.value;
                          setVideos(n);
                        }}
                        className="w-40 text-xs h-9"
                      />
                      <Input
                        placeholder="YouTube URL"
                        value={link.youtube_url}
                        onChange={(e) => {
                          const n = [...videos];
                          n[i].links[li].youtube_url = e.target.value;
                          setVideos(n);
                        }}
                        className="flex-1 text-xs h-9"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const n = [...videos];
                          n[i].links = n[i].links.filter((_, j) => j !== li);
                          setVideos(n);
                        }}
                      >
                        ✕
                      </Button>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    size="xs"
                    onClick={() => {
                      const n = [...videos];
                      n[i].links = [...n[i].links, { youtube_url: "", link_label: "" }];
                      setVideos(n);
                    }}
                    className="text-[10px] font-bold"
                  >
                    + 영상 링크 추가
                  </Button>
                </div>
              </div>
            )}
          />
          <Button
            variant="outline"
            onClick={() =>
              setVideos([...videos, { category: "drama_film", project_name: "", year_label: "", links: [] }])
            }
          >
            + 아카이브 항목 추가
          </Button>
        </Section>

        {/* 7. 화보 / 에디토리얼 */}
        <Section title="화보 / 에디토리얼 (Editorial)">
          <DraggableList
            items={editorials}
            droppableId="editorials"
            onReorder={setEditorials}
            renderItem={(ed, i) => (
              <div className="mb-6 p-5 border-2 border-slate-200 rounded-xl bg-slate-50/50">
                <div className="flex gap-3 items-center mb-4">
                  <Input
                    placeholder="연도"
                    value={ed.year_label}
                    onChange={(e) => updateItem(editorials, i, { year_label: e.target.value }, setEditorials)}
                    className="w-24 font-bold"
                  />
                  <Input
                    placeholder="매체명 (예: Vogue, W Korea)"
                    value={ed.media_name}
                    onChange={(e) => updateItem(editorials, i, { media_name: e.target.value }, setEditorials)}
                    className="flex-1 font-bold"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setEditorials(editorials.filter((_, j) => j !== i))}
                    className="text-destructive"
                  >
                    ✕
                  </Button>
                </div>
                <div className="pl-4 space-y-2">
                  <p className="text-[10px] font-black text-primary uppercase mb-2">화보 미디어 (이미지/영상)</p>
                  {ed.media.map((m, mi) => (
                    <div key={mi} className="flex gap-2">
                      <select
                        value={m.media_type}
                        onChange={(e) => {
                          const n = [...editorials];
                          n[i].media[mi].media_type = e.target.value as "image" | "video";
                          setEditorials(n);
                        }}
                        className="border-2 border-slate-200 rounded-md px-2 py-2 text-xs font-black bg-white outline-none w-28"
                      >
                        <option value="image">이미지</option>
                        <option value="video">영상(유튜브)</option>
                      </select>
                      <Input
                        placeholder="미디어 URL"
                        value={m.media_url}
                        onChange={(e) => {
                          const n = [...editorials];
                          n[i].media[mi].media_url = e.target.value;
                          setEditorials(n);
                        }}
                        className="flex-1 text-xs h-9"
                      />
                      {m.media_type === "image" && m.media_url && (
                        <img
                          src={m.media_url}
                          alt=""
                          className="w-9 h-9 rounded object-cover border border-slate-200"
                        />
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const n = [...editorials];
                          n[i].media = n[i].media.filter((_, j) => j !== mi);
                          setEditorials(n);
                        }}
                      >
                        ✕
                      </Button>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    size="xs"
                    onClick={() => {
                      const n = [...editorials];
                      n[i].media = [...n[i].media, { media_url: "", media_type: "image" }];
                      setEditorials(n);
                    }}
                    className="text-[10px] font-bold"
                  >
                    + 미디어 추가
                  </Button>
                </div>
              </div>
            )}
          />
          <Button
            variant="outline"
            onClick={() => setEditorials([...editorials, { year_label: "", media_name: "", media: [] }])}
          >
            + 화보 추가
          </Button>
        </Section>

        {/* 8. 수상 내역 */}
        <Section title="수상 내역 (Awards)">
          <DraggableList
            items={awards}
            droppableId="awards"
            onReorder={setAwards}
            renderItem={(a, i) => (
              <div className="bg-slate-50 p-4 rounded-xl mb-3 border-2 border-slate-200 shadow-sm">
                <div className="flex gap-3 items-center mb-3">
                  <label className="flex items-center gap-2 shrink-0 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={a.show_on_profile}
                      onChange={(e) => updateItem(awards, i, { show_on_profile: e.target.checked }, setAwards)}
                      className="w-4 h-4 accent-primary"
                    />
                    <span className="text-[10px] font-black text-slate-500 uppercase">표시</span>
                  </label>
                  <Input
                    placeholder="연도"
                    value={a.year_label}
                    onChange={(e) => updateItem(awards, i, { year_label: e.target.value }, setAwards)}
                    className="w-24 font-bold"
                  />
                  <Input
                    placeholder="수상명"
                    value={a.title}
                    onChange={(e) => updateItem(awards, i, { title: e.target.value }, setAwards)}
                    className="flex-1 font-bold"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setAwards(awards.filter((_, j) => j !== i))}
                    className="text-destructive"
                  >
                    ✕
                  </Button>
                </div>
                <div className="flex gap-3 items-center pl-8">
                  <Label className="text-[10px] font-black text-primary uppercase shrink-0">수상장면 영상:</Label>
                  <Input
                    placeholder="YouTube URL"
                    value={a.youtube_url || ""}
                    onChange={(e) => updateItem(awards, i, { youtube_url: e.target.value }, setAwards)}
                    className="text-xs h-8"
                  />
                </div>
              </div>
            )}
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setAwards([
                ...awards,
                { title: "", year_label: "", tag_style: "award", show_on_profile: true, youtube_url: "" },
              ])
            }
          >
            + 수상 내역 추가
          </Button>
        </Section>

        {/* 9. 프로젝트 태그 */}
        <Section title="프로젝트 태그 (Tags)">
          <DraggableList
            items={tags}
            droppableId="tags"
            onReorder={setTags}
            renderItem={(t, i) => (
              <div className="flex gap-2 items-center mb-2 bg-slate-50 p-2 rounded-md">
                <Input
                  placeholder="태그 텍스트"
                  value={t.tag_text}
                  onChange={(e) => updateItem(tags, i, { tag_text: e.target.value }, setTags)}
                  className="flex-1 font-bold"
                />
                <select
                  value={t.tag_style}
                  onChange={(e) => updateItem(tags, i, { tag_style: e.target.value }, setTags)}
                  className="border-2 border-slate-200 rounded-md px-3 py-2 text-xs font-black bg-white outline-none"
                >
                  <option value="normal">Normal (회색)</option>
                  <option value="important">Important (파랑)</option>
                  <option value="award">Award (금색)</option>
                </select>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setTags(tags.filter((_, j) => j !== i))}
                  className="text-destructive"
                >
                  ✕
                </Button>
              </div>
            )}
          />
          <Button variant="outline" size="sm" onClick={() => setTags([...tags, { tag_text: "", tag_style: "normal" }])}>
            + 태그 추가
          </Button>
        </Section>

        {/* --- 하단 저장 버튼 --- */}
        <div className="flex gap-4 pt-10 border-t-4 border-slate-900">
          <Button
            onClick={handleSave}
            disabled={saving}
            className="bg-slate-900 text-white font-black px-12 h-16 text-xl shadow-xl hover:bg-primary transition-all rounded-xl"
          >
            {saving ? "데이터 동기화 중..." : "포트폴리오 전체 업데이트 저장"}
          </Button>
          <Link to="/admin">
            <Button variant="outline" className="h-16 px-10 font-black rounded-xl">
              취소
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

// --- 공통 섹션 컴포넌트 ---
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white p-8 rounded-[24px] shadow-sm border-2 border-slate-100">
      <h2 className="text-2xl font-black text-slate-900 mb-8 pb-5 border-b-4 border-slate-900 uppercase tracking-tighter inline-block">
        {title}
      </h2>
      <div className="w-full mt-4">{children}</div>
    </div>
  );
}
