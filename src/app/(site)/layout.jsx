import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/app/auth/actions";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

/**
 * Shared shell for all public-facing pages (home, cars, booking, auth, profile).
 * Reads the session server-side so the navbar reflects auth state on first paint.
 */
export default async function SiteLayout({ children }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="flex min-h-full flex-col">
      <Navbar
        user={user ? { email: user.email } : null}
        signOut={signOut}
      />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
