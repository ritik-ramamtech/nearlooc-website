export default function OfferDetailSkeleton() {
  return (
    <div className="min-h-screen bg-gray-100 py-4 animate-pulse">
      <div className="mx-auto px-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-7 w-40 rounded bg-gray-200" />
            <div className="h-4 w-56 rounded bg-gray-200" />
          </div>

          <div className="h-10 w-32 rounded-lg bg-gray-200" />
        </div>

        {/* Hero */}
        <div className="flex gap-10 rounded-2xl bg-white px-6 py-5 shadow">
          <div className="h-36 w-36 rounded-xl bg-gray-200" />

          <div className="flex-1 space-y-4">
            <div className="h-7 w-72 rounded bg-gray-200" />

            <div className="flex gap-2">
              <div className="h-4 w-24 rounded bg-gray-200" />
              <div className="h-4 w-24 rounded bg-gray-200" />
            </div>

            <div className="h-5 w-56 rounded bg-gray-200" />

            <div className="flex items-center gap-4">
              <div className="h-8 w-24 rounded bg-gray-200" />
              <div className="h-6 w-20 rounded bg-gray-200" />
              <div className="h-7 w-20 rounded-full bg-gray-200" />
            </div>
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <InfoCardSkeleton rows={6} />
          <InfoCardSkeleton rows={4} />
          <InfoCardSkeleton rows={4} />
        </div>

        {/* Description */}
        <SectionSkeleton lines={10} />

        {/* Terms + Highlights */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <TermsSkeleton />
          <HighlightsSkeleton />
        </div>
      </div>
    </div>
  );
}

function InfoCardSkeleton({ rows }: { rows: number }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center gap-3">
        <div className="h-9 w-9 rounded-lg bg-gray-200" />
        <div className="h-6 w-40 rounded bg-gray-200" />
      </div>

      <div className="space-y-5">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex items-center justify-between">
            <div className="h-4 w-24 rounded bg-gray-200" />
            <div className="h-4 w-20 rounded bg-gray-200" />
          </div>
        ))}
      </div>
    </div>
  );
}

function SectionSkeleton({ lines }: { lines: number }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-center gap-3">
        <div className="h-9 w-9 rounded-lg bg-gray-200" />
        <div className="h-6 w-36 rounded bg-gray-200" />
      </div>

      <div className="space-y-4 rounded-xl border border-gray-200 bg-gray-50 p-6">
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={`h-4 rounded bg-gray-200 ${
              i % 5 === 4
                ? "w-7/12"
                : i % 3 === 0
                ? "w-11/12"
                : "w-full"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

function TermsSkeleton() {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-center gap-3">
        <div className="h-9 w-9 rounded-lg bg-gray-200" />
        <div className="h-6 w-48 rounded bg-gray-200" />
      </div>

      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="h-2 w-2 rounded-full bg-gray-200" />
            <div className="h-4 flex-1 rounded bg-gray-200" />
          </div>
        ))}
      </div>
    </div>
  );
}

function HighlightsSkeleton() {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-center gap-3">
        <div className="h-9 w-9 rounded-lg bg-gray-200" />
        <div className="h-6 w-32 rounded bg-gray-200" />
      </div>

      <div className="flex flex-wrap gap-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="h-9 rounded-full bg-gray-200"
            style={{ width: `${70 + (i % 3) * 20}px` }}
          />
        ))}
      </div>
    </div>
  );
}