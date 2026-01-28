"use client";

import { useState } from "react";
import { inviteAdmin, promoteByEmail, promoteUser } from "@/app/admin/(dashboard)/invites/actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export type PendingUser = {
  id: string;
  email: string;
  created_at: string;
};

export function InvitesClient({ pending }: { pending: PendingUser[] }) {
  const [status, setStatus] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold">Invite & Approve Admins</h1>

      <Card>
        <CardHeader>Invite by email</CardHeader>
        <CardContent>
          <form
            className="grid gap-3 md:grid-cols-[1fr_auto]"
            onSubmit={async (event) => {
              event.preventDefault();
              const formData = new FormData(event.currentTarget);
              const result = await inviteAdmin(formData);
              setStatus(result.ok ? "Invite sent." : result.error ?? "Invite failed.");
              event.currentTarget.reset();
            }}
          >
            <Input name="email" type="email" placeholder="Admin email" required />
            <Button type="submit">Send invite</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>Promote by email</CardHeader>
        <CardContent>
          <form
            className="grid gap-3 md:grid-cols-[1fr_auto]"
            onSubmit={async (event) => {
              event.preventDefault();
              const formData = new FormData(event.currentTarget);
              const result = await promoteByEmail(formData);
              setStatus(result.ok ? "User promoted." : result.error ?? "Promotion failed.");
            }}
          >
            <Input name="email" type="email" placeholder="Existing user email" required />
            <Button type="submit" variant="outline">
              Promote
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>Pending accounts</CardHeader>
        <CardContent className="space-y-3">
          {pending.length === 0 ? (
            <p className="text-sm text-muted-foreground">No pending users right now.</p>
          ) : (
            pending.map((user) => (
              <div
                key={user.id}
                className="flex flex-col gap-2 rounded-xl border border-border/60 bg-muted/30 p-3 md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <p className="text-sm font-semibold">{user.email}</p>
                  <p className="text-xs text-muted-foreground">Joined {new Date(user.created_at).toLocaleString()}</p>
                </div>
                <Button
                  size="sm"
                  onClick={async () => {
                    const result = await promoteUser(user.id);
                    setStatus(result.ok ? "User promoted." : result.error ?? "Promotion failed.");
                  }}
                >
                  Promote to admin
                </Button>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {status ? <p className="text-sm text-muted-foreground">{status}</p> : null}
    </div>
  );
}
