import { Users } from "lucide-react";

export default function CelebritiesLoading() {
  return (
    <div className="flex flex-col animate-pulse">
      <section className="bg-gradient-to-b from-cream to-background py-12 md:py-16">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center text-center">
            <Users className="h-10 w-10 text-warm-wood" />
            <h1 className="mt-4 font-heading text-3xl font-bold tracking-tight md:text-4xl">
              沈氏名人堂
            </h1>
            <p className="mt-3 max-w-xl text-muted-foreground">
              千年传承，群星璀璨 —— 记录沈氏历史上的杰出人物
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
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-muted" />
                <div className="flex-1 space-y-2">
                  <div className="h-5 w-20 rounded bg-muted" />
                  <div className="h-3 w-16 rounded bg-muted" />
                </div>
              </div>
              <div className="mt-4 space-y-2">
                <div className="h-4 w-full rounded bg-muted" />
                <div className="h-4 w-4/5 rounded bg-muted" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
