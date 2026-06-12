"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Heart,
  Eye,
  MessageCircle,
  Send,
  User as UserIcon,
  Pencil,
  Trash2,
} from "lucide-react";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { useAuth } from "@/lib/auth-context";
import { getArticle, likeArticle, addComment, deleteArticle } from "@/lib/api";
import { RichTextEditor } from "@/components/editor/rich-text-editor";
import { toast } from "sonner";
import type { Article, Comment } from "@/lib/types";

/* ------------------------------------------------------------------ */
/* Category helpers                                                     */
/* ------------------------------------------------------------------ */

const CATEGORY_LABELS: Record<string, string> = {
  celebrity: "名人堂",
  family_rules: "家规家训",
  news: "最新动态",
  genealogy: "族谱",
};

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

export default function ArticleDetailPage({
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
  const [deleting, setDeleting] = useState(false);

  const isAdmin = user?.role === "admin" || user?.role === "editor";
  const isAuthor = user?.id === article?.author_id;
  const isPublished = !article?.status || article.status === "published";
  const canEdit = isAdmin || (isAuthor && article?.status === "draft");
  const canDelete = isAdmin || (isAuthor && article?.status === "draft");

  /* Fetch article */
  useEffect(() => {
    async function fetchArticle() {
      setLoading(true);
      try {
        const data = await getArticle(id, token ?? undefined);
        setArticle(data);
        setLikes(data.likes);
        setLiked(data.user_liked ?? false);
        setComments(data.comments ?? []);
      } catch {
        setArticle(null);
      } finally {
        setLoading(false);
      }
    }
    fetchArticle();
  }, [id, token]);

  /* Like handler */
  const handleLike = async () => {
    if (!isAuthenticated || !token) {
      router.push("/login");
      return;
    }
    try {
      const data = await likeArticle(id, token);
      setLikes(data.likes);
      setLiked(data.user_liked);
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

  /* Delete handler */
  const handleDelete = async () => {
    if (!token || !confirm("确定要删除这篇文章吗？此操作不可撤销。")) return;
    setDeleting(true);
    try {
      await deleteArticle(id, token);
      toast.success("文章已删除");
      router.push("/articles");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "删除失败，请稍后重试";
      toast.error(msg);
    } finally {
      setDeleting(false);
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
          该文章可能已被移除或链接无效
        </p>
        <Button variant="outline" className="mt-6" onClick={() => router.push("/")}>
          <ArrowLeft className="h-4 w-4" />
          返回首页
        </Button>
      </div>
    );
  }

  /* Render */
  const isHtmlContent = /<[a-zA-Z][\s\S]*>/.test(article.content);

  return (
    <div className="container max-w-4xl px-4 py-8 md:px-6 md:py-12">
      {/* Breadcrumb */}
      <Breadcrumb items={[{ label: "文章管理", href: "/articles" }, { label: article.title }]} />

      {/* Article Header */}
      <header className="mb-8">
        <div className="mb-3 flex items-center gap-2">
          <Badge variant="secondary" className="bg-cream-dark text-foreground border-0">
            {CATEGORY_LABELS[article.category] ?? article.category}
          </Badge>
          {article.status && article.status !== "published" && (
            <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-0">
              {article.status === "draft" ? "待审核" : article.status}
            </Badge>
          )}
          {canEdit && (
            <Link
              href={`/articles/${article.id}/edit`}
              className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <Pencil className="size-3" />
              编辑
            </Link>
          )}
          {canDelete && (
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs text-red-500 transition-colors hover:bg-red-50 hover:text-red-600"
            >
              <Trash2 className="size-3" />
              {deleting ? "删除中..." : "删除"}
            </button>
          )}
        </div>
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
        {isHtmlContent ? (
          <div
            className="prose prose-stone max-w-none dark:prose-invert text-base leading-relaxed"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        ) : (
          <div className="space-y-5 text-base leading-relaxed text-foreground/90">
            {article.content
              .split("\n")
              .filter((p) => p.trim().length > 0)
              .map((p, i) => (
                <p key={i}>{p}</p>
              ))}
          </div>
        )}
      </article>

      {/* Like Button — only for published articles */}
      {isPublished && (
        <>
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
              <RichTextEditor
                content={commentText}
                onChange={setCommentText}
                placeholder="写下您的评论..."
                minHeight="120px"
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
                  <div
                    className="mt-3 text-sm leading-relaxed text-foreground/80"
                    dangerouslySetInnerHTML={{ __html: comment.content }}
                  />
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
        </>
      )}
    </div>
  );
}
