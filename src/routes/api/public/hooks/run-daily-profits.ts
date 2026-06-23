import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";

// Called by pg_cron daily at 00:05 UTC.
// Auth: apikey header must match SUPABASE_PUBLISHABLE_KEY; payload optionally includes { date: "YYYY-MM-DD" }.
export const Route = createFileRoute("/api/public/hooks/run-daily-profits")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const apikey = request.headers.get("apikey");
        if (!apikey || apikey !== process.env.SUPABASE_PUBLISHABLE_KEY) {
          return new Response(JSON.stringify({ error: "unauthorized" }), {
            status: 401,
            headers: { "Content-Type": "application/json" },
          });
        }

        let body: { date?: string } = {};
        try {
          body = (await request.json()) as { date?: string };
        } catch {
          /* empty body is fine */
        }

        const supabaseAdmin = createClient(
          process.env.SUPABASE_URL!,
          process.env.SUPABASE_SERVICE_ROLE_KEY!,
          { auth: { persistSession: false, autoRefreshToken: false } },
        );

        const { data, error } = await supabaseAdmin.rpc("run_daily_profits", {
          _target_date: body.date ?? new Date().toISOString().slice(0, 10),
        });

        if (error) {
          console.error("run_daily_profits failed", error);
          return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          });
        }

        return new Response(JSON.stringify({ success: true, result: data }), {
          headers: { "Content-Type": "application/json" },
        });
      },
    },
  },
});
