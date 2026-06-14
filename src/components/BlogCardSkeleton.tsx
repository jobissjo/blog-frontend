export function BlogCardSkeleton() {
  return (
    <div className="rounded-xl overflow-hidden border border-border bg-card animate-pulse">
      {/* Thumbnail */}
      <div className="h-44 w-full bg-muted" />

      <div className="p-4 space-y-3">
        {/* Tag pill */}
        <div className="h-5 w-16 rounded-full bg-muted" />

        {/* Title */}
        <div className="space-y-2">
          <div className="h-4 w-full rounded bg-muted" />
          <div className="h-4 w-3/4 rounded bg-muted" />
        </div>

        {/* Description */}
        <div className="space-y-2 pt-1">
          <div className="h-3 w-full rounded bg-muted" />
          <div className="h-3 w-11/12 rounded bg-muted" />
          <div className="h-3 w-2/3 rounded bg-muted" />
        </div>

        {/* Footer: avatar + meta + read time */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-full bg-muted" />
            <div className="space-y-1">
              <div className="h-2.5 w-20 rounded bg-muted" />
              <div className="h-2.5 w-14 rounded bg-muted" />
            </div>
          </div>
          <div className="h-2.5 w-12 rounded bg-muted" />
        </div>
      </div>
    </div>
  )
}