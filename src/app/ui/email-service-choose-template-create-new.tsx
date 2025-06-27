"use client";

import React, { useState, useEffect } from "react";
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
import { useEmailContext } from "@/app/context/EmailContext";

interface EmailServiceChooseTemplateCreateNewProps {
  onBack: () => void;
  onNext: (templateType: "new" | "history") => void;
}

interface TemplatePreset {
  id: string;
  name: string;
  content: string;
}

const DEFAULT_TEMPLATE_CONTENT = `親愛的{{Name}}，

您好！恭喜您成功加入「6th AWS Educate Taiwan 雲端校園大使證照陪跑計畫」！非常高興您決定與我們一起踏上學習的旅程，共同探索雲端技術的無限可能！

為確保您能夠有效利用本計畫資源，校園大使團隊精心統整許多考照資源於在 Notion Page，並建立 Discord 社群以促進更深入的討論和即時互動，讓您可以輕鬆地提問並與大使互動問答。

您可以透過以下連結訪問：
Notion Page：點擊這裡
Discord 社群：{{Discord Link}}

【注意事項】
請記得定期追蹤計畫 Notion Page 和 Discord 社群，我們會定期更新資源和消息。
陪跑計畫包含證照課程與獎勵課程，獎勵課程需完成規定的課程進度才可以參與，詳細規則請見 Notion Page。

【開幕活動與報名資訊】
隨著「6th AWS Educate Taiwan 雲端校園大使證照陪跑計畫」正式啟動，誠摯邀請您參加 2024 年 5 月 3 日（星期五）舉行的開幕活動。開幕活動不僅標誌著計畫的正式啟動，也將針對計畫內容、規則等詳細說明，亦可與其他參與者相互認識、交流分享。
有意願參加開幕活動請填寫以下報名表單，表單將於 4/29（一）18:00 截止：點擊這裡

若您有任何問題或需要進一步協助，請隨時與我們聯繫，我們將竭誠為您服務！

台灣 AWS Educate Cloud Ambassador 官方社群：Facebook＆Instagram




Best regards,

Bill Wu

AWS Educate Cloud Ambassador

billwu0222@gmail.com`;

const templatePresets: TemplatePreset[] = [
  {
    id: "welcome",
    name: "Welcome Email",
    content: "This is the content of the Welcome Email template.",
  },
  {
    id: "event",
    name: "Event Invitation",
    content: "This is the content of the Event Invitation template.",
  },
  {
    id: "newsletter",
    name: "Newsletter",
    content: "This is the content of the Newsletter template.",
  },
  {
    id: "feedback",
    name: "Feedback Request",
    content: "This is the content of the Feedback Request template.",
  },
];

const ToolbarButton = ({
  icon,
  onClick,
  label,
}: {
  icon: React.ReactNode;
  onClick: () => void;
  label: string;
}) => (
  <button
    className="p-2 mx-1 rounded hover:bg-gray-100 transition-colors"
    onClick={onClick}
    title={label}
    aria-label={label}
  >
    {icon}
  </button>
);

export default function EmailServiceChooseTemplateCreateNew({
  onNext,
}: EmailServiceChooseTemplateCreateNewProps) {
  const [templateName, setTemplateName] = useState("");
  const [emailContent, setEmailContent] = useState(DEFAULT_TEMPLATE_CONTENT);
  const [selectedTemplate, setSelectedTemplate] = useState("");

  const { updateTemplate } = useEmailContext();

  useEffect(() => {
    if (!emailContent) {
      setEmailContent(DEFAULT_TEMPLATE_CONTENT);
    }
  }, [emailContent]);

  const handleFormatAction = (action: string) => {
    console.log(`Format action: ${action}`);
  };

  const handleSaveTemplate = () => {
    console.log("Saving template:", { templateName, emailContent });
  };

  const handleNextClick = () => {
    const tempId = `new-template-${Date.now()}`;
    updateTemplate(
      tempId,
      templateName || "Untitled Template",
      emailContent || DEFAULT_TEMPLATE_CONTENT,
      undefined
    );
    onNext("new");
  };

  const handleSelectPreset = (presetId: string) => {
    const preset = templatePresets.find(t => t.id === presetId);
    if (preset) {
      setTemplateName(preset.name);
      setEmailContent(preset.content);
      setSelectedTemplate(presetId);
    }
  };

  return (
    <Card className="w-full max-w-full mt-2">
      <div className="w-full p-6">
        <h2 className="text-2xl font-semibold mb-6">Create New Template</h2>

        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-9">
            <Input
              placeholder="Template Name"
              value={templateName}
              onChange={e => setTemplateName(e.target.value)}
              className="w-full mb-6"
            />

            <div className="flex flex-wrap items-center rounded-md p-1 bg-gray-50 mb-4">
              <ToolbarButton
                icon={<Link size={18} />}
                onClick={() => handleFormatAction("link")}
                label="Insert link"
              />
              <ToolbarButton
                icon={<Bold size={18} />}
                onClick={() => handleFormatAction("bold")}
                label="Bold text"
              />
              <ToolbarButton
                icon={<Italic size={18} />}
                onClick={() => handleFormatAction("italic")}
                label="Italic text"
              />
              <ToolbarButton
                icon={<Underline size={18} />}
                onClick={() => handleFormatAction("underline")}
                label="Underline text"
              />
              <ToolbarButton
                icon={<Strikethrough size={18} />}
                onClick={() => handleFormatAction("strikethrough")}
                label="Strikethrough text"
              />
              <ToolbarButton
                icon={<Heading1 size={18} />}
                onClick={() => handleFormatAction("h1")}
                label="Heading 1"
              />
              <ToolbarButton
                icon={<Heading2 size={18} />}
                onClick={() => handleFormatAction("h2")}
                label="Heading 2"
              />
              <ToolbarButton
                icon={<Heading3 size={18} />}
                onClick={() => handleFormatAction("h3")}
                label="Heading 3"
              />
              <ToolbarButton
                icon={<List size={18} />}
                onClick={() => handleFormatAction("bulletList")}
                label="Bullet list"
              />
              <ToolbarButton
                icon={<ListOrdered size={18} />}
                onClick={() => handleFormatAction("numberedList")}
                label="Numbered list"
              />
              <ToolbarButton
                icon={<Quote size={18} />}
                onClick={() => handleFormatAction("quote")}
                label="Quote"
              />
              <ToolbarButton
                // eslint-disable-next-line jsx-a11y/alt-text
                icon={<Image size={18} aria-hidden="true" />}
                onClick={() => handleFormatAction("image")}
                label="Insert image"
              />
              <ToolbarButton
                icon={<Undo size={18} />}
                onClick={() => handleFormatAction("undo")}
                label="Undo"
              />
              <ToolbarButton
                icon={<Redo size={18} />}
                onClick={() => handleFormatAction("redo")}
                label="Redo"
              />
            </div>

            <textarea
              value={emailContent}
              onChange={e => setEmailContent(e.target.value)}
              className="w-full h-[400px] border border-gray-200 rounded-md p-3 font-sans text-sm resize-none overflow-auto disabled:cursor-not-allowed disabled:opacity-50 bg-white outline-none focus:border-gray-300"
              placeholder="親愛的{{Name}}，"
              style={{ boxShadow: "none" }}
            />
          </div>

          <div className="col-span-3 flex flex-col space-y-6">
            <div>
              <Select value={selectedTemplate} onValueChange={handleSelectPreset}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a template" />
                </SelectTrigger>
                <SelectContent>
                  {templatePresets.map(preset => (
                    <SelectItem key={preset.id} value={preset.id}>
                      {preset.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

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
