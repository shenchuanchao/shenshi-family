import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "字辈查询",
  description: "查询您的字辈排行与辈分信息，追溯沈氏宗族字辈渊源。",
};

export default function GenerationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
