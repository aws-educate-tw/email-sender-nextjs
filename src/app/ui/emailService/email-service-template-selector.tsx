"use client";
import { useState, useEffect } from "react";
import { ChevronRight, ChevronLeft, FileText, RefreshCw } from "lucide-react";
import { convertToTaipeiTime } from "@/lib/utils/dataUtils";

interface FileDataType {
  file_id: string;
  created_at: string;
  updated_at: string;
  file_url: string;
  file_name: string;
  file_extension: string;
  file_size: number;
  uploader_id: string;
}

interface EmailServiceTemplateSelectorProps {
  onTemplateSelect: (
    templateFileName: string,
    templateFileId: string,
    templateFileUrl: string
  ) => void;
  onNext: () => void;
}

export default function EmailServiceTemplateSelector({
  onTemplateSelect,
  onNext,
}: EmailServiceTemplateSelectorProps) {
  const fileExtension = "html";
  const [content, setContent] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<FileDataType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [options, setOptions] = useState<FileDataType[] | null>(null);

  // Pagination
  const [evaluatedKeyStack, setEvaluatedKeyStack] = useState<(string | null)[]>([null]);
  const [pageIndex, setPageIndex] = useState(0);
  const [, setCurrentLastEvaluatedKey] = useState<string | null>(null);
  const [nextLastEvaluatedKey, setNextLastEvaluatedKey] = useState<string | null>(null);

  const fetchFiles = async (
    ext: string,
    limit: number,
    lastEvaluatedKey: string | null,
    direction: "next" | "prev" | "reset" = "reset"
  ) => {
    try {
      setIsLoading(true);
      const base_url = process.env.NEXT_PUBLIC_API_ENDPOINT;
      const url = new URL(`${base_url}/files`);
      url.searchParams.append("file_extension", ext);
      url.searchParams.append("limit", limit.toString());
      if (lastEvaluatedKey) url.searchParams.append("last_evaluated_key", lastEvaluatedKey);

      const token = localStorage.getItem("access_token");
      const response = await fetch(url.toString(), {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch files");

      const result = await response.json();
      setOptions(result.data);
      setCurrentLastEvaluatedKey(result.current_last_evaluated_key);
      setNextLastEvaluatedKey(result.next_last_evaluated_key);

      setEvaluatedKeyStack(prevStack => {
        if (direction === "next") {
          return [...prevStack, lastEvaluatedKey];
        } else if (direction === "prev") {
          return prevStack.slice(0, -1);
        } else {
          return [null]; // reset
        }
      });

      if (direction === "next") {
        setPageIndex(prev => prev + 1);
      } else if (direction === "prev") {
        setPageIndex(prev => Math.max(prev - 1, 0));
      } else {
        setPageIndex(0);
      }
    } catch (err: any) {
      alert("Failed to load templates: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles(fileExtension, 5, null, "reset");
  }, []);

  useEffect(() => {
    const fetchHtmlContent = async () => {
      if (selectedTemplate?.file_url) {
        try {
          const response = await fetch(selectedTemplate.file_url);
          const htmlContent = await response.text();
          const doc = new DOMParser().parseFromString(htmlContent, "text/html");
          setContent(doc.body.innerHTML);
        } catch (error) {
          console.error("Error fetching HTML:", error);
        }
      }
    };

    fetchHtmlContent();
  }, [selectedTemplate, onTemplateSelect]);

  useEffect(() => {
    if (selectedTemplate) {
      onTemplateSelect(
        selectedTemplate.file_name,
        selectedTemplate.file_id,
        selectedTemplate.file_url
      );
    }
  }, [selectedTemplate?.file_id]);

  return (
    <div className="flex flex-col">
      <div className="flex">
        {/* Left Panel */}
        <div className="w-1/4 border-r border-gray-300 bg-white p-4 overflow-y-auto">
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-700">Template History</h2>
              <button
                onClick={() => fetchFiles(fileExtension, 5, null, "reset")}
                className="p-1 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
                disabled={isLoading}
              >
                <RefreshCw size={18} className={isLoading ? "animate-pulse" : ""} />
              </button>
            </div>

            {/* Template List */}
            <div className="space-y-3">
              {isLoading ? (
                <div className="text-center py-8 text-gray-500">Loading templates...</div>
              ) : options && options.length > 0 ? (
                options.map(option => (
                  <div
                    key={option.file_id}
                    onClick={() => setSelectedTemplate(option)}
                    className={`border rounded-lg p-3 cursor-pointer transition-all ${
                      selectedTemplate?.file_id === option.file_id
                        ? "border-sky-800 bg-gray-200"
                        : "border-gray-300 hover:border-gray-400 hover:bg-gray-100"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-1 p-2 bg-sky-950 rounded-md">
                        <FileText size={20} className="text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-800 truncate">{option.file_name}</h3>
                        <div className="flex justify-between items-center mt-1">
                          <span className="text-xs text-gray-500">
                            {(option.file_size / 1024).toFixed(1)} KB
                          </span>
                          <span className="text-xs text-gray-500">
                            {convertToTaipeiTime(option.updated_at || option.created_at)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">No templates found.</div>
              )}

              {/* Pagination */}
              {options && options.length > 0 && (
                <div className="flex justify-between items-center pt-3 mt-2 border-t border-gray-200">
                  <button
                    className={`flex items-center gap-1 text-sm px-2 py-1 rounded ${
                      pageIndex === 0 || isLoading
                        ? "cursor-default text-gray-400"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                    onClick={() =>
                      fetchFiles(
                        fileExtension,
                        5,
                        evaluatedKeyStack[evaluatedKeyStack.length - 2] || null,
                        "prev"
                      )
                    }
                    disabled={pageIndex === 0 || isLoading}
                  >
                    <ChevronLeft size={16} />
                    Previous
                  </button>
                  <button
                    className={`flex items-center gap-1 text-sm px-2 py-1 rounded ${
                      !nextLastEvaluatedKey || isLoading
                        ? "cursor-default text-gray-400"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                    onClick={() => fetchFiles(fileExtension, 5, nextLastEvaluatedKey, "next")}
                    disabled={!nextLastEvaluatedKey || isLoading}
                  >
                    Next
                    <ChevronRight size={16} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="w-3/4 flex flex-col p-4 gap-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-700">
              {selectedTemplate ? (
                <>
                  You have selected:{" "}
                  <strong className="underline">{selectedTemplate.file_name}</strong>
                </>
              ) : (
                "Select a template to preview"
              )}
            </h2>
            {selectedTemplate && (
              <span className="text-sm text-gray-500">
                Last updated:{" "}
                {convertToTaipeiTime(selectedTemplate.updated_at || selectedTemplate.created_at)}
              </span>
            )}
          </div>

          {/* Preview Area */}
          <div className="flex-1 rounded-lg bg-white shadow-lg overflow-hidden">
            {content ? (
              <div className="h-full overflow-auto">
                <div className="border-2 border-sky-950 p-4 bg-sky-950 flex justify-between items-center">
                  <span className="text-sm font-medium text-white">Template Preview</span>
                </div>
                <div className="p-4 h-full bg-gray-100 cursor-not-allowed">
                  <div
                    className="prose max-w-full p-4 bg-white rounded-lg border-2 border-gray-200 opacity-60"
                    dangerouslySetInnerHTML={{ __html: content }}
                  />
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500 bg-gray-50">
                <div className="text-center p-6">
                  <FileText size={48} className="mx-auto mb-4 text-gray-300" />
                  <p>Select a template from the library to preview</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-end py-2 px-6">
        <button
          className="px-6 py-2 bg-sky-950 text-white rounded-md hover:bg-sky-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!selectedTemplate}
          onClick={onNext}
        >
          Select this Template
        </button>
      </div>
    </div>
  );
}
