import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { actor_id, actor_name, sender_name, organization, message } = await req.json();

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Save inquiry
    await supabase.from("contact_inquiries").insert({
      actor_id,
      name: sender_name,
      organization,
      message,
    });

    // Get assigned staff with telegram info
    const { data: assignments } = await supabase
      .from("actor_staff_assignment")
      .select("staff_id, assignment_type, staff:staff_id(name, telegram_token, telegram_chat_id)")
      .eq("actor_id", actor_id);

    const telegramResults: string[] = [];

    if (assignments) {
      for (const a of assignments) {
        const staff = (a as any).staff;
        if (staff?.telegram_token && staff?.telegram_chat_id) {
          const text = `[문의] ${actor_name}\n👤 ${sender_name}${organization ? ` / ${organization}` : ""}\n📝 ${message}\n🏷️ ${a.assignment_type}`;
          try {
            const res = await fetch(
              `https://api.telegram.org/bot${staff.telegram_token}/sendMessage`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ chat_id: staff.telegram_chat_id, text }),
              }
            );
            const body = await res.text();
            telegramResults.push(`${staff.name}: ${res.ok ? "sent" : body}`);
          } catch (e) {
            telegramResults.push(`${staff.name}: error`);
          }
        }
      }
    }

    return new Response(
      JSON.stringify({ success: true, telegram: telegramResults }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e: any) {
    return new Response(
      JSON.stringify({ error: e.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
