import { notFound } from "next/navigation";
import { productRepository } from "@/lib/db";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { MarkdownRenderer } from "@/components/markdown/markdown-renderer";
import { ProductSectionNav } from "@/components/products/section-nav";
import { ProductSectionNavMobile } from "@/components/products/section-nav-mobile";
import { TeacherHighlight } from "@/components/products/teacher-highlight";
import { FaqList } from "@/components/products/faq-list";
import { MediaCarousel } from "@/components/products/media-carousel";
import { YoutubeEmbed } from "@/components/products/youtube-embed";
import { PdfViewer } from "@/components/products/pdf-viewer";
import { CadEmbedViewer } from "@/components/products/cad-embed";
import { ModelViewer } from "@/components/products/model-viewer";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = await productRepository.getBySlug(slug);
  if (!data) return notFound();

  const { product, section, guides, lessons, faqs, youtube, images, pdfs, cad, models } = data;

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-10">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Products", href: "/products" },
          { label: product.name },
        ]}
      />
      <div className="mt-6 grid gap-8 lg:grid-cols-[260px_1fr]">
        <aside className="hidden lg:block">
          <div className="sticky top-24">
            <ProductSectionNav />
          </div>
        </aside>
        <div className="space-y-10">
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {product.teacher_friendly ? (
                <Badge variant="secondary">Teacher Friendly</Badge>
              ) : null}
              {product.difficulty ? (
                <Badge variant="outline">{product.difficulty}</Badge>
              ) : null}
            </div>
            <h1 className="text-4xl font-semibold tracking-tight">{product.name}</h1>
            <p className="text-lg text-muted-foreground">{product.short_description}</p>
          </div>

          <div className="lg:hidden">
            <ProductSectionNavMobile />
          </div>

          <section id="overview" className="space-y-4 scroll-mt-24">
            <TeacherHighlight active={false}>
              <h2 className="text-2xl font-semibold">Overview</h2>
              <MarkdownRenderer content={section?.overview_md ?? product.long_description_md} />
            </TeacherHighlight>
          </section>

          <section id="intended-use" className="space-y-4 scroll-mt-24">
            <TeacherHighlight active>
              <h2 className="text-2xl font-semibold">Intended Use</h2>
              <MarkdownRenderer content={section?.intended_use_md} />
            </TeacherHighlight>
          </section>

          <section id="quickstart" className="space-y-4 scroll-mt-24">
            <TeacherHighlight active>
              <h2 className="text-2xl font-semibold">Quickstart: First 60 minutes</h2>
              <MarkdownRenderer content={section?.quickstart_md} />
            </TeacherHighlight>
          </section>

          <section id="guides" className="space-y-4 scroll-mt-24">
            <h2 className="text-2xl font-semibold">Guides</h2>
            <div className="grid gap-4">
              {guides.map((guide) => (
                <Link
                  key={guide.id}
                  href={`/guides/${guide.slug}`}
                  className="rounded-2xl border border-border/60 bg-muted/30 p-4"
                >
                  <p className="text-sm font-semibold">{guide.title}</p>
                  <p className="text-sm text-muted-foreground">{guide.summary}</p>
                </Link>
              ))}
            </div>
          </section>

          <section id="lessons" className="space-y-4 scroll-mt-24">
            <TeacherHighlight active>
              <h2 className="text-2xl font-semibold">Lessons</h2>
              <div className="grid gap-4">
                {lessons.map((lesson) => (
                  <Link
                    key={lesson.id}
                    href={`/lessons/${lesson.slug}`}
                    className="rounded-2xl border border-border/60 bg-muted/30 p-4"
                  >
                    <p className="text-sm font-semibold">{lesson.title}</p>
                    <p className="text-sm text-muted-foreground">{lesson.summary}</p>
                  </Link>
                ))}
              </div>
            </TeacherHighlight>
          </section>

          <section id="practice" className="space-y-6 scroll-mt-24">
            <TeacherHighlight active>
              <h2 className="text-2xl font-semibold">Good Practice</h2>
              <MarkdownRenderer content={section?.good_practice_md} />
            </TeacherHighlight>
            <TeacherHighlight active>
              <h2 className="text-2xl font-semibold">Bad Practice</h2>
              <MarkdownRenderer content={section?.bad_practice_md} />
            </TeacherHighlight>
          </section>

          <section id="faqs" className="space-y-4 scroll-mt-24">
            <h2 className="text-2xl font-semibold">FAQs</h2>
            <FaqList faqs={faqs} />
          </section>

          <section id="media" className="space-y-6 scroll-mt-24">
            <h2 className="text-2xl font-semibold">Media</h2>
            <MediaCarousel images={images} />
            <div className="grid gap-4">
              {youtube.map((video) => (
                <YoutubeEmbed key={video.id} video={video} />
              ))}
            </div>
          </section>

          <section id="downloads" className="space-y-4 scroll-mt-24">
            <h2 className="text-2xl font-semibold">Downloads</h2>
            <div className="grid gap-4">
              {pdfs.map((pdf) => (
                <PdfViewer key={pdf.id} pdf={pdf} />
              ))}
            </div>
          </section>

          <section id="cad" className="space-y-4 scroll-mt-24">
            <h2 className="text-2xl font-semibold">CAD</h2>
            <div className="grid gap-4">
              {cad.map((embed) => (
                <CadEmbedViewer key={embed.id} embed={embed} />
              ))}
            </div>
            <div className="grid gap-4">
              {models.map((model) => (
                <ModelViewer key={model.id} model={model} />
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
