"use server";

import { contactSchema } from "@/lib/db/schema.zod";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function submitContact(formData: FormData) {
  const data = Object.fromEntries(formData.entries());
  const parsed = contactSchema.safeParse(data);
  if (!parsed.success) {
    return { ok: false, error: "Invalid form submission." };
  }
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("contact_submissions").insert({
    name: parsed.data.name,
    email: parsed.data.email,
    message: parsed.data.message,
  });
  if (error) {
    return { ok: false, error: "Unable to send message." };
  }
  return { ok: true };
}
