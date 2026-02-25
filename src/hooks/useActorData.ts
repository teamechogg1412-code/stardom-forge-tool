import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import type { Actor, ActorFull } from '@/types/actor';

export function useActors() {
  return useQuery({
    queryKey: ['actors'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('actors')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as Actor[];
    },
  });
}

export function useActorBySlug(slug: string) {
  return useQuery({
    queryKey: ['actor', slug],
    queryFn: async () => {
      const { data: actor, error } = await supabase
        .from('actors')
        .select('*')
        .eq('slug', slug)
        .single();
      if (error) throw error;

      const [images, careers, insights, keywords, videos, awards, tags] = await Promise.all([
        supabase.from('actor_images').select('*').eq('actor_id', actor.id).order('sort_order'),
        supabase.from('careers').select('*').eq('actor_id', actor.id).order('sort_order'),
        supabase.from('insights').select('*').eq('actor_id', actor.id).maybeSingle(),
        supabase.from('keywords').select('*').eq('actor_id', actor.id),
        supabase.from('videos').select('*').eq('actor_id', actor.id).order('sort_order'),
        supabase.from('awards').select('*').eq('actor_id', actor.id),
        supabase.from('actor_tags').select('*').eq('actor_id', actor.id),
      ]);

      return {
        ...actor,
        images: images.data || [],
        careers: careers.data || [],
        insights: insights.data || null,
        keywords: keywords.data || [],
        videos: videos.data || [],
        awards: awards.data || [],
        actor_tags: tags.data || [],
      } as ActorFull;
    },
    enabled: !!slug,
  });
}

export function useActorById(id: string) {
  return useQuery({
    queryKey: ['actor-edit', id],
    queryFn: async () => {
      const { data: actor, error } = await supabase
        .from('actors')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;

      const [images, careers, insights, keywords, videos, awards, tags] = await Promise.all([
        supabase.from('actor_images').select('*').eq('actor_id', id).order('sort_order'),
        supabase.from('careers').select('*').eq('actor_id', id).order('sort_order'),
        supabase.from('insights').select('*').eq('actor_id', id).maybeSingle(),
        supabase.from('keywords').select('*').eq('actor_id', id),
        supabase.from('videos').select('*').eq('actor_id', id).order('sort_order'),
        supabase.from('awards').select('*').eq('actor_id', id),
        supabase.from('actor_tags').select('*').eq('actor_id', id),
      ]);

      return {
        ...actor,
        images: images.data || [],
        careers: careers.data || [],
        insights: insights.data || null,
        keywords: keywords.data || [],
        videos: videos.data || [],
        awards: awards.data || [],
        actor_tags: tags.data || [],
      } as ActorFull;
    },
    enabled: !!id && id !== 'new',
  });
}

export function useDeleteActor() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('actors').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['actors'] }),
  });
}

const YOUTUBE_ID_PATTERN = /^[a-zA-Z0-9_-]{11}$/;

function isValidYouTubeId(value: string | null | undefined): boolean {
  return !!value && YOUTUBE_ID_PATTERN.test(value);
}

export function getYouTubeId(input: string): string | null {
  const value = input?.trim();
  if (!value) return null;

  if (isValidYouTubeId(value)) return value;

  try {
    const url = new URL(value);
    const host = url.hostname.replace('www.', '');

    if (host === 'youtu.be') {
      const id = url.pathname.split('/').filter(Boolean)[0];
      return isValidYouTubeId(id) ? id : null;
    }

    if (host.endsWith('youtube.com') || host.endsWith('youtube-nocookie.com')) {
      const fromQuery = url.searchParams.get('v');
      if (isValidYouTubeId(fromQuery)) return fromQuery;

      const segments = url.pathname.split('/').filter(Boolean);
      const targetIndex = segments.findIndex(segment => ['embed', 'shorts', 'live', 'v'].includes(segment));
      if (targetIndex >= 0) {
        const id = segments[targetIndex + 1];
        return isValidYouTubeId(id) ? id : null;
      }

      const directId = segments[0];
      if (isValidYouTubeId(directId)) return directId;
    }
  } catch {
    // Non-URL strings fall back to regex extraction below.
  }

  const fallback = value.match(/(?:youtu\.be\/|youtube(?:-nocookie)?\.com\/(?:watch\?.*v=|embed\/|shorts\/|live\/|v\/))([a-zA-Z0-9_-]{11})/);
  return fallback ? fallback[1] : null;
}

export function normalizeYouTubeUrl(input: string): string | null {
  const id = getYouTubeId(input);
  return id ? `https://www.youtube.com/watch?v=${id}` : null;
}
