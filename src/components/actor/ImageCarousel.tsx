import { useState } from 'react';

interface ImageCarouselProps {
  images: { image_url: string }[];
  fallbackUrl?: string | null;
  fallbackInitial?: string;
}

export default function ImageCarousel({ images, fallbackUrl, fallbackInitial }: ImageCarouselProps) {
  const [current, setCurrent] = useState(0);

  const allImages = images.length > 0
    ? images.map(i => i.image_url)
    : fallbackUrl ? [fallbackUrl] : [];

  if (allImages.length === 0) {
    return (
      <div className="aspect-[3/4] bg-muted rounded-lg flex items-center justify-center text-muted-foreground text-4xl font-black">
        {fallbackInitial || '?'}
      </div>
    );
  }

  const go = (dir: number) => {
    setCurrent(prev => (prev + dir + allImages.length) % allImages.length);
  };

  return (
    <div className="relative group rounded-lg overflow-hidden shadow-[15px_15px_40px_rgba(0,0,0,0.08)]">
      <div className="aspect-[3/4] bg-muted">
        <img
          src={allImages[current]}
          alt=""
          className="w-full h-full object-cover transition-opacity duration-300"
        />
      </div>

      {allImages.length > 1 && (
        <>
          {/* Left / Right arrows */}
          <button
            onClick={() => go(-1)}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-foreground/60 text-background flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-sm font-bold"
          >
            ‹
          </button>
          <button
            onClick={() => go(1)}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-foreground/60 text-background flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-sm font-bold"
          >
            ›
          </button>

          {/* Dots indicator */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {allImages.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`w-1.5 h-1.5 rounded-full transition-all ${
                  i === current ? 'bg-primary-foreground w-4' : 'bg-primary-foreground/50'
                }`}
              />
            ))}
          </div>

          {/* Counter */}
          <div className="absolute top-3 right-3 bg-foreground/60 text-background text-xs font-bold px-2 py-0.5 rounded-full">
            {current + 1}/{allImages.length}
          </div>
        </>
      )}
    </div>
  );
}
