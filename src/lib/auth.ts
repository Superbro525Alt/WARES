import { createSupabaseServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function requireAdmin() {
  const supabase = await createSupabaseServerClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) {
    redirect("/admin/login");
  }
  const { data: isAdmin, error: adminError } = await supabase.rpc("is_admin_uid", {
    uid: userData.user.id,
  });
  if (adminError || !isAdmin) {
    redirect("/admin/login?error=unauthorized");
  }
  return userData.user;
}

export async function getSessionUser() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getSession();
  return data.session?.user ?? null;
}
