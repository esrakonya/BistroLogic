// Dosya Yolu: src/components/skeletons/TableSkeleton.tsx

/**
 * SkeletonRow Component
 * Matches the exact height and spacing of the actual table rows 
 * to prevent Layout Shift (CLS).
 */
const SkeletonRow = () => (
  <tr className="animate-pulse border-b border-neutral-50 last:border-none">
    {/* Product Image / ID Thumbnail */}
    <td className="px-8 py-5 whitespace-nowrap">
      <div className="flex items-center gap-4">
        <div className="h-14 w-14 bg-neutral-200 rounded-2xl"></div>
        <div className="space-y-2">
          <div className="h-4 bg-neutral-200 rounded w-32"></div>
          <div className="h-2 bg-neutral-100 rounded w-16"></div>
        </div>
      </div>
    </td>
    {/* Category Selection */}
    <td className="px-8 py-5 whitespace-nowrap">
      <div className="h-6 bg-neutral-100 rounded-full w-24"></div>
    </td>
    {/* Price / Content Value */}
    <td className="px-8 py-5 whitespace-nowrap">
      <div className="h-4 bg-neutral-200 rounded w-16"></div>
    </td>
    {/* Action Buttons */}
    <td className="px-8 py-5 whitespace-nowrap text-right">
      <div className="flex justify-end gap-3">
        <div className="h-9 w-9 bg-neutral-100 rounded-xl"></div>
        <div className="h-9 w-9 bg-neutral-100 rounded-xl"></div>
      </div>
    </td>
  </tr>
);

export default function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="bg-white rounded-3xl border border-neutral-100 shadow-sm overflow-hidden">
      <table className="min-w-full border-separate border-spacing-0">
        <thead>
          <tr className="bg-neutral-50/50">
            <th className="px-8 py-5 text-left text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em] border-b border-neutral-100">
              Loading Details
            </th>
            <th className="px-8 py-5 text-left text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em] border-b border-neutral-100">
              Category
            </th>
            <th className="px-8 py-5 text-left text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em] border-b border-neutral-100">
              Value
            </th>
            <th className="px-8 py-5 text-right text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em] border-b border-neutral-100">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-50">
          {Array.from({ length: rows }).map((_, index) => (
            <SkeletonRow key={index} />
          ))}
        </tbody>
      </table>
    </div>
  );
}