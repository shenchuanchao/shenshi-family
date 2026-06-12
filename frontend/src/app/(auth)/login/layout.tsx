import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "登录",
  description: "登录沈氏文化家园，与全球宗亲一起探索沈氏文化。",
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
