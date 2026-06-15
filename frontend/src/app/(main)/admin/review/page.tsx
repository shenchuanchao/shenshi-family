"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import {
  FileText,
  Check,
  X,
  Eye,
  ImageIcon,
  ZoomIn,
  Trash2,
} from "lucide-react";

import { useAuth } from "@/lib/auth-context";
import {
  getDrafts,
  reviewArticle,
  deleteArticle,
  getPendingGalleryImages,
  reviewGalleryImage,
  deleteGalleryImage,
} from "@/lib/api";
import type { Article, GalleryImage } from "@/lib/types";

import { Button } from "@/components/ui/button";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import {
  Card,
  CardContent,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const PAGE_SIZE = 10;
const GALLERY_PAGE_SIZE = 12;

const CATEGORY_LABELS: Record<string, string> = {
  celebrity: "名人堂",
  family_rules: "家规家训",
  news: "最新动态",
  genealogy: "族谱",
};

export default function AdminReviewPage() {
  const router = useRouter();
  const { isAuthenticated, token, user, loading: authLoading } = useAuth();

  const [activeTab, setActiveTab] = useState("articles");

  // ── Article review state ──
  const [articles, setArticles] = useState<Article[]>([]);
  const [articleTotal, setArticleTotal] = useState(0);
  const [articlePage, setArticlePage] = useState(1);
  const [articleLoading, setArticleLoading] = useState(true);
  const [articleActionLoading, setArticleActionLoading] = useState<string | null>(null);

  // ── Gallery review state ──
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [galleryTotal, setGalleryTotal] = useState(0);
  const [galleryPage, setGalleryPage] = useState(1);
  const [galleryLoading, setGalleryLoading] = useState(true);
  const [galleryActionLoading, setGalleryActionLoading] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<GalleryImage | null>(null);

  const isAdmin = user?.role === "admin" || user?.role === "editor";

  // Redirect non-admin users
  useEffect(() => {
    if (!authLoading && (!isAuthenticated || !isAdmin)) {
      router.push("/articles");
    }
  }, [authLoading, isAuthenticated, isAdmin, router]);

  // ── Fetch articles ──
  const fetchDrafts = useCallback(async (p: number) => {
    if (!token || !isAuthenticated) return;
    setArticleLoading(true);
    try {
      const res = await getDrafts(token, { page: p, limit: PAGE_SIZE });
      setArticles(res.data ?? []);
      setArticleTotal(res.total ?? 0);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "加载失败";
      toast.error(msg);
      setArticles([]);
    } finally {
      setArticleLoading(false);
    }
  }, [token, isAuthenticated]);

  // ── Fetch gallery images ──
  const fetchPendingImages = useCallback(async (p: number) => {
    if (!token || !isAuthenticated) return;
    setGalleryLoading(true);
    try {
      const res = await getPendingGalleryImages(token, {
        page: p,
        limit: GALLERY_PAGE_SIZE,
      });
      setGalleryImages(res.data ?? []);
      setGalleryTotal(res.total ?? 0);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "加载失败";
      toast.error(msg);
      setGalleryImages([]);
    } finally {
      setGalleryLoading(false);
    }
  }, [token, isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated && isAdmin) {
      if (activeTab === "articles") fetchDrafts(articlePage);
      if (activeTab === "gallery") fetchPendingImages(galleryPage);
    }
  }, [activeTab, articlePage, galleryPage, fetchDrafts, fetchPendingImages, isAuthenticated, isAdmin]);

  // ── Article handlers ──
  const handleArticleReview = async (id: string, action: "approve" | "reject") => {
    setArticleActionLoading(id);
    try {
      await reviewArticle(id, action, undefined, token!);
      toast.success(action === "approve" ? "文章已通过审核" : "文章已驳回");
      setArticles((prev) => prev.filter((a) => a.id !== id));
      setArticleTotal((prev) => prev - 1);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "操作失败";
      toast.error(msg);
    } finally {
      setArticleActionLoading(null);
    }
  };

  const handleArticleDelete = async (id: string) => {
    if (!confirm("确定要删除这篇文章吗？")) return;
    setArticleActionLoading(id);
    try {
      await deleteArticle(id, token!);
      toast.success("文章已删除");
      setArticles((prev) => prev.filter((a) => a.id !== id));
      setArticleTotal((prev) => prev - 1);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "删除失败";
      toast.error(msg);
    } finally {
      setArticleActionLoading(null);
    }
  };

  // ── Gallery handlers ──
  const handleGalleryReview = async (id: string, action: "approve" | "reject") => {
    setGalleryActionLoading(id);
    try {
      let reason: string | undefined;
      if (action === "reject") {
        reason = prompt("请输入驳回原因（可选）：") || undefined;
      }
      await reviewGalleryImage(id, action, token!, reason);
      toast.success(action === "approve" ? "影像已通过审核" : "影像已驳回");
      setGalleryImages((prev) => prev.filter((img) => img.id !== id));
      setGalleryTotal((prev) => prev - 1);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "操作失败";
      toast.error(msg);
    } finally {
      setGalleryActionLoading(null);
    }
  };

  const handleGalleryDelete = async (id: string) => {
    if (!confirm("确定要删除这张影像吗？")) return;
    setGalleryActionLoading(id);
    try {
      await deleteGalleryImage(id, token!);
      toast.success("影像已删除");
      setGalleryImages((prev) => prev.filter((img) => img.id !== id));
      setGalleryTotal((prev) => prev - 1);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "删除失败";
      toast.error(msg);
    } finally {
      setGalleryActionLoading(null);
    }
  };

  const articleTotalPages = Math.max(1, Math.ceil(articleTotal / PAGE_SIZE));
  const galleryTotalPages = Math.max(1, Math.ceil(galleryTotal / GALLERY_PAGE_SIZE));

  if (authLoading) {
    return (
      <div className="container max-w-4xl px-4 py-8 md:px-6 md:py-12">
        <p className="text-sm text-muted-foreground">加载中...</p>
      </div>
    );
  }

  if (!isAuthenticated || !isAdmin) {
    return null;
  }

  return (
    <div className="container max-w-4xl px-4 py-8 md:px-6 md:py-12">
      <Breadcrumb
        items={[
          { label: "管理后台", href: "/articles" },
          { label: "审核管理" },
        ]}
      />

      <h1 className="mb-8 font-heading text-2xl font-bold tracking-tight text-dai-green md:text-3xl">
        审核管理
      </h1>

      <Tabs defaultValue="articles" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6 w-full">
          <TabsTrigger value="articles" className="flex-1 gap-1.5">
            <FileText className="size-3.5" />
            文章审核
            {articleTotal > 0 && (
              <Badge variant="secondary" className="ml-1 h-5 min-w-5 px-1 text-xs">
                {articleTotal}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="gallery" className="flex-1 gap-1.5">
            <ImageIcon className="size-3.5" />
            影像审核
            {galleryTotal > 0 && (
              <Badge variant="secondary" className="ml-1 h-5 min-w-5 px-1 text-xs">
                {galleryTotal}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        {/* ═══════════════════════════════════════════ */}
        {/* Article Review Tab                          */}
        {/* ═══════════════════════════════════════════ */}
        <TabsContent value="articles">
          {articleLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <Card key={i}>
                  <CardContent className="py-5">
                    <Skeleton className="mb-3 h-5 w-3/4" />
                    <Skeleton className="mb-2 h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                    <div className="mt-4 flex gap-3">
                      <Skeleton className="h-8 w-20" />
                      <Skeleton className="h-8 w-20" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : articles.length === 0 ? (
            <div className="flex flex-col items-center py-20 text-center">
              <FileText className="size-12 text-muted-foreground/40" />
              <p className="mt-4 text-lg font-medium text-muted-foreground">
                暂无待审核文章
              </p>
              <p className="mt-1 text-sm text-muted-foreground/70">
                当有用户提交投稿时，会出现在这里
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {articles.map((article) => (
                <Card key={article.id}>
                  <CardContent className="py-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <CardTitle className="font-heading text-lg">
                          {article.title}
                        </CardTitle>
                        <div className="mt-2 flex flex-wrap items-center gap-2">
                          <Badge variant="secondary" className="text-xs">
                            {CATEGORY_LABELS[article.category] ?? article.category}
                          </Badge>
                          <Badge
                            variant="secondary"
                            className="bg-yellow-100 text-yellow-800 border-0 text-xs"
                          >
                            {article.status === "draft" ? "待审核" : article.status}
                          </Badge>
                          {article.author && (
                            <span className="text-xs text-muted-foreground">
                              作者：{article.author.nickname ?? "未知"}
                            </span>
                          )}
                          <span className="text-xs text-muted-foreground">
                            {new Date(article.created_at).toLocaleDateString("zh-CN")}
                          </span>
                        </div>
                        <p className="mt-3 text-sm leading-relaxed text-muted-foreground line-clamp-3">
                          {article.content.replace(/<[^>]*>/g, "").slice(0, 200)}
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center gap-2">
                      <Link href={`/news/${article.id}`} target="_blank">
                        <Button variant="outline" size="sm">
                          <Eye className="size-3" />
                          预览
                        </Button>
                      </Link>
                      <Button
                        variant="default"
                        size="sm"
                        className="bg-dai-green hover:bg-dai-green-dark"
                        onClick={() => handleArticleReview(article.id, "approve")}
                        disabled={articleActionLoading === article.id}
                      >
                        <Check className="size-3" />
                        {articleActionLoading === article.id ? "处理中..." : "通过"}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-500 hover:bg-red-50 hover:text-red-600"
                        onClick={() => handleArticleReview(article.id, "reject")}
                        disabled={articleActionLoading === article.id}
                      >
                        <X className="size-3" />
                        驳回
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="ml-auto text-xs text-red-400 hover:bg-red-50 hover:text-red-500"
                        onClick={() => handleArticleDelete(article.id)}
                        disabled={articleActionLoading === article.id}
                      >
                        删除
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {articleTotalPages > 1 && (
                <div className="mt-6">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          text="上一页"
                          href="#"
                          onClick={(e: React.MouseEvent) => {
                            e.preventDefault();
                            if (articlePage > 1) setArticlePage((p) => p - 1);
                          }}
                          className={
                            articlePage <= 1 ? "pointer-events-none opacity-40" : ""
                          }
                        />
                      </PaginationItem>
                      {Array.from({ length: articleTotalPages }, (_, i) => i + 1).map(
                        (p) => (
                          <PaginationItem key={p}>
                            <PaginationLink
                              href="#"
                              isActive={p === articlePage}
                              onClick={(e: React.MouseEvent) => {
                                e.preventDefault();
                                setArticlePage(p);
                              }}
                            >
                              {p}
                            </PaginationLink>
                          </PaginationItem>
                        )
                      )}
                      <PaginationItem>
                        <PaginationNext
                          text="下一页"
                          href="#"
                          onClick={(e: React.MouseEvent) => {
                            e.preventDefault();
                            if (articlePage < articleTotalPages) setArticlePage((p) => p + 1);
                          }}
                          className={
                            articlePage >= articleTotalPages
                              ? "pointer-events-none opacity-40"
                              : ""
                          }
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </div>
          )}
        </TabsContent>

        {/* ═══════════════════════════════════════════ */}
        {/* Gallery Review Tab                         */}
        {/* ═══════════════════════════════════════════ */}
        <TabsContent value="gallery">
          {galleryLoading ? (
            <div className="grid gap-3 grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <Skeleton className="aspect-square w-full rounded-none" />
                  <CardContent className="py-3">
                    <Skeleton className="mb-2 h-3 w-3/4" />
                    <div className="flex gap-2">
                      <Skeleton className="h-7 w-16" />
                      <Skeleton className="h-7 w-16" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : galleryImages.length === 0 ? (
            <div className="flex flex-col items-center py-20 text-center">
              <ImageIcon className="size-12 text-muted-foreground/40" />
              <p className="mt-4 text-lg font-medium text-muted-foreground">
                暂无待审核影像
              </p>
              <p className="mt-1 text-sm text-muted-foreground/70">
                当有用户上传影像时，会出现在这里
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid gap-3 grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                {galleryImages.map((image) => (
                  <Card key={image.id} className="overflow-hidden">
                    <div className="relative group cursor-pointer" onClick={() => setPreviewImage(image)}>
                      <img
                        src={image.image_url}
                        alt={image.description ?? "待审核影像"}
                        className="aspect-square w-full object-cover transition-opacity group-hover:opacity-90"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/20">
                        <ZoomIn className="size-8 text-white opacity-0 transition-opacity group-hover:opacity-100" />
                      </div>
                    </div>
                    <CardContent className="py-2 px-2.5">
                      {image.description && (
                        <p className="mb-1.5 text-xs leading-relaxed text-muted-foreground line-clamp-1">
                          {image.description}
                        </p>
                      )}
                      <div className="mb-2 flex items-center gap-1.5">
                        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-0 text-[10px] px-1.5">
                          待审核
                        </Badge>
                        <span className="text-[10px] text-muted-foreground">
                          {new Date(image.created_at).toLocaleDateString("zh-CN")}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Button
                          variant="default"
                          size="sm"
                          className="flex-1 h-7 bg-dai-green hover:bg-dai-green-dark text-xs"
                          onClick={() => handleGalleryReview(image.id, "approve")}
                          disabled={galleryActionLoading === image.id}
                        >
                          <Check className="size-3" />
                          通过
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 h-7 text-xs text-red-500 hover:bg-red-50 hover:text-red-600"
                          onClick={() => handleGalleryReview(image.id, "reject")}
                          disabled={galleryActionLoading === image.id}
                        >
                          <X className="size-3" />
                          驳回
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0 text-red-400 hover:bg-red-50 hover:text-red-500"
                          onClick={() => handleGalleryDelete(image.id)}
                          disabled={galleryActionLoading === image.id}
                        >
                          <Trash2 className="size-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {galleryTotalPages > 1 && (
                <div className="mt-6">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          text="上一页"
                          href="#"
                          onClick={(e: React.MouseEvent) => {
                            e.preventDefault();
                            if (galleryPage > 1) setGalleryPage((p) => p - 1);
                          }}
                          className={
                            galleryPage <= 1 ? "pointer-events-none opacity-40" : ""
                          }
                        />
                      </PaginationItem>
                      {Array.from({ length: galleryTotalPages }, (_, i) => i + 1).map(
                        (p) => (
                          <PaginationItem key={p}>
                            <PaginationLink
                              href="#"
                              isActive={p === galleryPage}
                              onClick={(e: React.MouseEvent) => {
                                e.preventDefault();
                                setGalleryPage(p);
                              }}
                            >
                              {p}
                            </PaginationLink>
                          </PaginationItem>
                        )
                      )}
                      <PaginationItem>
                        <PaginationNext
                          text="下一页"
                          href="#"
                          onClick={(e: React.MouseEvent) => {
                            e.preventDefault();
                            if (galleryPage < galleryTotalPages) setGalleryPage((p) => p + 1);
                          }}
                          className={
                            galleryPage >= galleryTotalPages
                              ? "pointer-events-none opacity-40"
                              : ""
                          }
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* ── Image Preview Modal ── */}
      {previewImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setPreviewImage(null)}
        >
          <div className="relative max-h-[90vh] max-w-3xl" onClick={(e) => e.stopPropagation()}>
            <img
              src={previewImage.image_url}
              alt={previewImage.description ?? "影像预览"}
              className="max-h-[80vh] w-auto rounded-lg object-contain"
            />
            {previewImage.description && (
              <p className="mt-3 text-center text-sm text-white/80">
                {previewImage.description}
              </p>
            )}
            <button
              type="button"
              className="absolute -right-2 -top-2 flex size-8 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition-colors hover:bg-white/40"
              onClick={() => setPreviewImage(null)}
            >
              <X className="size-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
