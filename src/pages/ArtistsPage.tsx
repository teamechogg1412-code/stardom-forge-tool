import { Link } from 'react-router-dom';
import { useActors } from '@/hooks/useActorData';

export default function Index() {
  const { data: actors, isLoading } = useActors({ publishedOnly: true });

  return (
    <div className="min-h-screen bg-background">
      <nav className="px-[6%] py-5 flex justify-between items-center border-b-2 border-primary">
        <span className="text-sm font-black tracking-[2px] text-primary uppercase">Actor Portfolio</span>
        <Link to="/admin" className="text-xs font-bold text-muted-foreground hover:text-primary uppercase tracking-wider">
          Admin →
        </Link>
      </nav>

      <div className="px-[8%] py-20">
        <div className="flex items-end gap-6 mb-16">
          <div className="flex-1">
            <h1 className="text-4xl font-black text-primary mb-2 tracking-tight">Strategy Portfolio</h1>
            <p className="text-muted-foreground font-bold">등록된 배우 목록</p>
          </div>
          {actors && actors.length > 0 && (
            <div className="flex -space-x-3">
              {actors.filter(a => a.profile_image_url).slice(0, 6).map(actor => (
                <div key={actor.id} className="w-11 h-11 rounded-full border-2 border-background overflow-hidden shadow-sm">
                  <img src={actor.profile_image_url!} alt={actor.name_ko} className="w-full h-full object-cover" />
                </div>
              ))}
              {actors.length > 6 && (
                <div className="w-11 h-11 rounded-full border-2 border-background bg-muted flex items-center justify-center text-xs font-black text-muted-foreground shadow-sm">
                  +{actors.length - 6}
                </div>
              )}
            </div>
          )}
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : !actors || actors.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <p className="text-lg font-bold mb-4">등록된 배우가 없습니다.</p>
            <Link to="/admin" className="text-primary font-extrabold hover:underline">관리자 페이지에서 배우를 등록하세요 →</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {actors.map(actor => (
              <Link
                key={actor.id}
                to={`/actor/${actor.slug}`}
                className="group block bg-card border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
              >
                <div className="aspect-[3/4] bg-muted overflow-hidden">
                  {actor.profile_image_url ? (
                    <img src={actor.profile_image_url} alt={actor.name_ko} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground text-4xl font-black">
                      {actor.name_ko[0]}
                    </div>
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
