import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useActors, useDeleteActor } from '@/hooks/useActorData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';

const MASTER_PASSWORD = 'master1234';

export default function Admin() {
  const [isMaster, setIsMaster] = useState(false);
  const [showPwDialog, setShowPwDialog] = useState(false);
  const [pw, setPw] = useState('');

  // 일반 관리자: published만, 마스터: 전체
  const { data: actors, isLoading } = useActors(isMaster ? { all: true } : { publishedOnly: true });
  const deleteActor = useDeleteActor();

  const handleMasterLogin = () => {
    if (pw === MASTER_PASSWORD) {
      setIsMaster(true);
      setShowPwDialog(false);
      setPw('');
      toast({ title: '마스터 모드 활성화', description: '모든 배우 데이터에 접근할 수 있습니다.' });
    } else {
      toast({ title: '인증 실패', description: '비밀번호가 올바르지 않습니다.', variant: 'destructive' });
    }
  };

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
          {isMaster && <Badge className="bg-primary text-primary-foreground text-[10px]">MASTER</Badge>}
        </div>
        <div className="flex items-center gap-2">
          {!isMaster ? (
            showPwDialog ? (
              <div className="flex items-center gap-2">
                <Input
                  type="password"
                  value={pw}
                  onChange={e => setPw(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleMasterLogin()}
                  placeholder="비밀번호"
                  className="w-36 h-8 text-xs"
                />
                <Button size="sm" onClick={handleMasterLogin} className="text-xs font-bold">확인</Button>
                <Button size="sm" variant="ghost" onClick={() => { setShowPwDialog(false); setPw(''); }} className="text-xs">취소</Button>
              </div>
            ) : (
              <button
                onClick={() => setShowPwDialog(true)}
                className="w-5 h-5 rounded-full border border-border opacity-30 hover:opacity-100 transition-opacity"
                title="Master Mode"
              />
            )
          ) : (
            <Button size="sm" variant="ghost" onClick={() => setIsMaster(false)} className="text-xs font-bold text-muted-foreground">
              일반 모드로 전환
            </Button>
          )}
        </div>
      </nav>

      <div className="px-[8%] py-12">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-black text-primary tracking-tight">배우 관리</h1>
            <p className="text-sm text-muted-foreground font-bold mt-1">
              {isMaster ? '마스터 모드: 모든 배우 표시' : '공개된 배우만 표시됩니다'}
            </p>
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
              <div key={actor.id}
                className={`flex items-center justify-between p-5 border border-border rounded-xl hover:shadow-md transition-shadow ${
                  !actor.is_published ? 'bg-muted/60 border-dashed' : 'bg-card'
                }`}>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-muted overflow-hidden flex-shrink-0">
                    {actor.profile_image_url ? (
                      <img src={actor.profile_image_url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground font-black">{actor.name_ko[0]}</div>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-extrabold">{actor.name_ko}</h3>
                      {!actor.is_published && <Badge variant="destructive" className="text-[10px]">비공개</Badge>}
                      {actor.group_tag !== 'general' && <Badge variant="secondary" className="text-[10px]">{actor.group_tag}</Badge>}
                    </div>
                    <p className="text-xs text-muted-foreground">{actor.name_en} · /{actor.slug}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link to={`/actor/${actor.slug}`}><Button variant="outline" size="sm">보기</Button></Link>
                  <Link to={`/admin/actor/${actor.id}`}><Button variant="outline" size="sm">편집</Button></Link>
                  <Button variant="outline" size="sm" className="text-destructive hover:bg-destructive hover:text-destructive-foreground" onClick={() => handleDelete(actor.id, actor.name_ko)}>삭제</Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
