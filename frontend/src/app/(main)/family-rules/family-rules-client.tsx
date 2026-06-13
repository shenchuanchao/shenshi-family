"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  Heart,
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
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/lib/auth-context";
import { likeArticle, addComment } from "@/lib/api";
import type { Article, Comment } from "@/lib/types";

/* ------------------------------------------------------------------ */
/* Props                                                               */
/* ------------------------------------------------------------------ */

interface FamilyRulesClientProps {
  articles: Article[];
}

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

export default function FamilyRulesClient({ articles }: FamilyRulesClientProps) {
  const router = useRouter();
  const { user, token, isAuthenticated } = useAuth();

  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(0);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);

  /* Open article dialog */
  const openArticle = (article: Article) => {
    setSelectedArticle(article);
    setLikes(article.likes);
    setComments(article.comments ?? []);
    setLiked(false);
    setCommentText("");
    setDialogOpen(true);
  };

  /* Like handler */
  const handleLike = async () => {
    if (!isAuthenticated || !token || !selectedArticle) {
      router.push("/login");
      return;
    }
    try {
      const data = await likeArticle(selectedArticle.id, token);
      setLikes(data.likes);
      setLiked((prev) => !prev);
    } catch {
      /* silently ignore */
    }
  };

  /* Comment handler */
  const handleComment = async () => {
    if (!commentText.trim() || !selectedArticle) return;
    if (!isAuthenticated || !token) {
      router.push("/login");
      return;
    }
    setSubmittingComment(true);
    try {
      const data = await addComment(
        selectedArticle.id,
        commentText.trim(),
        token
      );
      const newComment: Comment = {
        id: data.id,
        article_id: selectedArticle.id,
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

  return (
    <div className="flex flex-col">
      {/* Articles Grid */}
      <section className="py-10 md:14">
        <div className="container px-4 md:px-6">
          {articles.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {articles.map((article) => (
                <Card
                  key={article.id}
                  className="cursor-pointer transition-all hover:shadow-md hover:-translate-y-0.5"
                  onClick={() => openArticle(article)}
                >
                  <CardHeader>
                    <CardTitle className="font-heading line-clamp-2">
                      {article.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                      {article.content.replace(/<[^>]*>/g, "").slice(0, 150)}
                      {article.content.length > 150 ? "..." : ""}
                    </p>
                    <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Heart className="h-3 w-3" />
                        {article.likes}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageCircle className="h-3 w-3" />
                        {article.comments?.length ?? 0}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <BookOpen className="h-12 w-12 text-muted-foreground/40" />
              <h3 className="mt-4 font-heading text-lg font-medium">
                暂无家规家训
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                家规家训内容正在整理中，敬请期待
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Article Detail Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-heading text-xl">
              {selectedArticle?.title}
            </DialogTitle>
            <DialogDescription>
              沈氏家规家训
            </DialogDescription>
          </DialogHeader>

          {selectedArticle && (
            <div>
              {/* Content */}
              <div className="space-y-4 text-sm leading-relaxed">
                {selectedArticle.content
                  .split("\n")
                  .filter((p) => p.trim().length > 0)
                  .map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
              </div>

              {/* Stats & Like */}
              <div className="mt-6 flex items-center gap-4">
                <Button
                  variant={liked ? "default" : "outline"}
                  size="sm"
                  onClick={handleLike}
                  className={
                    liked
                      ? "bg-warm-wood text-white hover:bg-warm-wood-dark"
                      : "hover:bg-warm-wood/10"
                  }
                >
                  <Heart
                    className={`h-4 w-4 ${liked ? "fill-current" : ""}`}
                  />
                  {liked ? "已点赞" : "点赞"} ({likes})
                </Button>
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <MessageCircle className="h-3 w-3" />
                  {comments.length} 条评论
                </span>
              </div>

              <Separator className="my-5" />

              {/* Comment Form */}
              {isAuthenticated ? (
                <div className="space-y-3">
                  <Textarea
                    placeholder="写下您的评论..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    className="min-h-[80px]"
                  />
                  <div className="flex justify-end">
                    <Button
                      size="sm"
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
              )}

              {/* Comment List */}
              {comments.length > 0 ? (
                <div className="mt-5 space-y-3">
                  {comments.map((comment) => (
                    <Card key={comment.id} size="sm">
                      <CardContent className="py-3">
                        <div className="flex items-center gap-2">
                          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-dai-green/10">
                            <UserIcon className="h-3 w-3 text-dai-green" />
                          </div>
                          <span className="text-xs font-medium">
                            {comment.user?.nickname ?? "匿名用户"}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(comment.created_at).toLocaleDateString(
                              "zh-CN"
                            )}
                          </span>
                        </div>
                        <p className="mt-2 text-sm text-foreground/80">
                          {comment.content}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="mt-5 text-center text-sm text-muted-foreground">
                  暂无评论
                </p>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
