import React, { Ref, useState } from "react";
import {
  Editor,
  EditorState,
  RichUtils,
  Modifier,
  ContentState,
  CompositeDecorator,
} from "draft-js";
import { stateToHTML } from "draft-js-export-html";
import { stateFromHTML } from "draft-js-import-html";
import "draft-js/dist/Draft.css";

type Props = {
  content: string;
  onChange: (content: string) => void;
  editorRef: Ref<HTMLDivElement>;
};

const linkStyle = {
  color: "blue",
  textDecoration: "underline",
};

const findLinkEntities = (
  contentBlock: any,
  callback: any,
  contentState: any
) => {
  contentBlock.findEntityRanges((character: any) => {
    const entityKey = character.getEntity();
    return (
      entityKey !== null &&
      contentState.getEntity(entityKey).getType() === "LINK"
    );
  }, callback);
};

const Link = (props: any) => {
  const { url } = props.contentState.getEntity(props.entityKey).getData();
  return (
    <a href={url} style={linkStyle}>
      {props.children}
    </a>
  );
};

export default function TextEditor({ content, onChange, editorRef }: Props) {
  const decorator = new CompositeDecorator([
    {
      strategy: findLinkEntities,
      component: Link,
    },
  ]);

  const [editorState, setEditorState] = useState(() => {
    const contentState = stateFromHTML(content);
    return EditorState.createWithContent(contentState, decorator);
  });

  const handleEditorChange = (newState: EditorState) => {
    setEditorState(newState);
    // Call onChange after a slight delay to ensure state has updated
    setTimeout(() => {
      const htmlContent = stateToHTML(newState.getCurrentContent());
      onChange(htmlContent);
    }, 0);
  };

  // Button click handlers
  const onBoldClick = () => {
    const newState = RichUtils.toggleInlineStyle(editorState, "BOLD");
    handleEditorChange(newState);
  };

  const onItalicClick = () => {
    const newState = RichUtils.toggleInlineStyle(editorState, "ITALIC");
    handleEditorChange(newState);
  };

  const onUnderlineClick = () => {
    const newState = RichUtils.toggleInlineStyle(editorState, "UNDERLINE");
    handleEditorChange(newState);
  };

  const onToggleBulletList = () => {
    const newState = RichUtils.toggleBlockType(
      editorState,
      "unordered-list-item"
    );
    handleEditorChange(newState);
  };

  const onAddLink = () => {
    const url = prompt("Enter the URL");
    const selection = editorState.getSelection();
    if (!url) return;

    const content = editorState.getCurrentContent();
    const contentWithEntity = content.createEntity("LINK", "MUTABLE", { url });
    const entityKey = contentWithEntity.getLastCreatedEntityKey();
    const contentWithLink = Modifier.applyEntity(
      contentWithEntity,
      selection,
      entityKey
    );
    const newState = EditorState.push(
      editorState,
      contentWithLink,
      "apply-entity"
    );

    handleEditorChange(newState);
  };

  const options = {
    entityStyleFn: (entity: any) => {
      const entityType = entity.get("type").toLowerCase();
      if (entityType === "link") {
        const data = entity.getData();
        return {
          element: "a",
          attributes: {
            href: data.url,
            target: "_blank",
          },
          style: {
            color: "#0077cc", // Make links blue
            textDecoration: "underline",
          },
        };
      }
    },
    blockStyleFn: (block: any) => {
      const type = block.getType();
      if (type === "unordered-list-item") {
        return {
          attributes: {},
          style: {
            // Example of adding custom style to <li> elements
            paddingLeft: "20px",
            listStyleType: "circle",
          },
        };
      }
    },
  };

  return (
    <div>
      <div className="flex gap-3 py-3">
        <button
          className="flex h-10 items-center rounded-lg bg-sky-800 px-4 text-sm font-medium text-white transition-colors hover:bg-sky-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-800 active:bg-sky-950 aria-disabled:cursor-not-allowed aria-disabled:opacity-50"
          onClick={onBoldClick}
        >
          Bold
        </button>
        <button
          className="flex h-10 items-center rounded-lg bg-sky-800 px-4 text-sm font-medium text-white transition-colors hover:bg-sky-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-800 active:bg-sky-950 aria-disabled:cursor-not-allowed aria-disabled:opacity-50"
          onClick={onItalicClick}
        >
          Italic
        </button>
        <button
          className="flex h-10 items-center rounded-lg bg-sky-800 px-4 text-sm font-medium text-white transition-colors hover:bg-sky-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-800 active:bg-sky-950 aria-disabled:cursor-not-allowed aria-disabled:opacity-50"
          onClick={onUnderlineClick}
        >
          Underline
        </button>
        <button
          className="flex h-10 items-center rounded-lg bg-sky-800 px-4 text-sm font-medium text-white transition-colors hover:bg-sky-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-800 active:bg-sky-950"
          onClick={onToggleBulletList}
        >
          Bulleted List
        </button>
        <button
          className="flex h-10 items-center rounded-lg bg-sky-800 px-4 text-sm font-medium text-white transition-colors hover:bg-sky-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-800 active:bg-sky-950 aria-disabled:cursor-not-allowed aria-disabled:opacity-50"
          onClick={onAddLink}
        >
          Add Link
        </button>
      </div>
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
