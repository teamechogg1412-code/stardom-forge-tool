export interface Actor {
  id: string;
  name_ko: string;
  name_en: string | null;
  slug: string;
  profile_image_url: string | null;
  instagram_id: string | null;
  followers: string | null;
  posts: string | null;
  following: string | null;
  avg_likes: string | null;
  avg_comments: string | null;
  height: string | null;
  language: string | null;
  brand_keyword: string | null;
  created_at: string;
}

export interface Career {
  id: string;
  actor_id: string;
  category: string; // 'drama_film' | 'brand_editorial'
  year_label: string;
  title: string;
  description: string | null;
  sort_order: number;
}

export interface Insight {
  id: string;
  actor_id: string;
  monthly_search: string | null;
  content_saturation: string | null;
  audience_interest: string | null;
  gender_female_pct: number | null;
  regional_impact: string | null;
  age_20s: number | null;
  age_30s: number | null;
  age_40s: number | null;
  core_age_description: string | null;
}

export interface Keyword {
  id: string;
  actor_id: string;
  keyword: string;
  size_class: string; // 'tag-xl' | 'tag-l' | 'tag-m' | 'tag-s'
}

export interface Video {
  id: string;
  actor_id: string;
  project_name: string;
  youtube_url: string;
  sort_order: number;
}

export interface Award {
  id: string;
  actor_id: string;
  title: string;
  tag_style: string;
}

export interface ActorTag {
  id: string;
  actor_id: string;
  tag_text: string;
  tag_style: string; // 'normal' | 'important' | 'award'
}

export interface ActorFull extends Actor {
  careers: Career[];
  insights: Insight | null;
  keywords: Keyword[];
  videos: Video[];
  awards: Award[];
  actor_tags: ActorTag[];
}
