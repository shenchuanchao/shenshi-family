import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "个人中心",
  description: "管理您的个人资料、堂号信息与偏好设置。",
};

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
