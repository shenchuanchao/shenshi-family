"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { FileText, ArrowLeft, Check, X, Eye } from "lucide-react";

import { useAuth } from "@/lib/auth-context";
import { getDrafts, reviewArticle, deleteArticle } from "@/lib/api";
import type { Article } from "@/lib/types";

import { Button } from "@/components/ui/button";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const PAGE_SIZE = 10;

const CATEGORY_LABELS: Record<string, string> = {
  celebrity: "名人堂",
  family_rules: "家规家训",
  news: "最新动态",
  genealogy: "族谱",
};

export default function AdminReviewPage() {
  const router = useRouter();
  const { isAuthenticated, token, user, loading: authLoading } = useAuth();

  const [articles, setArticles] = useState<Article[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const isAdmin = user?.role === "admin" || user?.role === "editor";

  // Redirect non-admin users
  useEffect(() => {
    if (!authLoading && (!isAuthenticated || !isAdmin)) {
      router.push("/articles");
    }
  }, [authLoading, isAuthenticated, isAdmin, router]);

  const fetchDrafts = useCallback(async (p: number) => {
    if (!token || !isAuthenticated) return;
    setLoading(true);
    try {
      const res = await getDrafts(token, {
        page: p,
        limit: PAGE_SIZE,
      });
      setArticles(res.data ?? []);
      setTotal(res.total ?? 0);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "加载失败";
      toast.error(msg);
      setArticles([]);
    } finally {
      setLoading(false);
    }
  }, [token, isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated && isAdmin) fetchDrafts(page);
  }, [page, fetchDrafts, isAuthenticated, isAdmin]);

  const handleReview = async (id: string, action: "approve" | "reject") => {
    setActionLoading(id);
    try {
      await reviewArticle(id, action, undefined, token!);
      toast.success(action === "approve" ? "文章已通过审核" : "文章已驳回");
      // Remove from list
      setArticles((prev) => prev.filter((a) => a.id !== id));
      setTotal((prev) => prev - 1);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "操作失败";
      toast.error(msg);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("确定要删除这篇文章吗？")) return;
    setActionLoading(id);
    try {
      await deleteArticle(id, token!);
      toast.success("文章已删除");
      setArticles((prev) => prev.filter((a) => a.id !== id));
      setTotal((prev) => prev - 1);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "删除失败";
      toast.error(msg);
    } finally {
      setActionLoading(null);
    }
  };

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

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
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { label: "文章管理", href: "/articles" },
          { label: "审核管理" },
        ]}
      />

      <h1 className="mb-8 flex items-center gap-3 font-heading text-2xl font-bold tracking-tight text-dai-green md:text-3xl">
        <FileText className="size-7" />
        文章审核
      </h1>

      {loading ? (
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
                    onClick={() => handleReview(article.id, "approve")}
                    disabled={actionLoading === article.id}
                  >
                    <Check className="size-3" />
                    {actionLoading === article.id ? "处理中..." : "通过"}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-500 hover:bg-red-50 hover:text-red-600"
                    onClick={() => handleReview(article.id, "reject")}
                    disabled={actionLoading === article.id}
                  >
                    <X className="size-3" />
                    驳回
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="ml-auto text-xs text-red-400 hover:bg-red-50 hover:text-red-500"
                    onClick={() => handleDelete(article.id)}
                    disabled={actionLoading === article.id}
                  >
                    删除
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      text="上一页"
                      href="#"
                      onClick={(e: React.MouseEvent) => {
                        e.preventDefault();
                        if (page > 1) setPage((p) => p - 1);
                      }}
                      className={
                        page <= 1 ? "pointer-events-none opacity-40" : ""
                      }
                    />
                  </PaginationItem>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (p) => (
                      <PaginationItem key={p}>
                        <PaginationLink
                          href="#"
                          isActive={p === page}
                          onClick={(e: React.MouseEvent) => {
                            e.preventDefault();
                            setPage(p);
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
                        if (page < totalPages) setPage((p) => p + 1);
                      }}
                      className={
                        page >= totalPages
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
    </div>
  );
}