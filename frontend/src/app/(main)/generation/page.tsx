"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, BookOpen, MapPin, MessageSquarePlus } from "lucide-react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import {
  queryGenerationVerse,
  getGenerationProvinces,
  getGenerationCities,
  getGenerationCounties,
} from "@/lib/api";
import type { GenerationVerse } from "@/lib/types";

/* ------------------------------------------------------------------ */
/* Provinces list                                                      */
/* ------------------------------------------------------------------ */

/** Direct-controlled municipalities — suffixed with 市 */
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

/** Format province name with proper suffix */
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

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

export default function GenerationPage() {
  const [provinces, setProvinces] = useState<string[]>([]);
  const [province, setProvince] = useState("");
  const [cities, setCities] = useState<string[]>([]);
  const [city, setCity] = useState("");
  const [counties, setCounties] = useState<string[]>([]);
  const [county, setCounty] = useState("");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<GenerationVerse[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState("");

  // Fetch provinces from backend (fallback to static list)
  useEffect(() => {
    async function fetchProvinces() {
      try {
        const data = await getGenerationProvinces();
        if (data && data.length > 0) {
          const merged = [...new Set([...data, ...ALL_PROVINCES])];
          setProvinces(merged);
        } else {
          setProvinces(ALL_PROVINCES);
        }
      } catch {
        setProvinces(ALL_PROVINCES);
      }
    }
    fetchProvinces();
  }, []);

  // Fetch cities when province changes
  useEffect(() => {
    if (!province) {
      setCities([]);
      setCity("");
      setCounties([]);
      setCounty("");
      return;
    }
    // Reset city/county on province change
    setCity("");
    setCounties([]);
    setCounty("");

    async function fetchCities() {
      try {
        const data = await getGenerationCities(province);
        setCities(data ?? []);
      } catch {
        setCities([]);
      }
    }
    fetchCities();
  }, [province]);

  // Fetch counties when city changes
  useEffect(() => {
    if (!province || !city) {
      setCounties([]);
      setCounty("");
      return;
    }
    setCounty("");

    async function fetchCounties() {
      try {
        const data = await getGenerationCounties(province, city);
        setCounties(data ?? []);
      } catch {
        setCounties([]);
      }
    }
    fetchCounties();
  }, [province, city]);

  const handleSearch = useCallback(
    async (searchQuery?: string) => {
      if (!province) return;

      const q = searchQuery !== undefined ? searchQuery : query;
      setLoading(true);
      setError("");
      setSearched(true);
      if (searchQuery !== undefined) setQuery(searchQuery);

      try {
        const data = await queryGenerationVerse({
          province,
          city: city || undefined,
          county: county || undefined,
          verse: q.trim() || undefined,
        });
        setResults(data ?? []);
      } catch {
        setError("查询失败，请稍后重试");
        setResults([]);
      } finally {
        setLoading(false);
      }
    },
    [province, city, county, query]
  );

  // Auto-search when province changes
  useEffect(() => {
    if (province) {
      handleSearch("");
    }
  }, [province]); // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-search when city or county changes (if already searched)
  useEffect(() => {
    if (province && searched) {
      handleSearch();
    }
  }, [city, county]); // eslint-disable-line react-hooks/exhaustive-deps

  // Build location label for forum post title
  const locationLabel = [province ? formatProvince(province) : "", city, county]
    .filter(Boolean)
    .join("");
  const forumHelpTitle = `求${locationLabel}沈氏字辈信息`;

  const selectClass =
    "flex h-11 w-full rounded-lg border border-input bg-background px-3 text-base shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring";

  return (
    <div className="flex flex-col">
      <div className="container max-w-4xl px-4 pt-6 md:px-6">
        <Breadcrumb items={[{ label: "字辈查询" }]} />
      </div>
      {/* Hero */}
      <section className="bg-gradient-to-b from-cream to-background py-12 md:py-16">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center text-center">
            <BookOpen className="h-10 w-10 text-dai-green" />
            <h1 className="mt-4 font-heading text-3xl font-bold tracking-tight md:text-4xl">
              字辈查询器
            </h1>
            <p className="mt-3 max-w-xl text-muted-foreground">
              选择您的省份，查找可能匹配的沈氏支系
            </p>
          </div>

          {/* Search Controls */}
          <div className="mx-auto mt-8 max-w-3xl space-y-4">
            {/* Province + City + County (one row) */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="province-select">
                  省份 <span className="text-red-500">*</span>
                </Label>
                <select
                  id="province-select"
                  value={province}
                  onChange={(e) => setProvince(e.target.value)}
                  className={selectClass}
                >
                  <option value="">请选择省份</option>
                  {Object.entries(PROVINCE_GROUPS).map(([group, items]) => (
                    <optgroup key={group} label={`── ${group} ──`}>
                      {items.map((p) => (
                        <option key={p} value={p}>
                          {formatProvince(p)}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="city-select">
                  城市{" "}
                  <span className="text-xs text-muted-foreground">（可选）</span>
                </Label>
                <select
                  id="city-select"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  disabled={!province || cities.length === 0}
                  className={selectClass}
                >
                  <option value="">全部城市</option>
                  {cities.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="county-select">
                  区县{" "}
                  <span className="text-xs text-muted-foreground">（可选）</span>
                </Label>
                <select
                  id="county-select"
                  value={county}
                  onChange={(e) => setCounty(e.target.value)}
                  disabled={!city || counties.length === 0}
                  className={selectClass}
                >
                  <option value="">全部区县</option>
                  {counties.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Verse Input (optional) */}
            <div className="space-y-2">
              <Label htmlFor="verse-input">
                字辈内容{" "}
                <span className="text-xs text-muted-foreground">
                  （可选，不填则浏览该地区全部字辈）
                </span>
              </Label>
              <div className="flex items-center gap-3">
                <Input
                  id="verse-input"
                  placeholder="输入字辈关键词，如：仁义礼智信..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSearch();
                  }}
                  className="h-11 text-base"
                  disabled={!province}
                />
                <Button
                  size="lg"
                  onClick={() => handleSearch()}
                  disabled={!province || loading}
                  className="shrink-0 bg-dai-green hover:bg-dai-green-dark"
                >
                  <Search className="h-4 w-4" />
                  查询
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="py-10 md:py-14">
        <div className="container px-4 md:px-6">
          {/* Loading */}
          {loading && (
            <div className="grid gap-6 sm:grid-cols-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-5 w-1/2" />
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Results Grid */}
          {!loading && results.length > 0 && (
            <>
              <p className="mb-6 text-sm text-muted-foreground">
                {formatProvince(province)}
                {city ? ` · ${city}` : ""}
                {county ? ` · ${county}` : ""}
                {query ? ` · 搜索"${query}"` : " · 全部字辈"}
                {" · "}共找到 {results.length} 条结果
              </p>
              <div className="grid gap-6 sm:grid-cols-2">
                {results.map((result) => (
                  <Card
                    key={result.id}
                    className="overflow-hidden border-l-4 border-l-dai-green transition-shadow hover:shadow-md"
                  >
                    <CardHeader>
                      <CardTitle className="font-heading">
                        {result.branch_name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="rounded-lg bg-cream p-3">
                        <p className="font-heading text-base leading-relaxed text-dai-green">
                          {result.verses}
                        </p>
                      </div>
                      {(result.province || result.region) && (
                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4 text-warm-wood" />
                          {[result.province, result.city, result.county]
                            .filter(Boolean)
                            .join(" ") || result.region}
                        </div>
                      )}
                      {result.description && (
                        <p className="text-sm leading-relaxed text-muted-foreground">
                          {result.description}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}

          {/* Error */}
          {!loading && error && (
            <div className="py-12 text-center">
              <p className="text-destructive">{error}</p>
            </div>
          )}

          {/* No Results — guide to forum */}
          {!loading && searched && results.length === 0 && !error && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Search className="h-12 w-12 text-muted-foreground/40" />
              <h3 className="mt-4 font-heading text-lg font-medium">
                未找到匹配的字辈
              </h3>
              <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                {locationLabel}地区暂未收录相关字辈数据。您可以前往留言墙发帖求助，其他宗亲可能会帮助您补充信息。
              </p>
              <Link
                href={`/forum?auto_title=${encodeURIComponent(forumHelpTitle)}`}
                className="mt-6 inline-flex items-center gap-2 rounded-lg bg-dai-green px-5 py-2.5 text-sm font-medium text-cream transition-colors hover:bg-dai-green-dark"
              >
                <MessageSquarePlus className="h-4 w-4" />
                去留言墙发帖求助
              </Link>
            </div>
          )}

          {/* Initial Empty State */}
          {!loading && !searched && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <BookOpen className="h-12 w-12 text-muted-foreground/30" />
              <p className="mt-4 text-sm text-muted-foreground">
                选择省份后可浏览该地区的沈氏字辈，也可输入关键词精确查询
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Province Quick Links */}
      <section className="border-t bg-cream py-10 md:py-14">
        <div className="container max-w-4xl px-4 md:px-6">
          <h2 className="mb-6 text-center font-heading text-xl font-semibold md:text-2xl">
            各省份沈氏字辈大全
          </h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {ALL_PROVINCES.map((p) => (
              <Link
                key={p}
                href={`/generation/${encodeURIComponent(p)}`}
                className="rounded-lg border bg-background px-3 py-2.5 text-center text-sm transition-colors hover:border-dai-green hover:text-dai-green"
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
