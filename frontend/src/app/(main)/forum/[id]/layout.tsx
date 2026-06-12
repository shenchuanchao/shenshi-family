import type { Metadata } from "next";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";

interface ForumPostResponse {
  code: number;
  data: { id: string; title: string; content?: string };
  message: string;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  try {
    const res = await fetch(`${API_BASE}/api/forum/posts/${id}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) throw new Error("Failed to fetch");
    const json: ForumPostResponse = await res.json();
    const post = json.data;
    return {
      title: `${post.title} | 沈氏文化家园`,
      description: post.content
        ? post.content.replace(/<[^>]*>/g, "").slice(0, 160)
        : "沈氏文化家园留言",
    };
  } catch {
    return { title: "帖子详情" };
  }
}

export default function ForumPostDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
