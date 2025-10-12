export default function EmailDetailsTableSkeleton() {
  // Number of skeleton rows you want to display
  const skeletonRows = Array.from({ length: 5 }); // Create an array with 5 empty slots

  return (
    <div className="overflow-x-auto">
      {/* Filters and Page Size Skeleton */}
      <div className="flex justify-between items-center p-4 border-b">
        <div className="flex items-center space-x-4">
          <div className="h-10 w-32 bg-gray-200 rounded-md animate-pulse"></div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="h-4 w-10 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-10 w-16 bg-gray-200 rounded-md animate-pulse"></div>
          <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>

      {/* Table Skeleton */}
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left">
              <div className="h-4 w-4 bg-gray-200 rounded animate-pulse"></div>
            </th>
            <th className="px-6 py-3 text-left">
              <div className="flex items-center space-x-1">
                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 w-4 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </th>
            <th className="px-6 py-3 text-left">
              <div className="flex items-center space-x-1">
                <div className="h-4 w-12 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 w-4 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </th>
            <th className="px-6 py-3 text-left">
              <div className="flex items-center space-x-1">
                <div className="h-4 w-12 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 w-4 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </th>
            <th className="px-6 py-3 text-left">
              <div className="flex items-center space-x-1">
                <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 w-4 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </th>
            <th className="px-6 py-3 text-left">
              <div className="flex items-center space-x-1">
                <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 w-4 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {skeletonRows.map((_, index) => (
            <tr key={index} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="h-4 w-4 bg-gray-200 rounded animate-pulse"></div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="h-4 w-40 bg-gray-200 rounded animate-pulse"></div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="h-6 w-16 bg-gray-200 rounded animate-pulse"></div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Skeleton */}
      <div className="flex items-center justify-between px-6 py-3 bg-white border-t border-gray-200">
        <div className="flex items-center space-x-4">
          <div className="h-4 w-40 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="h-10 w-20 bg-gray-200 rounded-md animate-pulse"></div>
          <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-10 w-20 bg-gray-200 rounded-md animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}
