import { Shield } from "lucide-react";
import type { Metadata } from "next";
import { Breadcrumb } from "@/components/ui/breadcrumb";

export const metadata: Metadata = {
  title: "隐私政策",
  description: "沈氏文化家园隐私政策，了解我们如何保护您的个人信息。",
  keywords: ["沈氏文化家园", "隐私政策"],
};

export default function PrivacyPage() {
  return (
    <div className="flex flex-col">
      <div className="container max-w-4xl px-4 pt-6 md:px-6">
        <Breadcrumb items={[{ label: "隐私政策" }]} />
      </div>
      <section className="bg-gradient-to-b from-cream to-background py-16 md:py-20">
        <div className="container px-4 md:px-6">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-4 inline-flex size-14 items-center justify-center rounded-full bg-dai-green/10">
              <Shield className="size-7 text-dai-green" />
            </div>
            <h1 className="font-heading text-3xl font-bold tracking-tight md:text-4xl">
              隐私政策
            </h1>
            <p className="mt-4 text-sm text-muted-foreground">
              最后更新日期：2026 年 6 月 10 日
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container max-w-3xl px-4 md:px-6">
          <div className="space-y-8 text-base leading-relaxed text-foreground/85">
            <p>
              沈氏文化家园（以下简称"我们"）非常重视用户的隐私保护。本隐私政策说明我们如何收集、使用、存储和保护您的个人信息。
            </p>

            <div>
              <h2 className="mb-3 font-heading text-lg font-semibold">信息收集</h2>
              <p className="mb-3">
                我们在以下场景中收集您的信息：
              </p>
              <ul className="ml-4 list-inside list-disc space-y-2 text-foreground/80">
                <li>注册账号时，收集您的邮箱地址和昵称</li>
                <li>完善个人资料时，收集您的家乡、字辈、堂号等信息</li>
                <li>上传影像时，收集您上传的图片文件及描述文字</li>
                <li>发表留言和评论时，收集您发布的内容</li>
              </ul>
            </div>

            <div>
              <h2 className="mb-3 font-heading text-lg font-semibold">信息使用</h2>
              <p className="mb-3">
                我们收集的信息仅用于以下目的：
              </p>
              <ul className="ml-4 list-inside list-disc space-y-2 text-foreground/80">
                <li>提供账号认证和登录服务</li>
                <li>展示用户昵称和头像等公开资料</li>
                <li>存储和展示您发布的影像、留言、评论等内容</li>
                <li>改善平台功能和用户体验</li>
              </ul>
            </div>

            <div>
              <h2 className="mb-3 font-heading text-lg font-semibold">信息存储与安全</h2>
              <p>
                您的密码经过加密存储，我们无法获取您的明文密码。个人信息存储在安全的服务器上，我们采取合理的技术和管理措施保护您的数据安全。我们不会将您的个人信息出售、出租或以其他方式提供给任何第三方，除非获得您的明确授权或法律法规要求。
              </p>
            </div>

            <div>
              <h2 className="mb-3 font-heading text-lg font-semibold">Cookie 与本地存储</h2>
              <p>
                我们使用浏览器本地存储（LocalStorage）保存您的登录状态，以便您无需重复登录。该信息仅存储在您的设备本地，不会传输至我们的服务器。
              </p>
            </div>

            <div>
              <h2 className="mb-3 font-heading text-lg font-semibold">您的权利</h2>
              <p className="mb-3">
                您对自己的个人信息享有以下权利：
              </p>
              <ul className="ml-4 list-inside list-disc space-y-2 text-foreground/80">
                <li>查看和修改您的个人资料</li>
                <li>随时登出您的账号</li>
                <li>联系我们删除您的账号及相关数据</li>
              </ul>
            </div>

            <div>
              <h2 className="mb-3 font-heading text-lg font-semibold">未成年人保护</h2>
              <p>
                本平台面向成年用户。如果您是未满 18 周岁的未成年人，请在监护人的指导下使用本平台，并在注册前获得监护人的同意。
              </p>
            </div>

            <div>
              <h2 className="mb-3 font-heading text-lg font-semibold">政策更新</h2>
              <p>
                我们可能会不时更新本隐私政策。重大变更将通过平台公告或邮件方式通知用户。继续使用本平台即表示您同意更新后的隐私政策。
              </p>
            </div>

            <div className="rounded-xl bg-cream p-6 text-center text-sm text-muted-foreground">
              如有任何关于隐私政策的问题，请通过{" "}
              <span className="text-dai-green">shanchuanchao99@sina.com</span>{" "}
              与我们联系。
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
