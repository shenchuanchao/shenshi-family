"use client";

import { useCallback, useRef, useEffect, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import ImageExtension from "@tiptap/extension-image";
import LinkExtension from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import "./editor.css";
import {
  Bold,
  Italic,
  Heading2,
  Heading3,
  Quote,
  List,
  Link2,
  ImagePlus,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

export interface RichTextEditorProps {
  /** Initial HTML content */
  content?: string;
  /** Called with the HTML output whenever content changes */
  onChange?: (html: string) => void;
  /** Placeholder text shown when the editor is empty */
  placeholder?: string;
  /** Whether the editor is read-only */
  editable?: boolean;
  /** Additional CSS classes for the outer wrapper */
  className?: string;
  /** Minimum height of the editor area */
  minHeight?: string;
  /** Called with a File when user picks an image; should return the uploaded URL */
  onImageUpload?: (file: File) => Promise<string>;
}

// ---------------------------------------------------------------------------
// Toolbar Button
// ---------------------------------------------------------------------------

function ToolbarButton({
  onClick,
  active = false,
  disabled = false,
  children,
  title,
}: {
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  title: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      disabled={disabled}
      className={cn(
        "inline-flex h-8 w-8 items-center justify-center rounded-md text-sm transition-colors",
        disabled && "opacity-50 cursor-not-allowed",
        active
          ? "bg-dai-green text-cream"
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      )}
    >
      {children}
    </button>
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function RichTextEditor({
  content = "",
  onChange,
  placeholder = "",
  editable = true,
  className,
  minHeight = "200px",
  onImageUpload,
}: RichTextEditorProps) {
  const linkInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3],
        },
      }),
      ImageExtension,
      LinkExtension.configure({
        openOnClick: true,
        HTMLAttributes: {
          target: "_blank",
          rel: "noopener noreferrer",
          class:
            "text-dai-green underline underline-offset-2 hover:text-dai-green-dark",
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content,
    editable,
    editorProps: {
      attributes: {
        class: cn(
          "prose prose-sm max-w-none focus:outline-none",
          "min-h-[var(--editor-min-height)]",
          "px-4 py-3",
          "text-foreground"
        ),
        style: `--editor-min-height: ${minHeight};`,
      },
    },
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },
    // Disable tiptap's default SSR mismatch
    immediatelyRender: false,
  });

  // Sync external content changes (e.g. clearing after submit)
  useEffect(() => {
    if (!editor) return;
    const currentHTML = editor.getHTML();
    if (content !== currentHTML) {
      editor.commands.setContent(content || "");
    }
  }, [content, editor]);

  const setLink = useCallback(() => {
    if (!editor) return;
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("请输入链接地址", previousUrl || "https://");
    if (url === null) return;
    // empty or cancelled
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }, [editor]);

  // Handle image insertion: local upload if onImageUpload provided, else URL prompt
  const handleImageButton = useCallback(() => {
    if (!editor) return;
    if (onImageUpload) {
      // Open file picker
      fileInputRef.current?.click();
    } else {
      // Fallback: prompt for URL
      const url = window.prompt("请输入图片URL", "https://");
      if (url) {
        editor.chain().focus().setImage({ src: url }).run();
      }
    }
  }, [editor, onImageUpload]);

  // Handle file input change
  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file || !editor || !onImageUpload) return;

      // Validate
      if (!file.type.startsWith("image/")) {
        alert("请选择图片文件");
        return;
      }

      setUploading(true);
      try {
        const url = await onImageUpload(file);
        editor.chain().focus().setImage({ src: url }).run();
      } catch (err) {
        console.error("Image upload failed:", err);
        alert("图片上传失败，请稍后重试");
      } finally {
        setUploading(false);
        // Reset input so the same file can be selected again
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    },
    [editor, onImageUpload]
  );

  if (!editor) {
    return null;
  }

  return (
    <div
      className={cn(
        "rounded-lg border border-input bg-background",
        "focus-within:ring-1 focus-within:ring-dai-green/30 focus-within:border-dai-green/50",
        className
      )}
    >
      {/* Hidden file input for image upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Toolbar */}
      {editable && (
        <div className="flex flex-wrap items-center gap-0.5 border-b border-border px-2 py-1.5">
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            active={editor.isActive("bold")}
            title="加粗"
          >
            <Bold className="size-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            active={editor.isActive("italic")}
            title="斜体"
          >
            <Italic className="size-4" />
          </ToolbarButton>

          <span className="mx-0.5 h-5 w-px bg-border" />

          <ToolbarButton
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
            active={editor.isActive("heading", { level: 2 })}
            title="二级标题"
          >
            <Heading2 className="size-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 3 }).run()
            }
            active={editor.isActive("heading", { level: 3 })}
            title="三级标题"
          >
            <Heading3 className="size-4" />
          </ToolbarButton>

          <span className="mx-0.5 h-5 w-px bg-border" />

          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            active={editor.isActive("blockquote")}
            title="引用"
          >
            <Quote className="size-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            active={editor.isActive("bulletList")}
            title="无序列表"
          >
            <List className="size-4" />
          </ToolbarButton>

          <span className="mx-0.5 h-5 w-px bg-border" />

          <ToolbarButton
            onClick={setLink}
            active={editor.isActive("link")}
            title="插入链接"
          >
            <Link2 className="size-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={handleImageButton}
            disabled={uploading}
            title={onImageUpload ? "上传图片" : "插入图片"}
          >
            {uploading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <ImagePlus className="size-4" />
            )}
          </ToolbarButton>
        </div>
      )}

      {/* Editor Content */}
      <EditorContent editor={editor} className="[&_.ProseMirror]:outline-none" />
    </div>
  );
}
