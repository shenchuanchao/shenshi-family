import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "影像馆",
  description: "沈氏家族影像与活动照片集，记录宗亲团聚与文化交流的美好瞬间。",
};

export default function GalleryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
