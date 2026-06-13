import type { Metadata } from "next";
import { Newspaper } from "lucide-react";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { getArticles } from "@/lib/api";
import type { Article } from "@/lib/types";
import NewsClient from "./news-client";

const PAGE_SIZE = 9;

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "最新动态",
  description: "沈氏文化家园最新新闻与动态，了解沈氏宗族最新资讯。",
  keywords: ["沈氏新闻", "沈氏动态", "沈氏资讯", "宗亲活动"],
};

export default async function NewsPage() {
  const res = await getArticles({ category: "news", page: 1, limit: PAGE_SIZE });
  const articles: Article[] = res.data ?? [];
  const total: number = res.total ?? 0;

  return (
    <div className="flex flex-col">
      <div className="container max-w-4xl px-4 pt-6 md:px-6">
        <Breadcrumb items={[{ label: "最新动态" }]} />
      </div>
      {/* Hero Header */}
      <section className="bg-gradient-to-b from-cream to-background py-12 md:py-16">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center text-center">
            <div className="mb-4 flex size-14 items-center justify-center rounded-full bg-warm-wood/15">
              <Newspaper className="size-7 text-warm-wood" />
            </div>
            <h1 className="font-heading text-3xl font-bold tracking-tight text-dai-green md:text-4xl">
              最新动态
            </h1>
            <p className="mt-3 max-w-xl text-muted-foreground">
              了解沈氏宗亲会的最新资讯与活动
            </p>
          </div>
        </div>
      </section>

      {/* Content – interactive client component */}
      <NewsClient articles={articles} total={total} />
    </div>
  );
}
