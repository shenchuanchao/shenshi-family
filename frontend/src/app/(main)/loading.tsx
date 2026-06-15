export default function HomeLoading() {
  return (
    <div className="flex flex-col animate-pulse">
      {/* Hero skeleton */}
      <section className="bg-gradient-to-br from-cream via-cream-dark to-warm-wood-light/20 py-20 md:py-32">
        <div className="container relative z-10 px-4 md:px-6">
          <div className="flex flex-col items-center text-center">
            <div className="h-12 w-64 rounded-lg bg-muted" />
            <div className="mt-6 h-5 w-80 rounded bg-muted" />
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <div className="h-11 w-36 rounded-lg bg-muted" />
              <div className="h-11 w-36 rounded-lg bg-muted" />
            </div>
          </div>
        </div>
      </section>

      {/* Quick nav cards skeleton */}
      <section className="py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="mx-auto h-8 w-48 rounded-lg bg-muted" />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="rounded-xl bg-card p-5 ring-1 ring-foreground/10"
              >
                <div className="h-8 w-8 rounded bg-muted" />
                <div className="mt-4 h-5 w-20 rounded bg-muted" />
                <div className="mt-3 h-4 w-full rounded bg-muted" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest articles skeleton */}
      <section className="bg-light-gray py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="flex items-center justify-between">
            <div className="h-8 w-32 rounded bg-muted" />
            <div className="h-4 w-16 rounded bg-muted" />
          </div>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="rounded-xl bg-card p-5 ring-1 ring-foreground/10"
              >
                <div className="h-5 w-3/4 rounded bg-muted" />
                <div className="mt-3 space-y-2">
                  <div className="h-4 w-full rounded bg-muted" />
                  <div className="h-4 w-2/3 rounded bg-muted" />
                </div>
                <div className="mt-4 flex gap-4">
                  <div className="h-3 w-16 rounded bg-muted" />
                  <div className="h-3 w-16 rounded bg-muted" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
