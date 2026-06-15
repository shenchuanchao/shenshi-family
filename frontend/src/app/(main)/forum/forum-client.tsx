"use client";

import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { MessageSquare, PenLine, Calendar, User as UserIcon } from "lucide-react";

import { useAuth } from "@/lib/auth-context";
import { getForumPosts, createForumPost } from "@/lib/api";
import type { ForumPost } from "@/lib/types";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RichTextEditor } from "@/components/editor/rich-text-editor";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const PAGE_SIZE = 10;

/* ------------------------------------------------------------------ */
/* Props                                                               */
/* ------------------------------------------------------------------ */

interface ForumClientProps {
  posts: ForumPost[];
  total: number;
}

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

/** Compute which page numbers to show (with ellipses represented as null). */
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

/** Strip HTML tags from a string for plain-text preview */
function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "");
}

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

export default function ForumClient({ posts: initialPosts, total: initialTotal }: ForumClientProps) {
  return (
    <Suspense>
      <ForumContent posts={initialPosts} total={initialTotal} />
    </Suspense>
  );
}

function ForumContent({ posts: initialPosts, total: initialTotal }: ForumClientProps) {
  const { isAuthenticated, token } = useAuth();
  const searchParams = useSearchParams();

  const [posts, setPosts] = useState<ForumPost[]>(initialPosts);
  const [total, setTotal] = useState(initialTotal);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Handle auto_title from query param (e.g. from generation page)
  const autoTitleHandled = useRef(false);
  useEffect(() => {
    if (autoTitleHandled.current || !searchParams) return;
    const autoTitle = searchParams.get("auto_title");
    if (autoTitle) {
      autoTitleHandled.current = true;
      if (!isAuthenticated) {
        toast.error("请先登录后再发帖");
        return;
      }
      setTitle(autoTitle);
      setDialogOpen(true);
    }
  }, [searchParams, isAuthenticated]);

  const fetchPosts = useCallback(async (p: number) => {
    setLoading(true);
    try {
      const res = await getForumPosts({ page: p, limit: PAGE_SIZE });
      setPosts(res.data ?? []);
      setTotal(res.total ?? 0);
    } catch {
      toast.error("加载帖子失败，请稍后重试");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (page > 1) {
      fetchPosts(page);
    }
  }, [page, fetchPosts]);

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) {
      toast.error("请填写标题和内容");
      return;
    }
    if (!token) {
      toast.error("请先登录");
      return;
    }
    setSubmitting(true);
    try {
      await createForumPost(title.trim(), content.trim(), token);
      toast.success("发帖成功！");
      setTitle("");
      setContent("");
      setDialogOpen(false);
      setPage(1);
      fetchPosts(1);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "发帖失败，请稍后重试";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="flex flex-col">
      {/* Post List */}
      <section className="py-8 md:py-12">
        <div className="container max-w-3xl px-4 md:px-6">
          {/* Publish button */}
          <div className="mb-6 flex justify-center">
              <Dialog open={dialogOpen} onOpenChange={(open) => {
                if (open && !isAuthenticated) {
                  toast.error("请先登录后再发帖");
                  return;
                }
                setDialogOpen(open);
              }}>
                <DialogTrigger
                  render={
                    <Button>
                      <PenLine className="mr-2 size-4" />
                      发布留言
                    </Button>
                  }
                />
                <DialogContent className="sm:max-w-lg">
                  <DialogHeader>
                    <DialogTitle>发布新留言</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-2">
                    <div className="space-y-2">
                      <Label htmlFor="forum-title">标题</Label>
                      <Input
                        id="forum-title"
                        placeholder="请输入留言标题"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        maxLength={100}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>内容</Label>
                      <RichTextEditor
                        content={content}
                        onChange={setContent}
                        placeholder="写下你想说的话..."
                        minHeight={160}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setDialogOpen(false)}
                    >
                      取消
                    </Button>
                    <Button onClick={handleSubmit} disabled={submitting}>
                      {submitting ? "发布中..." : "发布"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Card key={i}>
                  <CardHeader className="pb-3">
                    <Skeleton className="h-5 w-3/4" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="mt-2 h-4 w-2/3" />
                    <div className="mt-4 flex gap-3">
                      <Skeleton className="h-3 w-20" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : posts.length === 0 ? (
            <div className="flex flex-col items-center py-20 text-center">
              <MessageSquare className="size-12 text-muted-foreground/40" />
              <p className="mt-4 text-lg font-medium text-muted-foreground">
                暂无帖子
              </p>
              <p className="mt-1 text-sm text-muted-foreground/70">
                成为第一个发帖的宗亲吧！
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {posts.map((post) => (
                <Link key={post.id} href={`/forum/${post.id}`}>
                  <Card className="cursor-pointer transition-shadow hover:shadow-md hover:-translate-y-px">
                    <CardHeader className="pb-3">
                      <CardTitle className="font-heading text-lg leading-snug line-clamp-1">
                        {post.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm leading-relaxed text-muted-foreground line-clamp-2">
                        {stripHtml(post.content).slice(0, 100)}
                        {stripHtml(post.content).length > 100 ? "..." : ""}
                      </p>
                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <UserIcon className="size-3" />
                            {post.user?.nickname ?? "匿名宗亲"}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="size-3" />
                            {new Date(post.created_at).toLocaleDateString(
                              "zh-CN"
                            )}
                          </span>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {post.reply_count} 回复
                        </Badge>
                      </div>
                    </CardContent>
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
