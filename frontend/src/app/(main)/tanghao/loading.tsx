import { Landmark } from "lucide-react";

export default function TanghaoLoading() {
  return (
    <div className="flex flex-col animate-pulse">
      <section className="bg-gradient-to-b from-cream to-background py-12 md:py-16">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center text-center">
            <Landmark className="h-10 w-10 text-warm-wood" />
            <h1 className="mt-4 font-heading text-3xl font-bold tracking-tight md:text-4xl">
              沈氏堂号百科
            </h1>
            <p className="mt-3 max-w-xl text-muted-foreground">
              探索沈氏各堂号的由来与历史
            </p>
          </div>
        </div>
      </section>
      <section className="container px-4 py-8 md:px-6">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="rounded-xl bg-card p-5 ring-1 ring-foreground/10"
            >
              <div className="h-6 w-28 rounded bg-muted" />
              <div className="mt-3 space-y-2">
                <div className="h-4 w-full rounded bg-muted" />
                <div className="h-4 w-4/5 rounded bg-muted" />
                <div className="h-4 w-2/3 rounded bg-muted" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
