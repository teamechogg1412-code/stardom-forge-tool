import { Link } from 'react-router-dom';
import { useActors, useDeleteActor } from '@/hooks/useActorData';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

export default function Admin() {
  const { data: actors, isLoading } = useActors();
  const deleteActor = useDeleteActor();

  const handleDelete = (id: string, name: string) => {
    if (!confirm(`"${name}" 배우를 삭제하시겠습니까? 모든 관련 데이터가 삭제됩니다.`)) return;
    deleteActor.mutate(id, {
      onSuccess: () => toast({ title: '삭제 완료', description: `${name} 배우가 삭제되었습니다.` }),
      onError: () => toast({ title: '오류', description: '삭제에 실패했습니다.', variant: 'destructive' }),
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <nav className="px-[6%] py-5 flex justify-between items-center border-b-2 border-primary">
        <div className="flex items-center gap-4">
          <Link to="/" className="text-sm font-black tracking-[2px] text-primary uppercase">Portfolio</Link>
          <span className="text-border">/</span>
          <span className="text-sm font-bold text-muted-foreground uppercase">Admin</span>
        </div>
      </nav>

      <div className="px-[8%] py-12">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-black text-primary tracking-tight">배우 관리</h1>
            <p className="text-sm text-muted-foreground font-bold mt-1">배우 정보를 등록하고 관리합니다.</p>
          </div>
          <Link to="/admin/actor/new">
            <Button className="bg-primary text-primary-foreground font-bold">+ 새 배우 등록</Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : !actors || actors.length === 0 ? (
          <p className="text-center text-muted-foreground py-20">등록된 배우가 없습니다.</p>
        ) : (
          <div className="space-y-3">
            {actors.map(actor => (
              <div key={actor.id} className="flex items-center justify-between p-5 bg-card border border-border rounded-xl hover:shadow-md transition-shadow">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-muted overflow-hidden flex-shrink-0">
                    {actor.profile_image_url ? (
                      <img src={actor.profile_image_url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground font-black">{actor.name_ko[0]}</div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-extrabold">{actor.name_ko}</h3>
                    <p className="text-xs text-muted-foreground">{actor.name_en} · /{actor.slug}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link to={`/actor/${actor.slug}`}>
                    <Button variant="outline" size="sm">보기</Button>
                  </Link>
                  <Link to={`/admin/actor/${actor.id}`}>
                    <Button variant="outline" size="sm">편집</Button>
                  </Link>
                  <Button variant="outline" size="sm" className="text-destructive hover:bg-destructive hover:text-destructive-foreground" onClick={() => handleDelete(actor.id, actor.name_ko)}>
                    삭제
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
