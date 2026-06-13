import Link from "next/link";
import Image from "next/image";
import { BookOpen, Users, MapPin, MessageCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getArticles } from "@/lib/api";
import type { Article } from "@/lib/types";
import type { Metadata } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://shenshi-family.miegoat.club";

export const metadata: Metadata = {
  description: "传承千年文脉，连接全球宗亲。探索沈氏文化、查询字辈堂号、与全球宗亲交流互动。",
  keywords: ["沈氏文化家园", "沈氏字辈大全", "沈氏家谱", "沈姓名人", "吴兴沈氏", "沈氏寻根", "沈氏宗亲", "家谱查询"],
  openGraph: {
    title: "沈氏文化家园 - 沈氏字辈查询·名人堂·堂号百科·全球宗亲交流平台",
    description: "传承千年文脉，连接全球宗亲。探索沈氏文化、查询字辈堂号、与全球宗亲交流互动。",
  },
};

/* Province quick-links data */
const MUNICIPALITIES = new Set(["上海", "北京", "天津", "重庆"]);

const PROVINCE_GROUPS: Record<string, string[]> = {
  华东: ["上海", "江苏", "浙江", "安徽", "福建", "江西", "山东"],
  华中: ["河南", "湖北", "湖南"],
  华南: ["广东", "广西", "海南"],
  华北: ["北京", "天津", "河北", "山西", "内蒙古"],
  东北: ["辽宁", "吉林", "黑龙江"],
  西南: ["重庆", "四川", "贵州", "云南", "西藏"],
  西北: ["陕西", "甘肃", "青海", "宁夏", "新疆"],
  其他: ["台湾", "香港", "澳门"],
};

const ALL_PROVINCES = Object.values(PROVINCE_GROUPS).flat();

function formatProvince(base: string): string {
  if (MUNICIPALITIES.has(base)) return `${base}市`;
  if (base === "内蒙古") return "内蒙古自治区";
  if (base === "广西") return "广西壮族自治区";
  if (base === "西藏") return "西藏自治区";
  if (base === "宁夏") return "宁夏回族自治区";
  if (base === "新疆") return "新疆维吾尔自治区";
  if (base === "香港") return "香港特别行政区";
  if (base === "澳门") return "澳门特别行政区";
  return `${base}省`;
}

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
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "沈氏文化家园",
            url: SITE_URL,
            description: "全球沈氏宗亲的文化社区与寻根平台",
            potentialAction: {
              "@type": "SearchAction",
              target: `${SITE_URL}/generation?verse={search_term_string}`,
              "query-input": "required name=search_term_string",
            },
            publisher: {
              "@type": "Organization",
              name: "沈氏文化家园",
              logo: {
                "@type": "ImageObject",
                url: `${SITE_URL}/icon.png`,
              },
            },
          }),
        }}
      />
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-cream via-cream-dark to-warm-wood-light/20 py-20 md:py-32">
        {/* Background watermark */}
        <Image
          src="/img/logo-dragon.webp"
          alt=""
          fill
          className="pointer-events-none object-cover opacity-[0.06] select-none"
        />
        <div className="container relative z-10 px-4 md:px-6">
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

      {/* Province Quick Links */}
      <section className="border-t bg-cream py-10 md:py-14">
        <div className="container max-w-4xl px-4 md:px-6">
          <h2 className="mb-6 text-center font-heading text-xl font-semibold md:text-2xl">
            各省份沈氏字辈大全
          </h2>
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-2">
            {ALL_PROVINCES.map((p) => (
              <Link
                key={p}
                href={`/generation/${encodeURIComponent(formatProvince(p))}`}
                className="text-sm transition-colors hover:text-dai-green"
              >
                {formatProvince(p)}沈氏字辈
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
