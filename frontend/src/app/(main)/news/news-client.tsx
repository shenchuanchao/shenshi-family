"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Newspaper, Calendar, Eye, Image as ImageIcon } from "lucide-react";

import { getArticles } from "@/lib/api";
import type { Article } from "@/lib/types";

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

const PAGE_SIZE = 9;

/* ------------------------------------------------------------------ */
/* Props                                                               */
/* ------------------------------------------------------------------ */

interface NewsClientProps {
  articles: Article[];
  total: number;
}

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

function visiblePages(
  current: number,
  total: number
): (number | null)[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  const pages: (number | null)[] = [];
  pages.push(1);
  if (current > 3) pages.push(null);
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  for (let i = start; i <= end; i++) pages.push(i);
  if (current < total - 2) pages.push(null);
  pages.push(total);
  return pages;
}

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

export default function NewsClient({ articles: initialArticles, total: initialTotal }: NewsClientProps) {
  const [articles, setArticles] = useState<Article[]>(initialArticles);
  const [total, setTotal] = useState(initialTotal);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchArticles = useCallback(async (p: number) => {
    setLoading(true);
    try {
      const res = await getArticles({ category: "news", page: p, limit: PAGE_SIZE });
      setArticles(res.data ?? []);
      setTotal(res.total ?? 0);
    } catch {
      toast.error("加载动态失败，请稍后重试");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (page > 1) {
      fetchArticles(page);
    }
  }, [page, fetchArticles]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="flex flex-col">
      {/* Article List */}
      <section className="py-8 md:py-12">
        <div className="container max-w-4xl px-4 md:px-6">
          {loading ? (
            <div className="space-y-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <Card key={i}>
                  <div className="flex flex-col sm:flex-row">
                    <Skeleton className="h-44 w-full sm:h-auto sm:w-56 shrink-0 rounded-r-none" />
                    <div className="flex-1 p-5">
                      <Skeleton className="mb-3 h-5 w-3/4" />
                      <Skeleton className="mb-2 h-4 w-full" />
                      <Skeleton className="h-4 w-2/3" />
                      <div className="mt-4 flex gap-3">
                        <Skeleton className="h-3 w-24" />
                        <Skeleton className="h-3 w-20" />
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : articles.length === 0 ? (
            <div className="flex flex-col items-center py-20 text-center">
              <Newspaper className="size-12 text-muted-foreground/40" />
              <p className="mt-4 text-lg font-medium text-muted-foreground">
                暂无动态
              </p>
              <p className="mt-1 text-sm text-muted-foreground/70">
                新的资讯和活动即将发布，敬请关注
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {articles.map((article) => (
                <Link key={article.id} href={`/news/${article.id}`} className="block">
                  <Card className="cursor-pointer overflow-hidden transition-shadow hover:shadow-md hover:-translate-y-px">
                    <div className="flex flex-col sm:flex-row">
                      {/* Cover image */}
                      <div className="relative h-44 w-full shrink-0 sm:h-auto sm:w-56">
                        {article.cover_image ? (
                          <img
                            src={article.cover_image}
                            alt={article.title}
                            className="h-full w-full object-cover"
                            loading="lazy"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-cream to-cream-dark">
                            <ImageIcon className="size-10 text-warm-wood/40" />
                          </div>
                        )}
                        {/* Category badge */}
                        <Badge
                          variant="secondary"
                          className="absolute left-3 top-3 bg-cream/90 text-dai-green text-xs backdrop-blur-sm"
                        >
                          动态
                        </Badge>
                      </div>

                      {/* Content */}
                      <div className="flex flex-1 flex-col justify-between p-5">
                        <div>
                          <CardTitle className="font-heading text-lg leading-snug line-clamp-2">
                            {article.title}
                          </CardTitle>
                          <p className="mt-2 text-sm leading-relaxed text-muted-foreground line-clamp-3">
                            {article.content
                              .replace(/<[^>]*>/g, "")
                              .slice(0, 150)}
                            {article.content.length > 150 ? "..." : ""}
                          </p>
                        </div>
                        <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="size-3" />
                            {new Date(article.created_at).toLocaleDateString(
                              "zh-CN",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              }
                            )}
                          </span>
                          <span className="flex items-center gap-1">
                            <Eye className="size-3" />
                            {article.view_count}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8">
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
                  {visiblePages(page, totalPages).map((p, idx) =>
                    p === null ? (
                      <PaginationItem key={`ellipsis-${idx}`}>
                        <span className="flex size-8 items-center justify-center text-sm text-muted-foreground">
                          ...
                        </span>
                      </PaginationItem>
                    ) : (
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
      </section>
    </div>
  );
}
