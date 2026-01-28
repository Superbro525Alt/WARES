import Link from "next/link";
import { guideRepository } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createGuide, deleteGuideAction } from "@/app/admin/(dashboard)/guides/actions";

export default async function AdminGuidesPage() {
  const guides = await guideRepository.list();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold">Guides</h1>
        <Button asChild variant="outline">
          <Link href="/guides">Public guides</Link>
        </Button>
      </div>

      <form action={createGuide} className="grid gap-3 rounded-2xl border border-border/60 bg-background p-4 md:grid-cols-4">
        <Input name="title" placeholder="Guide title" required />
        <Input name="slug" placeholder="Slug" required />
        <Input name="summary" placeholder="Summary" required />
        <Button type="submit">Create guide</Button>
        <input type="hidden" name="content_md" value="" />
        <input type="hidden" name="published" value="false" />
      </form>

      <div className="grid gap-4">
        {guides.map((guide) => (
          <div
            key={guide.id}
            className="flex flex-col justify-between gap-3 rounded-2xl border border-border/60 bg-background p-4 md:flex-row md:items-center"
          >
            <div>
              <p className="text-sm font-semibold">{guide.title}</p>
              <p className="text-xs text-muted-foreground">/{guide.slug}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button asChild size="sm" variant="outline">
                <Link href={`/admin/guides/${guide.id}`}>Edit</Link>
              </Button>
              <form action={deleteGuideAction.bind(null, guide.id)}>
                <Button size="sm" variant="destructive" type="submit">
                  Delete
                </Button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
