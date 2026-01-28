import type { CadEmbed } from "@/lib/db/types";

const allowedHosts = ["onshape.com", "cad.onshape.com"];

export function CadEmbedViewer({ embed }: { embed: CadEmbed }) {
  let hostAllowed = false;
  try {
    const url = new URL(embed.embed_url);
    hostAllowed = allowedHosts.some((host) => url.host.endsWith(host));
  } catch {
    hostAllowed = false;
  }

  if (!hostAllowed) {
    return (
      <div className="rounded-xl border border-border/60 bg-muted/40 p-4 text-sm text-muted-foreground">
        Invalid or unapproved CAD embed URL.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border/60">
      <iframe
        src={embed.embed_url}
        title={embed.title}
        className="h-[520px] w-full"
        allowFullScreen
      />
    </div>
  );
}
