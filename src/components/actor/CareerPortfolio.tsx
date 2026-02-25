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
    const isBrand = c.category === 'brand_editorial';
    const links = (c as any).career_links || [];

    return (
      <span className="inline-flex gap-1.5 ml-2 align-middle">
        {!isBrand && (
          <a href={naverSearchUrl(c.title)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center w-5 h-5 rounded bg-[#03C75A] text-[10px] font-black text-white hover:opacity-80 transition-opacity leading-none">N</a>
        )}
        {hasImages && (
          <button onClick={(e) => { e.stopPropagation(); setModalImages(c.career_images); }} className="inline-flex items-center justify-center w-5 h-5 rounded bg-slate-200 text-[12px] hover:bg-slate-300 transition-colors cursor-pointer leading-none">📸</button>
        )}
        {links.map((link: any) => {
          const ytId = getYouTubeId(link.link_url);
          return (
            <a key={link.id} href={link.link_url} target="_blank" rel="noopener noreferrer" className={`inline-flex items-center justify-center w-5 h-5 rounded ${ytId ? 'bg-[#FF0000]' : 'bg-slate-800'} text-[10px] text-white hover:opacity-80 transition-opacity leading-none`}>
              {ytId ? '▶' : 'L'}
            </a>
          );
        })}
      </span>
    );
  };

  const renderList = (items: Career[], title: string) => (
    <div className="flex-1">
      <h3 className="text-xl font-black text-primary mb-10 pb-4 border-b-4 border-primary tracking-wide uppercase">{title}</h3>
      <ul className="space-y-10">
        {items.map(c => {
          const cleanDescription = c.description?.replace(/\[.*?\]/, '').trim();
          const roleImage = (c as any).role_image_url; // DB에서 가져온 배역 이미지

          return (
            <li key={c.id} className="flex gap-7 items-start group relative">
              {/* 연도 */}
              <span className="w-[60px] shrink-0 text-base font-black text-slate-400 tabular-nums group-hover:text-primary transition-colors pt-1">
                {c.year_label}
              </span>
              
              <div className="flex items-start gap-3 flex-1">
                {/* [서브 카테고리 배지] */}
                {c.sub_category && (
                  <span className="shrink-0 mt-1 px-2 py-0.5 text-[9px] font-black bg-slate-900 text-white rounded-[2px] uppercase tracking-wider shadow-sm">
                    {c.sub_category}
                  </span>
                )}

                {/* 텍스트 영역 */}
                <div className="flex flex-col relative flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-extrabold leading-tight text-slate-900 group-hover:text-primary transition-colors">
                      {c.title}
                    </span>
                    <div className="inline-flex items-center scale-90 origin-left">
                      {renderIcons(c)}
                    </div>
                  </div>

                  {/* 배역명 (작품명 바로 아래) */}
                  {cleanDescription && (
                    <span className="block text-sm text-slate-500 font-bold mt-1.5 tracking-tight group-hover:text-slate-800 transition-colors">
                      {cleanDescription}
                    </span>
                  )}

                  {/* ⭐ 배역 이미지 호버 미리보기 ⭐ */}
                  {roleImage && (
                    <div className="absolute left-0 top-[110%] z-[100] opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 pointer-events-none transition-all duration-300 ease-out">
                      <div className="relative w-44 aspect-[3/4] rounded-xl overflow-hidden border-[6px] border-white shadow-[0_20px_50px_rgba(0,0,0,0.3)] bg-slate-100">
                        <img src={roleImage} alt={c.title} className="w-full h-full object-cover" />
                        <div className="absolute bottom-0 w-full p-3 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                          <p className="text-[11px] text-white font-black leading-tight uppercase">{c.sub_category}</p>
                          <p className="text-[13px] text-white font-extrabold leading-tight mt-0.5">{c.title}</p>
                          <p className="text-[10px] text-white/70 font-bold mt-1">{cleanDescription}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );

  return (
    <>
      <section className="py-24 px-[8%] border-b border-border bg-white overflow-visible">
        <h2 className="text-3xl font-black text-center tracking-[4px] uppercase text-primary mb-20">Career Portfolio</h2>
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 max-w-[1800px] mx-auto">
          {renderList(dramaFilm, 'Drama & Film')}
          {renderList(brandEditorial, 'Brand & Editorial / Etc')}
        </div>
      </section>

      {modalImages && <StillcutModal images={modalImages} onClose={() => setModalImages(null)} />}
    </>
  );
}
