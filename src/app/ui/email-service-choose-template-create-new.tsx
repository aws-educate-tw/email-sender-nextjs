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
import { Card } from "@/components/ui/card";

// Rich text editor toolbar icons
const ToolbarButton = ({ icon, onClick }: { icon: React.ReactNode; onClick: () => void }) => (
  <button
    className="p-2 mx-1 rounded hover:bg-gray-100 transition-colors"
    onClick={onClick}
  >
    {icon}
  </button>
);

export default function EmailServiceChooseTemplateCreateNew() {
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

  const handleNext = () => {
    console.log("Next step");
    // Logic to proceed to the next step
  };

  return (
    <Card className="p-6 w-full max-w-full">
      <h2 className="text-2xl font-semibold mb-6">Create New Template</h2>

      <div className="grid gap-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div className="lg:col-span-3">
            <Input
              placeholder="Template Name"
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="lg:col-span-1">
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
          </div>
        </div>
        
        {/* Rich text editor toolbar */}
        <div className="flex flex-wrap items-center border rounded-md p-1 bg-white">
          <ToolbarButton icon={<i className="icon link">🔗</i>} onClick={() => handleFormatAction("link")} />
          <ToolbarButton icon={<i className="icon bold">B</i>} onClick={() => handleFormatAction("bold")} />
          <ToolbarButton icon={<i className="icon italic">I</i>} onClick={() => handleFormatAction("italic")} />
          <ToolbarButton icon={<i className="icon underline">U</i>} onClick={() => handleFormatAction("underline")} />
          <ToolbarButton icon={<i className="icon strikethrough">S</i>} onClick={() => handleFormatAction("strikethrough")} />
          <ToolbarButton icon={<i className="icon h1">H1</i>} onClick={() => handleFormatAction("h1")} />
          <ToolbarButton icon={<i className="icon h2">H2</i>} onClick={() => handleFormatAction("h2")} />
          <ToolbarButton icon={<i className="icon h3">H3</i>} onClick={() => handleFormatAction("h3")} />
          <ToolbarButton icon={<i className="icon ul">•</i>} onClick={() => handleFormatAction("bulletList")} />
          <ToolbarButton icon={<i className="icon ol">1.</i>} onClick={() => handleFormatAction("numberedList")} />
          <ToolbarButton icon={<i className="icon quote">""</i>} onClick={() => handleFormatAction("quote")} />
          <ToolbarButton icon={<i className="icon image">🖼️</i>} onClick={() => handleFormatAction("image")} />
          <ToolbarButton icon={<i className="icon undo">↩</i>} onClick={() => handleFormatAction("undo")} />
          <ToolbarButton icon={<i className="icon redo">↪</i>} onClick={() => handleFormatAction("redo")} />
        </div>
        
        {/* Text editor */}
        <textarea
          value={emailContent}
          onChange={(e) => setEmailContent(e.target.value)}
          className="w-full h-[400px] border rounded-md p-4 font-mono resize-none overflow-auto"
        />
        
        {/* Action buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button 
            variant="default" 
            className="bg-navy-blue text-white hover:bg-navy-blue/90 w-full"
            onClick={handleSaveTemplate}
          >
            Save Template
          </Button>
          
          <Button 
            variant="default" 
            className="bg-navy-blue text-white hover:bg-navy-blue/90 w-full"
            onClick={handleNext}
          >
            Next
          </Button>
        </div>
      </div>
    </Card>
  );
}