import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "文章列表",
  description: "沈氏文化精选文章，涵盖名人传记、家训解读、宗族动态等内容。",
};

export default function ArticlesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
