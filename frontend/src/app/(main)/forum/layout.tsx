import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "留言墙",
  description: "与全球沈氏宗亲交流互动，分享家族故事与心得。",
};

export default function ForumLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
