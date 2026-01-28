import Link from "next/link";
import { productRepository } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createProduct, deleteProductAction } from "@/app/admin/(dashboard)/products/actions";

export default async function AdminProductsPage() {
  const products = await productRepository.list();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold">Products</h1>
        <Button asChild variant="outline">
          <Link href="/products">Public catalog</Link>
        </Button>
      </div>

      <form action={createProduct} className="grid gap-3 rounded-2xl border border-border/60 bg-background p-4 md:grid-cols-4">
        <Input name="name" placeholder="Product name" required />
        <Input name="slug" placeholder="Slug" required />
        <Input name="short_description" placeholder="Short description" required />
        <Button type="submit">Create product</Button>
        <input type="hidden" name="long_description_md" value="" />
        <input type="hidden" name="teacher_friendly" value="false" />
        <input type="hidden" name="published" value="false" />
      </form>

      <div className="grid gap-4">
        {products.map((product) => (
          <div
            key={product.id}
            className="flex flex-col justify-between gap-3 rounded-2xl border border-border/60 bg-background p-4 md:flex-row md:items-center"
          >
            <div>
              <p className="text-sm font-semibold">{product.name}</p>
              <p className="text-xs text-muted-foreground">/{product.slug}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button asChild size="sm" variant="outline">
                <Link href={`/admin/products/${product.id}`}>Edit</Link>
              </Button>
              <form action={deleteProductAction.bind(null, product.id)}>
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
