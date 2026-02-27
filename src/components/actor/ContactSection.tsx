import { useState } from "react";
import { useActorStaffAssignments } from "@/hooks/useStaffData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

interface Props {
  actorId: string;
  actorName: string;
}

export default function ContactSection({ actorId, actorName }: Props) {
  const [open, setOpen] = useState(false);
  const { data: assignments } = useActorStaffAssignments(actorId);
  const [form, setForm] = useState({ name: "", organization: "", message: "" });
  const [sending, setSending] = useState(false);

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.message.trim()) {
      toast({ title: "이름과 문의 내용을 입력해 주세요.", variant: "destructive" });
      return;
    }
    setSending(true);
    try {
      const { error } = await supabase.functions.invoke("send-telegram", {
        body: {
          actor_id: actorId,
          actor_name: actorName,
          sender_name: form.name.trim(),
          organization: form.organization.trim() || null,
          message: form.message.trim(),
        },
      });
      if (error) throw error;
      toast({ title: "문의가 전송되었습니다." });
      setForm({ name: "", organization: "", message: "" });
      setOpen(false);
    } catch (e: any) {
      toast({ title: "전송 실패", description: e.message, variant: "destructive" });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!open ? (
        <Button
          onClick={() => setOpen(true)}
          className="rounded-full w-14 h-14 shadow-2xl bg-primary text-primary-foreground font-black text-lg hover:scale-110 transition-transform"
        >
          ✉
        </Button>
      ) : (
        <div className="w-80 bg-card border-2 border-border rounded-2xl shadow-2xl p-5 space-y-4 animate-in slide-in-from-bottom-4">
          <div className="flex justify-between items-center">
            <h3 className="font-black text-sm">Contact</h3>
            <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground font-bold text-lg">✕</button>
          </div>

          {assignments && assignments.length > 0 && (
            <div className="text-xs text-muted-foreground space-y-1 p-3 bg-muted/50 rounded-lg">
              <p className="font-bold text-foreground text-[10px] uppercase tracking-wider mb-1">담당자</p>
              {assignments.map((a) => (
                <p key={a.id}>
                  {a.staff?.name} ({a.assignment_type}) {a.staff?.phone && `· ${a.staff.phone}`}
                </p>
              ))}
            </div>
          )}

          <div className="space-y-3">
            <Input placeholder="이름 *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="text-sm" />
            <Input placeholder="소속 (선택)" value={form.organization} onChange={(e) => setForm({ ...form, organization: e.target.value })} className="text-sm" />
            <Textarea placeholder="문의 내용 *" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="text-sm min-h-[80px]" />
            <Button onClick={handleSubmit} disabled={sending} className="w-full font-bold">
              {sending ? "전송 중..." : "문의 보내기"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
