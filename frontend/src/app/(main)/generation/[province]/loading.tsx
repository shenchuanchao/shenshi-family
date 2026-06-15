import { ArrowLeft, BookOpen } from "lucide-react";

export default function GenerationProvinceLoading() {
  return (
    <div className="flex flex-col animate-pulse">
      <div className="container max-w-4xl px-4 pt-6 md:px-6">
        <div className="flex items-center gap-2">
          <ArrowLeft className="size-4 text-muted-foreground" />
          <div className="h-4 w-24 rounded bg-muted" />
        </div>
      </div>
      <section className="bg-gradient-to-b from-cream to-background py-12 md:py-16">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center text-center">
            <BookOpen className="h-10 w-10 text-warm-wood" />
            <div className="mt-4 h-8 w-64 rounded bg-muted" />
            <div className="mt-3 h-4 w-80 rounded bg-muted" />
          </div>
        </div>
      </section>
      <section className="container max-w-4xl px-4 py-8 md:px-6">
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="rounded-xl bg-card p-5 ring-1 ring-foreground/10"
            >
              <div className="flex flex-wrap gap-3">
                <div className="h-5 w-20 rounded bg-muted" />
                <div className="h-5 w-20 rounded bg-muted" />
                <div className="h-5 w-20 rounded bg-muted" />
              </div>
              <div className="mt-3 h-4 w-3/4 rounded bg-muted" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
