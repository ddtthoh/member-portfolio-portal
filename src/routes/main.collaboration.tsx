import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner">;
import { Building2, Network, Sparkles, Handshake, ArrowRight } from "lucide-react";
import { MReveal } from "@/components/marketing/m-reveal";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/main/collaboration")({
  head: () => ({
    meta: [
      { title: "Collaboration — NASLAB" },
      { name: "description", content: "Naslab partners with institutions, treasuries, and ecosystems that value execution quality, technical rigor, and long-term system building." },
      { property: "og:title", content: "Collaboration — NASLAB" },
      { property: "og:description", content: "Institutional, ecosystem, and technology partnerships across the Ncore stack." },
    ],
  }),
  component: CollaborationPage,
});

const TYPES = [
  { Icon: Building2, k: "Institutional", t: "Capital Partnerships", d: "Treasuries, family offices and funds seeking access to Naslab's execution infrastructure." },
  { Icon: Network, k: "Ecosystem", t: "Protocol & Venue Partners", d: "Exchanges, L2s and protocols integrating with the Ncore execution stack." },
  { Icon: Sparkles, k: "Technology", t: "Strategic Tech Partners", d: "Infrastructure, security and data partners building the next layer of digital finance." },
];
