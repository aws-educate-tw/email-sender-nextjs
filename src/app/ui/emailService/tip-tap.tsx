"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Underline } from "@tiptap/extension-underline";
import { Link } from "@tiptap/extension-link";
import BulletList from "@tiptap/extension-bullet-list";
import ListItem from "@tiptap/extension-list-item";
import ImageResize from "tiptap-extension-resize-image";
import Table from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Image as ImageIcon,
  Undo,
  Redo,
  Link as LinkIcon,
  Table as TableIcon,
  Trash2,
  Columns,
  Rows,
  CalendarCheck,
} from "lucide-react";
import cn from "classnames";
import InsertButtonDialog from "@/app/ui/emailService/insert-button-dialog";
import "./styles.scss";

const ToolbarButton = ({
  icon,
  onClick,
  label,
  isActive = false,
}: {
  icon: React.ReactNode;
  onClick: () => void;
  label: string;
  isActive?: boolean;
}) => (
  <button
    className={cn(
      "p-2 mx-1 rounded transition-colors",
      isActive ? "bg-gray-200" : "hover:bg-gray-100"
    )}
    onClick={onClick}
    title={label}
    aria-label={label}
  >
    {icon}
  </button>
);

// Table size selector component
const TableSizeSelector = ({
  onSelect,
  onClose,
}: {
  onSelect: (rows: number, cols: number) => void;
  onClose: () => void;
}) => {
  const [hoveredCell, setHoveredCell] = useState({ row: 0, col: 0 });
  const maxRows = 10;
  const maxCols = 10;

  const handleCellHover = (row: number, col: number) => {
    setHoveredCell({ row, col });
  };

  const handleCellClick = (row: number, col: number) => {
    onSelect(row + 1, col + 1);
    onClose();
  };

  return (
    <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg p-3 z-50">
      <div className="text-xs text-gray-600 mb-2 text-center">
        {hoveredCell.row + 1} × {hoveredCell.col + 1}
      </div>
      <div className="grid gap-0.5" style={{ gridTemplateColumns: `repeat(${maxCols}, 1fr)` }}>
        {Array.from({ length: maxRows * maxCols }).map((_, index) => {
          const row = Math.floor(index / maxCols);
          const col = index % maxCols;
          const isHighlighted = row <= hoveredCell.row && col <= hoveredCell.col;
          return (
            <div
              key={index}
              className={cn(
                "w-5 h-5 border border-gray-300 cursor-pointer transition-colors",
                isHighlighted ? "bg-blue-400" : "bg-white hover:bg-blue-200"
              )}
              onMouseEnter={() => handleCellHover(row, col)}
              onClick={() => handleCellClick(row, col)}
            />
          );
        })}
      </div>
      <div className="text-xs text-gray-500 mt-2 text-center">Select table size</div>
    </div>
  );
};

interface TipTapProps {
  onChange: (content: string) => void;
  content: string;
  onNext?: () => void;
  templateName?: string;
  onSave?: (content: string, fileId?: string, fileUrl?: string) => void;
  onCampaignInserted?: (campaignId: string, deadline: Date) => void;
}

