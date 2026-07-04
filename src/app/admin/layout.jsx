import { AdminSidebar } from "@/components/admin/admin-sidebar";

export const metadata = {
  title: "Admin",
  robots: { index: false },
};

/**
 * Admin console shell — its own chrome (sidebar), outside the public site
 * layout. Access requires a signed-in user with an admin profile, enforced
 * in the proxy middleware.
 */
export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-background lg:flex">
      <AdminSidebar />
      <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <div className="mx-auto max-w-6xl space-y-6">{children}</div>
      </main>
    </div>
  );
}
