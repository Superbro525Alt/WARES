import Link from "next/link";
import { productRepository, guideRepository, lessonRepository } from "@/lib/db";
import { createSupabaseAdminClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MiniBarChart } from "@/components/admin/mini-bar-chart";
import { ActivityLog } from "@/components/admin/activity-log";

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function formatShortDay(date: Date) {
  return date.toLocaleDateString("en-AU", { weekday: "short" });
}

function withinLastDays(date: Date, days: number) {
  const start = startOfDay(new Date());
  const cutoff = new Date(start.getTime() - (days - 1) * 24 * 60 * 60 * 1000);
  return date >= cutoff;
}

export default async function AdminDashboard() {
  const [products, guides, lessons] = await Promise.all([
    productRepository.list(),
    guideRepository.list(),
    lessonRepository.list(),
  ]);

  const supabase = createSupabaseAdminClient();
  const { data: pendingUsers } = await supabase
    .from("user_profiles")
    .select("id,email,created_at")
    .eq("role", "user")
    .order("created_at", { ascending: false })
    .limit(5);

  const publishedProducts = products.filter((p) => p.published).length;
  const publishedGuides = guides.filter((g) => g.published).length;
  const publishedLessons = lessons.filter((l) => l.published).length;

  const recentProducts = [...products]
    .sort((a, b) => (a.updated_at > b.updated_at ? -1 : 1))
    .slice(0, 4);
  const recentGuides = [...guides]
    .sort((a, b) => (a.updated_at > b.updated_at ? -1 : 1))
    .slice(0, 4);
  const recentLessons = [...lessons]
    .sort((a, b) => (a.updated_at > b.updated_at ? -1 : 1))
    .slice(0, 4);

  const activityItems = [
    ...recentProducts.map((item) => ({
      id: item.id,
      label: `Product updated: ${item.name}`,
      timestamp: new Date(item.updated_at),
    })),
    ...recentGuides.map((item) => ({
      id: item.id,
      label: `Guide updated: ${item.title}`,
      timestamp: new Date(item.updated_at),
    })),
    ...recentLessons.map((item) => ({
      id: item.id,
      label: `Lesson updated: ${item.title}`,
      timestamp: new Date(item.updated_at),
    })),
  ].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

  const days = Array.from({ length: 7 }).map((_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - index));
    return startOfDay(date);
  });

  const allUpdates = [
    ...products.map((p) => new Date(p.updated_at)),
    ...guides.map((g) => new Date(g.updated_at)),
    ...lessons.map((l) => new Date(l.updated_at)),
  ].filter((date) => withinLastDays(date, 7));

  const data = days.map((day) =>
    allUpdates.filter(
      (date) =>
        date.getFullYear() === day.getFullYear() &&
        date.getMonth() === day.getMonth() &&
        date.getDate() === day.getDate()
    ).length
  );

  const labels = days.map(formatShortDay);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold">Admin Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Manage WARES products, guides, lessons, and media.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline">
            <Link href="/">View site</Link>
          </Button>
          <Button asChild>
            <Link href="/admin/products">Add product</Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="text-sm text-muted-foreground">Products</CardHeader>
          <CardContent className="space-y-2">
            <div className="text-3xl font-semibold">{products.length}</div>
            <div className="flex gap-2 text-xs">
              <Badge variant="secondary">{publishedProducts} published</Badge>
              <Badge variant="outline">{products.length - publishedProducts} drafts</Badge>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="text-sm text-muted-foreground">Guides</CardHeader>
          <CardContent className="space-y-2">
            <div className="text-3xl font-semibold">{guides.length}</div>
            <div className="flex gap-2 text-xs">
              <Badge variant="secondary">{publishedGuides} published</Badge>
              <Badge variant="outline">{guides.length - publishedGuides} drafts</Badge>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="text-sm text-muted-foreground">Lessons</CardHeader>
          <CardContent className="space-y-2">
            <div className="text-3xl font-semibold">{lessons.length}</div>
            <div className="flex gap-2 text-xs">
              <Badge variant="secondary">{publishedLessons} published</Badge>
              <Badge variant="outline">{lessons.length - publishedLessons} drafts</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <Card className="p-5">
          <h2 className="text-lg font-semibold">Publishing activity (last 7 days)</h2>
          <p className="text-xs text-muted-foreground">Updates across products, guides, lessons.</p>
          <div className="mt-4">
            <MiniBarChart labels={labels} data={data} />
          </div>
        </Card>

        <Card className="p-5">
          <h2 className="text-lg font-semibold">Pending accounts</h2>
          <p className="text-xs text-muted-foreground">Recent signups waiting for promotion.</p>
          <div className="mt-4 space-y-3">
            {(pendingUsers ?? []).length === 0 ? (
              <p className="text-sm text-muted-foreground">No pending users.</p>
            ) : (
              pendingUsers?.map((user) => (
                <div key={user.id} className="rounded-xl border border-border/60 bg-muted/30 p-3">
                  <p className="text-sm font-semibold">{user.email}</p>
                  <p className="text-xs text-muted-foreground">
                    Joined {new Date(user.created_at).toLocaleString()}
                  </p>
                </div>
              ))
            )}
          </div>
          <Button asChild className="mt-4" variant="secondary">
            <Link href="/admin/invites">Review pending</Link>
          </Button>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <Card className="p-5">
          <h2 className="text-lg font-semibold">Recent edits</h2>
          <p className="text-xs text-muted-foreground">Latest updates across content types.</p>
          <div className="mt-4 space-y-3 text-sm">
            {recentProducts.map((item) => (
              <div key={item.id} className="flex items-center justify-between rounded-xl border border-border/60 bg-muted/30 p-3">
                <div>
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-xs text-muted-foreground">Product • {new Date(item.updated_at).toLocaleString()}</p>
                </div>
                <Button asChild size="sm" variant="outline">
                  <Link href={`/admin/products/${item.id}`}>Edit</Link>
                </Button>
              </div>
            ))}
            {recentGuides.map((item) => (
              <div key={item.id} className="flex items-center justify-between rounded-xl border border-border/60 bg-muted/30 p-3">
                <div>
                  <p className="font-semibold">{item.title}</p>
                  <p className="text-xs text-muted-foreground">Guide • {new Date(item.updated_at).toLocaleString()}</p>
                </div>
                <Button asChild size="sm" variant="outline">
                  <Link href={`/admin/guides/${item.id}`}>Edit</Link>
                </Button>
              </div>
            ))}
            {recentLessons.map((item) => (
              <div key={item.id} className="flex items-center justify-between rounded-xl border border-border/60 bg-muted/30 p-3">
                <div>
                  <p className="font-semibold">{item.title}</p>
                  <p className="text-xs text-muted-foreground">Lesson • {new Date(item.updated_at).toLocaleString()}</p>
                </div>
                <Button asChild size="sm" variant="outline">
                  <Link href={`/admin/lessons/${item.id}`}>Edit</Link>
                </Button>
              </div>
            ))}
          </div>
        </Card>

        <ActivityLog
          items={activityItems.slice(0, 6).map((item) => ({
            id: item.id,
            label: item.label,
            timestamp: item.timestamp.toLocaleString(),
          }))}
        />
      </div>
    </div>
  );
}
