import Link from "next/link";
import { AuthCard, AuthDivider } from "@/components/auth/auth-card";
import { GitHubButton } from "@/components/auth/github-button";
import { EmailAuthForm } from "@/components/auth/email-auth-form";

export const metadata = {
  title: "Sign in",
  description: "Sign in to your DriveLux account to manage bookings.",
  robots: { index: false },
};

export default async function LoginPage({ searchParams }) {
  const params = await searchParams;
  const next = typeof params?.next === "string" ? params.next : "/";
  const hasError = params?.error === "auth-code-error";

  return (
    <AuthCard
      title="Welcome back"
      subtitle="Sign in to book cars and manage your trips."
      footer={
        <>
          New to DriveLux?{" "}
          <Link
            href={`/signup${next !== "/" ? `?next=${encodeURIComponent(next)}` : ""}`}
            className="font-semibold text-primary-600 hover:text-primary-700"
          >
            Create an account
          </Link>
        </>
      }
    >
      {hasError && (
        <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
          Something went wrong signing you in. Please try again.
        </p>
      )}

      <GitHubButton next={next} />
      <AuthDivider />
      <EmailAuthForm mode="login" next={next} />
    </AuthCard>
  );
}
