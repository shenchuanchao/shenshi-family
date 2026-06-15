import { MessageSquare } from "lucide-react";

export default function ForumLoading() {
  return (
    <div className="flex flex-col animate-pulse">
      <section className="bg-gradient-to-b from-cream to-background py-12 md:py-16">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center text-center">
            <div className="mb-4 flex size-14 items-center justify-center rounded-full bg-warm-wood/15">
              <MessageSquare className="size-7 text-warm-wood" />
            </div>
            <h1 className="font-heading text-3xl font-bold tracking-tight text-dai-green md:text-4xl">
              沈氏留言墙
            </h1>
            <p className="mt-3 max-w-xl text-muted-foreground">
              宗亲交流、寻根问祖的温暖家园
            </p>
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
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-muted" />
                <div className="space-y-1">
                  <div className="h-4 w-20 rounded bg-muted" />
                  <div className="h-3 w-28 rounded bg-muted" />
                </div>
              </div>
              <div className="mt-3 h-5 w-2/3 rounded bg-muted" />
              <div className="mt-2 space-y-2">
                <div className="h-4 w-full rounded bg-muted" />
                <div className="h-4 w-4/5 rounded bg-muted" />
              </div>
              <div className="mt-4 flex gap-4">
                <div className="h-3 w-16 rounded bg-muted" />
                <div className="h-3 w-16 rounded bg-muted" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
