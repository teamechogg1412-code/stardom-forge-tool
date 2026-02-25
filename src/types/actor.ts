export interface Actor {
  id: string;
  name_ko: string;
  name_en: string | null;
  slug: string;
  profile_image_url: string | null;
  instagram_id: string | null;
  homepage_url: string | null;
  namuwiki_url: string | null;
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

export interface ActorImage {
  id: string;
  actor_id: string;
  image_url: string;
  sort_order: number;
}

export interface CareerImage {
  id: string;
  career_id: string;
  image_url: string;
  sort_order: number;
}

export interface Career {
  id: string;
  actor_id: string;
  category: string;
  year_label: string;
  title: string;
  description: string | null;
  youtube_url: string | null;
  sort_order: number;
  career_images: CareerImage[];
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
  size_class: string;
}

export interface Video {
  id: string;
  actor_id: string;
  category: string;
  project_name: string;
  year_label: string;
  sort_order: number;
  video_links: VideoLink[];
}

export interface VideoLink {
  id: string;
  video_id: string;
  youtube_url: string;
  link_label: string;
  sort_order: number;
}

export interface Award {
  id: string;
  actor_id: string;
  title: string;
  year_label: string | null;
  tag_style: string;
  show_on_profile: boolean;
}

export interface Editorial {
  id: string;
  actor_id: string;
  year_label: string;
  media_name: string;
  sort_order: number;
  editorial_media: EditorialMedia[];
}

export interface EditorialMedia {
  id: string;
  editorial_id: string;
  media_url: string;
  media_type: 'image' | 'video';
  sort_order: number;
}

export interface ActorTag {
  id: string;
  actor_id: string;
  tag_text: string;
  tag_style: string;
}

export interface ActorFull extends Actor {
  images: ActorImage[];
  careers: Career[];
  insights: Insight | null;
  keywords: Keyword[];
  videos: Video[];
  awards: Award[];
  actor_tags: ActorTag[];
  editorials: Editorial[];
}
