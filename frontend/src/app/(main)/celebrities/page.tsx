import type { Metadata } from "next";
import { Users } from "lucide-react";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { getArticles } from "@/lib/api";
import { CelebritiesClient } from "./celebrities-client";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "名人堂",
  description: "探索沈氏历史上的杰出人物，了解沈氏先贤的生平与贡献。",
  keywords: ["沈氏名人", "沈姓名人", "沈约", "沈括", "沈从文", "沈氏先贤", "沈氏名人堂"],
};

export default async function CelebritiesPage() {
  let celebrities: import("@/lib/types").Article[] = [];
  try {
    const res = await getArticles({ category: "celebrity", limit: 50 });
    celebrities = res.data ?? [];
  } catch {
    celebrities = [];
  }

  return (
    <div className="flex flex-col">
      <div className="container max-w-4xl px-4 pt-6 md:px-6">
        <Breadcrumb items={[{ label: "名人堂" }]} />
      </div>
      {/* Hero */}
      <section className="bg-gradient-to-b from-cream to-background py-12 md:py-16">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center text-center">
            <Users className="h-10 w-10 text-warm-wood" />
            <h1 className="mt-4 font-heading text-3xl font-bold tracking-tight md:text-4xl">
              沈氏名人堂
            </h1>
            <p className="mt-3 max-w-xl text-muted-foreground">
              千年传承，群星璀璨 —— 记录沈氏历史上的杰出人物
            </p>
          </div>
        </div>
      </section>

      <CelebritiesClient celebrities={celebrities} />
    </div>
  );
}
