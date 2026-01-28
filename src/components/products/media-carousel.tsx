"use client";

import Image from "next/image";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import type { MediaImage } from "@/lib/db/types";

export function MediaCarousel({ images }: { images: MediaImage[] }) {
  if (!images.length) return null;
  return (
    <div className="relative">
      <Carousel>
        <CarouselContent>
          {images.map((image) => (
            <CarouselItem key={image.id}>
              <div className="overflow-hidden rounded-2xl border border-border/60 bg-muted/20">
                <Image
                  src={image.storage_path}
                  alt={image.alt_text ?? image.title ?? "WARES product image"}
                  width={image.width ?? 1200}
                  height={image.height ?? 800}
                  unoptimized
                  className="h-80 w-full object-cover"
                />
                {image.caption ? (
                  <div className="border-t border-border/60 bg-background px-4 py-3 text-sm text-muted-foreground">
                    {image.caption}
                  </div>
                ) : null}
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}
