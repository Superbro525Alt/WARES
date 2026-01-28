"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MarkdownEditor } from "@/components/markdown/markdown-editor";
import { SortableList } from "@/components/admin/sortable-list";
import { UploadField } from "@/components/admin/upload-field";
import { saveProduct } from "@/app/admin/(dashboard)/products/[id]/actions";
import type {
  Category,
  Tag,
  Guide,
  Lesson,
  ProductWithRelations,
  Faq,
  MediaYoutube,
  MediaImage,
  DownloadPdf,
  CadEmbed,
  Model3d,
} from "@/lib/db/types";

interface ProductEditorProps {
  productData: ProductWithRelations;
  categories: Category[];
  tags: Tag[];
  guides: Guide[];
  lessons: Lesson[];
}

type SortableItem<T> = T & { clientId: string };

function withClientId<T extends { id?: string }>(items: T[]): SortableItem<T>[] {
  return items.map((item) => ({ ...item, clientId: item.id ?? crypto.randomUUID() }));
}

export function ProductEditor({ productData, categories, tags, guides, lessons }: ProductEditorProps) {
  const [pending, startTransition] = useTransition();
  const [status, setStatus] = useState<string | null>(null);
  const router = useRouter();
  const [product, setProduct] = useState(productData.product);
  const [section, setSection] = useState(productData.section ?? {
    product_id: productData.product.id,
    overview_md: "",
    quickstart_md: "",
    intended_use_md: "",
    good_practice_md: "",
    bad_practice_md: "",
  });

  const [tagIds, setTagIds] = useState<string[]>(productData.tags.map((tag) => tag.id));
  const [guideIds, setGuideIds] = useState<string[]>(productData.guides.map((guide) => guide.id));
  const [lessonIds, setLessonIds] = useState<string[]>(productData.lessons.map((lesson) => lesson.id));

  const [faqs, setFaqs] = useState<SortableItem<Faq>[]>(withClientId(productData.faqs));
  const [youtube, setYoutube] = useState<SortableItem<MediaYoutube>[]>(withClientId(productData.youtube));
  const [images, setImages] = useState<SortableItem<MediaImage>[]>(withClientId(productData.images));
  const [pdfs, setPdfs] = useState<SortableItem<DownloadPdf>[]>(withClientId(productData.pdfs));
  const [cad, setCad] = useState<SortableItem<CadEmbed>[]>(withClientId(productData.cad));
  const [models, setModels] = useState<SortableItem<Model3d>[]>(withClientId(productData.models));

  const removed = useRef({
    faqs: [] as string[],
    youtube: [] as string[],
    images: [] as string[],
    pdfs: [] as string[],
    cad: [] as string[],
    models: [] as string[],
  });

  const handleSave = () => {
    setStatus(null);
    startTransition(async () => {
      const stripClient = <T extends { clientId: string }>(item: T) => {
        const { clientId: _clientId, ...rest } = item;
        void _clientId;
        return rest;
      };
      const payload = {
        product,
        section,
        tagIds,
        guideIds,
        lessonIds,
        faqs: faqs.map((faq) => stripClient(faq)),
        youtube: youtube.map((item) => stripClient(item)),
        images: images.map((item) => stripClient(item)),
        pdfs: pdfs.map((item) => stripClient(item)),
        cad: cad.map((item) => stripClient(item)),
        models: models.map((item) => stripClient(item)),
        removed: removed.current,
      };
      const result = await saveProduct(JSON.stringify(payload));
      if (!result.ok) {
        setStatus(result.error ?? "Save failed.");
      } else {
        setStatus("Saved.");
        router.refresh();
      }
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Edit Product</h1>
          <p className="text-sm text-muted-foreground">{product.slug}</p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <a href={`/products/${product.slug}`} target="_blank" rel="noreferrer">
              Public Preview
            </a>
          </Button>
          <Button onClick={handleSave} disabled={pending}>
            {pending ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>
      {status ? <p className="text-sm text-muted-foreground">{status}</p> : null}

      <section className="grid gap-4 rounded-2xl border border-border/60 bg-background p-6">
        <h2 className="text-xl font-semibold">Basics</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Input value={product.name} onChange={(e) => setProduct({ ...product, name: e.target.value })} placeholder="Name" />
          <Input value={product.slug} onChange={(e) => setProduct({ ...product, slug: e.target.value })} placeholder="Slug" />
          <Input value={product.short_description} onChange={(e) => setProduct({ ...product, short_description: e.target.value })} placeholder="Short description" className="md:col-span-2" />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Select value={product.category_id ?? "none"} onValueChange={(value) => setProduct({ ...product, category_id: value === "none" ? null : value })}>
            <SelectTrigger>
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No category</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={product.difficulty ?? ""} onValueChange={(value) => setProduct({ ...product, difficulty: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Beginner">Beginner</SelectItem>
              <SelectItem value="Intermediate">Intermediate</SelectItem>
              <SelectItem value="Advanced">Advanced</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-3">
          <div className="rounded-xl border border-border/60 bg-muted/30 p-3">
            <p className="text-sm font-semibold">Publishing</p>
            <p className="text-xs text-muted-foreground">
              Turn this on to make the product visible on the public site.
            </p>
            <label className="mt-3 flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={product.published}
                onChange={(e) => setProduct({ ...product, published: e.target.checked })}
              />
              Published (live)
            </label>
          </div>
          <div className="rounded-xl border border-border/60 bg-muted/30 p-3">
            <p className="text-sm font-semibold">Teacher Friendly</p>
            <p className="text-xs text-muted-foreground">
              Highlights quickstarts, lessons, and best practices for educators.
            </p>
            <label className="mt-3 flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={product.teacher_friendly}
                onChange={(e) => setProduct({ ...product, teacher_friendly: e.target.checked })}
              />
              Teacher friendly
            </label>
          </div>
        </div>
      </section>

      <section className="grid gap-4 rounded-2xl border border-border/60 bg-background p-6">
        <h2 className="text-xl font-semibold">Longform Content</h2>
        <MarkdownEditor
          label="Overview"
          value={section.overview_md ?? ""}
          onChange={(value) => setSection({ ...section, overview_md: value })}
        />
        <MarkdownEditor
          label="Quickstart (First 60 minutes)"
          value={section.quickstart_md ?? ""}
          onChange={(value) => setSection({ ...section, quickstart_md: value })}
        />
        <MarkdownEditor
          label="Intended Use / Teacher Friendly"
          value={section.intended_use_md ?? ""}
          onChange={(value) => setSection({ ...section, intended_use_md: value })}
        />
        <MarkdownEditor
          label="Good Practice"
          value={section.good_practice_md ?? ""}
          onChange={(value) => setSection({ ...section, good_practice_md: value })}
        />
        <MarkdownEditor
          label="Bad Practice"
          value={section.bad_practice_md ?? ""}
          onChange={(value) => setSection({ ...section, bad_practice_md: value })}
        />
      </section>

      <section className="grid gap-4 rounded-2xl border border-border/60 bg-background p-6">
        <h2 className="text-xl font-semibold">Tags</h2>
        <div className="flex flex-wrap gap-3">
          {tags.map((tag) => (
            <label key={tag.id} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={tagIds.includes(tag.id)}
                onChange={(e) => {
                  setTagIds((prev) =>
                    e.target.checked
                      ? [...prev, tag.id]
                      : prev.filter((id) => id !== tag.id)
                  );
                }}
              />
              {tag.name}
            </label>
          ))}
        </div>
      </section>

      <section className="grid gap-4 rounded-2xl border border-border/60 bg-background p-6">
        <h2 className="text-xl font-semibold">Linked Guides</h2>
        <div className="flex flex-wrap gap-3">
          {guides.map((guide) => (
            <label key={guide.id} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={guideIds.includes(guide.id)}
                onChange={(e) => {
                  setGuideIds((prev) =>
                    e.target.checked
                      ? [...prev, guide.id]
                      : prev.filter((id) => id !== guide.id)
                  );
                }}
              />
              {guide.title}
            </label>
          ))}
        </div>
      </section>

      <section className="grid gap-4 rounded-2xl border border-border/60 bg-background p-6">
        <h2 className="text-xl font-semibold">Linked Lessons</h2>
        <div className="flex flex-wrap gap-3">
          {lessons.map((lesson) => (
            <label key={lesson.id} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={lessonIds.includes(lesson.id)}
                onChange={(e) => {
                  setLessonIds((prev) =>
                    e.target.checked
                      ? [...prev, lesson.id]
                      : prev.filter((id) => id !== lesson.id)
                  );
                }}
              />
              {lesson.title}
            </label>
          ))}
        </div>
      </section>

      <section className="grid gap-4 rounded-2xl border border-border/60 bg-background p-6">
        <h2 className="text-xl font-semibold">FAQs</h2>
        <Button
          type="button"
          variant="outline"
          onClick={() =>
            setFaqs((prev) => [
              ...prev,
              { id: undefined, clientId: crypto.randomUUID(), product_id: product.id, question: "", answer_md: "", order_index: prev.length },
            ])
          }
        >
          Add FAQ
        </Button>
        <SortableList
          items={faqs}
          onReorder={setFaqs}
          renderItem={(faq) => (
            <div className="grid gap-2">
              <Input
                value={faq.question}
                onChange={(e) =>
                  setFaqs((prev) =>
                    prev.map((item) =>
                      item.clientId === faq.clientId ? { ...item, question: e.target.value } : item
                    )
                  )
                }
                placeholder="Question"
              />
              <Textarea
                value={faq.answer_md ?? ""}
                onChange={(e) =>
                  setFaqs((prev) =>
                    prev.map((item) =>
                      item.clientId === faq.clientId ? { ...item, answer_md: e.target.value } : item
                    )
                  )
                }
                placeholder="Answer (markdown)"
              />
              <Button
                type="button"
                variant="destructive"
                onClick={() => {
                  if (faq.id) removed.current.faqs.push(faq.id);
                  setFaqs((prev) => prev.filter((item) => item.clientId !== faq.clientId));
                }}
              >
                Remove
              </Button>
            </div>
          )}
        />
      </section>

      <section className="grid gap-4 rounded-2xl border border-border/60 bg-background p-6">
        <h2 className="text-xl font-semibold">YouTube</h2>
        <Button
          type="button"
          variant="outline"
          onClick={() =>
            setYoutube((prev) => [
              ...prev,
              { id: undefined, clientId: crypto.randomUUID(), product_id: product.id, title: "", youtube_url: "", order_index: prev.length },
            ])
          }
        >
          Add Video
        </Button>
        <SortableList
          items={youtube}
          onReorder={setYoutube}
          renderItem={(item) => (
            <div className="grid gap-2">
              <Input value={item.title} onChange={(e) => setYoutube((prev) => prev.map((entry) => entry.clientId === item.clientId ? { ...entry, title: e.target.value } : entry))} placeholder="Title" />
              <Input value={item.youtube_url} onChange={(e) => setYoutube((prev) => prev.map((entry) => entry.clientId === item.clientId ? { ...entry, youtube_url: e.target.value } : entry))} placeholder="YouTube URL" />
              <Button type="button" variant="destructive" onClick={() => {
                if (item.id) removed.current.youtube.push(item.id);
                setYoutube((prev) => prev.filter((entry) => entry.clientId !== item.clientId));
              }}>Remove</Button>
            </div>
          )}
        />
      </section>

      <section className="grid gap-4 rounded-2xl border border-border/60 bg-background p-6">
        <h2 className="text-xl font-semibold">Images</h2>
        <UploadField bucket="public-images" onUploaded={(url) => {
          setImages((prev) => [
            ...prev,
            { id: undefined, clientId: crypto.randomUUID(), product_id: product.id, title: "", alt_text: "", caption: "", storage_path: url, width: null, height: null, order_index: prev.length },
          ]);
        }} />
        <SortableList
          items={images}
          onReorder={setImages}
          renderItem={(item) => (
            <div className="grid gap-2">
              <Input value={item.title ?? ""} onChange={(e) => setImages((prev) => prev.map((entry) => entry.clientId === item.clientId ? { ...entry, title: e.target.value } : entry))} placeholder="Title" />
              <Input value={item.alt_text ?? ""} onChange={(e) => setImages((prev) => prev.map((entry) => entry.clientId === item.clientId ? { ...entry, alt_text: e.target.value } : entry))} placeholder="Alt text" />
              <Input value={item.caption ?? ""} onChange={(e) => setImages((prev) => prev.map((entry) => entry.clientId === item.clientId ? { ...entry, caption: e.target.value } : entry))} placeholder="Caption" />
              <Input value={item.storage_path} onChange={(e) => setImages((prev) => prev.map((entry) => entry.clientId === item.clientId ? { ...entry, storage_path: e.target.value } : entry))} placeholder="Image URL" />
              <Button type="button" variant="destructive" onClick={() => {
                if (item.id) removed.current.images.push(item.id);
                setImages((prev) => prev.filter((entry) => entry.clientId !== item.clientId));
              }}>Remove</Button>
            </div>
          )}
        />
      </section>

      <section className="grid gap-4 rounded-2xl border border-border/60 bg-background p-6">
        <h2 className="text-xl font-semibold">PDF Downloads</h2>
        <UploadField bucket="public-pdfs" onUploaded={(url) => {
          setPdfs((prev) => [
            ...prev,
            { id: undefined, clientId: crypto.randomUUID(), product_id: product.id, title: "", description: "", kind: "manual", version: "", storage_path: url, order_index: prev.length },
          ]);
        }} />
        <SortableList
          items={pdfs}
          onReorder={setPdfs}
          renderItem={(item) => (
            <div className="grid gap-2">
              <Input value={item.title} onChange={(e) => setPdfs((prev) => prev.map((entry) => entry.clientId === item.clientId ? { ...entry, title: e.target.value } : entry))} placeholder="Title" />
              <Input value={item.description ?? ""} onChange={(e) => setPdfs((prev) => prev.map((entry) => entry.clientId === item.clientId ? { ...entry, description: e.target.value } : entry))} placeholder="Description" />
              <Input value={item.storage_path} onChange={(e) => setPdfs((prev) => prev.map((entry) => entry.clientId === item.clientId ? { ...entry, storage_path: e.target.value } : entry))} placeholder="PDF URL" />
              <Button type="button" variant="destructive" onClick={() => {
                if (item.id) removed.current.pdfs.push(item.id);
                setPdfs((prev) => prev.filter((entry) => entry.clientId !== item.clientId));
              }}>Remove</Button>
            </div>
          )}
        />
      </section>

      <section className="grid gap-4 rounded-2xl border border-border/60 bg-background p-6">
        <h2 className="text-xl font-semibold">CAD Embeds</h2>
        <Button type="button" variant="outline" onClick={() => setCad((prev) => [
          ...prev,
          { id: undefined, clientId: crypto.randomUUID(), product_id: product.id, title: "", embed_url: "", notes_md: "", order_index: prev.length },
        ])}>
          Add CAD Embed
        </Button>
        <SortableList
          items={cad}
          onReorder={setCad}
          renderItem={(item) => (
            <div className="grid gap-2">
              <Input value={item.title} onChange={(e) => setCad((prev) => prev.map((entry) => entry.clientId === item.clientId ? { ...entry, title: e.target.value } : entry))} placeholder="Title" />
              <Input value={item.embed_url} onChange={(e) => setCad((prev) => prev.map((entry) => entry.clientId === item.clientId ? { ...entry, embed_url: e.target.value } : entry))} placeholder="Embed URL" />
              <Textarea value={item.notes_md ?? ""} onChange={(e) => setCad((prev) => prev.map((entry) => entry.clientId === item.clientId ? { ...entry, notes_md: e.target.value } : entry))} placeholder="Notes" />
              <Button type="button" variant="destructive" onClick={() => {
                if (item.id) removed.current.cad.push(item.id);
                setCad((prev) => prev.filter((entry) => entry.clientId !== item.clientId));
              }}>Remove</Button>
            </div>
          )}
        />
      </section>

      <section className="grid gap-4 rounded-2xl border border-border/60 bg-background p-6">
        <h2 className="text-xl font-semibold">3D Models</h2>
        <UploadField bucket="public-models" onUploaded={(url) => {
          setModels((prev) => [
            ...prev,
            { id: undefined, clientId: crypto.randomUUID(), product_id: product.id, title: "", storage_path: url, format: "glb", notes_md: "", order_index: prev.length },
          ]);
        }} />
        <SortableList
          items={models}
          onReorder={setModels}
          renderItem={(item) => (
            <div className="grid gap-2">
              <Input value={item.title} onChange={(e) => setModels((prev) => prev.map((entry) => entry.clientId === item.clientId ? { ...entry, title: e.target.value } : entry))} placeholder="Title" />
              <Input value={item.storage_path} onChange={(e) => setModels((prev) => prev.map((entry) => entry.clientId === item.clientId ? { ...entry, storage_path: e.target.value } : entry))} placeholder="Model URL" />
              <Textarea value={item.notes_md ?? ""} onChange={(e) => setModels((prev) => prev.map((entry) => entry.clientId === item.clientId ? { ...entry, notes_md: e.target.value } : entry))} placeholder="Notes" />
              <Button type="button" variant="destructive" onClick={() => {
                if (item.id) removed.current.models.push(item.id);
                setModels((prev) => prev.filter((entry) => entry.clientId !== item.clientId));
              }}>Remove</Button>
            </div>
          )}
        />
      </section>
    </div>
  );
}
