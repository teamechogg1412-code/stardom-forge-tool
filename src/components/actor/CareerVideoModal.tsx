import { useState } from 'react';
import { getYouTubeId } from '@/hooks/useActorData';

interface CareerVideoModalProps {
  links: { link_url: string; link_label: string }[];
  initialIndex: number;
  onClose: () => void;
}

export default function CareerVideoModal({ links, initialIndex, onClose }: CareerVideoModalProps) {
  const [current, setCurrent] = useState(initialIndex);

  if (links.length === 0) return null;

  const go = (dir: number) => {
    setCurrent(prev => (prev + dir + links.length) % links.length);
  };

  const currentYtId = getYouTubeId(links[current].link_url);

  return (
    <div className="fixed inset-0 bg-foreground/95 z-[3000] flex items-center justify-center" onClick={onClose}>
      <button onClick={onClose} className="absolute top-6 right-8 text-white text-4xl font-light hover:opacity-70 z-10">✕</button>
      
      <div className="absolute top-6 left-8 text-white flex flex-col gap-1">
        <span className="text-xs font-bold opacity-70 uppercase tracking-widest">Video Archive</span>
        <h3 className="text-base font-extrabold">{links[current].link_label || '플레이어'}</h3>
      </div>

      <div className="relative w-full max-w-[1000px] aspect-video mx-4" onClick={e => e.stopPropagation()}>
        {currentYtId ? (
          <iframe
            src={`https://www.youtube.com/embed/${currentYtId}?autoplay=1`}
            className="w-full h-full border-4 border-primary rounded-lg shadow-2xl"
            allow="autoplay; encrypted-media"
            allowFullScreen
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-muted text-white">유효하지 않은 영상 링크입니다.</div>
        )}

        {/* 좌우 이동 버튼 */}
        {links.length > 1 && (
          <>
            <button onClick={() => go(-1)} className="absolute -left-16 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 text-white flex items-center justify-center text-2xl hover:bg-primary transition-colors">‹</button>
            <button onClick={() => go(1)} className="absolute -right-16 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 text-white flex items-center justify-center text-2xl hover:bg-primary transition-colors">›</button>
          </>
        )}
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/50 text-sm font-bold">
        {current + 1} / {links.length}
      </div>
    </div>
  );
}