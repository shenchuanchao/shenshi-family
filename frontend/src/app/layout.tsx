import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";
import { Toaster } from "@/components/ui/sonner";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://shenshi-culture.coderlog.net";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    template: "%s | 沈氏文化家园 - 沈氏字辈查询·堂号百科·宗亲交流",
    default: "沈氏文化家园 - 沈氏字辈查询·名人堂·堂号百科·全球宗亲交流平台",
  },
  description: "沈氏文化家园是全球沈氏宗亲的文化社区与寻根平台，提供沈氏字辈查询、名人堂、堂号百科、家规家训、迁徙史等内容，连接全球沈氏宗亲，传承千年文脉。",
  keywords: ["沈氏", "沈姓", "字辈查询", "沈氏字辈", "沈氏家谱", "沈氏名人", "沈氏堂号", "吴兴堂", "三善堂", "沈氏文化", "宗亲交流", "寻根问祖"],
  authors: [{ name: "沈氏文化家园" }],
  creator: "沈氏文化家园",
  publisher: "沈氏文化家园",
  formatDetection: {
    telephone: false,
    email: false,
    address: false,
  },
  openGraph: {
    type: "website",
    locale: "zh_CN",
    siteName: "沈氏文化家园",
    title: "沈氏文化家园 - 沈氏字辈查询·名人堂·堂号百科·全球宗亲交流平台",
    description: "全球沈氏宗亲的文化社区与寻根平台，提供字辈查询、名人堂、堂号百科等内容。",
    images: [{ url: "/img/logo-dragon.webp", width: 720, height: 720, alt: "沈氏文化家园" }],
  },
  twitter: {
    card: "summary",
    title: "沈氏文化家园",
    description: "全球沈氏宗亲的文化社区与寻根平台",
    images: ["/img/logo-dragon.webp"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  alternates: {
    canonical: SITE_URL,
  },
  icons: {
    icon: "/icon.png",
  },
  other: {
    "baidu-site-verification": "", // 百度站长验证，获取后填入
    "renderer": "webkit",
    "force-rendering": "webkit",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="h-full">
      <body className="flex min-h-full flex-col">
        <AuthProvider>{children}</AuthProvider>
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
