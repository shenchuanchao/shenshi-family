import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "堂号百科",
  description: "了解沈氏堂号的历史渊源与文化内涵，探索沈氏堂号百科。",
};

export default function TanghaoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
