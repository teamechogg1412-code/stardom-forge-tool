import { useState } from 'react';
import type { Career, CareerImage } from '@/types/actor';
import { getYouTubeId } from '@/hooks/useActorData';
import StillcutModal from './StillcutModal';

export default function CareerPortfolio({ careers }: { careers: Career[] }) {
  const dramaFilm = careers.filter(c => c.category === 'drama_film');
  const brandEditorial = careers.filter(c => c.category === 'brand_editorial');
  const [modalImages, setModalImages] = useState<CareerImage[] | null>(null);

  if (dramaFilm.length === 0 && brandEditorial.length === 0) return null;

  const naverSearchUrl = (title: string) =>
    `https://search.naver.com/search.naver?where=nexearch&sm=top_hty&fbm=0&ie=utf8&query=${encodeURIComponent(title)}`;

  const renderIcons = (c: Career) => {
    const hasImages = c.career_images && c.career_images.length > 0;
    const hasYoutube = c.youtube_url && getYouTubeId(c.youtube_url);
    const isBrand = c.category === 'brand_editorial';

    return (
      <span className="inline-flex gap-1.5 ml-2 align-middle">
        {/* Naver search - always show for drama/film */}
        {!isBrand && (
          <a
            href={naverSearchUrl(c.title)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center w-5 h-5 rounded bg-[#03C75A] text-[10px] font-black text-white hover:opacity-80 transition-opacity cursor-pointer leading-none"
            title="네이버 검색"
          >
            N
          </a>
        )}
        {/* Stillcut images */}
        {hasImages && (
          <button
            onClick={() => setModalImages(c.career_images)}
            className="inline-flex items-center justify-center w-5 h-5 rounded bg-muted-foreground/20 text-[11px] hover:bg-muted-foreground/40 transition-colors cursor-pointer leading-none"
            title="스틸컷 보기"
          >
            🖼
          </button>
        )}
        {/* YouTube */}
        {hasYoutube && (
          <a
            href={c.youtube_url!}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center w-5 h-5 rounded bg-[#FF0000]/15 text-[11px] hover:bg-[#FF0000]/30 transition-colors cursor-pointer leading-none"
            title="영상 보기"
          >
            ▶
          </a>
        )}
      </span>
    );
  };

  const renderList = (items: Career[], title: string) => (
    <div>
      <h3 className="text-xl font-black text-primary mb-10 pb-4 border-b-4 border-primary tracking-wide">{title}</h3>
      <ul className="space-y-7">
        {items.map(c => (
          <li key={c.id} className="flex gap-7 items-start">
            <span className="w-[70px] shrink-0 text-base font-black text-muted-foreground tracking-wide">{c.year_label}</span>
            <div>
              <span className="text-lg font-extrabold leading-snug">
                {c.title}
                {renderIcons(c)}
              </span>
              {c.description && <span className="block text-sm text-muted-foreground font-medium mt-1">{c.description}</span>}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <>
      <section className="py-24 px-[8%] border-b border-border">
        <h2 className="text-3xl font-black text-center tracking-[4px] uppercase text-primary mb-12">Career Portfolio</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 max-w-[1300px] mx-auto">
          {dramaFilm.length > 0 && renderList(dramaFilm, 'Drama & Film')}
          {brandEditorial.length > 0 && renderList(brandEditorial, 'Brand & Editorial')}
        </div>
      </section>

      {modalImages && <StillcutModal images={modalImages} onClose={() => setModalImages(null)} />}
    </>
  );
}
