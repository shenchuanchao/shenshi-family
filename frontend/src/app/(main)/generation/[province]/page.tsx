import { BookOpen, ArrowLeft } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

import { Breadcrumb } from "@/components/ui/breadcrumb";
import { queryGenerationVerse } from "@/lib/api";
import type { GenerationVerse } from "@/lib/types";

/* ------------------------------------------------------------------ */
/* Dynamic Metadata                                                    */
/* ------------------------------------------------------------------ */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ province: string }>;
}): Promise<Metadata> {
  const { province } = await params;
  const p = decodeURIComponent(province);
  return {
    title: `${p}沈氏字辈大全`,
    description: `${p}沈氏字辈大全，收录${p}地区各支系沈氏字辈信息，查询您的辈分与家族渊源。`,
    keywords: [`${p}沈氏字辈`, "沈氏字辈大全", "字辈查询", `${p}沈氏`, "沈氏家谱"],
  };
}

/* ------------------------------------------------------------------ */
/* Page Component (Server Component — data fetched during SSR)        */
/* ------------------------------------------------------------------ */

export default async function ProvinceVersePage({
  params,
}: {
  params: Promise<{ province: string }>;
}) {
  const { province } = await params;
  const decodedProvince = decodeURIComponent(province);

  let results: GenerationVerse[] = [];
  try {
    results = (await queryGenerationVerse({ province: decodedProvince })) ?? [];
  } catch {
    results = [];
  }

  return (
    <div className="flex flex-col">
      <div className="container max-w-4xl px-4 pt-6 md:px-6">
        <Breadcrumb
          items={[
            { label: "字辈查询", href: "/generation" },
            { label: `${decodedProvince}沈氏字辈大全` },
          ]}
        />
      </div>

      {/* Hero */}
      <section className="bg-gradient-to-b from-cream to-background py-8 md:py-12">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center text-center">
            <BookOpen className="h-8 w-8 text-dai-green" />
            <h1 className="mt-3 font-heading text-2xl font-bold tracking-tight md:text-3xl">
              {decodedProvince}沈氏字辈大全
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              收录{decodedProvince}地区各支系沈氏字辈信息
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-6 md:py-10">
        <div className="container max-w-3xl px-4 md:px-6">
          {/* Results */}
          {results.length > 0 && (
            <>
              <p className="mb-4 text-sm text-muted-foreground">
                共收录 {results.length} 条字辈信息
              </p>
              <div className="space-y-3 text-[15px] leading-7">
                {results.map((item, idx) => {
                  const location =
                    [item.province, item.city, item.county]
                      .filter(Boolean)
                      .join(" ") || item.region || "";
                  return (
                    <p key={item.id}>
                      <span className="mr-1 font-medium text-muted-foreground">
                        {idx + 1}.
                      </span>
                      <span className="font-heading font-semibold">
                        {item.branch_name}
                      </span>
                      <span className="mx-1">：</span>
                      <span className="text-dai-green">{item.verses}</span>
                      {location && (
                        <span className="text-muted-foreground">
                          （{location}）
                        </span>
                      )}
                      {item.description && (
                        <span className="text-muted-foreground">
                          ——{item.description}
                        </span>
                      )}
                    </p>
                  );
                })}
              </div>
            </>
          )}

          {/* Empty */}
          {results.length === 0 && (
            <div className="flex flex-col items-center py-16 text-center">
              <BookOpen className="h-10 w-10 text-muted-foreground/30" />
              <p className="mt-4 text-muted-foreground">
                {decodedProvince}地区暂未收录字辈信息
              </p>
            </div>
          )}

          {/* Back Link */}
          <div className="mt-8 text-center">
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
