"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function AdminLoginClient() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [showUnauthorized, setShowUnauthorized] = useState(false);
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const params = useSearchParams();

  const unauthorized = params.get("error") === "unauthorized";

  useEffect(() => {
    if (!showUnauthorized) return;
    const supabase = createSupabaseBrowserClient();
    supabase.auth.signOut();
    setEmail("");
    setPassword("");
  }, [showUnauthorized]);

  return (
    <div className="mx-auto flex min-h-[70vh] w-full max-w-md flex-col justify-center px-6 py-12">
      <div className="rounded-3xl border border-border/60 bg-background p-8 shadow-sm">
        <h1 className="text-3xl font-semibold">Admin Access</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {mode === "signin"
            ? "Sign in with your admin credentials to manage WARES content."
            : "Create your account and wait for an admin to grant access."}
        </p>
        {unauthorized ? (
          <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900">
            This account does not have admin access yet. Please sign in with a different
            account or request access.
          </div>
        ) : null}

        <form
          className="mt-6 grid gap-4"
          onSubmit={async (event) => {
            event.preventDefault();
            setError(null);
            setMessage(null);
            setLoading(true);
            const supabase = createSupabaseBrowserClient();
            if (mode === "signin") {
              const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
              });
              if (error) {
                setError(error.message);
                setLoading(false);
                return;
              }
              router.push("/admin");
              router.refresh();
              return;
            }

            const { error } = await supabase.auth.signUp({
              email,
              password,
            });
            if (error) {
              setError(error.message);
              setLoading(false);
              return;
            }
            setMessage("Account created. You will receive access once an admin approves you.");
            setShowUnauthorized(true);
          }}
        >
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            disabled={loading}
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            disabled={loading}
          />
          <Button type="submit" disabled={loading}>
            {loading
              ? mode === "signin"
                ? "Signing in..."
                : "Creating account..."
              : mode === "signin"
              ? "Sign in"
              : "Create account"}
          </Button>
          {error ? <p className="text-sm text-rose-600">{error}</p> : null}
          {message ? <p className="text-sm text-emerald-600">{message}</p> : null}
        </form>

        <div className="mt-6 text-sm text-muted-foreground">
          {mode === "signin" ? (
            <button
              type="button"
              onClick={() => setMode("signup")}
              className="font-semibold text-primary"
              disabled={loading}
            >
              Need an account? Request access
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setMode("signin")}
              className="font-semibold text-primary"
              disabled={loading}
            >
              Already have access? Sign in
            </button>
          )}
        </div>
      </div>

      <Dialog
        open={showUnauthorized}
        onOpenChange={(open) => {
          setShowUnauthorized(open);
          if (!open) {
            router.push("/");
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Access pending</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Your account is created, but you need an admin to promote you to admin
            before you can access the dashboard.
          </p>
          <Button
            className="mt-4"
            onClick={() => {
              setShowUnauthorized(false);
              router.push("/");
            }}
          >
            OK
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
