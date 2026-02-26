import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useActors } from '@/hooks/useActorData';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const MASTER_PASSWORD = 'master1234';

export default function TotalPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { data: actors, isLoading } = useActors({ all: true });

  const handleLogin = () => {
    if (password === MASTER_PASSWORD) {
      setAuthenticated(true);
      setError('');
    } else {
      setError('비밀번호가 올바르지 않습니다.');
    }
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-full max-w-sm p-8 bg-card border border-border rounded-2xl shadow-lg text-center">
          <h2 className="text-xl font-black text-primary mb-6">Total Access</h2>
          <p className="text-sm text-muted-foreground mb-6">비밀번호를 입력해 주세요.</p>
          <Input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
            placeholder="비밀번호"
            className="mb-3"
          />
          {error && <p className="text-destructive text-xs mb-3">{error}</p>}
          <Button onClick={handleLogin} className="w-full font-bold">확인</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <nav className="px-[6%] py-5 flex justify-between items-center border-b-2 border-primary">
        <span className="text-sm font-black tracking-[2px] text-primary uppercase">Total Portfolio</span>
        <Badge variant="outline" className="text-xs font-bold">ALL ACCESS</Badge>
      </nav>

      <div className="px-[8%] py-20">
        <h1 className="text-4xl font-black text-primary mb-2 tracking-tight">Total Portfolio</h1>
        <p className="text-muted-foreground font-bold mb-16">전체 배우 목록 (공개/비공개 포함)</p>

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
                className="group block bg-card border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 relative">
                {!actor.is_published && (
                  <Badge className="absolute top-3 right-3 z-10 bg-destructive text-destructive-foreground text-[10px]">비공개</Badge>
                )}
                <div className="aspect-[3/4] bg-muted overflow-hidden">
                  {actor.profile_image_url ? (
                    <img src={actor.profile_image_url} alt={actor.name_ko} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground text-4xl font-black">{actor.name_ko[0]}</div>
                  )}
                </div>
                <div className="p-5">
                  <h2 className="text-lg font-black">{actor.name_ko}</h2>
                  <div className="flex items-center gap-2 mt-1">
                    {actor.name_en && <p className="text-xs text-muted-foreground font-medium tracking-wider uppercase">{actor.name_en}</p>}
                    {actor.group_tag !== 'general' && (
                      <Badge variant="secondary" className="text-[10px]">{actor.group_tag}</Badge>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
