import { ArrowLeft } from "lucide-react";

export default function CelebrityDetailLoading() {
  return (
    <div className="flex flex-col animate-pulse">
      <div className="container max-w-3xl px-4 pt-6 md:px-6">
        <div className="flex items-center gap-2">
          <ArrowLeft className="size-4 text-muted-foreground" />
          <div className="h-4 w-24 rounded bg-muted" />
        </div>
      </div>
      <article className="container max-w-3xl px-4 py-8 md:px-6">
        <div className="flex items-center gap-4">
          <div className="h-20 w-20 rounded-full bg-muted" />
          <div className="space-y-2">
            <div className="h-7 w-40 rounded bg-muted" />
            <div className="h-4 w-24 rounded bg-muted" />
          </div>
        </div>
        <div className="mt-8 space-y-3">
          <div className="h-4 w-full rounded bg-muted" />
          <div className="h-4 w-full rounded bg-muted" />
          <div className="h-4 w-5/6 rounded bg-muted" />
          <div className="h-4 w-full rounded bg-muted" />
          <div className="h-4 w-3/4 rounded bg-muted" />
        </div>
        <div className="mt-8 space-y-3">
          <div className="h-4 w-full rounded bg-muted" />
          <div className="h-4 w-full rounded bg-muted" />
          <div className="h-4 w-2/3 rounded bg-muted" />
        </div>
        <div className="mt-10 flex gap-4">
          <div className="h-10 w-24 rounded-lg bg-muted" />
          <div className="h-10 w-24 rounded-lg bg-muted" />
        </div>
      </article>
    </div>
  );
}
