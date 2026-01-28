"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { MarkdownEditor } from "@/components/markdown/markdown-editor";
import type { Guide, Product } from "@/lib/db/types";
import { saveGuide } from "@/app/admin/(dashboard)/guides/actions";

export function GuideEditor({
  guide,
  products,
  linkedProductIds,
}: {
  guide: Guide;
  products: Product[];
  linkedProductIds: string[];
}) {
  const [pending, startTransition] = useTransition();
  const [status, setStatus] = useState<string | null>(null);
  const router = useRouter();
  const [form, setForm] = useState({
    title: guide.title,
    slug: guide.slug,
    summary: guide.summary ?? "",
    difficulty: guide.difficulty ?? "",
    est_minutes: guide.est_minutes?.toString() ?? "",
    content_md: guide.content_md ?? "",
    published: guide.published,
  });
  const [productIds, setProductIds] = useState<string[]>(linkedProductIds);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Edit Guide</h1>
          <p className="text-sm text-muted-foreground">{guide.slug}</p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <a href={`/guides/${guide.slug}`} target="_blank" rel="noreferrer">
              Public Preview
            </a>
          </Button>
          <Button
            disabled={pending}
            onClick={() => {
              setStatus(null);
              startTransition(async () => {
                const payload = {
                  id: guide.id,
                  ...form,
                  est_minutes: form.est_minutes ? Number(form.est_minutes) : null,
                  product_ids: productIds,
                };
                const result = await saveGuide(JSON.stringify(payload));
                if (!result.ok) {
                  setStatus(result.error ?? "Save failed.");
                } else {
                  setStatus("Saved.");
                  router.refresh();
                }
              });
            }}
          >
            {pending ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>
      {status ? <p className="text-sm text-muted-foreground">{status}</p> : null}

      <section className="grid gap-4 rounded-2xl border border-border/60 bg-background p-6">
        <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Title" />
        <Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="Slug" />
        <Textarea value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })} placeholder="Summary" />
        <Input value={form.difficulty} onChange={(e) => setForm({ ...form, difficulty: e.target.value })} placeholder="Difficulty" />
        <Input value={form.est_minutes} onChange={(e) => setForm({ ...form, est_minutes: e.target.value })} placeholder="Estimated minutes" />
        <div className="rounded-xl border border-border/60 bg-muted/30 p-3">
          <p className="text-sm font-semibold">Publishing</p>
          <p className="text-xs text-muted-foreground">
            Turn this on to publish the guide to the public site.
          </p>
          <label className="mt-3 flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.published}
              onChange={(e) => setForm({ ...form, published: e.target.checked })}
            />
            Published (live)
          </label>
        </div>
      </section>

      <section className="grid gap-4 rounded-2xl border border-border/60 bg-background p-6">
        <h2 className="text-xl font-semibold">Linked Products</h2>
        <div className="flex flex-wrap gap-3">
          {products.map((product) => (
            <label key={product.id} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={productIds.includes(product.id)}
                onChange={(e) => {
                  setProductIds((prev) =>
                    e.target.checked
                      ? [...prev, product.id]
                      : prev.filter((id) => id !== product.id)
                  );
                }}
              />
              {product.name}
            </label>
          ))}
        </div>
      </section>

      <section className="grid gap-4 rounded-2xl border border-border/60 bg-background p-6">
        <MarkdownEditor
          label="Guide content"
          value={form.content_md}
          onChange={(value) => setForm({ ...form, content_md: value })}
        />
      </section>
    </div>
  );
}
