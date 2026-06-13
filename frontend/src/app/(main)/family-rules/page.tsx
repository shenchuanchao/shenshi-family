import Image from "next/image";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { getArticles } from "@/lib/api";
import type { Article } from "@/lib/types";
import FamilyRulesClient from "./family-rules-client";

export const dynamic = "force-dynamic";

export default async function FamilyRulesPage() {
  const res = await getArticles({ category: "family_rules", limit: 50 });
  const articles: Article[] = res.data ?? [];

  return (
    <div className="flex flex-col">
      <div className="container max-w-4xl px-4 pt-6 md:px-6">
        <Breadcrumb items={[{ label: "家规家训" }]} />
      </div>
      {/* Hero */}
      <section className="bg-gradient-to-b from-cream to-background py-12 md:py-16">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center text-center">
            <Image
              src="/img/seal-sanshan.webp"
              alt="沈氏三善"
              width={100}
              height={100}
              className="mb-4"
            />
            <h1 className="mt-4 font-heading text-3xl font-bold tracking-tight md:text-4xl">
              沈氏家规家训
            </h1>
            <p className="mt-3 max-w-xl text-muted-foreground">
              传承先祖智慧，教化后代子孙 —— 沈氏家族的精神财富
            </p>
          </div>
        </div>
      </section>

      {/* Content – interactive client component */}
      <FamilyRulesClient articles={articles} />
    </div>
  );
}
