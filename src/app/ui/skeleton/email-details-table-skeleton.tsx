export default function EmailDetailsTableSkeleton() {
  // Number of skeleton rows you want to display
  const skeletonRows = Array.from({ length: 5 }); // Create an array with 5 empty slots

  return (
    <div className="overflow-x-auto shadow-lg rounded-md">
      <table className="w-full bg-white rounded-md">
        <thead>
          <tr>
            <th className="rounded-tl-md py-2 px-4 bg-gray-200 text-left text-md font-medium text-gray-700 tracking-wider">
              Recipient Email
            </th>
            <th className="py-2 px-4 bg-gray-200 text-left text-md font-medium text-gray-700 tracking-wider">
              BCC
            </th>
            <th className="py-2 px-4 bg-gray-200 text-left text-md font-medium text-gray-700 tracking-wider">
              CC
            </th>
            <th className="py-2 px-4 w-24 bg-gray-200 text-left text-md font-medium text-gray-700 tracking-wider">
              Status
            </th>
            <th className="rounded-tr-md py-2 px-4 bg-gray-200 text-left text-md font-medium text-gray-700 tracking-wider">
              Sent At
            </th>
          </tr>
        </thead>
        <tbody>
          {skeletonRows.map((_, index) => (
            <tr
              key={index}
              className={`${index !== 0 ? "border-t border-gray-200" : ""}`}
            >
              <td className="py-2 px-4 text-sm">
                <div className="bg-gray-200 h-4 rounded-md animate-pulse"></div>
              </td>
              <td className="py-2 px-4 text-sm">
                <div className="bg-gray-200 h-4 rounded-md animate-pulse"></div>
              </td>
              <td className="py-2 px-4 text-sm">
                <div className="flex flex-col gap-2">
                  <div className="bg-gray-200 h-4 w-full rounded-md animate-pulse"></div>
                  <div className="bg-gray-200 h-4 w-full rounded-md animate-pulse"></div>
                  <div className="bg-gray-200 h-4 w-full rounded-md animate-pulse"></div>
                </div>
              </td>
              <td className="py-2 px-4 text-sm">
                <div className="bg-gray-200 w-20 h-6 rounded-full animate-pulse"></div>
              </td>
              <td className="py-2 px-4 text-sm">
                <div className="bg-gray-200 h-4 rounded-md animate-pulse"></div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
