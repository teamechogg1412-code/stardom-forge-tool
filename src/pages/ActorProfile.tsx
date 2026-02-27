import { useParams } from "react-router-dom";
import { useActorBySlug } from "@/hooks/useActorData";
import { useAccessLog } from "@/hooks/useAccessLog";
import ActorNav from "@/components/actor/ActorNav";
import ProfileHero from "@/components/actor/ProfileHero";
import CareerPortfolio from "@/components/actor/CareerPortfolio";
import MarketInsight from "@/components/actor/MarketInsight";
import KeywordCloud from "@/components/actor/KeywordCloud";
import VideoSection from "@/components/actor/VideoSection";
import EditorialSection from "@/components/actor/EditorialSection";
import ArtistBio from "@/components/actor/ArtistBio";
import ContactSection from "@/components/actor/ContactSection";

export default function ActorProfile() {
  const { slug } = useParams<{ slug: string }>();
  const { data: actor, isLoading, error } = useActorBySlug(slug || "");
  useAccessLog(actor?.id);

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
        {/* 프로필 히어로 섹션 */}
        <div id="profile">
          <ProfileHero actor={actor} />
          <ArtistBio actor={actor} /> {/* 여기에 추가 */}
        </div>

        {/* 커리어 포트폴리오 섹션 */}
        <div id="career">
          <CareerPortfolio careers={actor.careers} />
        </div>

        {/* 마켓 인사이트 섹션 */}
        <div id="insight">
          <MarketInsight insight={actor.insights} />
        </div>

        {/* 키워드 클라우드 섹션 */}
        <KeywordCloud keywords={actor.keywords} />

        {/* 화보 & 수상 내역 통합 섹션 (actor.awards 데이터 전달) */}
        <div id="editorial">
          <EditorialSection editorials={actor.editorials} awards={actor.awards} />
        </div>

        {/* 비주얼 아카이브 섹션 */}
        <div id="videos">
          <VideoSection videos={actor.videos} />
        </div>

        {/* 푸터 */}
        <footer className="py-16 text-center border-t-[5px] border-foreground font-black text-sm">
          © {new Date().getFullYear()} {actor.name_en || actor.name_ko} — Official Strategy Portfolio
        </footer>
      </div>
    </>
  );
}
