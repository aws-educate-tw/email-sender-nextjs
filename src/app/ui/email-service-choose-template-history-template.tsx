import React, { useState, useEffect } from "react";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { fetchHistoryTemplates } from "@/lib/actions";
import { useEmailContext } from "@/app/context/EmailContext";
import { convertToTaipeiTime } from "@/lib/utils/dataUtils";
import { formatFileSize } from "@/lib/utils/dataUtils";

interface TemplateItem {
  file_id: string;
  file_name: string;
  uploader_id: string;
  created_at: string;
  file_url: string;
  file_size: number;
}

interface HistoryTemplateProps {
  onNext: () => void;
  onBack?: () => void;
}

export const EmailServiceChooseTemplateHistoryTemplate: React.FC<HistoryTemplateProps> = ({
  onNext,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [templates, setTemplates] = useState<TemplateItem[]>([]);
  const [filteredTemplates, setFilteredTemplates] = useState<TemplateItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [previousLastEvaluatedKey, setPreviousLastEvaluatedKey] = useState<string | null>(null);
  const [, setCurrentLastEvaluatedKey] = useState<string | null>(null);
  const [nextLastEvaluatedKey, setNextLastEvaluatedKey] = useState<string | null>(null);

  const { updateTemplate } = useEmailContext();

  useEffect(() => {
    if (templates.length > 0) {
      setFilteredTemplates(
        templates.filter(template =>
          template.file_name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    } else {
      setFilteredTemplates([]);
    }
  }, [searchQuery, templates]);

  const fetchTemplates = async (limit: number = 10, lastEvaluatedKey: string | null = null) => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        setError("You must be logged in to view templates");
        setIsLoading(false);
        return;
      }

      const response = await fetchHistoryTemplates(token, limit, lastEvaluatedKey);

      if (response.status === "error") {
        setError(response.message);
      } else {
        setTemplates(response.templates);
        setPreviousLastEvaluatedKey(response.previousLastEvaluatedKey);
        setCurrentLastEvaluatedKey(response.currentLastEvaluatedKey);
        setNextLastEvaluatedKey(response.nextLastEvaluatedKey);
        setError(null);
      }
    } catch (err: any) {
      console.error("Failed to fetch templates:", err);
      setError("Failed to load templates. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  const handleSelectTemplate = (template: TemplateItem) => {
    updateTemplate(template.file_id, template.file_name, undefined, template.file_url);
    setSelectedTemplate(template.file_id);
  };

  const handlePrevious = () => {
    if (previousLastEvaluatedKey) {
      fetchTemplates(10, previousLastEvaluatedKey);
    }
  };

  const handleNext = () => {
    if (nextLastEvaluatedKey) {
      fetchTemplates(10, nextLastEvaluatedKey);
    }
  };

  return (
    <Card className="w-full max-w-full mt-2">
      <div className="bg-white rounded-lg p-6 mt-2">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">History Templates</h2>
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search templates..."
              className="pl-10 pr-4 py-2 border rounded-lg w-64"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <svg
              className="animate-spin -ml-1 mr-3 h-8 w-8 text-gray-500"
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
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291l-1.497-1.32A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <span className="ml-2 text-gray-500">Loading templates...</span>
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-700 p-4 rounded-md mb-4">
            <p>{error}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            {filteredTemplates.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                {searchQuery ? "No templates match your search." : "No templates available."}
              </div>
            ) : (
              <table className="w-full bg-white shadow-md rounded-md">
                <thead>
                  <tr className="bg-neutral-100 rounded-t-md">
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                      Template Name
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                      Created At
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                      File Size
                    </th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTemplates.map(template => (
                    <tr
                      key={template.file_id}
                      className={`border-t hover:bg-gray-50 ${
                        selectedTemplate === template.file_id ? "bg-blue-50/10" : ""
                      }`}
                    >
                      <td className="py-2 px-4 border-b border-gray-200 max-w-96 break-words">
                        {template.file_name}
                      </td>
                      <td className="py-2 px-4 border-b border-gray-200">
                        {convertToTaipeiTime(template.created_at)}
                      </td>
                      <td className="py-2 px-4 border-b border-gray-200">
                        {formatFileSize(template.file_size)}
                      </td>
                      <td className="py-2 px-4 border-b border-gray-200 text-right">
                        {selectedTemplate === template.file_id ? (
                          <button className="px-4 py-1 bg-green-500 text-white font-medium rounded hover:bg-green-600">
                            Selected
                          </button>
                        ) : (
                          <button
                            className="px-4 py-1 bg-white border border-gray-300 rounded hover:bg-gray-50"
                            onClick={() => handleSelectTemplate(template)}
                          >
                            Use
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            <div className="flex justify-end gap-8 pt-3 pb-1 px-2">
              <button
                className={`flex items-center gap-1 ${
                  !previousLastEvaluatedKey
                    ? "cursor-default text-gray-400"
                    : "hover:text-gray-600 hover:underline"
                }`}
                onClick={handlePrevious}
                disabled={!previousLastEvaluatedKey}
              >
                <ChevronLeft size={20} />
                Previous
              </button>
              <button
                className={`flex items-center gap-1 ${
                  !nextLastEvaluatedKey
                    ? "cursor-default text-gray-400"
                    : "hover:text-gray-600 hover:underline"
                }`}
                onClick={handleNext}
                disabled={!nextLastEvaluatedKey}
              >
                Next
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        )}

        <div className="flex justify-between mt-6">
          <div>
            <button
              className={`px-6 py-2 rounded text-white ${
                selectedTemplate
                  ? "bg-[#1a2f4a] hover:bg-[#48596e] cursor-pointer"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
              onClick={onNext}
              disabled={!selectedTemplate}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </Card>
  );
};
