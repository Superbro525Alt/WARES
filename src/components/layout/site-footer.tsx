import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 bg-background">
      <div className="mx-auto grid w-full max-w-6xl gap-6 px-6 py-10 md:grid-cols-3">
        <div className="space-y-3">
          <p className="text-lg font-semibold">WARES</p>
          <p className="text-sm text-muted-foreground">
            Accessible STEM robotics components + teacher-friendly documentation.
          </p>
          <p className="text-sm text-muted-foreground">
            Perth, Western Australia
          </p>
        </div>
        <div className="space-y-2 text-sm">
          <p className="font-semibold">Explore</p>
          <div className="flex flex-col gap-2 text-muted-foreground">
            <Link href="/products">Products</Link>
            <Link href="/guides">Guides</Link>
            <Link href="/lessons">Lessons</Link>
            <Link href="/teacher-start-here">Teacher Start Here</Link>
          </div>
        </div>
        <div className="space-y-2 text-sm">
          <p className="font-semibold">Contact</p>
          <p className="text-muted-foreground">sales@warobotics.education</p>
          <div className="flex flex-col gap-2 text-muted-foreground">
            <Link href="/about">About</Link>
            <Link href="/contact">Contact</Link>
          </div>
        </div>
      </div>
      <div className="border-t border-border/60 py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} WARES. All rights reserved.
      </div>
    </footer>
  );
}
