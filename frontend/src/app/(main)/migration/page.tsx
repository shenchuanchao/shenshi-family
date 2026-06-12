"use client";

import { MapPin, ArrowRight, Calendar } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Breadcrumb } from "@/components/ui/breadcrumb";

/* ------------------------------------------------------------------ */
/* Static migration data                                               */
/* ------------------------------------------------------------------ */

interface MigrationRoute {
  id: number;
  period: string;
  origin: string;
  destination: string;
  description: string;
  detail: string;
}

const migrationRoutes: MigrationRoute[] = [
  {
    id: 1,
    period: "周代",
    origin: "沈国（河南沈丘）",
    destination: "吴兴（浙江湖州）",
    description: "沈氏南迁始祖",
    detail:
      "周代沈国灭亡后，沈氏族人开始南迁。其中一支辗转至吴兴（今浙江湖州），在此扎根繁衍，奠定了吴兴沈氏的基础，成为沈氏南迁的始祖。吴兴后来成为沈氏最重要的郡望之地。",
  },
  {
    id: 2,
    period: "汉代",
    origin: "吴兴",
    destination: "各地",
    description: "郡望形成",
    detail:
      "汉代吴兴沈氏逐渐壮大，族人因仕途、经商等原因分散至全国各地。吴兴郡望正式形成，成为天下沈氏公认的核心发源地，'吴兴沈氏' 自此名扬四海。",
  },
  {
    id: 3,
    period: "宋代",
    origin: "吴兴",
    destination: "江西、福建",
    description: "随南宋南迁",
    detail:
      "南宋时期，北方战乱频仍，大量吴兴沈氏族人随朝廷南迁至江西、福建等地。他们在当地开枝散叶，建立了新的宗族分支，将沈氏文化传播至东南沿海。",
  },
  {
    id: 4,
    period: "明代",
    origin: "江西",
    destination: "湖南、湖北",
    description: "湖广填四川",
    detail:
      "明初大规模移民运动中，江西沈氏族人迁往湖南、湖北等地。此后部分族人又继续西迁入川，参与了波澜壮阔的 '湖广填四川' 大移民，在巴蜀大地扎根。",
  },
  {
    id: 5,
    period: "清代",
    origin: "福建 / 广东",
    destination: "台湾、东南亚",
    description: "海外迁徙",
    detail:
      "清代福建、广东的沈氏族人渡海赴台湾开垦，同时有大量族人远赴东南亚各地经商、务工。沈氏的足迹从此遍布南洋，形成了广泛的海外宗亲网络。",
  },
  {
    id: 6,
    period: "近现代",
    origin: "各地",
    destination: "全球",
    description: "沈氏走向世界",
    detail:
      "近现代以来，沈氏后裔遍布世界各地。从欧美到澳洲，从日韩到非洲，沈氏族人凭借勤劳与智慧在全球各地建功立业，同时不忘寻根问祖，维系着跨越千年的宗族纽带。",
  },
];

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

export default function MigrationPage() {
  return (
    <div className="flex flex-col">
      <div className="container max-w-4xl px-4 pt-6 md:px-6">
        <Breadcrumb items={[{ label: "迁徙史" }]} />
      </div>
      {/* Hero */}
      <section className="bg-gradient-to-b from-cream to-background py-12 md:py-16">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center text-center">
            <MapPin className="h-10 w-10 text-dai-green" />
            <h1 className="mt-4 font-heading text-3xl font-bold tracking-tight md:text-4xl">
              沈氏迁徙史
            </h1>
            <p className="mt-3 max-w-xl text-muted-foreground">
              从河南沈丘到世界各地，追溯沈氏家族跨越千年的迁徙足迹
            </p>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-10 md:py-16">
        <div className="container px-4 md:px-6">
          <div className="relative mx-auto max-w-3xl">
            {/* Vertical connecting line */}
            <div className="absolute left-6 top-6 bottom-6 hidden w-px bg-gradient-to-b from-warm-wood via-dai-green to-warm-wood md:block" />

            <div className="space-y-8 md:space-y-10">
              {migrationRoutes.map((route, index) => (
                <div key={route.id} className="relative">
                  {/* Timeline dot */}
                  <div className="absolute left-6 top-8 z-10 hidden h-4 w-4 -translate-x-1/2 items-center justify-center md:flex">
                    <div className="h-4 w-4 rounded-full border-[3px] border-warm-wood bg-cream" />
                  </div>

                  {/* Card */}
                  <div className={`md:pl-14 ${index === 0 ? "md:pt-0" : ""}`}>
                    <Card className="overflow-hidden border-l-4 border-l-warm-wood transition-shadow hover:shadow-md">
                      <CardHeader>
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge
                            variant="secondary"
                            className="bg-dai-green/15 text-dai-green border-0"
                          >
                            <Calendar className="mr-1 h-3 w-3" />
                            {route.period}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {route.description}
                          </span>
                        </div>
                        <CardTitle className="mt-2 font-heading text-lg">
                          <span className="flex flex-wrap items-center gap-2">
                            <span className="text-warm-wood-dark">
                              {route.origin}
                            </span>
                            <ArrowRight className="h-4 w-4 shrink-0 text-dai-green" />
                            <span className="text-dai-green">
                              {route.destination}
                            </span>
                          </span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm leading-relaxed text-muted-foreground">
                          {route.detail}
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              ))}
            </div>

            {/* End marker */}
            <div className="relative hidden md:block">
              <div className="absolute left-6 z-10 flex h-4 w-4 -translate-x-1/2 items-center justify-center">
                <div className="h-3 w-3 rounded-full bg-dai-green" />
              </div>
              <div className="pl-14 pt-0">
                <p className="py-2 text-sm italic text-muted-foreground">
                  沈氏家族的故事仍在继续，全球宗亲的寻根之旅从未停歇...
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Summary */}
      <section className="border-t bg-light-gray py-12 md:py-16">
        <div className="container px-4 md:px-6">
          <div className="mx-auto max-w-3xl">
            <h2 className="font-heading text-center text-xl font-semibold md:text-2xl">
              迁徙概览
            </h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <Card className="bg-cream text-center">
                <CardContent className="py-6">
                  <p className="font-heading text-3xl font-bold text-warm-wood">
                    3000+
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    年迁徙历史
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-cream text-center">
                <CardContent className="py-6">
                  <p className="font-heading text-3xl font-bold text-dai-green">
                    6+
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    次大规模迁徙
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-cream text-center">
                <CardContent className="py-6">
                  <p className="font-heading text-3xl font-bold text-warm-wood-dark">
                    全球
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    沈氏分布范围
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
