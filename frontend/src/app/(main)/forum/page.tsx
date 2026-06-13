import type { Metadata } from "next";
import { MessageSquare, PenLine } from "lucide-react";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { getForumPosts } from "@/lib/api";
import type { ForumPost } from "@/lib/types";
import ForumClient from "./forum-client";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "留言墙",
  description: "与全球沈氏宗亲交流互动，分享家族故事与心得。",
  keywords: ["沈氏论坛", "沈氏留言墙", "宗亲交流", "沈氏社区", "寻根问祖"],
};

const PAGE_SIZE = 10;

export default async function ForumPage() {
  const res = await getForumPosts({ page: 1, limit: PAGE_SIZE });
  const posts: ForumPost[] = res.data ?? [];
  const total: number = res.total ?? 0;

  return (
    <div className="flex flex-col">
      <div className="container max-w-4xl px-4 pt-6 md:px-6">
        <Breadcrumb items={[{ label: "留言墙" }]} />
      </div>
      {/* Hero Header */}
      <section className="bg-gradient-to-b from-cream to-background py-12 md:py-16">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center text-center">
            <div className="mb-4 flex size-14 items-center justify-center rounded-full bg-warm-wood/15">
              <MessageSquare className="size-7 text-warm-wood" />
            </div>
            <h1 className="font-heading text-3xl font-bold tracking-tight text-dai-green md:text-4xl">
              沈氏留言墙
            </h1>
            <p className="mt-3 max-w-xl text-muted-foreground">
              宗亲交流、寻根问祖的温暖家园
            </p>
          </div>
        </div>
      </section>

      {/* Content – interactive client component */}
      <ForumClient posts={posts} total={total} />
    </div>
  );
}
