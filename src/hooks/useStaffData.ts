import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export interface Staff {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  telegram_token: string | null;
  telegram_chat_id: string | null;
  role_type: string;
  created_at: string;
}

export interface ActorStaffAssignment {
  id: string;
  actor_id: string;
  staff_id: string;
  assignment_type: string;
  staff?: Staff;
}

export function useStaffList() {
  return useQuery({
    queryKey: ["staff"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("staff")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Staff[];
    },
  });
}

export function useActorStaffAssignments(actorId: string) {
  return useQuery({
    queryKey: ["actor-staff", actorId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("actor_staff_assignment")
        .select("*, staff:staff_id(*)")
        .eq("actor_id", actorId);
      if (error) throw error;
      return data as ActorStaffAssignment[];
    },
    enabled: !!actorId,
  });
}

export function useSaveStaff() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (staff: Partial<Staff> & { id?: string }) => {
      if (staff.id) {
        const { error } = await supabase.from("staff").update(staff).eq("id", staff.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("staff").insert([staff]);
        if (error) throw error;
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["staff"] }),
  });
}

export function useDeleteStaff() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("staff").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["staff"] }),
  });
}

export function useSaveActorStaffAssignments() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ actorId, assignments }: { actorId: string; assignments: { staff_id: string; assignment_type: string }[] }) => {
      await supabase.from("actor_staff_assignment").delete().eq("actor_id", actorId);
      if (assignments.length > 0) {
        const { error } = await supabase.from("actor_staff_assignment").insert(
          assignments.map((a) => ({ actor_id: actorId, ...a }))
        );
        if (error) throw error;
      }
    },
    onSuccess: (_, { actorId }) => qc.invalidateQueries({ queryKey: ["actor-staff", actorId] }),
  });
}
