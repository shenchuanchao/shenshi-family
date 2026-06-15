"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  User as UserIcon,
  MapPin,
  BookOpen,
  Home,
  ImageIcon,
  TreePine,
  Clock,
  Save,
  Trash2,
  CheckCircle2,
  XCircle,
  Loader2,
} from "lucide-react";

import { useAuth } from "@/lib/auth-context";
import { getTanghaoList, getMyGalleryUploads, deleteGalleryImage } from "@/lib/api";
import type { Tanghao, GalleryImage } from "@/lib/types";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Breadcrumb } from "@/components/ui/breadcrumb";

export default function ProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated, token, loading: authLoading, updateUser } = useAuth();

  const [activeTab, setActiveTab] = useState("profile");

  // Profile form state
  const [nickname, setNickname] = useState("");
  const [hometown, setHometown] = useState("");
  const [generationVerse, setGenerationVerse] = useState("");
  const [tanghao, setTanghao] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [saving, setSaving] = useState(false);

  // Tanghao list
  const [tanghaoList, setTanghaoList] = useState<Tanghao[]>([]);
  const [tanghaoLoading, setTanghaoLoading] = useState(false);

  // Gallery uploads
  const [uploads, setUploads] = useState<GalleryImage[]>([]);
  const [uploadsLoading, setUploadsLoading] = useState(false);
  const [uploadsTotal, setUploadsTotal] = useState(0);
  const [uploadActionLoading, setUploadActionLoading] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<GalleryImage | null>(null);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [authLoading, isAuthenticated, router]);

  // Populate form when user data is available
  useEffect(() => {
    if (user) {
      setNickname(user.nickname ?? "");
      setHometown(user.hometown ?? "");
      setGenerationVerse(user.generation_verse ?? "");
      setTanghao(user.tanghao ?? "");
      setAvatarUrl(user.avatar_url ?? "");
    }
  }, [user]);

  // Fetch tanghao list
  useEffect(() => {
    setTanghaoLoading(true);
    getTanghaoList()
      .then((data) => setTanghaoList(data ?? []))
      .catch(() => {
        /* silently fail - tanghao select will just be empty */
      })
      .finally(() => setTanghaoLoading(false));
  }, []);

  // Fetch my gallery uploads
  const fetchUploads = useCallback(async () => {
    if (!token || !isAuthenticated) return;
    setUploadsLoading(true);
    try {
      const res = await getMyGalleryUploads(token, { page: 1, limit: 50 });
      setUploads(res.data ?? []);
      setUploadsTotal(res.total ?? 0);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "加载上传记录失败";
      toast.error(msg);
    } finally {
      setUploadsLoading(false);
    }
  }, [token, isAuthenticated]);

  useEffect(() => {
    if (activeTab === "uploads" && isAuthenticated) {
      fetchUploads();
    }
  }, [activeTab, fetchUploads, isAuthenticated]);

  const handleDeleteUpload = async (id: string) => {
    if (!confirm("确定要删除这张影像吗？")) return;
    setUploadActionLoading(id);
    try {
      await deleteGalleryImage(id, token!);
      toast.success("影像已删除");
      setUploads((prev) => prev.filter((img) => img.id !== id));
      setUploadsTotal((prev) => prev - 1);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "删除失败";
      toast.error(msg);
    } finally {
      setUploadActionLoading(null);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateUser({
        nickname: nickname.trim(),
        hometown: hometown.trim(),
        generation_verse: generationVerse.trim(),
        tanghao: tanghao.trim(),
        avatar_url: avatarUrl.trim(),
      });
      toast.success("资料更新成功！");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "更新失败，请稍后重试";
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  // Auth loading state
  if (authLoading) {
    return (
      <div className="container max-w-3xl px-4 py-8 md:px-6 md:py-12">
        <Skeleton className="mb-8 h-8 w-32" />
        <Skeleton className="mb-4 h-10 w-full" />
        <div className="space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      </div>
    );
  }

  // Not authenticated (will redirect)
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="container max-w-3xl px-4 py-8 md:px-6 md:py-12">
      <div className="mb-6">
        <Breadcrumb items={[{ label: "个人设置" }]} />
      </div>
      <h1 className="mb-8 font-heading text-2xl font-bold tracking-tight text-dai-green md:text-3xl">
        个人中心
      </h1>

      <Tabs defaultValue="profile" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6 w-full">
          <TabsTrigger value="profile" className="flex-1 gap-1.5">
            <UserIcon className="size-3.5" />
            <span className="hidden sm:inline">我的资料</span>
          </TabsTrigger>
          <TabsTrigger value="posts" className="flex-1 gap-1.5">
            <BookOpen className="size-3.5" />
            <span className="hidden sm:inline">我的帖子</span>
          </TabsTrigger>
          <TabsTrigger value="uploads" className="flex-1 gap-1.5">
            <ImageIcon className="size-3.5" />
            <span className="hidden sm:inline">我的上传</span>
          </TabsTrigger>
          <TabsTrigger value="tree" className="flex-1 gap-1.5">
            <TreePine className="size-3.5" />
            <span className="hidden sm:inline">我的家族树</span>
          </TabsTrigger>
        </TabsList>

        {/* ---- Profile Tab ---- */}
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle className="font-heading text-lg">编辑个人资料</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-5">
                {/* Nickname */}
                <div className="space-y-2">
                  <Label htmlFor="profile-nickname" className="flex items-center gap-1.5">
                    <UserIcon className="size-3.5 text-muted-foreground" />
                    昵称
                  </Label>
                  <Input
                    id="profile-nickname"
                    placeholder="请输入昵称"
                    value={nickname}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setNickname(e.target.value)
                    }
                  />
                </div>

                {/* Hometown */}
                <div className="space-y-2">
                  <Label htmlFor="profile-hometown" className="flex items-center gap-1.5">
                    <MapPin className="size-3.5 text-muted-foreground" />
                    籍贯
                  </Label>
                  <Input
                    id="profile-hometown"
                    placeholder="例如：陕西安康"
                    value={hometown}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setHometown(e.target.value)
                    }
                  />
                </div>

                {/* Generation Verse */}
                <div className="space-y-2">
                  <Label htmlFor="profile-verse" className="flex items-center gap-1.5">
                    <BookOpen className="size-3.5 text-muted-foreground" />
                    字辈
                  </Label>
                  <Input
                    id="profile-verse"
                    placeholder="请输入您的字辈"
                    value={generationVerse}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setGenerationVerse(e.target.value)
                    }
                  />
                </div>

                {/* Tanghao */}
                <div className="space-y-2">
                  <Label htmlFor="profile-tanghao" className="flex items-center gap-1.5">
                    <Home className="size-3.5 text-muted-foreground" />
                    堂号
                  </Label>
                  {tanghaoLoading ? (
                    <Skeleton className="h-9 w-full" />
                  ) : (
                    <select
                      id="profile-tanghao"
                      value={tanghao}
                      onChange={(e) => setTanghao(e.target.value)}
                      className="flex h-9 w-full rounded-lg border border-input bg-transparent px-3 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="">请选择堂号</option>
                      {tanghaoList.map((t) => (
                        <option key={t.name} value={t.name}>
                          {t.name}
                          {t.description ? ` - ${t.description}` : ""}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                {/* Avatar URL */}
                <div className="space-y-2">
                  <Label htmlFor="profile-avatar" className="flex items-center gap-1.5">
                    <ImageIcon className="size-3.5 text-muted-foreground" />
                    头像链接
                  </Label>
                  <Input
                    id="profile-avatar"
                    placeholder="https://example.com/avatar.jpg"
                    value={avatarUrl}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setAvatarUrl(e.target.value)
                    }
                  />
                  {avatarUrl && (
                    <div className="mt-2 flex items-center gap-3">
                      <img
                        src={avatarUrl}
                        alt="头像预览"
                        className="size-12 rounded-full border border-border object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                      <span className="text-xs text-muted-foreground">头像预览</span>
                    </div>
                  )}
                </div>

                {/* Save button */}
                <div className="flex justify-end pt-2">
                  <Button onClick={handleSave} disabled={saving}>
                    <Save className="size-4" />
                    {saving ? "保存中..." : "保存资料"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ---- My Posts Tab ---- */}
        <TabsContent value="posts">
          <Card>
            <CardContent className="flex flex-col items-center py-16">
              <div className="flex size-14 items-center justify-center rounded-full bg-warm-wood/10">
                <BookOpen className="size-6 text-warm-wood" />
              </div>
              <p className="mt-4 text-base font-medium text-muted-foreground">
                功能开发中...
              </p>
              <p className="mt-1 text-sm text-muted-foreground/70">
                即将支持查看您发布的所有帖子
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ---- My Uploads Tab ---- */}
        <TabsContent value="uploads">
          {uploadsLoading ? (
            <div className="grid gap-3 grid-cols-4 sm:grid-cols-5 lg:grid-cols-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="aspect-square w-full rounded-lg" />
                  <Skeleton className="h-3 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              ))}
            </div>
          ) : uploads.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center py-16">
                <div className="flex size-14 items-center justify-center rounded-full bg-dai-green/10">
                  <ImageIcon className="size-6 text-dai-green" />
                </div>
                <p className="mt-4 text-base font-medium text-muted-foreground">
                  还没有上传记录
                </p>
                <p className="mt-1 text-sm text-muted-foreground/70">
                  前往影像馆上传您的第一张家族照片吧
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                共上传了 <span className="font-medium text-foreground">{uploadsTotal}</span> 张影像
              </p>
              <div className="grid gap-3 grid-cols-4 sm:grid-cols-5 lg:grid-cols-6">
                {uploads.map((image) => (
                  <Card key={image.id} className="overflow-hidden">
                    <div
                      className="relative cursor-pointer group"
                      onClick={() => setPreviewImage(image)}
                    >
                      <img
                        src={image.image_url}
                        alt={image.description ?? "我的上传"}
                        className="aspect-square w-full object-cover transition-opacity group-hover:opacity-90"
                        loading="lazy"
                      />
                      {/* Status overlay badge */}
                      <div className="absolute left-1.5 top-1.5">
                        {image.status === "approved" ? (
                          <Badge className="bg-green-500/90 text-white border-0 text-xs gap-1">
                            <CheckCircle2 className="size-3" />
                            已通过
                          </Badge>
                        ) : image.status === "rejected" ? (
                          <Badge className="bg-red-500/90 text-white border-0 text-xs gap-1">
                            <XCircle className="size-3" />
                            已驳回
                          </Badge>
                        ) : (
                          <Badge className="bg-yellow-500/90 text-white border-0 text-xs gap-1">
                            <Loader2 className="size-3" />
                            审核中
                          </Badge>
                        )}
                      </div>
                    </div>
                    <CardContent className="py-2 px-2.5">
                      {image.description && (
                        <p className="mb-1 text-xs leading-relaxed text-muted-foreground line-clamp-1">
                          {image.description}
                        </p>
                      )}
                      {image.status === "rejected" && image.reject_reason && (
                        <p className="mb-1 text-[10px] text-red-500 line-clamp-1">
                          驳回：{image.reject_reason}
                        </p>
                      )}
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-muted-foreground">
                          {new Date(image.created_at).toLocaleDateString("zh-CN")}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-5 px-1.5 text-[10px] text-red-400 hover:bg-red-50 hover:text-red-500"
                          onClick={() => handleDeleteUpload(image.id)}
                          disabled={uploadActionLoading === image.id}
                        >
                          <Trash2 className="size-2.5" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </TabsContent>

        {/* ---- Family Tree Tab ---- */}
        <TabsContent value="tree">
          <Card>
            <CardContent className="flex flex-col items-center py-16">
              {/* Decorative coming soon illustration */}
              <div className="relative">
                <div className="flex size-20 items-center justify-center rounded-full bg-gradient-to-br from-warm-wood/15 to-dai-green/10">
                  <TreePine className="size-10 text-dai-green/60" />
                </div>
                <div className="absolute -right-1 -top-1 flex size-7 items-center justify-center rounded-full bg-warm-wood text-cream">
                  <Clock className="size-3.5" />
                </div>
              </div>
              <p className="mt-6 font-heading text-lg font-semibold text-foreground">
                即将上线
              </p>
              <p className="mt-2 max-w-xs text-center text-sm leading-relaxed text-muted-foreground">
                家族树功能正在精心开发中，届时您可以可视化地浏览和编辑家族世系图谱，连接全球沈氏宗亲。
              </p>
              <div className="mt-6 flex items-center gap-2 rounded-full bg-cream px-4 py-2">
                <span className="size-2 animate-pulse rounded-full bg-dai-green" />
                <span className="text-xs font-medium text-dai-green">
                  敬请期待
                </span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* ── Image Preview Modal ── */}
      {previewImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setPreviewImage(null)}
        >
          <div className="relative max-h-[90vh] max-w-3xl" onClick={(e) => e.stopPropagation()}>
            <img
              src={previewImage.image_url}
              alt={previewImage.description ?? "影像预览"}
              className="max-h-[80vh] w-auto rounded-lg object-contain"
            />
            {previewImage.description && (
              <p className="mt-3 text-center text-sm text-white/80">
                {previewImage.description}
              </p>
            )}
            <button
              type="button"
              className="absolute -right-2 -top-2 flex size-8 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition-colors hover:bg-white/40"
              onClick={() => setPreviewImage(null)}
            >
              <XCircle className="size-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
