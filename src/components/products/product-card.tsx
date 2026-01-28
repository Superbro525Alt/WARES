import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Product, Category } from "@/lib/db/types";

export function ProductCard({
  product,
  category,
}: {
  product: Product;
  category?: Category | null;
}) {
  return (
    <Card className="group flex h-full flex-col overflow-hidden border-border/60 bg-card/80 transition hover:-translate-y-1 hover:border-foreground/30">
      <CardHeader className="space-y-2">
        <div className="flex flex-wrap gap-2">
          {product.teacher_friendly ? (
            <Badge variant="secondary">Teacher Friendly</Badge>
          ) : null}
          {category ? <Badge variant="outline">{category.name}</Badge> : null}
        </div>
        <h3 className="text-xl font-semibold tracking-tight">{product.name}</h3>
        <p className="text-sm text-muted-foreground">{product.short_description}</p>
      </CardHeader>
      <CardContent className="mt-auto" />
      <CardFooter>
        <Button asChild variant="ghost" className="group-hover:translate-x-1">
          <Link href={`/products/${product.slug}`}>View Documentation</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
