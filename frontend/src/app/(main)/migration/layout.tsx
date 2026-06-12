import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "迁徙史",
  description: "追溯沈氏家族的迁徙足迹，了解沈氏宗族在历史上的迁徙路线与分布。",
};

export default function MigrationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
