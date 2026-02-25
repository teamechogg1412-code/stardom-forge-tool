import { useState } from 'react';
import type { Video } from '@/types/actor';
import { getYouTubeId } from '@/hooks/useActorData';

const CATEGORY_LABELS: Record<string, string> = {
  drama_film: '1. Drama & Film',
  advertising: '2. Advertising',
  magazine: '3. Magazine',
  event_diary: '4. Event & Diary',
  music_video: '5. Music Video',
  awards_other: '6. Awards & Other',
};

const CATEGORY_ORDER = ['drama_film', 'advertising', 'magazine', 'event_diary', 'music_video', 'awards_other'];

export default function VideoSection({ videos }: { videos: Video[] }) {
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  if (videos.length === 0) return null;

  const grouped = CATEGORY_ORDER.reduce<Record<string, Video[]>>((acc, cat) => {
    const items = videos.filter(v => v.category === cat);
    if (items.length > 0) acc[cat] = items;
    return acc;
  }, {});

  // Also include any videos with categories not in the standard list
  videos.forEach(v => {
    if (!CATEGORY_ORDER.includes(v.category)) {
      if (!grouped[v.category]) grouped[v.category] = [];
      grouped[v.category].push(v);
    }
  });

  const categoryKeys = Object.keys(grouped);

  return (
    <>
      <section className="py-24 px-[8%] border-b border-border">
        <h2 className="text-3xl font-black text-center tracking-[4px] uppercase text-primary mb-16">
          Visual Archive
        </h2>

        <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-14">
          {categoryKeys.map(cat => (
            <div key={cat}>
              <h3 className="text-sm font-black text-primary uppercase tracking-wider pb-3 border-b-[3px] border-primary mb-5">
                {CATEGORY_LABELS[cat] || cat}
              </h3>
              <ul className="space-y-0">
                {grouped[cat].map(v => (
                  <li key={v.id}>
                    <div className="flex items-center justify-between py-3 border-b border-border">
                      <span className="font-bold text-sm flex-1">{v.project_name}</span>
                      {v.year_label && (
                        <span className="text-xs text-muted-foreground font-medium ml-3 shrink-0">{v.year_label}</span>
                      )}
                    </div>
                    {v.video_links && v.video_links.length > 0 && (
                      <div className="pl-4 py-1 space-y-1">
                        {v.video_links.map(link => {
                          const ytId = getYouTubeId(link.youtube_url);
                          return (
                            <div
                              key={link.id}
                              className="flex items-center gap-2 py-1.5 cursor-pointer hover:text-primary transition-colors text-sm"
                              onClick={() => ytId && setActiveVideo(ytId)}
                            >
                              <span className="text-destructive text-xs">▶</span>
                              <span className="font-semibold">{link.link_label || '영상 보기'}</span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {activeVideo && (
        <div
          className="fixed inset-0 bg-foreground/95 z-[2000] flex items-center justify-center"
          onClick={() => setActiveVideo(null)}
        >
          <div className="relative w-[90%] max-w-[1000px] aspect-video" onClick={e => e.stopPropagation()}>
            <button
              onClick={() => setActiveVideo(null)}
              className="absolute -top-14 right-0 text-primary-foreground text-4xl font-light cursor-pointer hover:opacity-70"
            >
              ✕
            </button>
            <iframe
              src={`https://www.youtube.com/embed/${activeVideo}?autoplay=1`}
              className="w-full h-full border-4 border-primary-foreground"
              allow="autoplay; encrypted-media"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </>
  );
}
