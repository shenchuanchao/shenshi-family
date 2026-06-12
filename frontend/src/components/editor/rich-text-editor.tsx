"use client";

import { useCallback, useRef, useEffect } from "react";
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
}

// ---------------------------------------------------------------------------
// Toolbar Button
// ---------------------------------------------------------------------------

function ToolbarButton({
  onClick,
  active = false,
  children,
  title,
}: {
  onClick: () => void;
  active?: boolean;
  children: React.ReactNode;
  title: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={cn(
        "inline-flex h-8 w-8 items-center justify-center rounded-md text-sm transition-colors",
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
}: RichTextEditorProps) {
  const linkInputRef = useRef<HTMLInputElement>(null);

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

  const addImage = useCallback(() => {
    if (!editor) return;
    const url = window.prompt("请输入图片URL", "https://");
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  }, [editor]);

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
          <ToolbarButton onClick={addImage} title="插入图片">
            <ImagePlus className="size-4" />
          </ToolbarButton>
        </div>
      )}

      {/* Editor Content */}
      <EditorContent editor={editor} className="[&_.ProseMirror]:outline-none" />
    </div>
  );
}
