import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "字辈查询",
  description: "查询您的字辈排行与辈分信息，追溯沈氏宗族字辈渊源。",
  keywords: ["沈氏字辈", "字辈查询", "沈氏字辈大全", "字辈排行", "辈分查询", "沈氏家谱"],
};

export default function GenerationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
