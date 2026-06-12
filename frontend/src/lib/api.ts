import type {
  Article,
  ForumPost,
  GalleryImage,
  GenerationVerse,
  PaginatedResponse,
  Tanghao,
  User,
} from "@/lib/types";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function request<T>(
  path: string,
  options: RequestInit & { token?: string } = {}
): Promise<T> {
  const { token, headers: extraHeaders, ...rest } = options;

  const headers: Record<string, string> = {
    ...(extraHeaders as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  // Only set Content-Type for non-FormData bodies
  if (!(rest.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...rest,
    headers,
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    const message =
      (errorBody as { message?: string }).message ||
      `Request failed with status ${res.status}`;
    throw new Error(message);
  }

  const json = await res.json();

  // The NestJS backend wraps every response via TransformInterceptor:
  //   { code: 0, data: <actual_payload>, message: "success" }
  // Unwrap here so callers receive the payload directly.
  if (json && typeof json === "object" && "code" in json && "data" in json) {
    return json.data as T;
  }

  return json as T;
}

function qs(params?: Record<string, string | number | boolean | undefined>): string {
  if (!params) return "";
  const entries = Object.entries(params).filter(
    ([, v]) => v !== undefined && v !== ""
  );
  if (entries.length === 0) return "";
  const searchParams = new URLSearchParams(
    entries.map(([k, v]) => [k, String(v)])
  );
  return `?${searchParams.toString()}`;
}

// ---------------------------------------------------------------------------
// Auth
// ---------------------------------------------------------------------------

export async function login(email: string, password: string) {
  return request<{ user: User; access_token: string }>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function register(
  email: string,
  password: string,
  nickname?: string
) {
  return request<User>("/api/auth/register", {
    method: "POST",
    body: JSON.stringify({ email, password, nickname }),
  });
}

export async function getProfile(token: string) {
  return request<User>("/api/auth/profile", { token });
}

export async function updateProfile(token: string, data: Partial<User>) {
  return request<User>("/api/auth/profile", {
    method: "PUT",
    token,
    body: JSON.stringify(data),
  });
}

// ---------------------------------------------------------------------------
// Articles
// ---------------------------------------------------------------------------

export async function getArticles(params?: {
  category?: string;
  page?: number;
  limit?: number;
}) {
  return request<PaginatedResponse<Article>>(
    `/api/articles${qs(params)}`
  );
}

export async function getArticle(id: string, token?: string) {
  return request<Article>(`/api/articles/${id}`, { token });
}

export async function likeArticle(id: string, token: string) {
  return request<{ likes: number; user_liked: boolean }>(`/api/articles/${id}/like`, {
    method: "POST",
    token,
  });
}

export async function addComment(
  articleId: string,
  content: string,
  token: string
) {
  return request<{ id: string; content: string; created_at: string }>(
    `/api/articles/${articleId}/comments`,
    {
      method: "POST",
      token,
      body: JSON.stringify({ content }),
    }
  );
}

export async function createArticle(
  data: {
    title: string;
    content: string;
    category: string;
    dynasty?: string;
    field?: string;
    cover_image?: string;
  },
  token: string
) {
  return request<Article>("/api/articles", {
    method: "POST",
    token,
    body: JSON.stringify(data),
  });
}

export async function updateArticle(
  id: string,
  data: {
    title?: string;
    content?: string;
    category?: string;
    dynasty?: string;
    field?: string;
    cover_image?: string;
  },
  token: string
) {
  return request<Article>(`/api/articles/${id}`, {
    method: "PUT",
    token,
    body: JSON.stringify(data),
  });
}

export async function submitArticle(
  data: {
    title: string;
    content: string;
    category: string;
    dynasty?: string;
    field?: string;
    cover_image?: string;
  },
  token: string
) {
  return request<Article>("/api/articles/submit", {
    method: "POST",
    token,
    body: JSON.stringify(data),
  });
}

export async function reviewArticle(
  id: string,
  action: "approve" | "reject",
  reason?: string,
  token?: string
) {
  return request<Article>(`/api/articles/${id}/review`, {
    method: "POST",
    token,
    body: JSON.stringify({ action, reason }),
  });
}

export async function deleteArticle(id: string, token: string) {
  return request<{ message: string }>(`/api/articles/${id}`, {
    method: "DELETE",
    token,
  });
}

export async function getDrafts(token: string, params?: {
  page?: number;
  limit?: number;
}) {
  return request<PaginatedResponse<Article>>(
    `/api/articles/drafts${qs(params)}`, { token }
  );
}

export async function getManageArticles(token: string, params?: {
  page?: number;
  limit?: number;
}) {
  return request<PaginatedResponse<Article>>(
    `/api/articles/manage${qs(params)}`, { token }
  );
}

// ---------------------------------------------------------------------------
// Forum
// ---------------------------------------------------------------------------

export async function getForumPosts(params?: {
  page?: number;
  limit?: number;
}) {
  return request<PaginatedResponse<ForumPost>>(
    `/api/forum/posts${qs(params)}`
  );
}

export async function getForumPost(id: string) {
  return request<ForumPost>(`/api/forum/posts/${id}`);
}

export async function createForumPost(
  title: string,
  content: string,
  token: string
) {
  return request<ForumPost>("/api/forum/posts", {
    method: "POST",
    token,
    body: JSON.stringify({ title, content }),
  });
}

export async function addForumReply(
  postId: string,
  content: string,
  token: string
) {
  return request<{ id: string; content: string; created_at: string }>(
    `/api/forum/posts/${postId}/replies`,
    {
      method: "POST",
      token,
      body: JSON.stringify({ content }),
    }
  );
}

export async function deleteForumPost(id: string, token: string) {
  return request<{ message: string }>(`/api/forum/posts/${id}`, {
    method: "DELETE",
    token,
  });
}

// ---------------------------------------------------------------------------
// Gallery
// ---------------------------------------------------------------------------

export async function getGalleryImages(params?: {
  page?: number;
  limit?: number;
}) {
  return request<PaginatedResponse<GalleryImage>>(
    `/api/gallery${qs(params)}`
  );
}

export async function uploadGalleryImage(
  file: File,
  description: string,
  token: string
) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("description", description);

  return request<GalleryImage>("/api/gallery", {
    method: "POST",
    token,
    body: formData,
  });
}

export async function likeGalleryImage(id: string, token: string) {
  return request<{ likes: number }>(`/api/gallery/${id}/like`, {
    method: "POST",
    token,
  });
}

// ---------------------------------------------------------------------------
// Generation Verse & Tanghao
// ---------------------------------------------------------------------------

export async function getGenerationProvinces() {
  return request<string[]>("/api/generation/provinces");
}

export async function getGenerationCities(province: string) {
  return request<string[]>(`/api/generation/cities${qs({ province })}`);
}

export async function getGenerationCounties(province: string, city?: string) {
  return request<string[]>(`/api/generation/counties${qs({ province, city })}`);
}

export async function queryGenerationVerse(params: {
  province: string;
  city?: string;
  county?: string;
  verse?: string;
}) {
  return request<GenerationVerse[]>(
    `/api/generation/query${qs(params)}`
  );
}

export async function getTanghaoList() {
  return request<Tanghao[]>("/api/tanghao");
}
