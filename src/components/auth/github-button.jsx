"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { GithubIcon } from "@/components/ui/icons";

/**
 * GitHub OAuth sign-in. Forwards `next` through the callback so the user lands
 * back where they intended after auth.
 * @param {{ next?: string }} props
 */
export function GitHubButton({ next = "/" }) {
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    setLoading(true);
    const supabase = createClient();
    const callback = `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`;
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "github",
      options: { redirectTo: callback },
    });
    if (error) setLoading(false);
  }

  return (
    <button
      type="button"
      onClick={handleLogin}
      disabled={loading}
      className="flex h-11 w-full items-center justify-center gap-2.5 rounded-full bg-slate-900 px-5 text-sm font-medium text-white transition-colors hover:bg-slate-800 disabled:opacity-60"
    >
      <GithubIcon size={18} />
      {loading ? "Redirecting…" : "Continue with GitHub"}
    </button>
  );
}
