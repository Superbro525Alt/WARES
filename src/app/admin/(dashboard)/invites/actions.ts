"use server";

import { createSupabaseAdminClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function inviteAdmin(formData: FormData) {
  await requireAdmin();
  const email = formData.get("email")?.toString();
  if (!email) return { ok: false, error: "Email required." };

  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase.auth.admin.inviteUserByEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/admin/login`,
  });
  if (error) {
    return { ok: false, error: error.message };
  }

  if (data.user?.id) {
    await supabase.from("user_profiles").upsert({
      id: data.user.id,
      email,
      role: "admin",
    });
  }

  revalidatePath("/admin/invites");
  return { ok: true };
}

export async function promoteUser(userId: string) {
  await requireAdmin();
  const supabase = createSupabaseAdminClient();
  const { error } = await supabase
    .from("user_profiles")
    .update({ role: "admin" })
    .eq("id", userId);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/admin/invites");
  return { ok: true };
}

export async function promoteByEmail(formData: FormData) {
  await requireAdmin();
  const email = formData.get("email")?.toString();
  if (!email) return { ok: false, error: "Email required." };
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("user_profiles")
    .update({ role: "admin" })
    .eq("email", email)
    .select("id")
    .maybeSingle();
  if (error) return { ok: false, error: error.message };
  if (!data?.id) return { ok: false, error: "No pending account found for that email." };
  revalidatePath("/admin/invites");
  return { ok: true };
}
