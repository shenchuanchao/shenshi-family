import { ArrowLeft } from "lucide-react";

export default function ForumDetailLoading() {
  return (
    <div className="flex flex-col animate-pulse">
      <div className="container max-w-3xl px-4 pt-6 md:px-6">
        <div className="flex items-center gap-2">
          <ArrowLeft className="size-4 text-muted-foreground" />
          <div className="h-4 w-24 rounded bg-muted" />
        </div>
      </div>
      <article className="container max-w-3xl px-4 py-8 md:px-6">
        <div className="h-7 w-3/4 rounded bg-muted" />
        <div className="mt-4 flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-muted" />
          <div className="space-y-1">
            <div className="h-4 w-20 rounded bg-muted" />
            <div className="h-3 w-28 rounded bg-muted" />
          </div>
        </div>
        <div className="mt-6 space-y-3">
          <div className="h-4 w-full rounded bg-muted" />
          <div className="h-4 w-full rounded bg-muted" />
          <div className="h-4 w-5/6 rounded bg-muted" />
          <div className="h-4 w-full rounded bg-muted" />
          <div className="h-4 w-3/4 rounded bg-muted" />
        </div>
        <div className="mt-8 border-t pt-6">
          <div className="h-5 w-24 rounded bg-muted" />
          <div className="mt-4 space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-lg bg-muted/30 p-4">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-muted" />
                  <div className="space-y-1">
                    <div className="h-3 w-16 rounded bg-muted" />
                    <div className="h-3 w-24 rounded bg-muted" />
                  </div>
                </div>
                <div className="mt-2 h-4 w-4/5 rounded bg-muted" />
              </div>
            ))}
          </div>
        </div>
      </article>
    </div>
  );
}
