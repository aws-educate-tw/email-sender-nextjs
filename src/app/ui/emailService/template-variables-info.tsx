import { FileCode, Tag, Copy } from "lucide-react";

interface TemplateVariablesInfoProps {
  templateFileName: string;
  templateVariables: string[];
  isLoading: boolean;
}

export default function TemplateVariablesInfo({
  templateFileName,
  templateVariables,
  isLoading,
}: TemplateVariablesInfoProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-6">
      {/* 標題區域 */}
      <div className="flex items-center justify-start gap-6">
        <div className="flex items-center gap-2">
          <FileCode className="w-8 h-8 text-950" />
          <h3 className="text-lg font-semibold text-gray-900">Selected Template File</h3>
          <p className="text-white bg-sky-950 font-mono text-xs rounded-full px-2 py-1 inline-block">
            {templateFileName}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Tag className="w-8 h-8 text-sky-950" />
          <h4 className="font-medium text-gray-900">Extracted Template Variables</h4>
          {!isLoading && (
            <span className="text-white bg-sky-950 text-xs font-medium px-2 py-1 rounded-full">
              {templateVariables.length} 個 Variables
            </span>
          )}
        </div>
      </div>

      <div>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="flex items-center space-x-3 text-gray-500">
              <svg
                className="animate-spin h-6 w-6 text-blue-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              <span className="text-sm font-medium">正在加載 Template Variables...</span>
            </div>
          </div>
        ) : templateVariables.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <svg
                className="w-6 h-6 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-2.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 009.586 13H7"
                />
              </svg>
            </div>
            <p className="text-gray-500 text-sm">未找到 Template Variables</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {templateVariables.map((variable, index) => (
              <div
                key={variable}
                className="group relative bg-gray-200 border border-gray-300 rounded-lg p-1 transition-all duration-200 hover:shadow-md"
              >
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-6 h-6 text-xs font-bold flex items-center justify-center">
                      {index + 1}
                    </div>
                  </div>
                  <code className="text-sm font-mono px-2 py-1 rounded border flex-1 min-w-0 truncate">
                    {variable}
                  </code>
                  <button
                    onClick={() => navigator.clipboard.writeText(variable)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1 rounded"
                    title="複製變量"
                  >
                    <Copy className="w-4 h-4 text-black active:text-gray-500" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
