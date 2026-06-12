"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Heart,
  Eye,
  MessageCircle,
  Send,
  User as UserIcon,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { useAuth } from "@/lib/auth-context";
import { getArticle, likeArticle, addComment } from "@/lib/api";
import type { Article, Comment } from "@/lib/types";

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

export default function CelebrityDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { user, token, isAuthenticated } = useAuth();

  const [article, setArticle] = useState<Article | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);

  /* Fetch article */
  useEffect(() => {
    async function fetchArticle() {
      setLoading(true);
      try {
        const data = await getArticle(id);
        setArticle(data);
        setLikes(data.likes);
        setComments(data.comments ?? []);
      } catch {
        setArticle(null);
      } finally {
        setLoading(false);
      }
    }
    fetchArticle();
  }, [id]);

  /* Like handler */
  const handleLike = async () => {
    if (!isAuthenticated || !token) {
      router.push("/login");
      return;
    }
    try {
      const data = await likeArticle(id, token);
      setLikes(data.likes);
      setLiked((prev) => !prev);
    } catch {
      /* silently ignore */
    }
  };

  /* Comment handler */
  const handleComment = async () => {
    if (!commentText.trim()) return;
    if (!isAuthenticated || !token) {
      router.push("/login");
      return;
    }
    setSubmittingComment(true);
    try {
      const data = await addComment(id, commentText.trim(), token);
      const newComment: Comment = {
        id: data.id,
        article_id: id,
        user_id: user?.id ?? "",
        content: data.content,
        created_at: data.created_at,
        user: { nickname: user?.nickname ?? "用户" },
      };
      setComments((prev) => [newComment, ...prev]);
      setCommentText("");
    } catch {
      /* silently ignore */
    } finally {
      setSubmittingComment(false);
    }
  };

  /* Loading State */
  if (loading) {
    return (
      <div className="container max-w-4xl px-4 py-10 md:px-6">
        <Skeleton className="mb-6 h-8 w-24" />
        <Skeleton className="mb-4 h-10 w-3/4" />
        <div className="mb-6 flex gap-2">
          <Skeleton className="h-5 w-14 rounded-full" />
          <Skeleton className="h-5 w-14 rounded-full" />
        </div>
        <Skeleton className="mb-8 aspect-video w-full" />
        <div className="space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>
    );
  }

  /* Not Found */
  if (!article) {
    return (
      <div className="container flex max-w-4xl flex-col items-center px-4 py-20 text-center md:px-6">
        <h1 className="font-heading text-2xl font-bold">文章不存在</h1>
        <p className="mt-2 text-muted-foreground">
          该名人文章可能已被移除或链接无效
        </p>
        <Button variant="outline" className="mt-6" onClick={() => router.push("/celebrities")}>
          <ArrowLeft className="h-4 w-4" />
          返回名人堂
        </Button>
      </div>
    );
  }

  /* Render */
  const paragraphs = article.content
    .split("\n")
    .filter((p) => p.trim().length > 0);

  return (
    <div className="container max-w-4xl px-4 py-8 md:px-6 md:py-12">
      {/* Breadcrumb */}
      <Breadcrumb items={[{ label: "名人堂", href: "/celebrities" }, { label: article.title }]} />

      {/* Article Header */}
      <header className="mb-8">
        <h1 className="font-heading text-3xl font-bold tracking-tight md:text-4xl">
          {article.title}
        </h1>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          {article.dynasty && (
            <Badge
              variant="secondary"
              className="bg-warm-wood/15 text-warm-wood-dark border-0"
            >
              {article.dynasty}
            </Badge>
          )}
          {article.field && (
            <Badge
              variant="secondary"
              className="bg-dai-green/15 text-dai-green border-0"
            >
              {article.field}
            </Badge>
          )}
          <span className="flex items-center gap-1 text-sm text-muted-foreground">
            <Eye className="h-4 w-4" />
            {article.view_count}
          </span>
          <span className="flex items-center gap-1 text-sm text-muted-foreground">
            <Heart className="h-4 w-4" />
            {likes}
          </span>
        </div>
      </header>

      {/* Cover Image */}
      {article.cover_image && (
        <div className="mb-10 overflow-hidden rounded-xl">
          <img
            src={article.cover_image}
            alt={article.title}
            className="w-full object-cover"
          />
        </div>
      )}

      {/* Article Content */}
      <article className="mb-10">
        <div className="space-y-5 text-base leading-relaxed text-foreground/90">
          {paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </article>

      {/* Like Button */}
      <div className="mb-10 flex justify-center">
        <Button
          variant={liked ? "default" : "outline"}
          size="lg"
          onClick={handleLike}
          className={
            liked
              ? "bg-warm-wood text-white hover:bg-warm-wood-dark"
              : "hover:bg-warm-wood/10 hover:text-warm-wood-dark"
          }
        >
          <Heart className={`h-4 w-4 ${liked ? "fill-current" : ""}`} />
          {liked ? "已点赞" : "点赞"} ({likes})
        </Button>
      </div>

      <Separator className="my-8" />

      {/* Comments Section */}
      <section>
        <h2 className="mb-6 flex items-center gap-2 font-heading text-xl font-semibold">
          <MessageCircle className="h-5 w-5 text-dai-green" />
          评论 ({comments.length})
        </h2>

        {/* Comment Form */}
        <div className="mb-8">
          {isAuthenticated ? (
            <div className="space-y-3">
              <Textarea
                placeholder="写下您的评论..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="min-h-[100px]"
              />
              <div className="flex justify-end">
                <Button
                  onClick={handleComment}
                  disabled={!commentText.trim() || submittingComment}
                  className="bg-dai-green hover:bg-dai-green-dark"
                >
                  <Send className="h-4 w-4" />
                  {submittingComment ? "提交中..." : "发表评论"}
                </Button>
              </div>
            </div>
          ) : (
            <Card className="bg-cream">
              <CardContent className="flex items-center justify-center py-8">
                <p className="text-sm text-muted-foreground">
                  请先{" "}
                  <a
                    href="/login"
                    className="font-medium text-dai-green underline-offset-2 hover:underline"
                  >
                    登录
                  </a>{" "}
                  后发表评论
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Comment List */}
        {comments.length > 0 ? (
          <div className="space-y-5">
            {comments.map((comment) => (
              <Card key={comment.id}>
                <CardContent className="py-4">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-dai-green/10">
                      <UserIcon className="h-4 w-4 text-dai-green" />
                    </div>
                    <span className="text-sm font-medium">
                      {comment.user?.nickname ?? "匿名用户"}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(comment.created_at).toLocaleDateString("zh-CN")}
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-foreground/80">
                    {comment.content}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="py-10 text-center">
            <MessageCircle className="mx-auto h-8 w-8 text-muted-foreground/30" />
            <p className="mt-3 text-sm text-muted-foreground">
              暂无评论，来发表第一条评论吧
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
