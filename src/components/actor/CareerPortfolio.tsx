import { useState } from 'react';
import type { Career, CareerImage } from '@/types/actor';
import { getYouTubeId } from '@/hooks/useActorData';
import StillcutModal from './StillcutModal';
import CareerVideoModal from './CareerVideoModal';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function CareerPortfolio({ careers }: { careers: Career[] }) {
  const ITEMS_PER_PAGE = 12; // 한 페이지에 12개 (왼쪽 6개, 오른쪽 6개)

  const [dramaPage, setDramaPage] = useState(0);
  const [brandPage, setBrandPage] = useState(0);
  const [modalImages, setModalImages] = useState<CareerImage[] | null>(null);
  const [activeVideoSet, setActiveVideoSet] = useState<{links: any[], index: number} | null>(null);

  // 데이터 정렬 (최신순)
  const sortedCareers = [...careers].sort((a, b) => b.year_label.localeCompare(a.year_label));
  const dramaFilm = sortedCareers.filter(c => c.category === 'drama_film');
  const brandEtc = sortedCareers.filter(c => c.category === 'brand_editorial');

  if (careers.length === 0) return null;

  const getSubCategoryStyle = (subCat: string | null) => {
    const cat = subCat?.toLowerCase() || '';
    switch (cat) {
      case 'drama': return 'bg-blue-700 text-white';
      case 'movie': return 'bg-black text-white';
      case 'mv': return 'bg-violet-600 text-white';
      case 'cf': return 'bg-amber-500 text-white';
      case 'editorial': return 'bg-teal-600 text-white';
      default: return 'bg-slate-400 text-white';
    }
  };

  const renderIcons = (c: Career) => {
    const hasImages = c.career_images && c.career_images.length > 0;
    const isBrand = c.category === 'brand_editorial';
    const youtubeLinks = ((c as any).career_links || []).filter((l: any) => getYouTubeId(l.link_url));

    return (
      <span className="inline-flex gap-1.5 ml-2 align-middle">
        {!isBrand && (
          <a href={`https://search.naver.com/search.naver?query=${encodeURIComponent(c.title)}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center w-5 h-5 rounded bg-[#03C75A] text-[10px] font-black text-white hover:opacity-80 transition-opacity leading-none shadow-sm">N</a>
        )}
        {hasImages && (
          <button onClick={(e) => { e.stopPropagation(); setModalImages(c.career_images); }} className="inline-flex items-center justify-center w-5 h-5 rounded bg-slate-200 text-[12px] hover:bg-slate-300 transition-colors cursor-pointer leading-none shadow-sm">📸</button>
        )}
        {youtubeLinks.length > 0 && (
          <button onClick={(e) => { e.stopPropagation(); setActiveVideoSet({ links: youtubeLinks, index: 0 }); }} className="inline-flex items-center justify-center w-5 h-5 rounded bg-[#FF0000] text-[10px] text-white hover:opacity-80 transition-opacity leading-none shadow-sm">▶</button>
        )}
      </span>
    );
  };

  // 개별 아이템 렌더링 (연도 표시 로직 포함)
  const renderItem = (c: Career, index: number, allItemsInPage: Career[]) => {
    const cleanDescription = c.description?.replace(/\[.*?\]/, '').trim();
    const roleImage = (c as any).role_image_url;
    
    // 페이지 내에서의 인덱스가 아닌, 전체 리스트에서의 인덱스를 찾아 연도 중복 체크
    const globalIndex = careers.findIndex(item => item.id === c.id);
    const isFirstInYear = globalIndex === 0 || c.year_label !== careers[globalIndex - 1].year_label;

    return (
      <div key={c.id} className="flex gap-6 items-start group relative border-b border-slate-100 pb-7 last:border-0">
        <div className="w-[50px] shrink-0 pt-1">
          {isFirstInYear ? (
            <span className="text-sm font-black text-primary tabular-nums">{c.year_label}</span>
          ) : (
            <span className="opacity-0 text-sm font-black select-none">{c.year_label}</span>
          )}
        </div>
        
        <div className="flex items-start gap-3 flex-1 min-w-0">
          {c.sub_category && (
            <span className={`shrink-0 mt-1 px-2 py-0.5 text-[8px] font-black rounded-[2px] uppercase tracking-wider shadow-sm ${getSubCategoryStyle(c.sub_category)}`}>
              {c.sub_category}
            </span>
          )}
          <div className="flex flex-col relative flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-base font-extrabold leading-tight text-slate-900 group-hover:text-primary transition-colors truncate">{c.title}</span>
              <div className="shrink-0 scale-90 origin-left">{renderIcons(c)}</div>
            </div>
            {cleanDescription && <span className="block text-xs text-slate-500 font-bold mt-1.5 tracking-tight truncate group-hover:text-slate-800 transition-colors">{cleanDescription}</span>}

            {roleImage && (
              <div className="absolute left-[220px] -top-12 z-[100] opacity-0 scale-95 translate-x-1 group-hover:opacity-100 group-hover:scale-100 group-hover:translate-x-0 pointer-events-none transition-all duration-300 ease-out hidden xl:block">
                <div className="relative w-40 aspect-[3/4] rounded-xl overflow-hidden border-[5px] border-white shadow-[0_20px_50px_rgba(0,0,0,0.3)] bg-slate-100">
                  <img src={roleImage} alt={c.title} className="w-full h-full object-cover" />
                  <div className="absolute bottom-0 w-full p-3 bg-gradient-to-t from-black/90 via-black/20 to-transparent text-left">
                    <p className="text-[11px] text-white/80 font-black leading-tight uppercase">{c.sub_category}</p>
                    <p className="text-[13px] text-white font-extrabold leading-tight mt-0.5">{c.title}</p>
                    <p className="text-[10px] text-white/70 font-bold mt-1">{cleanDescription}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // 페이지 기반 렌더링 로직 (왼쪽 채우고 오른쪽 채우기)
  const renderPaginatedContent = (items: Career[], currentPage: number, setCurrentPage: (p: number) => void) => {
    const totalPages = Math.ceil(items.length / ITEMS_PER_PAGE);
    const startIndex = currentPage * ITEMS_PER_PAGE;
    const pageItems = items.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    
    // 왼쪽 6개, 오른쪽 6개로 분할
    const leftColItems = pageItems.slice(0, 6);
    const rightColItems = pageItems.slice(6, 12);

    return (
      <div className="flex flex-col gap-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-16 gap-y-0 mt-8 min-h-[550px]">
          <div className="space-y-8">{leftColItems.map((c, i) => renderItem(c, i, pageItems))}</div>
          <div className="space-y-8">{rightColItems.map((c, i) => renderItem(c, i + 6, pageItems))}</div>
        </div>
        
        {/* 페이지네이션 컨트롤 */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-6 mt-4">
            <button 
              onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
              disabled={currentPage === 0}
              className="w-10 h-10 rounded-full border-2 border-slate-200 flex items-center justify-center hover:border-primary hover:text-primary disabled:opacity-30 disabled:hover:border-slate-200 disabled:hover:text-current transition-all"
            >
              <ChevronLeft size={20} />
            </button>
            <span className="text-xs font-black tracking-widest text-slate-400 uppercase">
              Page {currentPage + 1} <span className="mx-2 text-slate-200">/</span> {totalPages}
            </span>
            <button 
              onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
              disabled={currentPage === totalPages - 1}
              className="w-10 h-10 rounded-full border-2 border-slate-200 flex items-center justify-center hover:border-primary hover:text-primary disabled:opacity-30 disabled:hover:border-slate-200 disabled:hover:text-current transition-all"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <section className="py-24 px-[8%] border-b border-border bg-white overflow-visible">
        <h2 className="text-3xl font-black text-center tracking-[4px] uppercase text-primary mb-16">Career Portfolio</h2>
        <div className="max-w-[1400px] mx-auto">
          <Tabs defaultValue="drama" className="w-full">
            <TabsList className="flex justify-center bg-transparent gap-4 mb-8">
              <TabsTrigger value="drama" className="px-10 py-3.5 rounded-full text-sm font-black uppercase tracking-widest border-2 border-slate-100 data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:border-primary transition-all shadow-sm">
                Drama & Film ({dramaFilm.length})
              </TabsTrigger>
              <TabsTrigger value="brand" className="px-10 py-3.5 rounded-full text-sm font-black uppercase tracking-widest border-2 border-slate-100 data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:border-primary transition-all shadow-sm">
                Brand & Etc ({brandEtc.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="drama" className="mt-0 outline-none">
              {renderPaginatedContent(dramaFilm, dramaPage, setDramaPage)}
            </TabsContent>
            <TabsContent value="brand" className="mt-0 outline-none">
              {renderPaginatedContent(brandEtc, brandPage, setBrandPage)}
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {modalImages && <StillcutModal images={modalImages} onClose={() => setModalImages(null)} />}
      {activeVideoSet && (
        <CareerVideoModal links={activeVideoSet.links} initialIndex={activeVideoSet.index} onClose={() => setActiveVideoSet(null)} />
      )}
    </>
  );
}
