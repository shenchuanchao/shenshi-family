import { Mail, MessageSquare, Globe, MapPin } from "lucide-react";
import type { Metadata } from "next";
import { Breadcrumb } from "@/components/ui/breadcrumb";

export const metadata: Metadata = {
  title: "联系方式",
  description: "联系沈氏文化家园团队，欢迎提出建议与合作意向。",
};

export default function ContactPage() {
  return (
    <div className="flex flex-col">
      <div className="container max-w-4xl px-4 pt-6 md:px-6">
        <Breadcrumb items={[{ label: "联系方式" }]} />
      </div>
      <section className="bg-gradient-to-b from-cream to-background py-16 md:py-20">
        <div className="container px-4 md:px-6">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-4 inline-flex size-14 items-center justify-center rounded-full bg-dai-green/10">
              <MessageSquare className="size-7 text-dai-green" />
            </div>
            <h1 className="font-heading text-3xl font-bold tracking-tight md:text-4xl">
              联系方式
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              有任何问题或建议，欢迎随时与我们取得联系
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container max-w-3xl px-4 md:px-6">
          <div className="grid gap-8 md:grid-cols-2">
            <div className="space-y-8">
              <div>
                <h2 className="mb-3 font-heading text-lg font-semibold">联系渠道</h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-dai-green/10">
                      <Mail className="size-4 text-dai-green" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">电子邮箱</p>
                      <p className="text-sm text-muted-foreground">
                        contact@shenshi-culture.com
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-warm-wood/10">
                      <MessageSquare className="size-4 text-warm-wood" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">留言墙</p>
                      <p className="text-sm text-muted-foreground">
                        在平台内留言，我们会尽快回复
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-dai-green/10">
                      <Globe className="size-4 text-dai-green" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">开源社区</p>
                      <p className="text-sm text-muted-foreground">
                        欢迎参与项目开发与内容贡献
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-warm-wood/10">
                      <MapPin className="size-4 text-warm-wood" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">地址</p>
                      <p className="text-sm text-muted-foreground">
                        浙江省湖州市吴兴区
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div>
                <h2 className="mb-3 font-heading text-lg font-semibold">常见问题</h2>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium">如何注册账号？</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      点击页面右上角"注册"按钮，填写邮箱和密码即可创建账号。
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">如何上传照片到影像馆？</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      登录后进入影像馆页面，点击"上传照片"按钮，选择图片并填写描述即可。
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">字辈信息不准确怎么办？</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      欢迎通过邮箱或留言墙提交更正信息，我们会核实后更新。
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">如何贡献内容？</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      我们欢迎宗亲投稿名人传记、家族故事、老照片等内容，请通过邮箱与我们联系。
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