export default function TipTap({ onChange, content, onCampaignInserted }: TipTapProps) {
  const [, setEditorContent] = useState(content);
  const [, setIsFocused] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [showTableSelector, setShowTableSelector] = useState(false);
  const [showInsertButtonDialog, setShowInsertButtonDialog] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const tableSelectorRef = useRef<HTMLDivElement>(null);

  const router = useRouter();

  const isTokenExpired = () => {
    const expiryTime = localStorage.getItem("token_expiry_time");
    if (!expiryTime) return true;
    return new Date().getTime() > parseInt(expiryTime);
  };

  // Convert image file to base64 data URL
  const convertImageToBase64 = async (file: File): Promise<string | null> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error("Failed to read file"));
      reader.readAsDataURL(file);
    });
  };

  // Handle image file (single image only)
  const handleImageFiles = async (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    const imageFiles = fileArray.filter(file => file.type.startsWith("image/"));

    if (imageFiles.length === 0) {
      alert("Please select an image file.");
      return;
    }

    if (!editor) return;

    // Only process the first image
    const firstImage = imageFiles[0];

    // Validate file size (5MB limit)
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    if (firstImage.size > MAX_FILE_SIZE) {
      alert("Image file is too large. Please select an image smaller than 5MB.");
      return;
    }

    try {
      const base64Url = await convertImageToBase64(firstImage);
      if (base64Url) {
        editor.chain().focus().setImage({ src: base64Url }).run();
      }
    } catch (error) {
      console.error("Failed to convert image:", error);
      alert("Failed to process the image. Please try again with a different file.");
    }
  };

  // Handle image file selection
  const handleImageFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    await handleImageFiles(files);

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Handle drag enter
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  // Handle drag leave
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Only set to false if leaving the editor container
    if (e.currentTarget === e.target) {
      setIsDragging(false);
    }
  };

  // Handle drag over
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  // Handle drop
  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      await handleImageFiles(files);
    }
  };

  // Handle paste event for images
  const handlePaste = async (event: ClipboardEvent) => {
    const items = event.clipboardData?.items;
    if (!items) return;

    for (let i = 0; i < items.length; i++) {
      const item = items[i];

      if (item.type.startsWith("image/")) {
        event.preventDefault();

        const file = item.getAsFile();
        if (!file) continue;

        // Convert to base64 and insert
        try {
          const base64Url = await convertImageToBase64(file);
          if (base64Url && editor) {
            editor.chain().focus().setImage({ src: base64Url }).run();
          }
        } catch (error) {
          console.error("Failed to convert image to base64:", error);
          alert("Failed to process the pasted image. Please try again.");
        }

        break;
      }
    }
  };

  // Close table selector when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (tableSelectorRef.current && !tableSelectorRef.current.contains(event.target as Node)) {
        setShowTableSelector(false);
      }
    };

    if (showTableSelector) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [showTableSelector]);

  useEffect(() => {
    const access_token = localStorage.getItem("access_token");
    if (!access_token || isTokenExpired()) {
      router.push("/login");
    }
  }, [router]);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: false,
        listItem: false,
      }),
      Underline,
      BulletList,
      ListItem,
      Link.configure({
        openOnClick: false,
        autolink: true,
        HTMLAttributes: {
          class: "text-blue-500 underline",
        },
      }),
      ImageResize,
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          style:
            "border-collapse: collapse; margin: 0; overflow: hidden; table-layout: fixed; width: 100%;",
        },
      }),
      TableRow.configure({
        HTMLAttributes: {
          style: "",
        },
      }),
      TableHeader.extend({
        content: "block+",
        addAttributes() {
          return {
            ...this.parent?.(),
            colwidth: {
              default: null,
              parseHTML: element => {
                const colwidth = element.getAttribute("colwidth");
                const value = colwidth
                  ? colwidth.split(",").map(width => parseInt(width, 10))
                  : null;
                return value;
              },
              renderHTML: attributes => {
                if (!attributes.colwidth) {
                  return {};
                }
                return {
                  colwidth: attributes.colwidth.join(","),
                  style: `width: ${attributes.colwidth[0]}px; border: 2px solid #ced4da; box-sizing: border-box; min-width: 1em; padding: 3px 5px; position: relative; vertical-align: top; background-color: #f1f3f5; font-weight: bold; text-align: left;`,
                };
              },
            },
            style: {
              default:
                "border: 2px solid #ced4da; box-sizing: border-box; min-width: 1em; padding: 3px 5px; position: relative; vertical-align: top; background-color: #f1f3f5; font-weight: bold; text-align: left;",
            },
          };
        },
      }),
      TableCell.extend({
        content: "block+",
        addAttributes() {
          return {
            ...this.parent?.(),
            colwidth: {
              default: null,
              parseHTML: element => {
                const colwidth = element.getAttribute("colwidth");
                const value = colwidth
                  ? colwidth.split(",").map(width => parseInt(width, 10))
                  : null;
                return value;
              },
              renderHTML: attributes => {
                if (!attributes.colwidth) {
                  return {
                    style:
                      "border: 2px solid #ced4da; box-sizing: border-box; min-width: 1em; padding: 3px 5px; position: relative; vertical-align: top;",
                  };
                }
                return {
                  colwidth: attributes.colwidth.join(","),
                  style: `width: ${attributes.colwidth[0]}px; border: 2px solid #ced4da; box-sizing: border-box; min-width: 1em; padding: 3px 5px; position: relative; vertical-align: top;`,
                };
              },
            },
            style: {
              default:
                "border: 2px solid #ced4da; box-sizing: border-box; min-width: 1em; padding: 3px 5px; position: relative; vertical-align: top;",
            },
          };
        },
      }),
    ],
    editorProps: {
      attributes: {
        class:
          "w-full h-[40vh] border border-gray-300 rounded-md p-4 font-sans text-sm overflow-auto bg-white focus:outline-none focus:ring-2 focus:ring-blue-500",
      },
      handlePaste: (view, event) => {
        handlePaste(event);
        return false; // Allow default paste behavior for non-image content
      },
      handleDrop: (view, event) => {
        const files = event.dataTransfer?.files;
        if (files && files.length > 0) {
          const hasImages = Array.from(files).some(file => file.type.startsWith("image/"));
          if (hasImages) {
            // Let our custom drop handler handle it
            return false;
          }
        }
        return false;
      },
      handleKeyDown: (view, event) => {
        // Handle keyboard shortcuts for table operations
        if (!editor?.isActive("table")) return false;

        const { state } = view;
        const { selection } = state;
        const { $from } = selection;

        // Check if current cell is empty
        const cellNode = $from.node($from.depth);
        const isEmpty = cellNode && cellNode.content.size === 0;

        // Cmd/Ctrl+Delete to delete row (works always)
        if (
          (event.metaKey || event.ctrlKey) &&
          (event.key === "Backspace" || event.key === "Delete")
        ) {
          event.preventDefault();
          editor.chain().focus().deleteRow().run();
          return true;
        }

        // Shift+Delete to delete column (works always)
        if (event.shiftKey && (event.key === "Backspace" || event.key === "Delete")) {
          event.preventDefault();
          editor.chain().focus().deleteColumn().run();
          return true;
        }

        // Plain Delete/Backspace on empty cell deletes the row
        if (isEmpty && (event.key === "Backspace" || event.key === "Delete")) {
          event.preventDefault();
          editor.chain().focus().deleteRow().run();
          return true;
        }

        return false;
      },
    },
    content: content,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      setEditorContent(html);
      onChange(html);
    },
    immediatelyRender: false,
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
      setEditorContent(content);
    }
  }, [content, editor]);

  const handleFormatAction = (action: string) => {
    if (!editor) return;

    switch (action) {
      case "bold":
        editor.chain().focus().toggleBold().run();
        break;
      case "italic":
        editor.chain().focus().toggleItalic().run();
        break;
      case "underline":
        editor.chain().focus().toggleUnderline().run();
        break;
      case "strikethrough":
        editor.chain().focus().toggleStrike().run();
        break;
      case "h1":
        editor.chain().focus().toggleHeading({ level: 1 }).run();
        break;
      case "h2":
        editor.chain().focus().toggleHeading({ level: 2 }).run();
        break;
      case "h3":
        editor.chain().focus().toggleHeading({ level: 3 }).run();
        break;
      case "bulletList":
        editor.chain().focus().toggleBulletList().run();
        break;
      case "numberedList":
        editor.chain().focus().toggleOrderedList().run();
        break;
      case "quote":
        editor.chain().focus().toggleBlockquote().run();
        break;
      case "link":
        const url = window.prompt("Enter URL");
        if (url) {
          editor.chain().focus().setLink({ href: url }).run();
        } else {
          editor.chain().focus().unsetLink().run();
        }
        break;
      case "image":
        // Trigger file input click
        fileInputRef.current?.click();
        break;
      case "undo":
        editor.chain().focus().undo().run();
        break;
      case "redo":
        editor.chain().focus().redo().run();
        break;
      case "deleteTable":
        editor.chain().focus().deleteTable().run();
        break;
      case "addColumnBefore":
        editor.chain().focus().addColumnBefore().run();
        break;
      case "addColumnAfter":
        editor.chain().focus().addColumnAfter().run();
        break;
      case "deleteColumn":
        editor.chain().focus().deleteColumn().run();
        break;
      case "addRowBefore":
        editor.chain().focus().addRowBefore().run();
        break;
      case "addRowAfter":
        editor.chain().focus().addRowAfter().run();
        break;
      case "deleteRow":
        editor.chain().focus().deleteRow().run();
        break;
      case "toggleHeaderRow":
        editor.chain().focus().toggleHeaderRow().run();
        break;
      case "mergeCells":
        editor.chain().focus().mergeCells().run();
        break;
      case "splitCell":
        editor.chain().focus().splitCell().run();
        break;
      default:
        break;
    }
  };

  const handleInsertTable = (rows: number, cols: number) => {
    if (!editor) return;

    // 檢查光標是否在表格內
    if (editor.isActive("table")) {
      alert("Cannot insert table inside another table");
      setShowTableSelector(false);
      return;
    }

    editor.chain().focus().insertTable({ rows, cols, withHeaderRow: false }).run();
  };

  return (
    <>
      {/* Hidden file input for image upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={handleImageFileSelect}
      />

      {/* Insert Button Dialog */}
      <InsertButtonDialog
        isOpen={showInsertButtonDialog}
        onClose={() => setShowInsertButtonDialog(false)}
        onInsert={(buttonHtml, campaignId, deadline) => {
          if (editor) {
            editor.chain().focus().insertContent(buttonHtml).run();
          }
          onCampaignInserted?.(campaignId, deadline);
          setShowInsertButtonDialog(false);
        }}
      />

      <div className="flex-col">
        <div className="pb-4">
          {/* Toolbar */}
          <div className="flex flex-wrap items-center rounded-md p-1 bg-gray-200 mb-4">
            <ToolbarButton
              icon={<LinkIcon size={18} />}
              onClick={() => handleFormatAction("link")}
              label="Insert link"
              isActive={editor?.isActive("link")}
            />
            <ToolbarButton
              icon={<Bold size={18} />}
              onClick={() => handleFormatAction("bold")}
              label="Bold text"
              isActive={editor?.isActive("bold")}
            />
            <ToolbarButton
              icon={<Italic size={18} />}
              onClick={() => handleFormatAction("italic")}
              label="Italic text"
              isActive={editor?.isActive("italic")}
            />
            <ToolbarButton
              icon={<UnderlineIcon size={18} />}
              onClick={() => handleFormatAction("underline")}
              label="Underline text"
              isActive={editor?.isActive("underline")}
            />
            <ToolbarButton
              icon={<Strikethrough size={18} />}
              onClick={() => handleFormatAction("strikethrough")}
              label="Strikethrough text"
              isActive={editor?.isActive("strike")}
            />
            <ToolbarButton
              icon={<Heading1 size={18} />}
              onClick={() => handleFormatAction("h1")}
              label="Heading 1"
              isActive={editor?.isActive("heading", { level: 1 })}
            />
            <ToolbarButton
              icon={<Heading2 size={18} />}
              onClick={() => handleFormatAction("h2")}
              label="Heading 2"
              isActive={editor?.isActive("heading", { level: 2 })}
            />
            <ToolbarButton
              icon={<Heading3 size={18} />}
              onClick={() => handleFormatAction("h3")}
              label="Heading 3"
              isActive={editor?.isActive("heading", { level: 3 })}
            />
            <ToolbarButton
              icon={<List size={18} />}
              onClick={() => handleFormatAction("bulletList")}
              label="Bullet list"
              isActive={editor?.isActive("bulletList")}
            />
            <ToolbarButton
              icon={<ListOrdered size={18} />}
              onClick={() => handleFormatAction("numberedList")}
              label="Numbered list"
              isActive={editor?.isActive("orderedList")}
            />
            <ToolbarButton
              icon={<Quote size={18} />}
              onClick={() => handleFormatAction("quote")}
              label="Quote"
              isActive={editor?.isActive("blockquote")}
            />
            <ToolbarButton
              icon={<ImageIcon size={18} aria-hidden="true" />}
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
            <div className="w-px h-6 bg-gray-400 mx-1" />
            <div className="relative" ref={tableSelectorRef}>
              <button
                className={cn(
                  "p-2 mx-1 rounded transition-colors",
                  editor?.isActive("table")
                    ? "bg-gray-300 cursor-not-allowed opacity-50"
                    : "hover:bg-gray-100"
                )}
                onClick={() => {
                  if (editor?.isActive("table")) {
                    alert("Cannot insert table inside another table");
                    return;
                  }
                  setShowTableSelector(!showTableSelector);
                }}
                title={
                  editor?.isActive("table")
                    ? "Cannot insert table inside another table"
                    : "Insert table"
                }
                aria-label="Insert table"
                disabled={editor?.isActive("table")}
              >
                <TableIcon size={18} />
              </button>
              {showTableSelector && !editor?.isActive("table") && (
                <TableSizeSelector
                  onSelect={handleInsertTable}
                  onClose={() => setShowTableSelector(false)}
                />
              )}
            </div>
            {editor?.isActive("table") && (
              <>
                <ToolbarButton
                  icon={
                    <div className="flex items-center gap-0.5">
                      <Columns size={16} />
                      <span className="text-xs">+</span>
                    </div>
                  }
                  onClick={() => handleFormatAction("addColumnAfter")}
                  label="Add column after"
                />
                <ToolbarButton
                  icon={
                    <div className="flex items-center gap-0.5">
                      <Columns size={16} />
                      <span className="text-xs">-</span>
                    </div>
                  }
                  onClick={() => handleFormatAction("deleteColumn")}
                  label="Delete column"
                />
                <ToolbarButton
                  icon={
                    <div className="flex items-center gap-0.5">
                      <Rows size={16} />
                      <span className="text-xs">+</span>
                    </div>
                  }
                  onClick={() => handleFormatAction("addRowAfter")}
                  label="Add row after"
                />
                <ToolbarButton
                  icon={
                    <div className="flex items-center gap-0.5">
                      <Rows size={16} />
                      <span className="text-xs">-</span>
                    </div>
                  }
                  onClick={() => handleFormatAction("deleteRow")}
                  label="Delete row"
                />
                <div className="w-px h-6 bg-gray-400 mx-1" />
                <ToolbarButton
                  icon={
                    <div className="flex flex-col items-center">
                      <Rows size={14} />
                      <span className="text-[8px] leading-none">H</span>
                    </div>
                  }
                  onClick={() => handleFormatAction("toggleHeaderRow")}
                  label="Toggle header row"
                  isActive={editor?.isActive("tableHeader")}
                />
                <ToolbarButton
                  icon={<Trash2 size={18} className="text-red-600" />}
                  onClick={() => handleFormatAction("deleteTable")}
                  label="Delete table"
                />
              </>
            )}
            <ToolbarButton
              icon={<CalendarCheck size={18} />}
              onClick={() => setShowInsertButtonDialog(true)}
              label="Insert Button"
            />
          </div>

          <div className="border border-sky-950 p-4 rounded-t-lg bg-sky-950 flex justify-between items-center">
            <span className="text-sm font-medium text-white">Template</span>
            <span className="text-xs text-white/80">
              💡 Tip: Press Enter between images for line breaks
            </span>
          </div>

          {/* Editor Content with Drag and Drop */}
          <div
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className="relative"
          >
            {isDragging && (
              <div className="absolute inset-0 z-50 flex items-center justify-center bg-blue-50 bg-opacity-90 border-2 border-dashed border-blue-500 rounded-b-lg">
                <div className="text-center">
                  <ImageIcon size={48} className="mx-auto mb-2 text-blue-500" />
                  <p className="text-lg font-semibold text-blue-700">Drop image here</p>
                  <p className="text-sm text-blue-600">One image at a time</p>
                </div>
              </div>
            )}
            <EditorContent
              editor={editor}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              className="p-4 border border-gray-200 border-t-0 bg-gray-50 rounded-b-lg"
            />
          </div>
        </div>
      </div>
    </>
  );
}
