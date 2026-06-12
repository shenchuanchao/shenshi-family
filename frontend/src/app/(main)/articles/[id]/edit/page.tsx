"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import { FileText, Send, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";

import { Breadcrumb } from "@/components/ui/breadcrumb";
import { useAuth } from "@/lib/auth-context";
import { getArticle, updateArticle } from "@/lib/api";
import { RichTextEditor } from "@/components/editor/rich-text-editor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const CATEGORIES = [
  { value: "news", label: "最新动态" },
  { value: "celebrity", label: "名人堂" },
  { value: "genealogy", label: "族谱" },
  { value: "family_rules", label: "家规家训" },
];

export default function EditArticlePage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params.id;
  const { isAuthenticated, token, loading: authLoading } = useAuth();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("news");
  const [dynasty, setDynasty] = useState("");
  const [field, setField] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const fetchArticle = useCallback(async () => {
    setLoading(true);
    try {
      const article = await getArticle(id);
      setTitle(article.title);
      setContent(article.content);
      setCategory(article.category);
      setDynasty(article.dynasty ?? "");
      setField(article.field ?? "");
      setCoverImage(article.cover_image ?? "");
    } catch {
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchArticle();
  }, [fetchArticle]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [authLoading, isAuthenticated, router]);

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
      await updateArticle(
        id,
        {
          title: title.trim(),
          content,
          category,
          dynasty: dynasty.trim() || undefined,
          field: field.trim() || undefined,
          cover_image: coverImage.trim() || undefined,
        },
        token
      );
      toast.success("文章更新成功！");
      router.push(`/articles/${id}`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "更新失败，请稍后重试";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="container max-w-3xl px-4 py-8 md:px-6 md:py-12">
        <Skeleton className="mb-6 h-5 w-24" />
        <Skeleton className="mb-8 h-8 w-48" />
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-40" />
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (notFound) {
    return (
      <div className="container flex max-w-3xl flex-col items-center px-4 py-20 text-center md:px-6">
        <h1 className="font-heading text-2xl font-bold">文章不存在</h1>
        <Button variant="outline" className="mt-6" onClick={() => router.push("/articles")}>
          <ArrowLeft className="size-4" />
          返回文章列表
        </Button>
      </div>
    );
  }

  return (
    <div className="container max-w-3xl px-4 py-8 md:px-6 md:py-12">
      {/* Breadcrumb */}
      <Breadcrumb items={[{ label: "文章管理", href: "/articles" }, { label: title || "编辑文章" }]} />

      <h1 className="mb-8 flex items-center gap-3 font-heading text-2xl font-bold tracking-tight text-dai-green md:text-3xl">
        <FileText className="size-7" />
        编辑文章
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

          {/* Cover image */}
          <div className="space-y-2">
            <Label htmlFor="article-cover">封面图片链接（可选）</Label>
            <Input
              id="article-cover"
              placeholder="https://..."
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
            />
          </div>

          {/* Rich Text Editor */}
          <div className="space-y-2">
            <Label>文章内容</Label>
            <RichTextEditor
              content={content}
              onChange={setContent}
              placeholder="编辑文章内容..."
              minHeight="360px"
            />
          </div>

          {/* Submit */}
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={() => router.push(`/articles/${id}`)}>
              取消
            </Button>
            <Button onClick={handleSubmit} disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  更新中...
                </>
              ) : (
                <>
                  <Send className="size-4" />
                  保存修改
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
