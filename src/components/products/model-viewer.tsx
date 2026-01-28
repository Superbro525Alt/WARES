"use client";

import { useEffect } from "react";
import type { Model3d } from "@/lib/db/types";

export function ModelViewer({ model }: { model: Model3d }) {
  useEffect(() => {
    if (customElements.get("model-viewer")) return;
    const script = document.createElement("script");
    script.type = "module";
    script.src = "https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js";
    document.head.appendChild(script);
  }, []);

  return (
    <div className="overflow-hidden rounded-xl border border-border/60 bg-muted/30">
      {/* @ts-expect-error model-viewer web component */}
      <model-viewer
        src={model.storage_path}
        alt={model.title}
        camera-controls
        ar
        auto-rotate
        style={{ width: "100%", height: "480px" }}
      />
      {model.notes_md ? (
        <div className="border-t border-border/60 bg-background px-4 py-3 text-sm text-muted-foreground">
          {model.notes_md}
        </div>
      ) : null}
    </div>
  );
}
