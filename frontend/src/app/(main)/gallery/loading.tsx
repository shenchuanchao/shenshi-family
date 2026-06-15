import { Camera } from "lucide-react";

export default function GalleryLoading() {
  return (
    <div className="flex flex-col animate-pulse">
      <section className="bg-gradient-to-b from-cream to-background py-12 md:py-16">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center text-center">
            <Camera className="h-10 w-10 text-warm-wood" />
            <div className="mt-4 h-8 w-40 rounded bg-muted" />
            <div className="mt-3 h-4 w-64 rounded bg-muted" />
          </div>
        </div>
      </section>
      <section className="container px-4 py-8 md:px-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="space-y-2">
              <div className="aspect-square rounded-xl bg-muted" />
              <div className="h-4 w-3/4 rounded bg-muted" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
