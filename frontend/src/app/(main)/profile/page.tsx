"use client";

import { useEffect, useState } from "react";
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
} from "lucide-react";

import { useAuth } from "@/lib/auth-context";
import { getTanghaoList } from "@/lib/api";
import type { Tanghao } from "@/lib/types";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Breadcrumb } from "@/components/ui/breadcrumb";

export default function ProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated, loading: authLoading, updateUser } = useAuth();

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
                    placeholder="例如：浙江湖州"
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
          <Card>
            <CardContent className="flex flex-col items-center py-16">
              <div className="flex size-14 items-center justify-center rounded-full bg-dai-green/10">
                <ImageIcon className="size-6 text-dai-green" />
              </div>
              <p className="mt-4 text-base font-medium text-muted-foreground">
                功能开发中...
              </p>
              <p className="mt-1 text-sm text-muted-foreground/70">
                即将支持管理您上传的所有影像
              </p>
            </CardContent>
          </Card>
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
    </div>
  );
}
