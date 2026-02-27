import { useState } from "react";
import { Link } from "react-router-dom";
import { useStaffList, useSaveStaff, useDeleteStaff, type Staff } from "@/hooks/useStaffData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const EMPTY_STAFF = { name: "", email: "", phone: "", telegram_token: "", telegram_chat_id: "", role_type: "영업" };

export default function AdminStaff() {
  const { data: staffList, isLoading } = useStaffList();
  const saveStaff = useSaveStaff();
  const deleteStaff = useDeleteStaff();
  const [editing, setEditing] = useState<Partial<Staff> | null>(null);
  const [isMaster, setIsMaster] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [pw, setPw] = useState("");

  const handleMasterLogin = () => {
    if (pw === "master1234") {
      setIsMaster(true);
      setShowPw(false);
      setPw("");
      toast({ title: "마스터 모드 활성화" });
    } else {
      toast({ title: "인증 실패", variant: "destructive" });
    }
  };

  const handleSave = () => {
    if (!editing?.name) { toast({ title: "이름은 필수입니다", variant: "destructive" }); return; }
    saveStaff.mutate(editing as any, {
      onSuccess: () => { toast({ title: "저장 완료" }); setEditing(null); },
      onError: (e) => toast({ title: "오류", description: e.message, variant: "destructive" }),
    });
  };

  const handleDelete = (s: Staff) => {
    if (!confirm(`"${s.name}" 담당자를 삭제하시겠습니까?`)) return;
    deleteStaff.mutate(s.id, {
      onSuccess: () => toast({ title: "삭제 완료" }),
    });
  };

  const maskValue = (v: string | null) => (v ? "••••••" + v.slice(-4) : "-");

  return (
    <div className="min-h-screen bg-background">
      <nav className="px-[6%] py-5 flex justify-between items-center border-b-2 border-primary sticky top-0 bg-background/90 backdrop-blur-md z-50">
        <div className="flex items-center gap-4">
          <Link to="/admin" className="text-sm font-black tracking-[2px] text-primary uppercase">← Admin</Link>
          <span className="text-sm font-bold text-muted-foreground">담당자 관리</span>
          {isMaster && <Badge className="bg-primary text-primary-foreground text-[10px]">MASTER</Badge>}
        </div>
        <div className="flex items-center gap-2">
          {!isMaster ? (
            showPw ? (
              <div className="flex items-center gap-2">
                <Input type="password" value={pw} onChange={(e) => setPw(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleMasterLogin()} placeholder="비밀번호" className="w-36 h-8 text-xs" />
                <Button size="sm" onClick={handleMasterLogin}>확인</Button>
                <Button size="sm" variant="ghost" onClick={() => { setShowPw(false); setPw(""); }}>취소</Button>
              </div>
            ) : (
              <button onClick={() => setShowPw(true)} className="w-5 h-5 rounded-full border border-border opacity-30 hover:opacity-100 transition-opacity" title="Master Mode" />
            )
          ) : (
            <Button size="sm" variant="ghost" onClick={() => setIsMaster(false)} className="text-xs font-bold text-muted-foreground">일반 모드</Button>
          )}
          <Button onClick={() => setEditing({ ...EMPTY_STAFF })} className="font-bold">+ 담당자 추가</Button>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-10">
        {isLoading ? (
          <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>
        ) : !staffList?.length ? (
          <p className="text-center text-muted-foreground py-20">등록된 담당자가 없습니다.</p>
        ) : (
          <div className="space-y-3">
            {staffList.map((s) => (
              <div key={s.id} className="flex items-center justify-between p-5 border border-border rounded-xl bg-card hover:shadow-md transition-shadow">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold">{s.name}</h3>
                    <Badge variant="secondary" className="text-[10px]">{s.role_type}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {s.email || "-"} · {s.phone || "-"} · 텔레그램: {isMaster ? (s.telegram_chat_id || "-") : maskValue(s.telegram_chat_id)}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => setEditing({ ...s })}>편집</Button>
                  <Button variant="outline" size="sm" className="text-destructive" onClick={() => handleDelete(s)}>삭제</Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>{editing?.id ? "담당자 편집" : "새 담당자 등록"}</DialogTitle></DialogHeader>
          {editing && (
            <div className="space-y-4">
              <div><Label className="text-xs font-bold">이름 *</Label><Input value={editing.name || ""} onChange={(e) => setEditing({ ...editing, name: e.target.value })} className="mt-1" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label className="text-xs font-bold">이메일</Label><Input value={editing.email || ""} onChange={(e) => setEditing({ ...editing, email: e.target.value })} className="mt-1" /></div>
                <div><Label className="text-xs font-bold">전화번호</Label><Input value={editing.phone || ""} onChange={(e) => setEditing({ ...editing, phone: e.target.value })} className="mt-1" /></div>
              </div>
              <div>
                <Label className="text-xs font-bold">역할 유형</Label>
                <Select value={editing.role_type || "영업"} onValueChange={(v) => setEditing({ ...editing, role_type: v })}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="영업">영업</SelectItem>
                    <SelectItem value="광고">광고</SelectItem>
                    <SelectItem value="매니저">매니저</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {isMaster && (
                <div className="p-4 bg-muted/50 rounded-lg border space-y-3">
                  <p className="text-xs font-black text-primary uppercase">텔레그램 설정 (마스터 전용)</p>
                  <div><Label className="text-xs font-bold">Bot Token</Label><Input value={editing.telegram_token || ""} onChange={(e) => setEditing({ ...editing, telegram_token: e.target.value })} className="mt-1 font-mono text-xs" /></div>
                  <div><Label className="text-xs font-bold">Chat ID</Label><Input value={editing.telegram_chat_id || ""} onChange={(e) => setEditing({ ...editing, telegram_chat_id: e.target.value })} className="mt-1 font-mono text-xs" /></div>
                </div>
              )}
              <Button onClick={handleSave} disabled={saveStaff.isPending} className="w-full font-bold">
                {saveStaff.isPending ? "저장 중..." : "저장"}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
