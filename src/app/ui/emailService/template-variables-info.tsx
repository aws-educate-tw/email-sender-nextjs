import { FileCode, Tag, Copy, SquareFunction } from "lucide-react";

interface TemplateVariablesInfoProps {
  templateFileName: string;
  templateVariables: string[];
  isLoading: boolean;
  missingVariables?: string[];
}

export default function TemplateVariablesInfo({
  templateFileName,
  templateVariables,
  isLoading,
  missingVariables,
}: TemplateVariablesInfoProps) {
  return (
    <div className="bg-white rounded-xl border-2 border-gray-200 shadow-sm p-6 space-y-6">
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
              <SquareFunction className="w-6 h-6 animate-pulse" />
              <span className="text-sm font-medium">Loading Template Variables...</span>
            </div>
          </div>
        ) : templateVariables.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center mx-auto mb-3">
              <SquareFunction className="w-6 h-6" />
            </div>
            <p className="text-gray-500 text-sm">Template Variables Not Found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {templateVariables.map((variable, index) => {
              const isMissing = missingVariables?.includes(variable);
              return (
                <div
                  key={variable}
                  className={`group relative border rounded-lg p-1 transition-all duration-200 hover:shadow-md ${
                    isMissing ? "bg-red-200 border-red-400" : "bg-gray-200 border-gray-300"
                  }`}
                >
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-6 h-6 text-xs font-bold flex items-center justify-center">
                        {index + 1}
                      </div>
                    </div>
                    <code className="text-sm font-mono px-2 py-1 rounded flex-1 min-w-0 truncate">
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
              );
            })}
          </div>
        )}
        {missingVariables && missingVariables.length > 0 && (
          <p className="mt-4 text-sm text-red-600 font-medium">
            ⚠️ Spreadsheet 缺少 {missingVariables.length} 個參數
          </p>
        )}
      </div>
    </div>
  );
}
