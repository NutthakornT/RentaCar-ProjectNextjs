import { GitHubButton } from "./github-button";

export default async function LoginPage({ searchParams }) {
  const params = await searchParams;
  const hasError = params?.error === "auth-code-error";

  return (
    <div className="flex flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex w-full max-w-sm flex-col items-center gap-6 rounded-2xl border border-black/8 bg-white p-10 dark:border-white/[.145] dark:bg-black">
        <h1 className="text-2xl font-semibold text-black dark:text-zinc-50">
          Sign in
        </h1>
        {hasError && (
          <p className="text-sm text-red-600 dark:text-red-400">
            Something went wrong signing you in. Please try again.
          </p>
        )}
        <GitHubButton />
      </main>
    </div>
  );
}
