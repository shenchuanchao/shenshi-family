import { Newspaper } from "lucide-react";

export default function NewsLoading() {
  return (
    <div className="flex flex-col animate-pulse">
      <section className="bg-gradient-to-b from-cream to-background py-12 md:py-16">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center text-center">
            <div className="mb-4 flex size-14 items-center justify-center rounded-full bg-warm-wood/15">
              <Newspaper className="size-7 text-warm-wood" />
            </div>
            <h1 className="font-heading text-3xl font-bold tracking-tight text-dai-green md:text-4xl">
              最新动态
            </h1>
            <p className="mt-3 max-w-xl text-muted-foreground">
              了解沈氏宗亲会的最新资讯与活动
            </p>
          </div>
        </div>
      </section>
      <section className="container max-w-4xl px-4 py-8 md:px-6">
        <div className="space-y-6">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="rounded-xl bg-card p-5 ring-1 ring-foreground/10"
            >
              <div className="flex gap-4">
                <div className="h-20 w-28 shrink-0 rounded-lg bg-muted" />
                <div className="flex-1 space-y-2">
                  <div className="h-5 w-3/4 rounded bg-muted" />
                  <div className="h-4 w-full rounded bg-muted" />
                  <div className="h-4 w-2/3 rounded bg-muted" />
                  <div className="flex gap-4 pt-1">
                    <div className="h-3 w-20 rounded bg-muted" />
                    <div className="h-3 w-16 rounded bg-muted" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
