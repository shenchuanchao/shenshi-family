import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "堂号百科",
  description: "了解沈氏堂号的历史渊源与文化内涵，探索沈氏堂号百科。",
  keywords: ["沈氏堂号", "堂号百科", "吴兴堂", "三善堂", "沈氏堂号大全"],
};

export default function TanghaoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
