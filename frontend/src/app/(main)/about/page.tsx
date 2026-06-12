import { BookOpen, Heart, Globe, Users } from "lucide-react";
import type { Metadata } from "next";
import { Breadcrumb } from "@/components/ui/breadcrumb";

export const metadata: Metadata = {
  title: "关于我们",
  description: "了解沈氏文化家园的使命与愿景，我们致力于传承沈氏文化、连接全球宗亲。",
};

export default function AboutPage() {
  return (
    <div className="flex flex-col">
      <div className="container max-w-4xl px-4 pt-6 md:px-6">
        <Breadcrumb items={[{ label: "关于我们" }]} />
      </div>
      <section className="bg-gradient-to-b from-cream to-background py-16 md:py-20">
        <div className="container px-4 md:px-6">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-4 inline-flex size-14 items-center justify-center rounded-full bg-dai-green/10">
              <BookOpen className="size-7 text-dai-green" />
            </div>
            <h1 className="font-heading text-3xl font-bold tracking-tight md:text-4xl">
              关于我们
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              沈氏文化家园 —— 全球沈氏宗亲的精神纽带与文化社区
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container max-w-3xl px-4 md:px-6">
          <div className="space-y-10 text-base leading-relaxed text-foreground/85">
            <div>
              <h2 className="mb-4 flex items-center gap-2 font-heading text-xl font-semibold">
                <Heart className="size-5 text-warm-wood" />
                我们的使命
              </h2>
              <p>
                沈氏文化家园致力于传承和弘扬沈氏家族千年文化遗产，搭建全球沈氏宗亲之间的桥梁。我们相信，家族文化是中华文明的重要组成部分，通过数字化手段让传统文化焕发新的生命力，是我们这一代人的责任与使命。
              </p>
            </div>

            <div>
              <h2 className="mb-4 flex items-center gap-2 font-heading text-xl font-semibold">
                <Globe className="size-5 text-dai-green" />
                平台功能
              </h2>
              <p className="mb-4">
                我们为用户提供丰富的文化内容和社区互动功能：
              </p>
              <ul className="ml-4 list-inside list-disc space-y-2 text-foreground/80">
                <li>名人堂 —— 记录沈氏历史上的杰出人物，从沈约到沈括，从沈周到沈从文</li>
                <li>字辈查询 —— 收录各地沈氏字辈排行，帮助宗亲查找辈分信息</li>
                <li>堂号百科 —— 介绍沈氏各堂号的来源与历史，如吴兴堂、三善堂等</li>
                <li>家规家训 —— 传承先祖智慧，教化后代子孙</li>
                <li>迁徙史 —— 追溯沈氏家族的迁徙足迹与分布</li>
                <li>留言墙 —— 全球宗亲交流互动的社区平台</li>
                <li>影像馆 —— 记录和分享家族珍贵影像</li>
              </ul>
            </div>

            <div>
              <h2 className="mb-4 flex items-center gap-2 font-heading text-xl font-semibold">
                <Users className="size-5 text-warm-wood" />
                加入我们
              </h2>
              <p>
                无论您身在何处，只要姓沈，这里就是您的精神家园。欢迎注册成为会员，参与社区讨论，分享您的家族故事，上传珍贵老照片，与全球沈氏宗亲共同书写属于我们的文化篇章。
              </p>
            </div>

            <div className="rounded-xl bg-cream p-6">
              <blockquote className="text-center">
                <p className="font-heading text-lg italic text-dai-green">
                  &ldquo;参天之木，必有其根；怀山之水，必有其源。&rdquo;
                </p>
                <footer className="mt-3 text-sm text-muted-foreground">
                  —— 寻根问祖，薪火相传
                </footer>
              </blockquote>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
