import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, MessageSquare } from "lucide-react";

import { Button } from "@/components/ui/button";
import { getForumPost } from "@/lib/api";
import type { ForumPost, ForumReply } from "@/lib/types";

import ForumDetailClient from "./forum-detail-client";

interface ForumPostWithReplies extends ForumPost {
  replies?: ForumReply[];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  try {
    const post = (await getForumPost(id)) as ForumPostWithReplies;
    return {
      title: post.title,
      description:
        post.content?.replace(/<[^>]*>/g, "").slice(0, 160) ?? "...",
      keywords: ["沈氏", "沈氏论坛", "宗亲交流", post.title],
    };
  } catch {
    return {
      title: "帖子不存在",
    };
  }
}

export default async function ForumDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  try {
    const post = (await getForumPost(id)) as ForumPostWithReplies;
    return <ForumDetailClient post={post} />;
  } catch {
    return (
      <div className="container max-w-3xl px-4 py-20 text-center md:px-6">
        <MessageSquare className="mx-auto size-12 text-muted-foreground/40" />
        <p className="mt-4 text-lg font-medium text-muted-foreground">
          帖子不存在或已被删除
        </p>
        <Link href="/forum">
          <Button variant="outline" className="mt-4">
            <ArrowLeft className="size-4" />
            返回留言墙
          </Button>
        </Link>
      </div>
    );
  }
}
