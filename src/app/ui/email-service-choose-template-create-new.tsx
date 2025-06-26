"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Link,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Image,
  Undo,
  Redo,
} from "lucide-react";
import { Card } from "@/components/ui/card";

interface EmailServiceChooseTemplateCreateNewProps {
  onBack: () => void;
  onNext: (templateType: "new" | "history") => void;
}

// Rich text editor toolbar icons
const ToolbarButton = ({ icon, onClick }: { icon: React.ReactNode; onClick: () => void }) => (
  <button className="p-2 mx-1 rounded hover:bg-gray-100 transition-colors" onClick={onClick}>
    {icon}
  </button>
);

export default function EmailServiceChooseTemplateCreateNew({
  onNext,
}: EmailServiceChooseTemplateCreateNewProps) {
  const [templateName, setTemplateName] = useState("");
  const [emailContent, setEmailContent] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("");

  // These would be actual handler functions in a real implementation
  const handleFormatAction = (action: string) => {
    console.log(`Format action: ${action}`);
    // Implement formatting logic here
  };

  const handleSaveTemplate = () => {
    console.log("Saving template:", { templateName, emailContent });
    // Logic to save the template
  };

  const handleNextClick = () => {
    onNext("new");
  };

  return (
    <Card className="w-full max-w-full mt-2">
      <div className="w-full p-6">
        <h2 className="text-2xl font-semibold mb-6">Create New Template</h2>

        <div className="grid grid-cols-12 gap-6">
          {/* Left column - Template name input and editor */}
          <div className="col-span-9">
            <Input
              placeholder="Template Name"
              value={templateName}
              onChange={e => setTemplateName(e.target.value)}
              className="w-full mb-6"
            />

            {/* Rich text editor toolbar */}
            <div className="flex flex-wrap items-center border rounded-md p-1 bg-white mb-4">
              <ToolbarButton icon={<Link size={18} />} onClick={() => handleFormatAction("link")} />
              <ToolbarButton icon={<Bold size={18} />} onClick={() => handleFormatAction("bold")} />
              <ToolbarButton
                icon={<Italic size={18} />}
                onClick={() => handleFormatAction("italic")}
              />
              <ToolbarButton
                icon={<Underline size={18} />}
                onClick={() => handleFormatAction("underline")}
              />
              <ToolbarButton
                icon={<Strikethrough size={18} />}
                onClick={() => handleFormatAction("strikethrough")}
              />
              <ToolbarButton
                icon={<Heading1 size={18} />}
                onClick={() => handleFormatAction("h1")}
              />
              <ToolbarButton
                icon={<Heading2 size={18} />}
                onClick={() => handleFormatAction("h2")}
              />
              <ToolbarButton
                icon={<Heading3 size={18} />}
                onClick={() => handleFormatAction("h3")}
              />
              <ToolbarButton
                icon={<List size={18} />}
                onClick={() => handleFormatAction("bulletList")}
              />
              <ToolbarButton
                icon={<ListOrdered size={18} />}
                onClick={() => handleFormatAction("numberedList")}
              />
              <ToolbarButton
                icon={<Quote size={18} />}
                onClick={() => handleFormatAction("quote")}
              />
              <ToolbarButton
                icon={<Image size={18} />}
                onClick={() => handleFormatAction("image")}
              />
              <ToolbarButton icon={<Undo size={18} />} onClick={() => handleFormatAction("undo")} />
              <ToolbarButton icon={<Redo size={18} />} onClick={() => handleFormatAction("redo")} />
            </div>

            {/* Text editor */}
            <textarea
              value={emailContent}
              onChange={e => setEmailContent(e.target.value)}
              className="w-full h-[400px] border rounded-md p-4 font-mono resize-none overflow-auto"
              placeholder="親愛的{{Name}}，"
            />
          </div>

          {/* Right column - Template selection and buttons */}
          <div className="col-span-3 flex flex-col space-y-6">
            <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
              <SelectTrigger>
                <SelectValue placeholder="Select a recent template" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="template1">Template 1</SelectItem>
                <SelectItem value="template2">Template 2</SelectItem>
                <SelectItem value="template3">Template 3</SelectItem>
              </SelectContent>
            </Select>

            <div className="mt-auto space-y-4">
              <Button
                variant="default"
                className="bg-[#1a2f4a] text-white hover:bg-[#1a2f4a]/90 w-full"
                onClick={handleSaveTemplate}
              >
                Save Template
              </Button>

              <Button
                variant="default"
                className="bg-[#1a2f4a] text-white hover:bg-[#1a2f4a]/90 w-full"
                onClick={handleNextClick}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
