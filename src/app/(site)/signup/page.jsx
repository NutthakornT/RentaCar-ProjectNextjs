import Link from "next/link";
import { AuthCard, AuthDivider } from "@/components/auth/auth-card";
import { GitHubButton } from "@/components/auth/github-button";
import { EmailAuthForm } from "@/components/auth/email-auth-form";

export const metadata = {
  title: "Create your account",
  description: "Join ChaoRoad to book premium cars in minutes.",
  robots: { index: false },
};

export default async function SignupPage({ searchParams }) {
  const params = await searchParams;
  const next = typeof params?.next === "string" ? params.next : "/";

  return (
    <AuthCard
      title="Create your account"
      subtitle="Book premium cars in minutes — it's free to join."
      footer={
        <>
          Already have an account?{" "}
          <Link
            href={`/login${next !== "/" ? `?next=${encodeURIComponent(next)}` : ""}`}
            className="font-semibold text-primary-600 hover:text-primary-700"
          >
            Sign in
          </Link>
        </>
      }
    >
      <GitHubButton next={next} />
      <AuthDivider />
      <EmailAuthForm mode="signup" next={next} />
      <p className="mt-5 text-center text-xs text-slate-400">
        By creating an account you agree to our Terms and Privacy Policy.
      </p>
    </AuthCard>
  );
}
