import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "迁徙史",
  description: "追溯沈氏家族的迁徙足迹，了解沈氏宗族在历史上的迁徙路线与分布。",
  keywords: ["沈氏迁徙", "沈氏迁徙史", "沈氏分布", "沈氏源流", "宗族迁徙"],
};

export default function MigrationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
