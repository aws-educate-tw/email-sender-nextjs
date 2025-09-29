import React, { useState } from "react";
import { ArrowRight, Info, Webhook, Link2, Hash, Key } from "lucide-react";
import HelpTip from "@/app/ui/help-tip";
import WebhookTypeDropdown from "@/app/ui/webhook-type-dropdown";
import { WebhookDataType } from "@/app/ui/webhookService/type";

interface WebhookServiceWebhookProps {
  onNext: () => void;
  webhookData: WebhookDataType;
  onWebhookDataChange: (data: WebhookDataType) => void;
}

export default function WebhookServiceWebhook({
  onNext,
  webhookData,
  onWebhookDataChange,
}: WebhookServiceWebhookProps) {
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleWebhookTypeChange = (webhookType: string) => {
    // Ensure the webhookType is one of the valid values
    if (webhookType === "surveycake" || webhookType === "slack") {
      onWebhookDataChange({
        ...webhookData,
        webhookType,
      });
    }
  };

  const handleInputChange = (field: keyof WebhookDataType, value: string) => {
    onWebhookDataChange({
      ...webhookData,
      [field]: value,
    });
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" });
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!webhookData.surveycakeLink) {
      newErrors.surveycakeLink = "Surveycake Link is required";
    }
    if (!webhookData.hashKey) {
      newErrors.hashKey = "Hash Key is required";
    }
    if (!webhookData.ivKey) {
      newErrors.ivKey = "IV Key is required";
    }
    if (!webhookData.webhookName) {
      newErrors.webhookName = "Webhook Name is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateForm()) {
      onNext();
    }
  };

  return (
    <div className="space-y-6">
      {/* Required Section */}
      <div className="space-y-3">
        <h3 className="text-xl font-bold mb-6 text-gray-800 flex items-center">
          <div className="w-1 h-6 bg-[#1a2f4a] rounded-full mr-3"></div>
          Required
        </h3>

        {/* Webhook Type */}
        <div className="space-y-3">
          <label className="flex items-center text-gray-700 font-medium text-sm">
            <Webhook size={18} className="mr-2 text-[#1a2f4a]" />
            Webhook Type
            <HelpTip message="Select the webhook type for your integration.">
              <Info
                size={16}
                className="ml-2 text-gray-400 hover:text-gray-600 cursor-help transition-colors"
              />
            </HelpTip>
          </label>
          <WebhookTypeDropdown onSelect={handleWebhookTypeChange} />
        </div>

        {/* Surveycake Link */}
        <div className="space-y-3">
          <label className="flex items-center text-gray-700 font-medium text-sm">
            <Link2 size={18} className="mr-2 text-[#1a2f4a]" />
            Surveycake Link
            <HelpTip message="Enter the Surveycake link that will be used in the webhook.">
              <Info
                size={16}
                className="ml-2 text-gray-400 hover:text-gray-600 cursor-help transition-colors"
              />
            </HelpTip>
          </label>
          <input
            type="url"
            value={webhookData.surveycakeLink}
            onChange={e => handleInputChange("surveycakeLink", e.target.value)}
            placeholder="https://www.surveycake.com/..."
            className={`w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a2f4a] focus:border-transparent transition-all duration-200 ${
              errors.surveycakeLink ? "border-red-500 focus:ring-red-500" : ""
            }`}
          />
          {errors.surveycakeLink && (
            <p className="text-red-500 text-sm mt-1">{errors.surveycakeLink}</p>
          )}
        </div>

        {/* Hash Key */}
        <div className="space-y-3">
          <label className="flex items-center text-gray-700 font-medium text-sm">
            <Hash size={18} className="mr-2 text-[#1a2f4a]" />
            Hash Key
            <HelpTip message="Enter the hash key for webhook authentication and data integrity.">
              <Info
                size={16}
                className="ml-2 text-gray-400 hover:text-gray-600 cursor-help transition-colors"
              />
            </HelpTip>
          </label>
          <input
            type="text"
            value={webhookData.hashKey}
            onChange={e => handleInputChange("hashKey", e.target.value)}
            placeholder="Enter hash key"
            className={`w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a2f4a] focus:border-transparent transition-all duration-200 ${
              errors.hashKey ? "border-red-500 focus:ring-red-500" : ""
            }`}
          />
          {errors.hashKey && <p className="text-red-500 text-sm mt-1">{errors.hashKey}</p>}
        </div>

        {/* IV Key */}
        <div className="space-y-3">
          <label className="flex items-center text-gray-700 font-medium text-sm">
            <Key size={18} className="mr-2 text-[#1a2f4a]" />
            IV Key
            <HelpTip message="Enter the initialization vector key for encryption.">
              <Info
                size={16}
                className="ml-2 text-gray-400 hover:text-gray-600 cursor-help transition-colors"
              />
            </HelpTip>
          </label>
          <input
            type="text"
            value={webhookData.ivKey}
            onChange={e => handleInputChange("ivKey", e.target.value)}
            placeholder="Enter IV key"
            className={`w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a2f4a] focus:border-transparent transition-all duration-200 ${
              errors.ivKey ? "border-red-500 focus:ring-red-500" : ""
            }`}
          />
          {errors.ivKey && <p className="text-red-500 text-sm mt-1">{errors.ivKey}</p>}
        </div>

        {/* Webhook Name */}
        <div className="space-y-3">
          <label className="flex items-center text-gray-700 font-medium text-sm">
            <Webhook size={18} className="mr-2 text-[#1a2f4a]" />
            Webhook Name
            <HelpTip message="Enter a name to identify your webhook.">
              <Info
                size={16}
                className="ml-2 text-gray-400 hover:text-gray-600 cursor-help transition-colors"
              />
            </HelpTip>
          </label>
          <input
            type="text"
            value={webhookData.webhookName}
            onChange={e => handleInputChange("webhookName", e.target.value)}
            placeholder="Enter webhook name"
            className={`w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a2f4a] focus:border-transparent transition-all duration-200 ${
              errors.webhookName ? "border-red-500 focus:ring-red-500" : ""
            }`}
          />
          {errors.webhookName && <p className="text-red-500 text-sm mt-1">{errors.webhookName}</p>}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-end pt-6 border-t border-gray-200">
        <button
          onClick={handleNext}
          className="flex items-center px-6 py-3 bg-[#1a2f4a] text-white rounded-lg hover:bg-[#152238] transition-colors font-medium"
        >
          Continue to Settings
          <ArrowRight className="w-5 h-5 ml-2" />
        </button>
      </div>
    </div>
  );
}
