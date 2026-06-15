export interface User {
  id: string;
  email: string;
  nickname?: string;
  role?: string;
  hometown?: string;
  generation_verse?: string;
  tanghao?: string;
  avatar_url?: string;
  created_at: string;
}

export interface Article {
  id: string;
  title: string;
  content: string;
  category: "celebrity" | "genealogy" | "news" | "family_rules";
  dynasty?: string;
  field?: string;
  cover_image?: string;
  view_count: number;
  likes: number;
  status?: string;
  author_id?: string;
  user_liked?: boolean;
  author?: {
    id: string;
    nickname: string;
    avatar_url?: string;
  };
  created_at: string;
  comments?: Comment[];
}

export interface Comment {
  id: string;
  article_id: string;
  user_id: string;
  content: string;
  created_at: string;
  user?: {
    nickname: string;
    avatar_url?: string;
  };
}

export interface ForumPost {
  id: string;
  user_id: string;
  title: string;
  content: string;
  reply_count: number;
  created_at: string;
  user?: {
    nickname: string;
    avatar_url?: string;
  };
}

export interface ForumReply {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  created_at: string;
  user?: {
    nickname: string;
    avatar_url?: string;
  };
}

export interface GalleryImage {
  id: string;
  user_id: string;
  image_url: string;
  storage_path?: string;
  description?: string;
  likes: number;
  status?: string;
  reject_reason?: string;
  created_at: string;
}

export interface GenerationVerse {
  id: string;
  branch_name: string;
  verses: string;
  region?: string;
  province?: string;
  city?: string;
  county?: string;
  description?: string;
}

export interface Tanghao {
  name: string;
  description: string;
}

export interface ApiResponse<T> {
  code: number;
  data: T;
  message: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}