import { productRepository } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { upsertTagAction, deleteTagAction } from "@/app/admin/(dashboard)/tags/actions";

export default async function AdminTagsPage() {
  const tags = await productRepository.listTags();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold">Tags</h1>
      <form action={upsertTagAction} className="grid gap-3 rounded-2xl border border-border/60 bg-background p-4 md:grid-cols-3">
        <Input name="name" placeholder="Tag name" required />
        <Input name="slug" placeholder="Slug" required />
        <Button type="submit">Add tag</Button>
      </form>
      <div className="grid gap-4">
        {tags.map((tag) => (
          <div
            key={tag.id}
            className="grid gap-3 rounded-2xl border border-border/60 bg-background p-4 md:grid-cols-4"
          >
            <form action={upsertTagAction} className="grid gap-3 md:col-span-3 md:grid-cols-3">
              <input type="hidden" name="id" value={tag.id} />
              <Input name="name" defaultValue={tag.name} />
              <Input name="slug" defaultValue={tag.slug} />
              <Button type="submit" variant="outline">
                Save
              </Button>
            </form>
            <form action={deleteTagAction.bind(null, tag.id)}>
              <Button type="submit" variant="destructive">
                Delete
              </Button>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}
