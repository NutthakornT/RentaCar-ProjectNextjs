"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/field";
import { MailIcon, LockIcon, UserIcon } from "@/components/ui/icons";

/**
 * Email + password auth against Supabase. `mode` toggles sign-in vs sign-up.
 * Errors from Supabase (e.g. email auth disabled) surface inline rather than
 * failing silently.
 * @param {{ mode: "login" | "signup", next?: string }} props
 */
export function EmailAuthForm({ mode, next = "/" }) {
  const router = useRouter();
  const isSignup = mode === "signup";
  const [values, setValues] = useState({ name: "", email: "", password: "" });
  const [status, setStatus] = useState("idle"); // idle | loading | error
  const [message, setMessage] = useState("");

  const set = (key) => (e) =>
    setValues((v) => ({ ...v, [key]: e.target.value }));

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("loading");
    setMessage("");
    const supabase = createClient();

    if (isSignup) {
      const { error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: { name: values.name },
          emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
        },
      });
      if (error) {
        setStatus("error");
        setMessage(error.message);
        return;
      }
      router.push(
        `/login${next !== "/" ? `?next=${encodeURIComponent(next)}` : ""}`,
      );
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email: values.email,
      password: values.password,
    });
    if (error) {
      setStatus("error");
      setMessage(error.message);
      return;
    }
    router.push(next);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {isSignup && (
        <Field label="Full name">
          <Input
            value={values.name}
            onChange={set("name")}
            placeholder="Alex Morgan"
            autoComplete="name"
            icon={<UserIcon size={18} />}
            required
          />
        </Field>
      )}

      <Field label="Email">
        <Input
          type="email"
          value={values.email}
          onChange={set("email")}
          placeholder="you@example.com"
          autoComplete="email"
          icon={<MailIcon size={18} />}
          required
        />
      </Field>

      <Field label="Password">
        <Input
          type="password"
          value={values.password}
          onChange={set("password")}
          placeholder={isSignup ? "At least 6 characters" : "Your password"}
          autoComplete={isSignup ? "new-password" : "current-password"}
          icon={<LockIcon size={18} />}
          minLength={6}
          required
        />
      </Field>

      {status === "error" && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
          {message}
        </p>
      )}

      <Button
        type="submit"
        size="lg"
        disabled={status === "loading"}
        className="w-full"
      >
        {status === "loading"
          ? "Please wait…"
          : isSignup
            ? "Create account"
            : "Sign in"}
      </Button>
    </form>
  );
}
