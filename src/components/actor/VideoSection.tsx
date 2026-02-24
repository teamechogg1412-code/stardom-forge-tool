import { useState } from 'react';
import type { Video } from '@/types/actor';
import { getYouTubeId } from '@/hooks/useActorData';

export default function VideoSection({ videos }: { videos: Video[] }) {
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  if (videos.length === 0) return null;

  return (
    <>
      <section className="py-24 px-[8%] border-b border-border">
        <h2 className="text-3xl font-black text-center tracking-[4px] uppercase text-primary mb-12">Video Archive</h2>
        <div className="max-w-[800px] mx-auto">
          {videos.map(v => {
            const ytId = getYouTubeId(v.youtube_url);
            return (
              <div
                key={v.id}
                className="flex items-center justify-between py-4 border-b border-border cursor-pointer font-bold hover:text-primary hover:bg-secondary/50 px-3 rounded transition-colors"
                onClick={() => ytId && setActiveVideo(ytId)}
              >
                <span>{v.project_name}</span>
                <span className="text-destructive text-lg">▶</span>
              </div>
            );
          })}
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
