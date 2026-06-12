"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  FileText,
  PenLine,
  Send,
  Trash2,
  Pencil,
  Eye,
  Calendar,
  ShieldCheck,
} from "lucide-react";

import { useAuth } from "@/lib/auth-context";
import { getManageArticles, deleteArticle } from "@/lib/api";
import type { Article } from "@/lib/types";

import { Button } from "@/components/ui/button";
import { Breadcrumb } from "@/components/ui/breadcrumb";
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

const PAGE_SIZE = 15;

const CATEGORY_LABELS: Record<string, string> = {
  celebrity: "名人堂",
  family_rules: "家规家训",
  news: "最新动态",
  genealogy: "族谱",
};

const STATUS_LABELS: Record<string, { text: string; className: string }> = {
  draft: { text: "待审核", className: "bg-yellow-100 text-yellow-800" },
  published: { text: "已发布", className: "bg-green-100 text-green-800" },
  rejected: { text: "已驳回", className: "bg-red-100 text-red-800" },
};

export default function ArticlesManagePage() {
  const router = useRouter();
  const { isAuthenticated, token, user, loading: authLoading } = useAuth();

  const [articles, setArticles] = useState<Article[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  const isAdmin = user?.role === "admin" || user?.role === "editor";

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [authLoading, isAuthenticated, router]);

  const fetchArticles = useCallback(
    async (p: number) => {
      if (!token || !isAuthenticated) return;
      setLoading(true);
      try {
        const res = await getManageArticles(token, {
          page: p,
          limit: PAGE_SIZE,
        });
        setArticles(res.data ?? []);
        setTotal(res.total ?? 0);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "加载失败";
        toast.error(msg);
      } finally {
        setLoading(false);
      }
    },
    [token, isAuthenticated]
  );

  useEffect(() => {
    if (isAuthenticated) {
      fetchArticles(page);
    }
  }, [page, fetchArticles, isAuthenticated]);

  const handleDelete = async (id: string) => {
    if (!token || !confirm("确定删除？")) return;
    setDeleting(id);
    try {
      await deleteArticle(id, token);
      toast.success("已删除");
      setArticles((prev) => prev.filter((a) => a.id !== id));
      setTotal((prev) => prev - 1);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "删除失败";
      toast.error(msg);
    } finally {
      setDeleting(null);
    }
  };

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  if (authLoading) {
    return (
      <div className="container max-w-5xl px-4 py-8 md:px-6">
        <p className="text-sm text-muted-foreground">加载中...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="container max-w-5xl px-4 py-8 md:px-6 md:py-12">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Breadcrumb items={[{ label: "文章管理" }]} />
          <h1 className="flex items-center gap-3 font-heading text-2xl font-bold tracking-tight text-dai-green md:text-3xl">
            <FileText className="size-7" />
            {isAdmin ? "文章管理" : "我的投稿"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {isAdmin
              ? "管理所有文章，审核投稿"
              : "查看您提交的文章状态"}
          </p>
        </div>
        <div className="flex gap-2">
          {isAdmin ? (
            <>
              <Link href="/articles/new">
                <Button className="gap-1.5 bg-dai-green hover:bg-dai-green-dark">
                  <PenLine className="size-4" />
                  发布文章
                </Button>
              </Link>
              <Link href="/admin/review">
                <Button variant="outline" className="gap-1.5">
                  <ShieldCheck className="size-4" />
                  审核管理
                </Button>
              </Link>
            </>
          ) : (
            <Link href="/articles/new">
              <Button className="gap-1.5 bg-dai-green hover:bg-dai-green-dark">
                <Send className="size-4" />
                立即投稿
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      ) : articles.length === 0 ? (
        <div className="flex flex-col items-center py-20 text-center">
          <FileText className="size-12 text-muted-foreground/40" />
          <p className="mt-4 text-lg font-medium text-muted-foreground">
            {isAdmin ? "暂无文章" : "您还没有投过稿"}
          </p>
          <p className="mt-1 text-sm text-muted-foreground/70">
            {isAdmin
              ? "点击上方按钮发布第一篇文章"
              : "点击上方按钮开始投稿"}
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left font-medium">标题</th>
                <th className="hidden px-4 py-3 text-left font-medium sm:table-cell">
                  分类
                </th>
                <th className="px-4 py-3 text-left font-medium">状态</th>
                <th className="hidden px-4 py-3 text-left font-medium md:table-cell">
                  日期
                </th>
                <th className="px-4 py-3 text-right font-medium">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {articles.map((article) => {
                const statusInfo = STATUS_LABELS[article.status ?? "draft"] ?? {
                  text: article.status ?? "未知",
                  className: "bg-gray-100 text-gray-800",
                };

                return (
                  <tr key={article.id} className="hover:bg-muted/30">
                    <td className="max-w-48 truncate px-4 py-3 font-medium">
                      {article.title}
                    </td>
                    <td className="hidden px-4 py-3 text-muted-foreground sm:table-cell">
                      {CATEGORY_LABELS[article.category] ?? article.category}
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        variant="secondary"
                        className={`border-0 text-xs ${statusInfo.className}`}
                      >
                        {statusInfo.text}
                      </Badge>
                    </td>
                    <td className="hidden px-4 py-3 text-muted-foreground md:table-cell">
                      <span className="flex items-center gap-1 text-xs">
                        <Calendar className="size-3" />
                        {new Date(article.created_at).toLocaleDateString(
                          "zh-CN"
                        )}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Link href={`/articles/${article.id}`}>
                          <Button variant="ghost" size="sm" className="h-8">
                            <Eye className="size-3" />
                          </Button>
                        </Link>
                        {(isAdmin ||
                          article.author_id === user?.id) && (
                          <Link href={`/articles/${article.id}/edit`}>
                            <Button variant="ghost" size="sm" className="h-8">
                              <Pencil className="size-3" />
                            </Button>
                          </Link>
                        )}
                        {(isAdmin ||
                          (article.author_id === user?.id &&
                            article.status !== "published")) && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 text-red-500 hover:bg-red-50 hover:text-red-600"
                            onClick={() => handleDelete(article.id)}
                            disabled={deleting === article.id}
                          >
                            <Trash2 className="size-3" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

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
                  className={page <= 1 ? "pointer-events-none opacity-40" : ""}
                />
              </PaginationItem>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
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
              ))}
              <PaginationItem>
                <PaginationNext
                  text="下一页"
                  href="#"
                  onClick={(e: React.MouseEvent) => {
                    e.preventDefault();
                    if (page < totalPages) setPage((p) => p + 1);
                  }}
                  className={
                    page >= totalPages ? "pointer-events-none opacity-40" : ""
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}