import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";
import { SignOutButton } from "@/components/admin/sign-out-button";

const navItems = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/guides", label: "Guides" },
  { href: "/admin/lessons", label: "Lessons" },
  { href: "/admin/categories", label: "Categories" },
  { href: "/admin/tags", label: "Tags" },
  { href: "/admin/invites", label: "Invite Admin" },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="mx-auto flex w-full max-w-6xl gap-6 px-6 py-10">
        <aside className="hidden w-56 flex-shrink-0 flex-col gap-4 rounded-2xl border border-border/60 bg-background p-4 md:flex">
          <div className="text-sm text-muted-foreground">Admin</div>
          <div className="text-sm font-semibold">{data.user?.email}</div>
          <SignOutButton />
          <nav className="mt-4 flex flex-col gap-2 text-sm">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-lg px-3 py-2 text-muted-foreground hover:bg-muted/40 hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>
        <div className="flex-1 space-y-6">
          <div className="rounded-2xl border border-border/60 bg-background p-4 md:hidden">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs text-muted-foreground">Admin</p>
                <p className="text-sm font-semibold">{data.user?.email}</p>
              </div>
              <SignOutButton />
            </div>
            <nav className="mt-4 grid grid-cols-2 gap-2 text-sm">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-lg border border-border/60 px-3 py-2 text-center text-muted-foreground hover:bg-muted/40 hover:text-foreground"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
