import React, { useState } from "react";
import { Editor, EditorState, RichUtils, ContentState } from "draft-js";
import { stateToHTML } from "draft-js-export-html";
import { stateFromHTML } from "draft-js-import-html"; // Import this function
import "draft-js/dist/Draft.css";

type Props = {
  content: string;
  onChange: (content: string) => void;
};

export default function TextEditor({ content, onChange }: Props) {
  const [editorState, setEditorState] = useState(() => {
    const contentState = stateFromHTML(content);
    return EditorState.createWithContent(contentState);
  });

  const onBoldClick = () => {
    setEditorState(RichUtils.toggleInlineStyle(editorState, "BOLD"));
  };

  const handleEditorChange = (state: EditorState) => {
    setEditorState(state);
    const htmlContent = stateToHTML(state.getCurrentContent());
    onChange(htmlContent); // Pass HTML back to parent component
  };

  return (
    <div>
      <button onClick={onBoldClick}>Bold</button>
      <div
        style={{
          border: "1px solid black",
          minHeight: "400px",
          backgroundColor: "white",
          paddingTop: "60px",
          paddingBottom: "60px",
          paddingLeft: "60px",
          paddingRight: "60px",
          margin: "auto",
          maxWidth: "800px",
          borderRadius: "8px",
          boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Editor editorState={editorState} onChange={handleEditorChange} />
      </div>
    </div>
  );
}
