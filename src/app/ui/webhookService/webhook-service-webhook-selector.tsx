"use client";

import React, { useState, useEffect } from "react";
import { ArrowRight, Webhook, Calendar, User, Mail, Search, RefreshCw, ChevronLeft, ChevronRight } from "lucide-react";
import { WebhookListItem } from "@/app/ui/webhookService/type";

interface WebhookServiceWebhookSelectorProps {
  onNext: () => void;
  onWebhookSelect: (webhook: WebhookListItem) => void;
}

interface ApiResponse {
  data: WebhookListItem[];
  page: number;
  limit: number;
  total_count: number;
  sort_order: "ASC" | "DESC";
}

export default function WebhookServiceWebhookSelector({
  onNext,
  onWebhookSelect,
}: WebhookServiceWebhookSelectorProps) {
  const [webhooks, setWebhooks] = useState<WebhookListItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedWebhook, setSelectedWebhook] = useState<WebhookListItem | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [limit] = useState<number>(10); // Items per page

  useEffect(() => {
    fetchWebhooks(currentPage);
  }, [currentPage]);

  const fetchWebhooks = async (page: number) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const base_url = process.env.NEXT_PUBLIC_API_ENDPOINT;
      if (!base_url) {
        throw new Error("API endpoint not configured");
      }

      // Fetch webhooks of all types by making multiple requests if needed
      const webhookTypes = ["surveycake", "slack"];
      const allWebhooks: WebhookListItem[] = [];
      let totalWebhooks = 0;

      for (const webhookType of webhookTypes) {
        try {
          const url = new URL(`${base_url}/webhooks`);
          
          // Add required parameters for each webhook type
          url.searchParams.append("webhook_type", webhookType);
          url.searchParams.append("limit", limit.toString());
          url.searchParams.append("page", page.toString());
          url.searchParams.append("sort_order", "DESC");

          const token = localStorage.getItem("access_token");
          if (!token) {
            throw new Error("No access token found. Please login again.");
          }

          console.log(`Fetching ${webhookType} webhooks from:`, url.toString());

          const response = await fetch(url.toString(), {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const result: ApiResponse = await response.json();
            console.log(`${webhookType} webhooks response:`, result);
            if (result.data && Array.isArray(result.data)) {
              allWebhooks.push(...result.data);
              totalWebhooks += result.total_count || 0;
            }
          } else {
            console.warn(`Failed to fetch ${webhookType} webhooks:`, response.status);
            // Try to get error details for debugging
            try {
              const errorData = await response.json();
              console.log(`${webhookType} error response:`, errorData);
            } catch (e) {
              console.log(`Could not parse ${webhookType} error response`);
            }
          }
        } catch (typeError) {
          console.warn(`Error fetching ${webhookType} webhooks:`, typeError);
          // Continue with other webhook types
        }
      }

      // Sort all webhooks by creation date (newest first)
      allWebhooks.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      
      console.log("All webhooks fetched:", allWebhooks.length);
      setWebhooks(allWebhooks);
      setTotalCount(totalWebhooks);

      // If no webhooks were found at all, it might be an API issue
      if (allWebhooks.length === 0 && page === 1) {
        // Try one more time with just surveycake to get proper error message
        const url = new URL(`${base_url}/webhooks`);
        url.searchParams.append("webhook_type", "surveycake");
        url.searchParams.append("limit", limit.toString());
        url.searchParams.append("page", page.toString());
        url.searchParams.append("sort_order", "DESC");

        const token = localStorage.getItem("access_token");
        const response = await fetch(url.toString(), {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          let errorMessage = `Request failed: ${response.status}`;
          try {
            const errorData = await response.json();
            console.log("Final error response data:", errorData);
            errorMessage = errorData.message || errorData.error || errorMessage;
            
            if (response.status === 400) {
              errorMessage = `Bad Request: ${errorMessage}. Please check if you have permission to access webhooks.`;
            } else if (response.status === 401) {
              errorMessage = "Unauthorized. Please login again.";
            } else if (response.status === 403) {
              errorMessage = "Forbidden. You don't have permission to access webhooks.";
            }
          } catch (jsonError) {
            console.log("Could not parse final error response:", jsonError);
          }
          throw new Error(errorMessage);
        }
      }

    } catch (err: any) {
      console.error("Failed to fetch webhooks:", err);
      setError(err.message || "Failed to load webhooks");
    } finally {
      setIsLoading(false);
    }
  };

  const handleWebhookSelect = (webhook: WebhookListItem) => {
    setSelectedWebhook(webhook);
    onWebhookSelect(webhook);
  };

  const handleNext = () => {
    if (selectedWebhook) {
      onNext();
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const handleNextPage = () => {
    if (webhooks.length >= limit) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const handleRetry = () => {
    fetchWebhooks(currentPage);
  };

  const canGoNext = webhooks.length >= limit;
  const canGoPrevious = currentPage > 1;

  const filteredWebhooks = webhooks.filter(webhook =>
    webhook.webhook_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    webhook.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    webhook.webhook_type?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-xl font-bold mb-2 text-gray-800">Loading Webhooks...</h3>
          <div className="flex justify-center">
            <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-xl font-bold mb-2 text-red-600">Error Loading Webhooks</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={handleRetry}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-3">
        <h3 className="text-xl font-bold mb-6 text-gray-800 flex items-center">
          <div className="w-1 h-6 bg-[#1a2f4a] rounded-full mr-3"></div>
          Select Webhook to Modify
        </h3>
        
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search webhooks by name, subject, or type..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              // Reset to first page when searching
              if (currentPage !== 1) {
                setCurrentPage(1);
              }
            }}
            className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a2f4a] focus:border-transparent transition-all duration-200"
          />
        </div>
      </div>

      {filteredWebhooks.length === 0 ? (
        <div className="text-center py-8">
          <Webhook className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h4 className="text-lg font-semibold text-gray-600 mb-2">No Webhooks Found</h4>
          <p className="text-gray-500">
            {searchTerm ? "No webhooks match your search criteria." : "You haven't created any webhooks yet."}
          </p>
        </div>
      ) : (
        <>
          {/* Webhook List */}
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {filteredWebhooks.map((webhook) => (
              <div
                key={webhook.webhook_id}
                className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                  selectedWebhook?.webhook_id === webhook.webhook_id
                    ? "border-[#1a2f4a] bg-blue-50 shadow-md"
                    : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
                }`}
                onClick={() => handleWebhookSelect(webhook)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Webhook className="w-5 h-5 text-[#1a2f4a]" />
                      <h4 className="font-semibold text-gray-800">
                        {webhook.webhook_name || `Webhook #${webhook.sequence_number}`}
                      </h4>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        webhook.webhook_type === "surveycake" 
                          ? "bg-blue-100 text-blue-800"
                          : "bg-purple-100 text-purple-800"
                      }`}>
                        {webhook.webhook_type}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        <span className="truncate">{webhook.subject}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        <span className="truncate">{webhook.display_name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(webhook.created_at)}</span>
                      </div>
                    </div>
                  </div>
                  
                  {selectedWebhook?.webhook_id === webhook.webhook_id && (
                    <div className="ml-4">
                      <div className="w-6 h-6 bg-[#1a2f4a] rounded-full flex items-center justify-center">
                        <div className="w-3 h-3 bg-white rounded-full"></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          {totalCount > limit && (
            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <div className="text-sm text-gray-600">
                Showing {((currentPage - 1) * limit) + 1} to {Math.min(currentPage * limit, totalCount)} of {totalCount} webhooks
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePreviousPage}
                  disabled={!canGoPrevious}
                  className={`flex items-center px-3 py-2 rounded-lg transition-colors ${
                    canGoPrevious
                      ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      : "bg-gray-50 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Previous
                </button>
                
                <span className="px-3 py-2 text-sm text-gray-600">
                  Page {currentPage}
                </span>
                
                <button
                  onClick={handleNextPage}
                  disabled={!canGoNext}
                  className={`flex items-center px-3 py-2 rounded-lg transition-colors ${
                    canGoNext
                      ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      : "bg-gray-50 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-1" />
                </button>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-end pt-6 border-t border-gray-200">
            <button
              onClick={handleNext}
              disabled={!selectedWebhook}
              className={`flex items-center px-6 py-3 rounded-lg font-medium transition-colors ${
                selectedWebhook
                  ? "bg-[#1a2f4a] text-white hover:bg-[#152238]"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              Continue to Modify
              <ArrowRight className="w-5 h-5 ml-2" />
            </button>
          </div>
        </>
      )}
    </div>
  );
}
