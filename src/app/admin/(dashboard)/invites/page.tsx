import { createSupabaseAdminClient } from "@/lib/supabase/server";
import { InvitesClient, PendingUser } from "@/components/admin/invites-client";

export default async function AdminInvitesPage() {
  const supabase = createSupabaseAdminClient();
  const { data } = await supabase
    .from("user_profiles")
    .select("id,email,created_at")
    .eq("role", "user")
    .order("created_at", { ascending: false });

  const pending = (data ?? []) as PendingUser[];

  return <InvitesClient pending={pending} />;
}
