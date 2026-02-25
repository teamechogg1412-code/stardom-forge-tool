import { useState, useEffect } from 'react';
import type { ActorFull } from '@/types/actor';

export default function ArtistBio({ actor }: { actor: ActorFull }) {
  const [randomImage, setRandomImage] = useState<string>('');

  useEffect(() => {
    const allPossibleImages = [
      ...(actor.profile_image_url ? [actor.profile_image_url] : []),
      ...actor.images.map(img => img.image_url)
    ];
    if (allPossibleImages.length > 0) {
      const randomIndex = Math.floor(Math.random() * allPossibleImages.length);
      setRandomImage(allPossibleImages[randomIndex]);
    }
  }, [actor.images, actor.profile_image_url]);

  // 하이라이트와 본문 중 하나라도 있어야 표시
  if (!actor.bio_headline && !actor.bio_text) return null;

  return (
    <section className="py-28 px-[10%] border-b border-border bg-white">
      <div className="max-w-[1500px] mx-auto">
        
        {/* 상단 헤더 라인 */}
        <div className="flex justify-between items-end border-b-2 border-foreground pb-4 mb-20">
          <h2 className="text-xl font-black tracking-tighter uppercase italic">Artist Bio</h2>
          <span className="text-base font-bold tracking-[0.2em] uppercase text-muted-foreground">
            {actor.name_en || actor.name_ko}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
          {/* 왼쪽: 텍스트 영역 */}
          <div className="lg:col-span-7 space-y-12">
            
            {/* 하이라이트 필드를 굵게 표시 */}
            {actor.bio_headline && (
              <div className="text-2xl lg:text-3xl font-black text-primary leading-[1.3] tracking-tight break-keep">
                {actor.bio_headline}
              </div>
            )}
            
            {/* 본문 필드를 일반 굵기로 표시 */}
            {actor.bio_text && (
              <div className="text-[1.05rem] leading-[2] text-foreground/80 font-medium whitespace-pre-wrap break-keep text-justify">
                {actor.bio_text}
              </div>
            )}
          </div>

          {/* 오른쪽: 랜덤 이미지 영역 */}
          <div className="lg:col-span-5 pt-4">
            <div className="relative group">
              <div className="absolute -top-4 -right-4 w-full h-full border border-primary/10 rounded-sm -z-10"></div>
              <div className="aspect-[3/4.2] rounded-sm overflow-hidden shadow-[20px_20px_60px_rgba(0,0,0,0.1)] bg-muted">
                {randomImage && (
                  <img 
                    src={randomImage} 
                    alt="Bio portrait" 
                    className="w-full h-full object-cover grayscale-[15%] hover:grayscale-0 transition-all duration-1000"
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
