import { useState } from 'react';
import type { Editorial, EditorialMedia } from '@/types/actor';
import { getYouTubeId } from '@/hooks/useActorData';

export default function EditorialSection({ editorials }: { editorials: Editorial[] }) {
  const [activeEditorial, setActiveEditorial] = useState<Editorial | null>(null);
  const [mediaIndex, setMediaIndex] = useState(0);

  if (editorials.length === 0) return null;

  const openModal = (ed: Editorial) => {
    if (ed.editorial_media && ed.editorial_media.length > 0) {
      setActiveEditorial(ed);
      setMediaIndex(0);
    }
  };

  const go = (dir: number) => {
    if (!activeEditorial) return;
    const len = activeEditorial.editorial_media.length;
    setMediaIndex(prev => (prev + dir + len) % len);
  };

  const getThumb = (ed: Editorial): { url: string; isVideo: boolean } | null => {
    const first = ed.editorial_media?.[0];
    if (!first) return null;
    if (first.media_type === 'video') {
      const ytId = getYouTubeId(first.media_url);
      return ytId ? { url: `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`, isVideo: true } : null;
    }
    return { url: first.media_url, isVideo: false };
  };

  const currentMedia = activeEditorial?.editorial_media?.[mediaIndex];

  return (
    <>
      <section className="py-24 px-[8%] border-b border-border">
        <h2 className="text-3xl font-black text-center tracking-[4px] uppercase text-primary mb-16">
          Editorial & Pictorial
        </h2>

        <div className="max-w-[1200px] mx-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
          {editorials.map(ed => {
            const thumb = getThumb(ed);
            const count = ed.editorial_media?.length || 0;
            return (
              <div
                key={ed.id}
                className="group cursor-pointer"
                onClick={() => openModal(ed)}
              >
                <div className="aspect-[3/4] rounded-lg overflow-hidden border border-border relative bg-muted">
                  {thumb ? (
                    <img src={thumb.url} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">No media</div>
                  )}
                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/30 transition-colors duration-300 flex items-center justify-center">
                    {count > 1 && (
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity text-primary-foreground text-sm font-bold bg-foreground/50 px-2 py-0.5 rounded-full">
                        +{count}
                      </span>
                    )}
                  </div>
                  {thumb?.isVideo && (
                    <div className="absolute top-2 right-2 bg-foreground/60 text-primary-foreground text-[10px] px-1.5 py-0.5 rounded font-bold">▶</div>
                  )}
                </div>
                <div className="mt-2">
                  <span className="text-[11px] font-bold text-muted-foreground tracking-wider">{ed.year_label}</span>
                  <h3 className="text-sm font-extrabold leading-tight truncate">{ed.media_name}</h3>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Instagram-style modal */}
      {activeEditorial && currentMedia && (
        <div
          className="fixed inset-0 bg-foreground/95 z-[2000] flex items-center justify-center"
          onClick={() => setActiveEditorial(null)}
        >
          <button
            onClick={() => setActiveEditorial(null)}
            className="absolute top-6 right-8 text-primary-foreground text-4xl font-light cursor-pointer hover:opacity-70 z-10"
          >
            ✕
          </button>

          {/* Header info */}
          <div className="absolute top-6 left-8 text-primary-foreground">
            <span className="text-xs font-bold opacity-70">{activeEditorial.year_label}</span>
            <h3 className="text-base font-extrabold">{activeEditorial.media_name}</h3>
          </div>

          {/* Counter */}
          <div className="absolute top-6 left-1/2 -translate-x-1/2 text-primary-foreground text-sm font-bold">
            {mediaIndex + 1} / {activeEditorial.editorial_media.length}
          </div>

          <div className="relative w-full max-w-[90vw] max-h-[90vh] flex items-center justify-center" onClick={e => e.stopPropagation()}>
            {currentMedia.media_type === 'video' ? (
              <div className="w-[90vw] max-w-[1000px] aspect-video">
                <iframe
                  src={`https://www.youtube.com/embed/${getYouTubeId(currentMedia.media_url)}?autoplay=1`}
                  className="w-full h-full border-4 border-primary-foreground rounded-lg"
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                />
              </div>
            ) : (
              <img src={currentMedia.media_url} alt="" className="max-w-full max-h-[85vh] object-contain rounded-lg" />
            )}

            {activeEditorial.editorial_media.length > 1 && (
              <>
                <button
                  onClick={() => go(-1)}
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-primary-foreground/20 text-primary-foreground flex items-center justify-center text-xl font-bold hover:bg-primary-foreground/40 transition-colors"
                >
                  ‹
                </button>
                <button
                  onClick={() => go(1)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-primary-foreground/20 text-primary-foreground flex items-center justify-center text-xl font-bold hover:bg-primary-foreground/40 transition-colors"
                >
                  ›
                </button>
              </>
            )}
          </div>

          {/* Dots */}
          {activeEditorial.editorial_media.length > 1 && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
              {activeEditorial.editorial_media.map((_, i) => (
                <button
                  key={i}
                  onClick={(e) => { e.stopPropagation(); setMediaIndex(i); }}
                  className={`w-2 h-2 rounded-full transition-all ${i === mediaIndex ? 'bg-primary-foreground w-5' : 'bg-primary-foreground/40'}`}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}