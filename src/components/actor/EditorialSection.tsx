import { useState } from 'react';
import type { Editorial } from '@/types/actor';
import { getYouTubeId } from '@/hooks/useActorData';

export default function EditorialSection({ editorials }: { editorials: Editorial[] }) {
  const [lightbox, setLightbox] = useState<{ type: 'image' | 'video'; url: string } | null>(null);

  if (editorials.length === 0) return null;

  return (
    <>
      <section className="py-24 px-[8%] border-b border-border">
        <h2 className="text-3xl font-black text-center tracking-[4px] uppercase text-primary mb-16">
          Editorial & Pictorial
        </h2>

        <div className="max-w-[1200px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {editorials.map(ed => (
            <div key={ed.id} className="group">
              <div className="mb-3">
                <span className="text-xs font-black text-muted-foreground tracking-wider">{ed.year_label}</span>
                <h3 className="text-lg font-extrabold leading-snug">{ed.media_name}</h3>
              </div>

              {ed.editorial_media && ed.editorial_media.length > 0 && (
                <div className={`grid gap-2 ${ed.editorial_media.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
                  {ed.editorial_media.map(m => (
                    <div
                      key={m.id}
                      className="aspect-[3/4] rounded-lg overflow-hidden border border-border cursor-pointer hover:opacity-80 transition-opacity relative"
                      onClick={() => {
                        if (m.media_type === 'video') {
                          const ytId = getYouTubeId(m.media_url);
                          if (ytId) setLightbox({ type: 'video', url: ytId });
                        } else {
                          setLightbox({ type: 'image', url: m.media_url });
                        }
                      }}
                    >
                      {m.media_type === 'video' ? (
                        <>
                          <img
                            src={`https://img.youtube.com/vi/${getYouTubeId(m.media_url)}/hqdefault.jpg`}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 flex items-center justify-center bg-foreground/20">
                            <span className="text-3xl text-primary-foreground">▶</span>
                          </div>
                        </>
                      ) : (
                        <img src={m.media_url} alt="" className="w-full h-full object-cover" />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {lightbox && (
        <div
          className="fixed inset-0 bg-foreground/95 z-[2000] flex items-center justify-center"
          onClick={() => setLightbox(null)}
        >
          <button
            onClick={() => setLightbox(null)}
            className="absolute top-6 right-8 text-primary-foreground text-4xl font-light cursor-pointer hover:opacity-70 z-10"
          >
            ✕
          </button>
          <div className="relative max-w-[90%] max-h-[90%]" onClick={e => e.stopPropagation()}>
            {lightbox.type === 'video' ? (
              <div className="w-[90vw] max-w-[1000px] aspect-video">
                <iframe
                  src={`https://www.youtube.com/embed/${lightbox.url}?autoplay=1`}
                  className="w-full h-full border-4 border-primary-foreground"
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                />
              </div>
            ) : (
              <img src={lightbox.url} alt="" className="max-w-full max-h-[85vh] object-contain" />
            )}
          </div>
        </div>
      )}
    </>
  );
}
