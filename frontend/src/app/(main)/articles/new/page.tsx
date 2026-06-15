"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { FileText, Send, Upload, X, ImagePlus } from "lucide-react";

import { useAuth } from "@/lib/auth-context";
import { createArticle, submitArticle, uploadImage } from "@/lib/api";
import { RichTextEditor } from "@/components/editor/rich-text-editor";
import { Button } from "@/components/ui/button";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
} from "@/components/ui/card";

const CATEGORIES = [
  { value: "news", label: "最新动态" },
  { value: "celebrity", label: "名人堂" },
  { value: "genealogy", label: "族谱" },
  { value: "family_rules", label: "家规家训" },
];

export default function NewArticlePage() {
  const router = useRouter();
  const { isAuthenticated, token, user, loading: authLoading } = useAuth();

  const isAdminEditor = user?.role === "admin" || user?.role === "editor";

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("news");
  const [dynasty, setDynasty] = useState("");
  const [field, setField] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [coverUploading, setCoverUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const coverInputRef = useRef<HTMLInputElement>(null);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [authLoading, isAuthenticated, router]);

  // Upload cover image from local file
  const handleCoverFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !token) return;
    if (!file.type.startsWith("image/")) {
      toast.error("请选择图片文件");
      return;
    }
    setCoverUploading(true);
    try {
      const result = await uploadImage(file, token);
      setCoverImage(result.url);
      toast.success("封面上传成功");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "封面上传失败";
      toast.error(msg);
    } finally {
      setCoverUploading(false);
      if (coverInputRef.current) coverInputRef.current.value = "";
    }
  };

  // Image upload handler for rich text editor
  const handleEditorImageUpload = useCallback(
    async (file: File): Promise<string> => {
      if (!token) throw new Error("请先登录");
      const result = await uploadImage(file, token);
      return result.url;
    },
    [token]
  );

  const handleSubmit = async () => {
    if (!title.trim()) {
      toast.error("请输入文章标题");
      return;
    }
    if (!content.trim()) {
      toast.error("请输入文章内容");
      return;
    }
    if (!token) {
      toast.error("请先登录");
      return;
    }

    setSubmitting(true);
    try {
      const articleData = {
        title: title.trim(),
        content,
        category,
        dynasty: dynasty.trim() || undefined,
        field: field.trim() || undefined,
        cover_image: coverImage.trim() || undefined,
      };

      // Admin/editor directly publish; regular users submit for review
      const article = isAdminEditor
        ? await createArticle(articleData, token)
        : await submitArticle(articleData, token);

      toast.success(isAdminEditor ? "文章发布成功！" : "文章已提交审核！");
      router.push(`/articles/${article.id}`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "操作失败，请稍后重试";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading) {
    return (
      <div className="container max-w-3xl px-4 py-8 md:px-6 md:py-12">
        <p className="text-sm text-muted-foreground">加载中...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="container max-w-3xl px-4 py-8 md:px-6 md:py-12">
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { label: "文章管理", href: "/articles" },
          { label: "新建文章" },
        ]}
      />

      <h1 className="mb-8 flex items-center gap-3 font-heading text-2xl font-bold tracking-tight text-dai-green md:text-3xl">
        <FileText className="size-7" />
        {isAdminEditor ? "发布文章" : "投稿"}
      </h1>

      <Card>
        <CardContent className="space-y-6 pt-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="article-title">文章标题</Label>
            <Input
              id="article-title"
              placeholder="请输入文章标题"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="article-category">分类</Label>
            <select
              id="article-category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="flex h-9 w-full rounded-lg border border-input bg-transparent px-3 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          {/* Extra fields: dynasty + field (side by side) */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="article-dynasty">朝代（可选）</Label>
              <Input
                id="article-dynasty"
                placeholder="如：南朝梁"
                value={dynasty}
                onChange={(e) => setDynasty(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="article-field">领域（可选）</Label>
              <Input
                id="article-field"
                placeholder="如：书法、文学"
                value={field}
                onChange={(e) => setField(e.target.value)}
              />
            </div>
          </div>

          {/* Cover image — file upload + URL */}
          <div className="space-y-2">
            <Label>封面图片（可选）</Label>
            <div className="flex items-center gap-2">
              <input
                ref={coverInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleCoverFileChange}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => coverInputRef.current?.click()}
                disabled={coverUploading}
              >
                <Upload className="size-3.5" />
                {coverUploading ? "上传中..." : "上传图片"}
              </Button>
              <Input
                placeholder="或粘贴图片链接 https://..."
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
                className="flex-1"
              />
              {coverImage && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setCoverImage("")}
                >
                  <X className="size-3.5" />
                </Button>
              )}
            </div>
            {coverImage && (
              <div className="mt-2 flex items-center gap-3">
                <img
                  src={coverImage}
                  alt="封面预览"
                  className="h-20 rounded-lg border border-border object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
                <span className="text-xs text-muted-foreground">封面预览</span>
              </div>
            )}
          </div>

          {/* Rich Text Editor */}
          <div className="space-y-2">
            <Label>文章内容</Label>
            <RichTextEditor
              content={content}
              onChange={setContent}
              placeholder="开始编写文章内容..."
              minHeight="360px"
              onImageUpload={handleEditorImageUpload}
            />
            <p className="text-xs text-muted-foreground">
              <ImagePlus className="mr-1 inline size-3" />
              点击工具栏图片按钮可上传本地图片
            </p>
          </div>

          {/* Submit */}
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={() => router.back()}>
              取消
            </Button>
            <Button onClick={handleSubmit} disabled={submitting}>
              <Send className="size-4" />
              {submitting
                ? (isAdminEditor ? "发布中..." : "提交中...")
                : (isAdminEditor ? "发布文章" : "提交审核")}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
