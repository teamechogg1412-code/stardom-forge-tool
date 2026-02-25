import { useState } from "react";
import type { Editorial, Award } from "@/types/actor";
import { getYouTubeId } from "@/hooks/useActorData";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

export default function EditorialSection({ editorials, awards }: { editorials: Editorial[]; awards: Award[] }) {
  const [activeEditorial, setActiveEditorial] = useState<Editorial | null>(null);
  const [activeAwardVideo, setActiveAwardVideo] = useState<string | null>(null); // 시상식 영상용 state
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
    setMediaIndex((prev) => (prev + dir + len) % len);
  };

  const getThumb = (ed: Editorial): { url: string; isVideo: boolean } | null => {
    const first = ed.editorial_media?.[0];
    if (!first) return null;
    if (first.media_type === "video") {
      const ytId = getYouTubeId(first.media_url);
      return ytId ? { url: `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`, isVideo: true } : null;
    }
    return { url: first.media_url, isVideo: false };
  };

  const currentMedia = activeEditorial?.editorial_media?.[mediaIndex];

  return (
    <>
      <section className="py-24 px-[8%] border-b border-border overflow-hidden">
        <h2 className="text-3xl font-black text-center tracking-[4px] uppercase text-primary mb-16">
          Editorial & Pictorial
        </h2>

        {/* 화보 캐러셀 */}
        <div className="max-w-[1600px] mx-auto relative px-12 mb-32">
          <Carousel opts={{ align: "start", loop: true }} className="w-full">
            <CarouselContent className="-ml-4">
              {editorials.map((ed) => {
                const thumb = getThumb(ed);
                const count = ed.editorial_media?.length || 0;
                return (
                  <CarouselItem key={ed.id} className="pl-4 basis-full sm:basis-1/3 md:basis-1/5 lg:basis-[14.28%]">
                    <div className="group cursor-pointer" onClick={() => openModal(ed)}>
                      <div className="aspect-[3/4] rounded-lg overflow-hidden border border-border relative bg-muted">
                        {thumb ? (
                          <img
                            src={thumb.url}
                            alt=""
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
                            No media
                          </div>
                        )}
                        <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/30 transition-colors duration-300 flex items-center justify-center">
                          {count > 1 && (
                            <span className="opacity-0 group-hover:opacity-100 transition-opacity text-primary-foreground text-sm font-bold bg-foreground/50 px-2 py-0.5 rounded-full">
                              +{count}
                            </span>
                          )}
                        </div>
                        {thumb?.isVideo && (
                          <div className="absolute top-2 right-2 bg-foreground/60 text-primary-foreground text-[10px] px-1.5 py-0.5 rounded font-bold">
                            ▶
                          </div>
                        )}
                      </div>
                      <div className="mt-4">
                        <span className="text-[11px] font-bold text-muted-foreground tracking-wider">
                          {ed.year_label}
                        </span>
                        <h3 className="text-sm font-extrabold leading-tight truncate">{ed.media_name}</h3>
                      </div>
                    </div>
                  </CarouselItem>
                );
              })}
            </CarouselContent>
            <CarouselPrevious className="-left-6 h-10 w-10" />
            <CarouselNext className="-right-6 h-10 w-10" />
          </Carousel>
        </div>

        {/* 수상 내역 리스트 (스크린샷 스타일) */}
        {awards && awards.length > 0 && (
          <div className="max-w-[1200px] mx-auto pt-24 border-t-2 border-primary/30">
            <div className="flex flex-col md:flex-row gap-10 md:gap-20">
              {/* 왼쪽 카테고리 라벨 */}
              <div className="shrink-0">
                <h3 className="text-lg font-black text-primary tracking-tighter flex items-center gap-3">
                  AWARDS <span className="w-8 h-[2px] bg-primary"></span>
                </h3>
              </div>

              {/* 오른쪽 리스트 */}
              <div className="flex-1">
                {awards
                  .filter((a) => a.show_on_profile)
                  .map((award) => (
                    <div
                      key={award.id}
                      className="group flex items-center justify-between py-5 border-b border-border/60 hover:bg-secondary/20 transition-colors px-2"
                    >
                      <div className="flex items-baseline gap-6">
                        <span className="text-sm font-black text-muted-foreground/60 tabular-nums w-12">
                          {award.year_label}
                        </span>
                        <span className="text-base font-extrabold text-foreground/90 group-hover:text-primary transition-colors">
                          {award.title}
                        </span>
                      </div>

                      {/* 유튜브 링크가 있을 경우 버튼 표시 */}
                      {award.youtube_url && (
                        <button
                          onClick={() => setActiveAwardVideo(getYouTubeId(award.youtube_url!))}
                          className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center text-lg hover:bg-primary hover:text-white transition-all shadow-sm"
                          title="수상 장면 보기"
                        >
                          🎞️
                        </button>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}
      </section>

      {/* 시상식 영상 모달 */}
      {activeAwardVideo && (
        <div
          className="fixed inset-0 bg-foreground/95 z-[2500] flex items-center justify-center"
          onClick={() => setActiveAwardVideo(null)}
        >
          <div className="relative w-[90%] max-w-[1000px] aspect-video" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setActiveAwardVideo(null)}
              className="absolute -top-12 right-0 text-white text-3xl font-light hover:opacity-70"
            >
              ✕
            </button>
            <iframe
              src={`https://www.youtube.com/embed/${activeAwardVideo}?autoplay=1`}
              className="w-full h-full border-4 border-primary shadow-2xl rounded-lg"
              allow="autoplay; encrypted-media"
              allowFullScreen
            />
          </div>
        </div>
      )}

      {/* 화보 모달 (기존과 동일) */}
      {activeEditorial && currentMedia && (
        <div
          className="fixed inset-0 bg-foreground/95 z-[2000] flex items-center justify-center"
          onClick={() => setActiveEditorial(null)}
        >
          <button
            onClick={() => setActiveEditorial(null)}
            className="absolute top-6 right-8 text-white text-4xl font-light hover:opacity-70 z-10"
          >
            ✕
          </button>
          <div className="absolute top-6 left-8 text-white">
            <span className="text-xs font-bold opacity-70">{activeEditorial.year_label}</span>
            <h3 className="text-base font-extrabold">{activeEditorial.media_name}</h3>
          </div>
          <div
            className="relative w-full max-w-[90vw] max-h-[90vh] flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {currentMedia.media_type === "video" ? (
              <div className="w-[90vw] max-w-[1000px] aspect-video">
                <iframe
                  src={`https://www.youtube.com/embed/${getYouTubeId(currentMedia.media_url)}?autoplay=1`}
                  className="w-full h-full border-4 border-white rounded-lg"
                  allowFullScreen
                />
              </div>
            ) : (
              <img
                src={currentMedia.media_url}
                alt=""
                className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
              />
            )}
            {activeEditorial.editorial_media.length > 1 && (
              <>
                <button
                  onClick={() => go(-1)}
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 text-white flex items-center justify-center text-xl hover:bg-white/40"
                >
                  ‹
                </button>
                <button
                  onClick={() => go(1)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 text-white flex items-center justify-center text-xl hover:bg-white/40"
                >
                  ›
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
