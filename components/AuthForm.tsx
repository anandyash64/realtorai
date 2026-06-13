"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "./Button";

export function AuthForm({ mode }: { mode: "login" | "signup" | "forgot" | "profile" }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const isSignup = mode === "signup";
  const isForgot = mode === "forgot";
  const isProfile = mode === "profile";

  return (
    <form
      className="mx-auto w-full max-w-md rounded-lg border border-line bg-white p-6 shadow-soft"
      onSubmit={async (event) => {
        event.preventDefault();
        const form = new FormData(event.currentTarget);
        const email = String(form.get("email") ?? "");
        const password = String(form.get("password") ?? "");
        const name = String(form.get("name") ?? "");
        const company = String(form.get("company") ?? "");

        setLoading(true);
        setMessage("");

        try {
          const { createClient } = await import("@/lib/supabase/client");
          const supabase = createClient();

          if (mode === "login") {
            const { error } = await supabase.auth.signInWithPassword({ email, password });
            if (error) throw error;
            setMessage("Logged in successfully.");
          }

          if (mode === "signup") {
            const { error } = await supabase.auth.signUp({
              email,
              password,
              options: { data: { name, company } }
            });
            if (error) throw error;
            setMessage("Account created. Check your email to confirm your address.");
          }

          if (mode === "forgot") {
            const { error } = await supabase.auth.resetPasswordForEmail(email);
            if (error) throw error;
            setMessage("Password reset email sent.");
          }

          if (mode === "profile") {
            const { error } = await supabase.auth.updateUser({
              email,
              data: { name, company }
            });
            if (error) throw error;
            setMessage("Profile updated.");
          }
        } catch (error) {
          setMessage(error instanceof Error ? error.message : "Unable to complete request.");
        } finally {
          setLoading(false);
        }
      }}
    >
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-ink">
          {mode === "login" && "Login"}
          {isSignup && "Create your account"}
          {isForgot && "Reset password"}
          {isProfile && "User profile"}
        </h1>
        <p className="mt-2 text-sm text-muted">
          {isForgot
            ? "Enter your email and Supabase Auth will send a reset link."
            : "Supabase Auth ready. Connect your project keys in .env.local."}
        </p>
      </div>
      <div className="grid gap-4">
        {(isSignup || isProfile) && (
          <label className="grid gap-2 text-sm font-medium text-ink">
            Name
            <input name="name" className="focus-ring h-11 rounded-md border border-line px-3" />
          </label>
        )}
        {(isSignup || isProfile) && (
          <label className="grid gap-2 text-sm font-medium text-ink">
            Company
            <input name="company" className="focus-ring h-11 rounded-md border border-line px-3" />
          </label>
        )}
        <label className="grid gap-2 text-sm font-medium text-ink">
          Email
          <input
            name="email"
            type="email"
            required
            className="focus-ring h-11 rounded-md border border-line px-3"
          />
        </label>
        {!isForgot && !isProfile && (
          <label className="grid gap-2 text-sm font-medium text-ink">
            Password
            <input
              name="password"
              type="password"
              required
              className="focus-ring h-11 rounded-md border border-line px-3"
            />
          </label>
        )}
        <Button className="w-full">{loading ? "Working..." : isProfile ? "Save Profile" : "Continue"}</Button>
      </div>
      {message ? <p className="mt-4 text-sm font-medium text-blue-700">{message}</p> : null}
      {!isProfile ? (
        <div className="mt-6 flex justify-between text-sm text-muted">
          <Link href="/forgot-password">Forgot password?</Link>
          <Link href={isSignup ? "/login" : "/signup"}>
            {isSignup ? "Login" : "Sign up"}
          </Link>
        </div>
      ) : null}
    </form>
  );
}
