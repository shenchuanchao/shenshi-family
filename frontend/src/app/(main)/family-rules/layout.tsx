import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "家规家训",
  description: "传承先祖智慧，沈氏家规家训集锦，教化后代子孙。",
};

export default function FamilyRulesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
