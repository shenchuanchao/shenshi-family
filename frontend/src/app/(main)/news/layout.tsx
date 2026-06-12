import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "最新动态",
  description: "沈氏文化家园最新新闻与动态，了解沈氏宗族最新资讯。",
};

export default function NewsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
