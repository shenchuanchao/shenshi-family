import type { Metadata } from "next";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";

interface ArticleResponse {
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
    const res = await fetch(`${API_BASE}/api/articles/${id}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) throw new Error("Failed to fetch");
    const json: ArticleResponse = await res.json();
    const article = json.data;
    return {
      title: `${article.title} | 沈氏文化家园`,
      description: article.content
        ? article.content.replace(/<[^>]*>/g, "").slice(0, 160)
        : "沈氏文化家园文章",
    };
  } catch {
    return { title: "文章详情" };
  }
}

export default function ArticleDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
