import type { ActorFull } from '@/types/actor';
import ImageCarousel from './ImageCarousel';
import { Instagram, Globe } from 'lucide-react';

export default function ProfileHero({ actor }: { actor: ActorFull }) {
  return (
    <section className="py-24 border-b border-border bg-white">
      {/* 1800px 너비 유지 */}
      <div className="max-w-[1800px] mx-auto px-[5%] flex flex-col lg:flex-row items-start gap-16 lg:gap-32">
        
        {/* 왼쪽: 이미지 영역 */}
        <div className="flex-shrink-0 w-full lg:max-w-[550px]">
          <div className="rounded-xl overflow-hidden shadow-lg border border-slate-200">
            <ImageCarousel
              images={actor.images}
              fallbackUrl={actor.profile_image_url}
              fallbackInitial={actor.name_ko[0]}
            />
          </div>
        </div>

        {/* 오른쪽: 정보 영역 */}
        <div className="flex-1 flex flex-col gap-10 w-full pt-2">
          
          {/* 타이틀 영역: 영문 이름을 더 크고 진하게 수정 */}
          <div className="border-b-[3px] border-slate-900 pb-8 mb-4">
            <h1 className="text-5xl font-black leading-none tracking-tighter text-slate-900">
              {actor.name_ko}
            </h1>
            {actor.name_en && (
              <p className="text-xl text-slate-700 font-bold tracking-[6px] uppercase mt-4">
                {actor.name_en}
              </p>
            )}
          </div>

          {/* SNS 통계: 테두리를 진한 회색(slate-300)으로 변경 */}
          <div className="grid grid-cols-3 gap-6">
            {[
              { label: 'Followers', value: actor.followers },
              { label: 'Posts', value: actor.posts },
              { label: 'Following', value: actor.following },
            ].map(item => item.value ? (
              <div key={item.label} className="bg-white p-8 text-center rounded-2xl border-2 border-slate-300 hover:border-primary transition-colors shadow-sm">
                <span className="block text-xs text-primary font-black uppercase mb-2 tracking-widest">{item.label}</span>
                <span className="text-3xl font-black text-slate-900 tabular-nums">{item.value}</span>
              </div>
            ) : null)}
          </div>

          {/* 주요 프로젝트 태그: 테두리 강조 */}
          {actor.actor_tags.length > 0 && (
            <div className="mt-2">
              <h3 className="text-xs text-slate-500 font-black uppercase mb-4 tracking-[3px]">Global & Major Projects</h3>
              <div className="flex flex-wrap gap-3">
                {actor.actor_tags.map(tag => (
                  <span key={tag.id} className={`text-sm px-6 py-2.5 font-bold rounded-full border-2 shadow-sm transition-all ${
                    tag.tag_style === 'important' ? 'bg-primary text-primary-foreground border-primary' :
                    tag.tag_style === 'award' ? 'bg-accent text-accent-foreground border-accent' :
                    'bg-white text-slate-800 border-slate-300 hover:border-primary'
                  }`}>{tag.tag_text}</span>
                ))}
              </div>
            </div>
          )}

          {/* 하단 정보 박스: 배경은 밝게, 테두리는 진하게(slate-300) */}
          <div className="grid grid-cols-3 gap-10 p-10 bg-slate-50 rounded-[30px] border-2 border-slate-300 border-l-[12px] border-l-primary shadow-sm">
            {[
              { label: 'Physical', value: actor.height },
              { label: 'Language', value: actor.language },
              { label: 'Brand', value: actor.brand_keyword },
            ].map(item => item.value ? (
              <div key={item.label}>
                <span className="text-[10px] text-primary font-black block mb-2 uppercase tracking-[2px]">{item.label}</span>
                <span className="text-xl font-black text-slate-900">{item.value}</span>
              </div>
            ) : null)}
          </div>

          {/* 소셜 아이콘 */}
          <div className="flex gap-4 mt-2 ml-1">
            {actor.instagram_id && (
              <SocialIcon 
                href={`https://instagram.com/${actor.instagram_id}`} 
                icon={<Instagram size={22} />} 
                label="Instagram"
              />
            )}
            {actor.homepage_url && (
              <SocialIcon 
                href={actor.homepage_url} 
                icon={<Globe size={22} />} 
                label="Official Site"
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function SocialIcon({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <a 
      href={href} 
      target="_blank" 
      rel="noopener noreferrer"
      className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-white hover:bg-primary transition-all duration-300 shadow-md hover:-translate-y-1"
      title={label}
    >
      {icon}
    </a>
  );
}
