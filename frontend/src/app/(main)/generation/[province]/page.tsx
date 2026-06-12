"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { BookOpen, MapPin, ArrowLeft } from "lucide-react";
import Link from "next/link";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { queryGenerationVerse } from "@/lib/api";
import type { GenerationVerse } from "@/lib/types";

const MUNICIPALITIES = new Set(["上海", "北京", "天津", "重庆"]);

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

export default function ProvinceVersePage() {
  const params = useParams<{ province: string }>();
  const province = decodeURIComponent(params.province ?? "");

  const [results, setResults] = useState<GenerationVerse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!province) return;
    async function fetch() {
      setLoading(true);
      try {
        const data = await queryGenerationVerse({ province });
        setResults(data ?? []);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }
    fetch();
  }, [province]);

  useEffect(() => {
    if (province) {
      document.title = `${formatProvince(province)}沈氏字辈大全 | 沈氏文化家园`;
    }
  }, [province]);

  const displayName = formatProvince(province);

  return (
    <div className="flex flex-col">
      <div className="container max-w-4xl px-4 pt-6 md:px-6">
        <Breadcrumb
          items={[
            { label: "字辈查询", href: "/generation" },
            { label: `${displayName}沈氏字辈大全` },
          ]}
        />
      </div>

      {/* Hero */}
      <section className="bg-gradient-to-b from-cream to-background py-10 md:py-14">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center text-center">
            <BookOpen className="h-10 w-10 text-dai-green" />
            <h1 className="mt-4 font-heading text-3xl font-bold tracking-tight md:text-4xl">
              {displayName}沈氏字辈大全
            </h1>
            <p className="mt-3 max-w-xl text-muted-foreground">
              收录{displayName}地区各支系沈氏字辈信息
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-8 md:py-12">
        <div className="container max-w-4xl px-4 md:px-6">
          {/* Loading */}
          {loading && (
            <div className="space-y-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-5 w-1/3" />
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Results */}
          {!loading && results.length > 0 && (
            <>
              <p className="mb-6 text-sm text-muted-foreground">
                共收录 {results.length} 条字辈信息
              </p>
              <div className="space-y-4">
                {results.map((item, idx) => (
                  <Card
                    key={item.id}
                    className="overflow-hidden border-l-4 border-l-dai-green"
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="font-heading text-lg">
                          {item.branch_name}
                        </CardTitle>
                        <span className="text-xs text-muted-foreground">
                          #{idx + 1}
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="rounded-lg bg-cream p-3">
                        <p className="font-heading text-base leading-relaxed text-dai-green">
                          {item.verses}
                        </p>
                      </div>
                      {(item.province || item.city || item.county || item.region) && (
                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                          <MapPin className="h-3.5 w-3.5 text-warm-wood" />
                          {[item.province, item.city, item.county]
                            .filter(Boolean)
                            .join(" ") || item.region}
                        </div>
                      )}
                      {item.description && (
                        <p className="text-sm leading-relaxed text-muted-foreground">
                          {item.description}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}

          {/* Empty */}
          {!loading && results.length === 0 && (
            <div className="flex flex-col items-center py-20 text-center">
              <BookOpen className="h-12 w-12 text-muted-foreground/30" />
              <p className="mt-4 text-lg font-medium text-muted-foreground">
                暂无数据
              </p>
              <p className="mt-1 text-sm text-muted-foreground/70">
                {displayName}地区暂未收录字辈信息
              </p>
            </div>
          )}

          {/* Back Link */}
          <div className="mt-10 text-center">
            <Link
              href="/generation"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-dai-green"
            >
              <ArrowLeft className="h-4 w-4" />
              返回字辈查询器
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
