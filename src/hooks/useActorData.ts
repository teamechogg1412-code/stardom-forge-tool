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

      const [images, careers, insights, keywords, videos, awards, tags, editorials] = await Promise.all([
        supabase.from('actor_images').select('*').eq('actor_id', actor.id).order('sort_order'),
        supabase.from('careers').select('*').eq('actor_id', actor.id).order('sort_order'),
        supabase.from('insights').select('*').eq('actor_id', actor.id).maybeSingle(),
        supabase.from('keywords').select('*').eq('actor_id', actor.id),
        supabase.from('videos').select('*, video_links(*)').eq('actor_id', actor.id).order('sort_order'),
        supabase.from('awards').select('*').eq('actor_id', actor.id),
        supabase.from('actor_tags').select('*').eq('actor_id', actor.id),
        supabase.from('editorials').select('*, editorial_media(*)').eq('actor_id', actor.id).order('sort_order'),
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
        editorials: editorials.data || [],
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

      const [images, careers, insights, keywords, videos, awards, tags, editorials] = await Promise.all([
        supabase.from('actor_images').select('*').eq('actor_id', id).order('sort_order'),
        supabase.from('careers').select('*').eq('actor_id', id).order('sort_order'),
        supabase.from('insights').select('*').eq('actor_id', id).maybeSingle(),
        supabase.from('keywords').select('*').eq('actor_id', id),
        supabase.from('videos').select('*, video_links(*)').eq('actor_id', id).order('sort_order'),
        supabase.from('awards').select('*').eq('actor_id', id),
        supabase.from('actor_tags').select('*').eq('actor_id', id),
        supabase.from('editorials').select('*, editorial_media(*)').eq('actor_id', id).order('sort_order'),
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
        editorials: editorials.data || [],
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

export function getYouTubeId(url: string): string | null {
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([^&\n?#]+)/);
  return match ? match[1] : null;
}
