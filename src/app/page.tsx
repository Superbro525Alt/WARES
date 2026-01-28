import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { SectionHeading } from "@/components/shared/section-heading";
import { FadeIn } from "@/components/shared/motion";
import { productRepository, guideRepository, lessonRepository } from "@/lib/db";
import { ArrowRight, BookOpen, CircuitBoard, GraduationCap, Wrench } from "lucide-react";

export default async function HomePage() {
  const [products, guides, lessons] = await Promise.all([
    productRepository.list({ publishedOnly: true }),
    guideRepository.list({ publishedOnly: true }),
    lessonRepository.list({ publishedOnly: true }),
  ]);

  return (
    <div className="hero-grid">
      <section className="mx-auto w-full max-w-6xl px-6 pb-16 pt-16">
        <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <FadeIn className="space-y-6">
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="border-foreground/30 text-xs">
                Perth, Western Australia
              </Badge>
              <Badge variant="secondary" className="text-xs">
                Public documentation
              </Badge>
            </div>
            <h1 className="text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
              Accessible STEM robotics components + teacher-friendly documentation
            </h1>
            <p className="text-base text-muted-foreground md:text-lg">
              WARES brings FRC-ready components and structured learning resources together.
              Find accurate specs, quickstarts, and lesson plans that help every classroom succeed.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg">
                <a href="https://warobotics.education/shop/">Browse Products</a>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/teacher-start-here">Teacher Start Here</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="secondary"
                className="transition-colors hover:bg-primary hover:text-primary-foreground"
              >
                <Link href="/guides">Guides</Link>
              </Button>
            </div>
            <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
              <span>Accurate specs</span>
              <span>First 60 minutes</span>
              <span>Media-rich CAD + PDF</span>
            </div>
          </FadeIn>

          <FadeIn className="glass-panel rounded-3xl p-6" delay={0.1}>
            <div className="grid gap-4">
              <div className="rounded-2xl border border-border/60 bg-muted/40 p-4">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <CircuitBoard className="h-4 w-4 text-primary" />
                  Product documentation
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  Specs, wiring, quickstarts, CAD, and FAQs in one place.
                </p>
              </div>
              <div className="rounded-2xl border border-border/60 bg-muted/40 p-4">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <GraduationCap className="h-4 w-4 text-primary" />
                  Teacher-first guidance
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  Best practices, common mistakes, and classroom setup checklists.
                </p>
              </div>
              <div className="rounded-2xl border border-border/60 bg-muted/40 p-4">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <Wrench className="h-4 w-4 text-primary" />
                  Hands-on lessons
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  Lesson plans with learning goals, timing, and materials.
                </p>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 py-12">
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="border-border/60 bg-card/80">
            <CardHeader className="space-y-2">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Teacher track</p>
              <h3 className="text-xl font-semibold">First 60 minutes</h3>
              <p className="text-sm text-muted-foreground">
                Guided steps for unboxing, safety, and first motion test.
              </p>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline" size="sm">
                <Link href="/teacher-start-here">Start here</Link>
              </Button>
            </CardContent>
          </Card>
          <Card className="border-border/60 bg-card/80">
            <CardHeader className="space-y-2">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Guides</p>
              <h3 className="text-xl font-semibold">Step-by-step builds</h3>
              <p className="text-sm text-muted-foreground">
                Assembly, wiring, and testing walk-throughs for teams.
              </p>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline" size="sm">
                <Link href="/guides">Explore guides</Link>
              </Button>
            </CardContent>
          </Card>
          <Card className="border-border/60 bg-card/80">
            <CardHeader className="space-y-2">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Lessons</p>
              <h3 className="text-xl font-semibold">Classroom-ready plans</h3>
              <p className="text-sm text-muted-foreground">
                Learning goals, prerequisites, and duration included.
              </p>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline" size="sm">
                <Link href="/lessons">View lessons</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 py-12">
        <SectionHeading
          eyebrow="Featured"
          title="Popular kits and systems"
          description="Quick entry points for established teams and new classrooms."
        />
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {products.slice(0, 3).map((product) => (
            <Card key={product.id} className="border-border/60 bg-card/80">
              <CardHeader>
                <h3 className="text-xl font-semibold">{product.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {product.short_description}
                </p>
              </CardHeader>
              <CardContent>
                <Button asChild variant="outline">
                  <Link href={`/products/${product.slug}`}>
                    View documentation <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 py-12">
        <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
          <div className="space-y-6">
            <SectionHeading
              eyebrow="Latest"
              title="New guides and lessons"
              description="Stay up to date with the newest teaching resources and build guides."
            />
            <Button asChild variant="outline">
              <Link href="/guides">Browse all resources</Link>
            </Button>
          </div>
          <div className="grid gap-4">
            {guides.slice(0, 2).map((guide) => (
              <Link
                key={guide.id}
                href={`/guides/${guide.slug}`}
                className="rounded-2xl border border-border/60 bg-muted/30 p-4"
              >
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <BookOpen className="h-4 w-4 text-primary" />
                  {guide.title}
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{guide.summary}</p>
              </Link>
            ))}
            {lessons.slice(0, 2).map((lesson) => (
              <Link
                key={lesson.id}
                href={`/lessons/${lesson.slug}`}
                className="rounded-2xl border border-border/60 bg-muted/30 p-4"
              >
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <GraduationCap className="h-4 w-4 text-primary" />
                  {lesson.title}
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{lesson.summary}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
