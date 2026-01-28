import type { MediaYoutube } from "@/lib/db/types";

function getEmbedUrl(url: string) {
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes("youtu.be")) {
      const id = parsed.pathname.replace("/", "");
      return `https://www.youtube.com/embed/${id}`;
    }
    const id = parsed.searchParams.get("v");
    if (id) return `https://www.youtube.com/embed/${id}`;
  } catch {
    return null;
  }
  return null;
}

export function YoutubeEmbed({ video }: { video: MediaYoutube }) {
  const embedUrl = getEmbedUrl(video.youtube_url);
  if (!embedUrl) return null;
  return (
    <div className="overflow-hidden rounded-xl border border-border/60">
      <iframe
        src={embedUrl}
        title={video.title}
        className="h-[420px] w-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}
