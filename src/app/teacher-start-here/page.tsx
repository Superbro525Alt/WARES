import Link from "next/link";
import { SectionHeading } from "@/components/shared/section-heading";
import { Button } from "@/components/ui/button";
import { productRepository, guideRepository, lessonRepository } from "@/lib/db";

export default async function TeacherStartHerePage() {
  const [products, guides, lessons] = await Promise.all([
    productRepository.list({ publishedOnly: true, teacherFriendly: true }),
    guideRepository.list({ publishedOnly: true }),
    lessonRepository.list({ publishedOnly: true }),
  ]);

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-14">
      <SectionHeading
        eyebrow="Teacher Start Here"
        title="A guided path for new classrooms"
        description="Start with the first 60 minutes, then move to the first week and common classroom setups."
      />
      <div className="mt-10 grid gap-6 lg:grid-cols-3">
        <div className="rounded-3xl border border-border/60 bg-muted/30 p-6">
          <p className="text-sm font-semibold">First 60 minutes</p>
          <p className="text-sm text-muted-foreground">
            Safety brief, unboxing, and a simple motion test with students.
          </p>
          <Button asChild size="sm" className="mt-4">
            <Link href="/guides">View quickstarts</Link>
          </Button>
        </div>
        <div className="rounded-3xl border border-border/60 bg-muted/30 p-6">
          <p className="text-sm font-semibold">First week</p>
          <p className="text-sm text-muted-foreground">
            Build confidence with wiring, CAD check-ins, and student roles.
          </p>
          <Button asChild size="sm" className="mt-4" variant="outline">
            <Link href="/lessons">Browse lessons</Link>
          </Button>
        </div>
        <div className="rounded-3xl border border-border/60 bg-muted/30 p-6">
          <p className="text-sm font-semibold">Common classroom setups</p>
          <p className="text-sm text-muted-foreground">
            Manage shared kits, tool checkout, and storage systems.
          </p>
          <Button asChild size="sm" className="mt-4" variant="ghost">
            <Link href="/guides">Explore setups</Link>
          </Button>
        </div>
      </div>

      <div className="mt-12 grid gap-8 lg:grid-cols-2">
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Recommended starter products</h2>
          <div className="grid gap-4">
            {products.slice(0, 3).map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.slug}`}
                className="rounded-2xl border border-border/60 bg-background p-4"
              >
                <p className="text-sm font-semibold">{product.name}</p>
                <p className="text-sm text-muted-foreground">{product.short_description}</p>
              </Link>
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Teacher knowledge base</h2>
          <div className="grid gap-4">
            {guides.slice(0, 2).map((guide) => (
              <Link
                key={guide.id}
                href={`/guides/${guide.slug}`}
                className="rounded-2xl border border-border/60 bg-background p-4"
              >
                <p className="text-sm font-semibold">{guide.title}</p>
                <p className="text-sm text-muted-foreground">{guide.summary}</p>
              </Link>
            ))}
            {lessons.slice(0, 2).map((lesson) => (
              <Link
                key={lesson.id}
                href={`/lessons/${lesson.slug}`}
                className="rounded-2xl border border-border/60 bg-background p-4"
              >
                <p className="text-sm font-semibold">{lesson.title}</p>
                <p className="text-sm text-muted-foreground">{lesson.summary}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
