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
import TipTap from "@/app/ui/tip-tap";
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

const DEFAULT_TEMPLATE_CONTENT = `
    <p>親愛的{{Name}}，</p>
    <p>您好！恭喜您成功加入<strong class="highlight">「6th AWS Educate Taiwan 雲端校園大使證照陪跑計畫」</strong>！非常高興您決定與我們一起踏上學習的旅程，共同探索雲端技術的無限可能！</p>
    <p>為確保您能夠有效利用本計畫資源，校園大使團隊精心統整許多考照資源於在 Notion Page，並建立 Discord 社群以促進更深入的討論和即時互動，讓您可以輕鬆地提問並與大使互動問答。</p>
    <p>您可以透過以下連結訪問：<br>Notion Page：<a target="_blank" href="https://aws-educate-tw.notion.site/AWS-0824fda6e4aa470e863c4d91daf9563a">點擊這裡</a><br>Discord 社群：{{Discord Link}}</p>
    <p>【注意事項】<br>請記得定期追蹤計畫 Notion Page 和 Discord 社群，我們會定期更新資源和消息。<br>陪跑計畫包含證照課程與獎勵課程，獎勵課程需完成規定的課程進度才可以參與，詳細規則請見 Notion Page。</p>
    <p>【開幕活動與報名資訊】<br>隨著「6th AWS Educate Taiwan 雲端校園大使證照陪跑計畫」正式啟動，誠摯邀請您參加 2024 年 5 月 3 日（星期五）舉行的開幕活動。開幕活動不僅標誌著計畫的正式啟動，也將針對計畫內容、規則等詳細說明，亦可與其他參與者相互認識、交流分享。<br>有意願參加開幕活動請填寫以下報名表單，<span class="important">表單將於 4/29（一）18:00 截止</span>：<a target="_blank" href="https://www.surveycake.com/s/VKO3k">點擊這裡</a></p>
    <p>若您有任何問題或需要進一步協助，請隨時與我們聯繫，我們將竭誠為您服務！</p>
    <p>台灣 AWS Educate Cloud Ambassador 官方社群：Facebook＆Instagram</p>
    <br>
    <p>Best regards,</p>
    <p>Bill Wu</p>
    <p>AWS Educate Cloud Ambassador</p>
    <p>billwu0222@gmail.com</p>`;

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

export default function EmailServiceChooseTemplateCreateNew({
  onNext,
}: EmailServiceChooseTemplateCreateNewProps) {
  const [templateName, setTemplateName] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [content, setContent] = useState(DEFAULT_TEMPLATE_CONTENT);
  const { updateTemplate } = useEmailContext();

  // Set template content when preset is selected
  useEffect(() => {
    if (selectedTemplate) {
      const preset = templatePresets.find(t => t.id === selectedTemplate);
      if (preset) {
        setTemplateName(preset.name);
        setContent(preset.content);
      }
    }
  }, [selectedTemplate]);

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
  };

  const handleSaveTemplate = () => {
    console.log("Saving template:", { templateName, emailContent: content });
  };

  const handleNextClick = () => {
    const tempId = `new-template-${Date.now()}`;
    updateTemplate(
      tempId,
      templateName || "Untitled Template",
      content || DEFAULT_TEMPLATE_CONTENT,
      undefined
    );
    onNext("new");
  };

  const handleSelectPreset = (presetId: string) => {
    setSelectedTemplate(presetId);
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

            <TipTap content={content} onChange={handleContentChange} />
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
