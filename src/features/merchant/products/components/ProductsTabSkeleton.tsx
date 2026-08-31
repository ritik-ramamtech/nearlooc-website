import { Skeleton } from "@/components/ui/skeleton";

export function ProductsTabSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-4 text-left">
              <Skeleton className="h-4 w-20" />
            </th>
            <th className="px-4 py-4 text-left">
              <Skeleton className="h-4 w-16" />
            </th>
            <th className="px-4 py-4 text-left">
              <Skeleton className="h-4 w-16" />
            </th>
            <th className="px-4 py-4 text-left">
              <Skeleton className="h-4 w-20" />
            </th>
            <th className="px-4 py-4 text-left">
              <Skeleton className="h-4 w-14" />
            </th>
            <th className="px-6 py-4 text-right">
              <Skeleton className="ml-auto h-4 w-16" />
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-100">
          {Array.from({ length: 8 }).map((_, index) => (
            <tr key={index}>
              {/* Product */}
              <td className="px-6 py-4">
                <div className="flex items-center gap-4">
                  <Skeleton className="h-14 w-14 rounded-xl" />

                  <div className="space-y-2">
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-3 w-56" />
                  </div>
                </div>
              </td>

              {/* Category */}
              <td className="px-4 py-4">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </td>

              {/* Price */}
              <td className="px-4 py-4">
                <Skeleton className="h-4 w-16" />
              </td>

              {/* Locations */}
              <td className="px-4 py-4">
                <Skeleton className="h-6 w-24 rounded-full" />
              </td>

              {/* Status */}
              <td className="px-4 py-4">
                <Skeleton className="h-6 w-20 rounded-full" />
              </td>

              {/* Actions */}
              <td className="px-6 py-4">
                <div className="flex justify-end gap-2">
                  <Skeleton className="h-9 w-16 rounded-lg" />
                  <Skeleton className="h-9 w-9 rounded-lg" />
                  <Skeleton className="h-9 w-9 rounded-lg" />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}