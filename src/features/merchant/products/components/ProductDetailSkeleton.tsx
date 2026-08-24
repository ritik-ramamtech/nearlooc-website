export default function ProductDetailSkeleton() {
  return (
    <div className="space-y-6 p-8 bg-slate-100 animate-pulse">
      {/* Header */}
      <div className="rounded-3xl border border-gray-200 bg-white px-6 py-4 shadow-sm">
        <div className="h-4 w-10 bg-gray-200 rounded-2xl"></div>

        <div className="flex justify-between items-start mt-8">
          <div>
            <div className="h-6 w-56 bg-gray-200 rounded-2xl"></div>
            <div className="flex mt-4 gap-8">
              <div className="flex flex-col gap-2">
                <div className="h-4 w-16 bg-gray-200 rounded-2xl"></div>
                <div className="h-4 w-16 bg-gray-200 rounded-2xl"></div>
              </div>
              <div className="flex flex-col gap-2">
                <div className="h-4 w-16 bg-gray-200 rounded-2xl"></div>
                <div className="h-4 w-16 bg-gray-200 rounded-2xl"></div>
              </div>
            </div>
            <div className="w-36 h-6 bg-gray-200 rounded-2xl mt-4"></div>

            <div className="mt-3 flex gap-6">
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 bg-gray-200 rounded" />
                <div className="flex flex-col gap-1">
                  <div className="h-4 w-16 bg-gray-200 rounded-2xl"></div>
                  <div className="h-4 w-20 bg-gray-200 rounded-2xl"></div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 bg-gray-200 rounded" />
                <div className="flex flex-col gap-1">
                  <div className="h-4 w-16 bg-gray-200 rounded-2xl"></div>
                  <div className="h-4 w-20 bg-gray-200 rounded-2xl"></div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="h-10 w-32 bg-gray-200 rounded-xl"></div>
            <div className="h-10 w-32 bg-gray-200 rounded-xl"></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Left Card */}
        <div className="col-span-4 h-80 rounded-3xl border border-gray-200 bg-white p-7 shadow-sm">
          <div className="animate-pulse space-y-5">
            <div className="flex items-center gap-4">
              <div className="h-11 w-11 rounded-2xl bg-gray-200" />

              <div className="space-y-2">
                <div className="h-5 w-36 rounded bg-gray-200" />
                <div className="h-4 w-48 rounded bg-gray-200" />
              </div>
            </div>

            <div className="space-y-4">
              <div className="h-12 rounded-2xl bg-gray-100" />
              <div className="h-12 rounded-2xl bg-gray-100" />
              <div className="h-12 rounded-2xl bg-gray-100" />
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="col-span-8 rounded-3xl border border-gray-200 bg-white p-7 shadow-sm">
          <div className="animate-pulse">
            {/* Header */}
            <div className="mb-5 flex items-center gap-3">
              <div className="h-11 w-11 rounded-2xl bg-gray-200" />

              <div className="space-y-2">
                <div className="h-5 w-40 rounded bg-gray-200" />
                <div className="h-4 w-64 rounded bg-gray-200" />
              </div>
            </div>

            {/* Description Box */}
            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6">
              <div className="space-y-4">
                <div className="h-4 w-full rounded bg-gray-200" />
                <div className="h-4 w-11/12 rounded bg-gray-200" />
                <div className="h-4 w-full rounded bg-gray-200" />
                <div className="h-4 w-10/12 rounded bg-gray-200" />
                <div className="h-4 w-8/12 rounded bg-gray-200" />

                <div className="pt-2" />

                <div className="h-5 w-48 rounded bg-gray-200" />

                <div className="h-4 w-full rounded bg-gray-200" />
                <div className="h-4 w-9/12 rounded bg-gray-200" />
                <div className="h-4 w-7/12 rounded bg-gray-200" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
