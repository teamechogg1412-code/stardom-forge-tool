import { useEffect, useState } from "react";
import { useStaffList, useActorStaffAssignments, useSaveActorStaffAssignments } from "@/hooks/useStaffData";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import SectionWrapper from "../SectionWrapper";

const NONE = "__none__";

export default function StaffAssignmentSection({ actorId }: { actorId: string }) {
  const { data: staffList } = useStaffList();
  const { data: assignments } = useActorStaffAssignments(actorId);
  const saveMutation = useSaveActorStaffAssignments();

  const [salesStaffId, setSalesStaffId] = useState<string>(NONE);
  const [adStaffId, setAdStaffId] = useState<string>(NONE);

  useEffect(() => {
    if (!assignments) return;
    const sales = assignments.find((a) => a.assignment_type === "영업 담당");
    const ad = assignments.find((a) => a.assignment_type === "광고 담당");
    setSalesStaffId(sales?.staff_id || NONE);
    setAdStaffId(ad?.staff_id || NONE);
  }, [assignments]);

  const handleSave = () => {
    const list: { staff_id: string; assignment_type: string }[] = [];
    if (salesStaffId !== NONE) list.push({ staff_id: salesStaffId, assignment_type: "영업 담당" });
    if (adStaffId !== NONE) list.push({ staff_id: adStaffId, assignment_type: "광고 담당" });
    saveMutation.mutate(
      { actorId, assignments: list },
      {
        onSuccess: () => toast({ title: "담당자 저장 완료" }),
        onError: (e) => toast({ title: "오류", description: e.message, variant: "destructive" }),
      }
    );
  };

  if (!staffList) return null;

  return (
    <SectionWrapper title="담당자 배정">
      <div className="grid grid-cols-2 gap-6">
        <div>
          <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">영업 담당자</Label>
          <Select value={salesStaffId} onValueChange={setSalesStaffId}>
            <SelectTrigger className="mt-1"><SelectValue placeholder="선택 안 함" /></SelectTrigger>
            <SelectContent>
              <SelectItem value={NONE}>선택 안 함</SelectItem>
              {staffList.map((s) => (
                <SelectItem key={s.id} value={s.id}>{s.name} ({s.role_type})</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">광고 담당자</Label>
          <Select value={adStaffId} onValueChange={setAdStaffId}>
            <SelectTrigger className="mt-1"><SelectValue placeholder="선택 안 함" /></SelectTrigger>
            <SelectContent>
              <SelectItem value={NONE}>선택 안 함</SelectItem>
              {staffList.map((s) => (
                <SelectItem key={s.id} value={s.id}>{s.name} ({s.role_type})</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <Button onClick={handleSave} disabled={saveMutation.isPending} className="mt-4 font-bold">
        {saveMutation.isPending ? "저장 중..." : "담당자 저장"}
      </Button>
    </SectionWrapper>
  );
}
