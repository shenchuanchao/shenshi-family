import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "注册",
  description: "注册成为沈氏文化家园会员，加入全球沈氏宗亲社区。",
  keywords: ["沈氏注册", "沈氏文化家园", "加入宗亲"],
};

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
