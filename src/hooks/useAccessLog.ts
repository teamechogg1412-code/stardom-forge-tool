import { useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";

function generateSessionId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function useAccessLog(actorId: string | undefined) {
  const logIdRef = useRef<string | null>(null);
  const sessionIdRef = useRef(generateSessionId());

  useEffect(() => {
    if (!actorId) return;

    const createLog = async () => {
      const { data } = await supabase
        .from("access_logs")
        .insert({
          actor_id: actorId,
          session_id: sessionIdRef.current,
          user_agent: navigator.userAgent,
          entry_time: new Date().toISOString(),
        })
        .select("id")
        .single();
      if (data) logIdRef.current = data.id;
    };

    createLog();

    const updateExit = () => {
      if (!logIdRef.current) return;
      const now = new Date().toISOString();
      // Use sendBeacon for reliability on page unload
      const url = `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/access_logs?id=eq.${logIdRef.current}`;
      const body = JSON.stringify({ exit_time: now });
      navigator.sendBeacon(
        url,
        new Blob(
          [body],
          { type: "application/json" }
        )
      );
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        updateExit();
      }
    };

    window.addEventListener("beforeunload", updateExit);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      updateExit();
      window.removeEventListener("beforeunload", updateExit);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [actorId]);
}
