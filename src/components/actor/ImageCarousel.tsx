import { useEffect, useState } from 'react';

interface ImageCarouselProps {
  images: { image_url: string }[];
  fallbackUrl?: string | null;
  fallbackInitial?: string;
}

export default function ImageCarousel({ images, fallbackUrl, fallbackInitial }: ImageCarouselProps) {
  const [current, setCurrent] = useState(0);
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  const allImages = images.length > 0
    ? images.map(i => i.image_url)
    : fallbackUrl ? [fallbackUrl] : [];

  const go = (dir: number) => {
    setCurrent(prev => (prev + dir + allImages.length) % allImages.length);
  };

  useEffect(() => {
    if (!isViewerOpen || allImages.length <= 1) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsViewerOpen(false);
      if (event.key === 'ArrowLeft') setCurrent(prev => (prev - 1 + allImages.length) % allImages.length);
      if (event.key === 'ArrowRight') setCurrent(prev => (prev + 1) % allImages.length);
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isViewerOpen, allImages.length]);

  if (allImages.length === 0) {
    return (
      <div className="aspect-[3/4] bg-muted rounded-lg flex items-center justify-center text-muted-foreground text-4xl font-black">
        {fallbackInitial || '?'}
      </div>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsViewerOpen(true)}
        className="relative group w-full rounded-lg overflow-hidden shadow-[15px_15px_40px_rgba(0,0,0,0.08)] text-left"
      >
        <div className="aspect-[3/4] bg-muted">
          <img
            src={allImages[current]}
            alt={`화보 이미지 ${current + 1}`}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          />
        </div>

        <div className="absolute left-3 bottom-3 bg-foreground/70 text-background text-xs font-black px-3 py-1 rounded-full">
          화보 보기
        </div>

        {allImages.length > 1 && (
          <div className="absolute right-3 top-3 bg-foreground/70 text-background text-xs font-bold px-2 py-0.5 rounded-full">
            {current + 1}/{allImages.length}
          </div>
        )}
      </button>

      {isViewerOpen && (
        <div
          className="fixed inset-0 z-[2200] bg-foreground/90 backdrop-blur-sm p-4 md:p-8 flex items-center justify-center"
          onClick={() => setIsViewerOpen(false)}
        >
          <div className="relative w-full max-w-4xl" onClick={e => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => setIsViewerOpen(false)}
              className="absolute -top-12 right-0 text-primary-foreground text-4xl leading-none"
              aria-label="닫기"
            >
              ✕
            </button>

            <div className="aspect-[3/4] max-h-[85vh] bg-muted rounded-xl overflow-hidden">
              <img
                src={allImages[current]}
                alt={`화보 확대 이미지 ${current + 1}`}
                className="w-full h-full object-contain"
              />
            </div>

            {allImages.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => go(-1)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-foreground/65 text-background flex items-center justify-center text-lg font-black"
                  aria-label="이전 이미지"
                >
                  ‹
                </button>
                <button
                  type="button"
                  onClick={() => go(1)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-foreground/65 text-background flex items-center justify-center text-lg font-black"
                  aria-label="다음 이미지"
                >
                  ›
                </button>

                <div className="mt-4 flex items-center justify-center gap-2">
                  {allImages.map((_, i) => (
                    <button
                      type="button"
                      key={i}
                      onClick={() => setCurrent(i)}
                      className={`h-1.5 rounded-full transition-all ${
                        i === current ? 'w-6 bg-primary-foreground' : 'w-2 bg-primary-foreground/40'
                      }`}
                      aria-label={`${i + 1}번 이미지로 이동`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}

