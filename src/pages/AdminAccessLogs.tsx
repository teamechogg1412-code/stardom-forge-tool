import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface LogSummary {
  actor_id: string;
  actor_name: string;
  total_views: number;
  avg_duration: number;
}

interface LogEntry {
  id: string;
  actor_id: string;
  ip_address: string | null;
  user_agent: string | null;
  entry_time: string;
  exit_time: string | null;
  duration_seconds: number | null;
  session_id: string;
}

export default function AdminAccessLogs() {
  const [view, setView] = useState<"summary" | "timeline">("summary");

  const { data: actors } = useQuery({
    queryKey: ["actors-for-logs"],
    queryFn: async () => {
      const { data } = await supabase.from("actors").select("id, name_ko");
      return data || [];
    },
  });

  const { data: logs, isLoading } = useQuery({
    queryKey: ["access-logs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("access_logs")
        .select("*")
        .order("entry_time", { ascending: false })
        .limit(500);
      if (error) throw error;
      return data as LogEntry[];
    },
  });

  const actorMap = new Map((actors || []).map((a) => [a.id, a.name_ko]));

  const summary: LogSummary[] = (() => {
    if (!logs) return [];
    const map = new Map<string, { total: number; durations: number[] }>();
    for (const l of logs) {
      const existing = map.get(l.actor_id) || { total: 0, durations: [] };
      existing.total++;
      if (l.duration_seconds) existing.durations.push(l.duration_seconds);
      map.set(l.actor_id, existing);
    }
    return Array.from(map.entries())
      .map(([actor_id, v]) => ({
        actor_id,
        actor_name: actorMap.get(actor_id) || actor_id.slice(0, 8),
        total_views: v.total,
        avg_duration: v.durations.length > 0 ? Math.round(v.durations.reduce((a, b) => a + b, 0) / v.durations.length) : 0,
      }))
      .sort((a, b) => b.total_views - a.total_views);
  })();

  const formatDate = (d: string) => new Date(d).toLocaleString("ko-KR", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
  const formatDuration = (s: number) => (s >= 60 ? `${Math.floor(s / 60)}분 ${s % 60}초` : `${s}초`);
  const parseUA = (ua: string | null) => {
    if (!ua) return "알 수 없음";
    if (ua.includes("Mobile")) return "📱 모바일";
    return "💻 데스크톱";
  };

  return (
    <div className="min-h-screen bg-background">
      <nav className="px-[6%] py-5 flex justify-between items-center border-b-2 border-primary sticky top-0 bg-background/90 backdrop-blur-md z-50">
        <div className="flex items-center gap-4">
          <Link to="/admin" className="text-sm font-black tracking-[2px] text-primary uppercase">← Admin</Link>
          <span className="text-sm font-bold text-muted-foreground">열람 로그</span>
        </div>
        <div className="flex gap-2">
          <Button variant={view === "summary" ? "default" : "outline"} size="sm" onClick={() => setView("summary")} className="font-bold text-xs">요약</Button>
          <Button variant={view === "timeline" ? "default" : "outline"} size="sm" onClick={() => setView("timeline")} className="font-bold text-xs">타임라인</Button>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-10">
        {isLoading ? (
          <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>
        ) : view === "summary" ? (
          <div>
            <h2 className="text-xl font-black mb-6">배우별 조회 요약</h2>
            <div className="space-y-3">
              {summary.map((s, i) => (
                <div key={s.actor_id} className="flex items-center justify-between p-4 border border-border rounded-xl bg-card">
                  <div className="flex items-center gap-4">
                    <span className="text-2xl font-black text-primary w-8">{i + 1}</span>
                    <div>
                      <h3 className="font-extrabold">{s.actor_name}</h3>
                      <p className="text-xs text-muted-foreground">평균 체류: {formatDuration(s.avg_duration)}</p>
                    </div>
                  </div>
                  <Badge className="text-lg font-black px-4 py-1">{s.total_views}회</Badge>
                </div>
              ))}
              {summary.length === 0 && <p className="text-center text-muted-foreground py-10">아직 로그가 없습니다.</p>}
            </div>
          </div>
        ) : (
          <div>
            <h2 className="text-xl font-black mb-6">열람 타임라인</h2>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-black text-xs">시간</TableHead>
                  <TableHead className="font-black text-xs">배우</TableHead>
                  <TableHead className="font-black text-xs">디바이스</TableHead>
                  <TableHead className="font-black text-xs">체류</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(logs || []).map((l) => (
                  <TableRow key={l.id}>
                    <TableCell className="text-xs">{formatDate(l.entry_time)}</TableCell>
                    <TableCell className="font-bold text-xs">{actorMap.get(l.actor_id) || l.actor_id.slice(0, 8)}</TableCell>
                    <TableCell className="text-xs">{parseUA(l.user_agent)}</TableCell>
                    <TableCell className="text-xs">{l.duration_seconds ? formatDuration(l.duration_seconds) : "-"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {(!logs || logs.length === 0) && <p className="text-center text-muted-foreground py-10">아직 로그가 없습니다.</p>}
          </div>
        )}
      </div>
    </div>
  );
}
