import { Landmark } from "lucide-react";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { getTanghaoList } from "@/lib/api";

export const dynamic = "force-dynamic";

export default async function TanghaoPage() {
  let tanghaos: import("@/lib/types").Tanghao[] = [];
  try {
    tanghaos = (await getTanghaoList()) ?? [];
  } catch {
    tanghaos = [];
  }

  return (
    <div className="flex flex-col">
      <div className="container max-w-4xl px-4 pt-6 md:px-6">
        <Breadcrumb items={[{ label: "堂号百科" }]} />
      </div>
      {/* Hero */}
      <section className="bg-gradient-to-b from-cream to-background py-12 md:py-16">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center text-center">
            <Landmark className="h-10 w-10 text-warm-wood" />
            <h1 className="mt-4 font-heading text-3xl font-bold tracking-tight md:text-4xl">
              沈氏堂号百科
            </h1>
            <p className="mt-3 max-w-xl text-muted-foreground">
              堂号是家族的象征与标志号，承载着沈氏各支系的历史记忆与精神追求
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-10 md:py-14">
        <div className="container px-4 md:px-6">
          {tanghaos.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {tanghaos.map((tanghao) => (
                <Card
                  key={tanghao.name}
                  className="overflow-hidden transition-shadow hover:shadow-lg group/tanghao"
                >
                  <div className="h-1.5 bg-gradient-to-r from-warm-wood via-warm-wood-light to-warm-wood" />
                  <CardContent className="py-6">
                    <div className="mb-4 flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border-2 border-warm-wood/30 bg-warm-wood/8 group-hover/tanghao:border-warm-wood/60 transition-colors">
                        <Landmark className="h-5 w-5 text-warm-wood" />
                      </div>
                      <h3 className="font-heading text-2xl font-bold text-dai-green leading-tight">
                        {tanghao.name}
                      </h3>
                    </div>
                    <div className="mb-4 flex items-center gap-2">
                      <div className="h-px flex-1 bg-warm-wood/20" />
                      <div className="h-1.5 w-1.5 rounded-full bg-warm-wood/40" />
                      <div className="h-px flex-1 bg-warm-wood/20" />
                    </div>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {tanghao.description}
                    </p>
                  </CardContent>
                  <div className="h-0.5 bg-gradient-to-r from-transparent via-warm-wood/30 to-transparent" />
                </Card>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Landmark className="h-12 w-12 text-muted-foreground/40" />
              <h3 className="mt-4 font-heading text-lg font-medium">暂无堂号信息</h3>
              <p className="mt-2 text-sm text-muted-foreground">堂号资料正在整理中，敬请期待</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
