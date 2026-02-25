import { useState } from 'react';
import type { CareerImage } from '@/types/actor';

interface StillcutModalProps {
  images: CareerImage[];
  onClose: () => void;
}

export default function StillcutModal({ images, onClose }: StillcutModalProps) {
  const [current, setCurrent] = useState(0);

  if (images.length === 0) return null;

  const go = (dir: number) => {
    setCurrent(prev => (prev + dir + images.length) % images.length);
  };

  return (
    <div className="fixed inset-0 bg-foreground/95 z-[2000] flex items-center justify-center" onClick={onClose}>
      <button
        onClick={onClose}
        className="absolute top-6 right-8 text-primary-foreground text-4xl font-light cursor-pointer hover:opacity-70 z-10"
      >
        ✕
      </button>

      <div className="absolute top-6 left-8 text-primary-foreground text-sm font-bold">
        {current + 1} / {images.length}
      </div>

      <div className="relative w-full max-w-[90vw] max-h-[90vh] flex items-center justify-center" onClick={e => e.stopPropagation()}>
        <img
          src={images[current].image_url}
          alt=""
          className="max-w-full max-h-[85vh] object-contain"
        />

        {images.length > 1 && (
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

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={(e) => { e.stopPropagation(); setCurrent(i); }}
            className={`w-2 h-2 rounded-full transition-all ${i === current ? 'bg-primary-foreground w-5' : 'bg-primary-foreground/40'}`}
          />
        ))}
      </div>
    </div>
  );
}
