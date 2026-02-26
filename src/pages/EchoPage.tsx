import { Link } from 'react-router-dom';
import { useActors } from '@/hooks/useActorData';

export default function EchoPage() {
  const { data: actors, isLoading } = useActors({ publishedOnly: true, tag: 'echo' });

  return (
    <div className="min-h-screen bg-background">
      <nav className="px-[6%] py-5 flex justify-between items-center border-b-2 border-primary">
        <span className="text-sm font-black tracking-[2px] text-primary uppercase">Echo Portfolio</span>
      </nav>

      <div className="px-[8%] py-20">
        <h1 className="text-4xl font-black text-primary mb-2 tracking-tight">Echo Collection</h1>
        <p className="text-muted-foreground font-bold mb-16">선별된 배우 포트폴리오</p>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : !actors || actors.length === 0 ? (
          <p className="text-center text-muted-foreground py-20">등록된 배우가 없습니다.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {actors.map(actor => (
              <Link key={actor.id} to={`/actor/${actor.slug}`}
                className="group block bg-card border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <div className="aspect-[3/4] bg-muted overflow-hidden">
                  {actor.profile_image_url ? (
                    <img src={actor.profile_image_url} alt={actor.name_ko} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground text-4xl font-black">{actor.name_ko[0]}</div>
                  )}
                </div>
                <div className="p-5">
                  <h2 className="text-lg font-black">{actor.name_ko}</h2>
                  {actor.name_en && <p className="text-xs text-muted-foreground font-medium tracking-wider uppercase mt-1">{actor.name_en}</p>}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
