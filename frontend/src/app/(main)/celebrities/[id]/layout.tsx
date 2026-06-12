import type { Metadata } from "next";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";

interface ArticleResponse {
  code: number;
  data: { id: string; title: string; content?: string; dynasty?: string; field?: string };
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
    const celebrity = json.data;
    const parts: string[] = [];
    if (celebrity.dynasty) parts.push(celebrity.dynasty);
    if (celebrity.field) parts.push(celebrity.field);
    const subtitle = parts.length > 0 ? parts.join("·") : "沈氏名人";
    return {
      title: `${celebrity.title} | 沈氏文化家园`,
      description: `${subtitle} — ${celebrity.content ? celebrity.content.replace(/<[^>]*>/g, "").slice(0, 140) : "沈氏文化家园名人堂"}`,
    };
  } catch {
    return { title: "名人详情" };
  }
}

export default function CelebrityDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
