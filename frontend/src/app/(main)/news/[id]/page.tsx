import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getArticle, getArticles } from "@/lib/api";
import type { Article } from "@/lib/types";
import { NewsDetailClient } from "./news-detail-client";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  try {
    const article = await getArticle(id);
    return {
      title: article.title,
      description:
        article.content?.replace(/<[^>]*>/g, "").slice(0, 160) ??
        "沈氏文化家园最新动态",
      keywords: ["沈氏", "沈氏文化", "最新动态", article.title],
    };
  } catch {
    return { title: "文章不存在" };
  }
}

async function getAdjacentArticles(
  currentId: string,
  category: string
): Promise<{ prev: Article | null; next: Article | null }> {
  try {
    // Fetch enough articles to find neighbors
    const res = await getArticles({ category, page: 1, limit: 50 });
    const articles = res.data ?? [];
    const idx = articles.findIndex((a) => a.id === currentId);
    if (idx === -1) return { prev: null, next: null };
    return {
      prev: idx > 0 ? articles[idx - 1] : null,
      next: idx < articles.length - 1 ? articles[idx + 1] : null,
    };
  } catch {
    return { prev: null, next: null };
  }
}

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let article;
  try {
    article = await getArticle(id);
  } catch {
    return (
      <div className="container flex max-w-4xl flex-col items-center px-4 py-20 text-center md:px-6">
        <h1 className="font-heading text-2xl font-bold">文章不存在</h1>
        <p className="mt-2 text-muted-foreground">
          该文章可能已被移除或链接无效
        </p>
        <Link href="/news">
          <Button variant="outline" className="mt-6">
            <ArrowLeft className="h-4 w-4" />
            返回最新动态
          </Button>
        </Link>
      </div>
    );
  }

  const { prev, next } = await getAdjacentArticles(id, article.category);

  return <NewsDetailClient article={article} prevArticle={prev} nextArticle={next} />;
}
