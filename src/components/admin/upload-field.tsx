"use client";

import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";

export function UploadField({
  bucket,
  onUploaded,
}: {
  bucket: "public-images" | "public-pdfs" | "public-models";
  onUploaded: (url: string) => void;
}) {
  return (
    <div className="flex items-center gap-3">
      <Button
        type="button"
        variant="outline"
        onClick={async () => {
          const input = document.createElement("input");
          input.type = "file";
          input.onchange = async () => {
            if (!input.files?.[0]) return;
            const file = input.files[0];
            const supabase = createSupabaseBrowserClient();
            const path = `${crypto.randomUUID()}-${file.name}`;
            const { error } = await supabase.storage.from(bucket).upload(path, file, {
              upsert: true,
            });
            if (error) {
              alert("Upload failed: " + error.message);
              return;
            }
            const { data } = supabase.storage.from(bucket).getPublicUrl(path);
            onUploaded(data.publicUrl);
          };
          input.click();
        }}
      >
        Upload file
      </Button>
    </div>
  );
}
