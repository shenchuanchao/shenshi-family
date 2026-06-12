import Link from "next/link";
import { BookOpen, Users, MapPin, MessageCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getArticles } from "@/lib/api";
import type { Article } from "@/lib/types";
import type { Metadata } from "next";

export const metadata: Metadata = {
  description: "传承千年文脉，连接全球宗亲。探索沈氏文化、查询字辈堂号、与全球宗亲交流互动。",
};

const quickLinks = [
  {
    name: "名人堂",
    description: "探索沈氏历史上的杰出人物",
    icon: Users,
    href: "/celebrity",
    color: "text-warm-wood",
  },
  {
    name: "字辈查询",
    description: "查询您的字辈排行与辈分",
    icon: BookOpen,
    href: "/generation",
    color: "text-dai-green",
  },
  {
    name: "迁徙史",
    description: "追溯沈氏家族的迁徙足迹",
    icon: MapPin,
    href: "/migration",
    color: "text-warm-wood-dark",
  },
  {
    name: "留言墙",
    description: "与全球宗亲交流互动",
    icon: MessageCircle,
    href: "/forum",
    color: "text-dai-green-light",
  },
];

async function getLatestArticles(): Promise<Article[]> {
  try {
    const response = await getArticles({ category: "news", page: 1, limit: 3 });
    return response.data || [];
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const articles = await getLatestArticles();

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-cream via-cream-dark to-warm-wood-light/20 py-20 md:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center text-center">
            <h1 className="font-heading text-4xl font-bold tracking-tight text-dai-green sm:text-5xl md:text-6xl">
              沈氏文化家园
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl">
              传承千年文脉，连接全球宗亲
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/generation"
                className="inline-flex h-11 items-center justify-center rounded-lg bg-dai-green px-8 text-sm font-medium text-cream transition-colors hover:bg-dai-green-dark"
              >
                开始寻根
              </Link>
              <Link
                href="/forum"
                className="inline-flex h-11 items-center justify-center rounded-lg border border-border bg-background px-8 text-sm font-medium transition-colors hover:bg-muted"
              >
                加入社区
              </Link>
            </div>
          </div>
        </div>
        {/* Decorative elements */}
        <div className="absolute -bottom-4 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* Quick Navigation Cards */}
      <section className="py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <h2 className="font-heading text-center text-2xl font-semibold tracking-tight md:text-3xl">
            探索沈氏文化
          </h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {quickLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <Card className="h-full transition-shadow hover:shadow-lg hover:-translate-y-0.5">
                  <CardHeader>
                    <link.icon className={`h-8 w-8 ${link.color}`} />
                    <CardTitle className="mt-4 font-heading">
                      {link.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {link.description}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Articles Section */}
      <section className="bg-light-gray py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-2xl font-semibold tracking-tight md:text-3xl">
              最新动态
            </h2>
            <Link
              href="/news"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-dai-green"
            >
              查看更多
            </Link>
          </div>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {articles.length > 0 ? (
              articles.map((article) => (
                <Link key={article.id} href={`/news/${article.id}`}>
                  <Card className="h-full transition-shadow hover:shadow-lg">
                    {article.cover_image && (
                      <div className="aspect-video overflow-hidden">
                        <img
                          src={article.cover_image}
                          alt={article.title}
                          className="h-full w-full object-cover transition-transform hover:scale-105"
                        />
                      </div>
                    )}
                    <CardHeader>
                      <CardTitle className="font-heading line-clamp-2">
                        {article.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="line-clamp-2 text-sm text-muted-foreground">
                        {article.content.replace(/<[^>]*>/g, "").slice(0, 100)}...
                      </p>
                      <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
                        <span>浏览 {article.view_count}</span>
                        <span>点赞 {article.likes}</span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))
            ) : (
              <>
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="h-full">
                    <CardHeader>
                      <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="h-3 w-full animate-pulse rounded bg-muted" />
                        <div className="h-3 w-2/3 animate-pulse rounded bg-muted" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </>
            )}
          </div>
        </div>
      </section>

      {/* Family Rules Section */}
      <section className="py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="font-heading text-2xl font-semibold tracking-tight md:text-3xl">
              家规家训
            </h2>
            <p className="mt-4 text-muted-foreground">
              传承先祖智慧，教化后代子孙
            </p>
          </div>
          <div className="mt-12 grid gap-8 md:grid-cols-2">
            <Card className="bg-cream">
              <CardContent className="pt-6">
                <blockquote className="text-center">
                  <p className="font-heading text-lg italic text-dai-green">
                    &ldquo;耕读传家久，诗书继世长&rdquo;
                  </p>
                  <footer className="mt-4 text-sm text-muted-foreground">
                    —— 沈氏家训
                  </footer>
                </blockquote>
              </CardContent>
            </Card>
            <Card className="bg-cream">
              <CardContent className="pt-6">
                <blockquote className="text-center">
                  <p className="font-heading text-lg italic text-dai-green">
                    &ldquo;忠孝为本，礼义为先&rdquo;
                  </p>
                  <footer className="mt-4 text-sm text-muted-foreground">
                    —— 沈氏家规
                  </footer>
                </blockquote>
              </CardContent>
            </Card>
          </div>
          <div className="mt-8 text-center">
            <Link
              href="/family-rules"
              className="inline-flex h-9 items-center justify-center rounded-lg border border-border bg-background px-4 text-sm font-medium transition-colors hover:bg-muted"
            >
              查看更多家训
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
