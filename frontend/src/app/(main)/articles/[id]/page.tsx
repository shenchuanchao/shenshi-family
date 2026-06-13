import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getArticle } from "@/lib/api";
import { ArticleDetailClient } from "./article-detail-client";

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
        "沈氏文化家园文章",
      keywords: ["沈氏", "沈氏文化", article.title, article.category],
    };
  } catch {
    return { title: "文章不存在" };
  }
}

export default async function ArticleDetailPage({
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
        <Link href="/">
          <Button variant="outline" className="mt-6">
            <ArrowLeft className="h-4 w-4" />
            返回首页
          </Button>
        </Link>
      </div>
    );
  }

  return <ArticleDetailClient article={article} />;
}
