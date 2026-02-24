import { useParams } from 'react-router-dom';
import { useActorBySlug } from '@/hooks/useActorData';
import ActorNav from '@/components/actor/ActorNav';
import ProfileHero from '@/components/actor/ProfileHero';
import CareerPortfolio from '@/components/actor/CareerPortfolio';
import MarketInsight from '@/components/actor/MarketInsight';
import KeywordCloud from '@/components/actor/KeywordCloud';
import VideoSection from '@/components/actor/VideoSection';

export default function ActorProfile() {
  const { slug } = useParams<{ slug: string }>();
  const { data: actor, isLoading, error } = useActorBySlug(slug || '');

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground font-bold">Loading...</p>
        </div>
      </div>
    );
  }

  if (error || !actor) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-black text-primary mb-4">404</h1>
          <p className="text-muted-foreground">배우 정보를 찾을 수 없습니다.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <ActorNav actorName={actor.name_en || actor.name_ko} />
      <div className="pt-16">
        <div id="profile"><ProfileHero actor={actor} /></div>
        <div id="career"><CareerPortfolio careers={actor.careers} /></div>
        <div id="insight"><MarketInsight insight={actor.insights} /></div>
        <KeywordCloud keywords={actor.keywords} />
        <div id="videos"><VideoSection videos={actor.videos} /></div>
        <footer className="py-16 text-center border-t-[5px] border-foreground font-black text-sm">
          © {new Date().getFullYear()} {actor.name_en || actor.name_ko} — Official Strategy Portfolio
        </footer>
      </div>
    </>
  );
}
