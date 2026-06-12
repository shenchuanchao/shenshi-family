import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "名人堂",
  description: "探索沈氏历史上的杰出人物，了解沈氏先贤的生平与贡献。",
};

export default function CelebritiesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
