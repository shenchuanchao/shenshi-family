"use client";

import { useState } from "react";
import Link from "next/link";
import { Users, Filter } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Article } from "@/lib/types";

const DYNASTIES = ["全部", "周", "秦", "汉", "三国", "晋", "南北朝", "隋", "唐", "宋", "元", "明", "清", "近现代"];
const FIELDS = ["全部", "政治", "军事", "文学", "科学", "艺术", "哲学", "医学", "商业", "教育"];

export function CelebritiesClient({ celebrities }: { celebrities: Article[] }) {
  const [dynastyFilter, setDynastyFilter] = useState("全部");
  const [fieldFilter, setFieldFilter] = useState("全部");

  const filtered = celebrities.filter((c) => {
    if (dynastyFilter !== "全部" && c.dynasty !== dynastyFilter) return false;
    if (fieldFilter !== "全部" && c.field !== fieldFilter) return false;
    return true;
  });

  return (
    <>
      {/* Filter Bar */}
      <section className="border-b bg-background py-4">
        <div className="container px-4 md:px-6">
          <div className="flex flex-wrap items-center gap-3">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">筛选：</span>
            <Select value={dynastyFilter} onValueChange={(v) => setDynastyFilter(v ?? "全部")}>
              <SelectTrigger className="min-w-[120px]">
                <SelectValue placeholder="朝代" />
              </SelectTrigger>
              <SelectContent>
                {DYNASTIES.map((d) => (
                  <SelectItem key={d} value={d}>
                    {d === "全部" ? "全部朝代" : d}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={fieldFilter} onValueChange={(v) => setFieldFilter(v ?? "全部")}>
              <SelectTrigger className="min-w-[120px]">
                <SelectValue placeholder="领域" />
              </SelectTrigger>
              <SelectContent>
                {FIELDS.map((f) => (
                  <SelectItem key={f} value={f}>
                    {f === "全部" ? "全部领域" : f}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {(dynastyFilter !== "全部" || fieldFilter !== "全部") && (
              <button
                onClick={() => { setDynastyFilter("全部"); setFieldFilter("全部"); }}
                className="text-xs text-warm-wood-dark underline-offset-2 hover:underline"
              >
                清除筛选
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-10 md:py-14">
        <div className="container px-4 md:px-6">
          {filtered.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((celebrity) => (
                <Link
                  key={celebrity.id}
                  href={`/celebrities/${celebrity.id}`}
                  className="block transition-transform hover:-translate-y-0.5"
                >
                  <Card className="h-full overflow-hidden transition-shadow hover:shadow-lg">
                    {celebrity.cover_image ? (
                      <div className="aspect-video overflow-hidden">
                        <img src={celebrity.cover_image} alt={celebrity.title} className="h-full w-full object-cover transition-transform duration-300 hover:scale-105" />
                      </div>
                    ) : (
                      <div className="flex aspect-video items-center justify-center bg-gradient-to-br from-cream to-cream-dark">
                        <Users className="h-12 w-12 text-warm-wood/40" />
                      </div>
                    )}
                    <CardHeader>
                      <CardTitle className="font-heading line-clamp-1">{celebrity.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex flex-wrap gap-2">
                        {celebrity.dynasty && <Badge variant="secondary" className="bg-warm-wood/15 text-warm-wood-dark border-0">{celebrity.dynasty}</Badge>}
                        {celebrity.field && <Badge variant="secondary" className="bg-dai-green/15 text-dai-green border-0">{celebrity.field}</Badge>}
                      </div>
                      <p className="line-clamp-2 text-sm text-muted-foreground">
                        {celebrity.content.replace(/<[^>]*>/g, "").slice(0, 80)}
                        {celebrity.content.length > 80 ? "..." : ""}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Users className="h-12 w-12 text-muted-foreground/40" />
              <h3 className="mt-4 font-heading text-lg font-medium">暂无匹配的名人</h3>
              <p className="mt-2 text-sm text-muted-foreground">请尝试调整筛选条件，查看更多沈氏名人</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
