"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Toolbar from "@/app/ui/Toolbar";

const Tiptap = ({ onChange, content }: any) => {
  const hangdleChange = (newContent: string) => {
    onChange(newContent);
  };

  const editor = useEditor({
    extensions: [StarterKit],
    editorProps: {
      attributes: {
        class:
          "flex min-h-96 flex-col px-4 justify-start border-b border-l border-r border-gray-700 text-gray-400 items-start w-full gap-3 font-medium pt-4 rounded-bl-md rounded-br-md outline-none focus:ring-2 focus:ring-sky-900 focus:ring-opacity-50",
      },
    },
    onUpdate: ({ editor }) => {
      hangdleChange(editor.getHTML());
    },
  });

  return (
    <div className="w-full px-4">
      <Toolbar editor={editor} content={content} />
      <EditorContent style={{ whiteSpace: "pre-line" }} editor={editor} />
    </div>
  );
};

export default Tiptap;
