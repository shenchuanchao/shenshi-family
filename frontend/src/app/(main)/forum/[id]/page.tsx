"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft, Calendar, MessageSquare, Send, User as UserIcon, Trash2 } from "lucide-react";

import { Breadcrumb } from "@/components/ui/breadcrumb";
import { useAuth } from "@/lib/auth-context";
import { getForumPost, addForumReply, deleteForumPost } from "@/lib/api";
import type { ForumPost, ForumReply } from "@/lib/types";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { RichTextEditor } from "@/components/editor/rich-text-editor";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

interface ForumPostWithReplies extends ForumPost {
  replies?: ForumReply[];
}

export default function ForumDetailPage({
  params,
}: {
  params: Promise<{ id: string }> | { id: string };
}) {
  // Support both Next.js 14 (plain object) and 15 (Promise) params
  const resolvedParams =
    "then" in params
      ? React.use(params as Promise<{ id: string }>)
      : (params as { id: string });
  const postId = resolvedParams.id;

  const router = useRouter();
  const { isAuthenticated, token, user } = useAuth();

  const [post, setPost] = useState<ForumPostWithReplies | null>(null);
  const [replies, setReplies] = useState<ForumReply[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  const [replyContent, setReplyContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchPost = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getForumPost(postId);
      setPost(data as ForumPostWithReplies);
      // Replies may be included in the response
      if ((data as ForumPostWithReplies).replies) {
        setReplies((data as ForumPostWithReplies).replies ?? []);
      }
    } catch {
      toast.error("加载帖子失败");
    } finally {
      setLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    fetchPost();
  }, [fetchPost]);

  const handleReply = async () => {
    if (!replyContent.trim()) {
      toast.error("请输入回复内容");
      return;
    }
    if (!token) {
      toast.error("请先登录");
      return;
    }
    setSubmitting(true);
    try {
      const data = await addForumReply(postId, replyContent.trim(), token);
      toast.success("回复成功！");
      // Add the new reply to the list
      const newReply: ForumReply = {
        id: data.id,
        post_id: postId,
        user_id: "",
        content: data.content,
        created_at: data.created_at,
        user: { nickname: "我" },
      };
      setReplies((prev) => [...prev, newReply]);
      setReplyContent("");
      // Update reply count on the post
      if (post) {
        setPost({ ...post, reply_count: post.reply_count + 1 });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "回复失败，请稍后重试";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!token || !confirm("确定要删除此帖吗？所有回复也会一并删除。")) return;
    setDeleting(true);
    try {
      await deleteForumPost(postId, token);
      toast.success("帖子已删除");
      router.push("/forum");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "删除失败";
      toast.error(msg);
    } finally {
      setDeleting(false);
    }
  };

  const isAdmin = user?.role === "admin";
  const canDelete = isAdmin || (post && user?.id === post.user_id);

  // ---- Loading State ----
  if (loading) {
    return (
      <div className="container max-w-3xl px-4 py-8 md:px-6 md:py-12">
        <Skeleton className="mb-6 h-5 w-24" />
        <Skeleton className="mb-3 h-8 w-3/4" />
        <div className="mb-6 flex gap-4">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-32" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-2/3" />
        </div>
        <Separator className="my-8" />
        <Skeleton className="mb-4 h-6 w-32" />
        <div className="space-y-4">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      </div>
    );
  }

  // ---- Not Found ----
  if (!post) {
    return (
      <div className="container max-w-3xl px-4 py-20 text-center md:px-6">
        <MessageSquare className="mx-auto size-12 text-muted-foreground/40" />
        <p className="mt-4 text-lg font-medium text-muted-foreground">
          帖子不存在或已被删除
        </p>
        <Link
          href="/forum"
          className={buttonVariants({ variant: "outline", className: "mt-4" })}
        >
          <ArrowLeft className="size-4" />
          返回留言墙
        </Link>
      </div>
    );
  }

  return (
    <div className="container max-w-3xl px-4 py-8 md:px-6 md:py-12">
      {/* Breadcrumb */}
      <Breadcrumb items={[{ label: "留言墙", href: "/forum" }, { label: post.title }]} />

      {/* Post */}
      <article>
        <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground md:text-3xl">
          {post.title}
        </h1>

        {/* Author info */}
        <div className="mt-4 flex items-center gap-3">
          <Avatar size="lg">
            {post.user?.avatar_url ? (
              <AvatarImage src={post.user.avatar_url} alt={post.user.nickname} />
            ) : null}
            <AvatarFallback className="bg-warm-wood/15 text-warm-wood">
              {(post.user?.nickname ?? "匿").charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-medium">
              {post.user?.nickname ?? "匿名宗亲"}
            </span>
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Calendar className="size-3" />
              {new Date(post.created_at).toLocaleDateString("zh-CN", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
          <Badge variant="secondary" className="ml-auto">
            {post.reply_count} 回复
          </Badge>
          {canDelete && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              disabled={deleting}
              className="h-7 text-xs text-red-500 hover:bg-red-50 hover:text-red-600"
            >
              <Trash2 className="size-3" />
              {deleting ? "删除中..." : "删除"}
            </Button>
          )}
        </div>

        {/* Content */}
        <div className="mt-6 text-sm leading-relaxed text-foreground/90">
          {isHtmlContent(post.content) ? (
            <div
              className="prose prose-stone max-w-none dark:prose-invert"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          ) : (
            <div className="whitespace-pre-wrap">{post.content}</div>
          )}
        </div>
      </article>

      <Separator className="my-8" />

      {/* Replies section */}
      <section>
        <h2 className="flex items-center gap-2 font-heading text-lg font-semibold">
          <MessageSquare className="size-5 text-dai-green" />
          全部回复
          <span className="text-sm font-normal text-muted-foreground">
            ({replies.length})
          </span>
        </h2>

        {replies.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-sm text-muted-foreground">
              暂无回复，快来抢沙发吧！
            </p>
          </div>
        ) : (
          <div className="mt-4 space-y-4">
            {replies.map((reply, index) => (
              <Card key={reply.id}>
                <CardContent className="py-4">
                  <div className="flex items-start gap-3">
                    <Avatar size="sm">
                      {reply.user?.avatar_url ? (
                        <AvatarImage
                          src={reply.user.avatar_url}
                          alt={reply.user.nickname}
                        />
                      ) : null}
                      <AvatarFallback className="bg-cream-dark text-muted-foreground text-xs">
                        {(reply.user?.nickname ?? "匿").charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">
                          {reply.user?.nickname ?? "匿名宗亲"}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          #{index + 1}
                        </span>
                        <span className="ml-auto text-xs text-muted-foreground">
                          {new Date(reply.created_at).toLocaleDateString("zh-CN")}
                        </span>
                      </div>
                      <p className="mt-1.5 text-sm leading-relaxed text-foreground/80">
                        {reply.content}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Reply form */}
      <Separator className="my-8" />
      <section>
        <h3 className="font-heading text-base font-semibold">发表回复</h3>
        {isAuthenticated ? (
          <div className="mt-4 space-y-3">
            <RichTextEditor
              content={replyContent}
              onChange={setReplyContent}
              placeholder="写下你的回复..."
              minHeight="140px"
            />
            <div className="flex justify-end">
              <Button onClick={handleReply} disabled={submitting}>
                <Send className="size-4" />
                {submitting ? "提交中..." : "发表回复"}
              </Button>
            </div>
          </div>
        ) : (
          <Card className="mt-4">
            <CardContent className="flex items-center justify-center py-8">
              <p className="text-sm text-muted-foreground">
                请先
                <Link
                  href="/login"
                  className="mx-1 font-medium text-dai-green underline underline-offset-4 hover:text-dai-green-dark"
                >
                  登录
                </Link>
                后再发表回复
              </p>
            </CardContent>
          </Card>
        )}
      </section>
    </div>
  );
}

/** Check if a string contains HTML tags */
function isHtmlContent(text: string): boolean {
  return /<[a-zA-Z][\s\S]*>/.test(text);
}
