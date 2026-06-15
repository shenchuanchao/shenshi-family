"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Camera, Heart, Upload, Image as ImageIcon } from "lucide-react";

import { useAuth } from "@/lib/auth-context";
import { getGalleryImages, uploadGalleryImage, likeGalleryImage } from "@/lib/api";
import type { GalleryImage } from "@/lib/types";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const PAGE_SIZE = 12;

/* ------------------------------------------------------------------ */
/* Props                                                               */
/* ------------------------------------------------------------------ */

interface GalleryClientProps {
  images: GalleryImage[];
  total: number;
}

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

function visiblePages(
  current: number,
  total: number
): (number | null)[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  const pages: (number | null)[] = [];
  pages.push(1);
  if (current > 3) pages.push(null);
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  for (let i = start; i <= end; i++) pages.push(i);
  if (current < total - 2) pages.push(null);
  pages.push(total);
  return pages;
}

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

export default function GalleryClient({ images: initialImages, total: initialTotal }: GalleryClientProps) {
  const { isAuthenticated, token } = useAuth();

  const [images, setImages] = useState<GalleryImage[]>(initialImages);
  const [total, setTotal] = useState(initialTotal);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const fetchImages = useCallback(async (p: number) => {
    setLoading(true);
    try {
      const res = await getGalleryImages({ page: p, limit: PAGE_SIZE });
      setImages(res.data ?? []);
      setTotal(res.total ?? 0);
    } catch {
      toast.error("加载图片失败，请稍后重试");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (page > 1) {
      fetchImages(page);
    }
  }, [page, fetchImages]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("请选择图片文件");
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error("请选择要上传的图片");
      return;
    }
    if (!token) {
      toast.error("请先登录");
      return;
    }
    setSubmitting(true);
    try {
      await uploadGalleryImage(selectedFile, description.trim(), token);
      toast.success("上传成功！");
      setDescription("");
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      setDialogOpen(false);
      setPage(1);
      fetchImages(1);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "上传失败，请稍后重试";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleLike = async (imageId: string) => {
    if (!isAuthenticated || !token) {
      toast.error("请先登录后再点赞");
      return;
    }
    try {
      const data = await likeGalleryImage(imageId, token);
      // Update the likes count locally
      setImages((prev) =>
        prev.map((img) =>
          img.id === imageId ? { ...img, likes: data.likes } : img
        )
      );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "点赞失败";
      toast.error(msg);
    }
  };

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="flex flex-col">
      {/* Image Grid */}
      <section className="py-8 md:py-12">
        <div className="container px-4 md:px-6">
          {/* Upload button */}
          <div className="mb-6 flex justify-center">
              <Dialog open={dialogOpen} onOpenChange={(open) => {
                if (open && !isAuthenticated) {
                  toast.error("请先登录后再上传");
                  return;
                }
                setDialogOpen(open);
              }}>
                <DialogTrigger
                  render={
                    <Button>
                      <Upload className="mr-2 size-4" />
                      上传影像
                    </Button>
                  }
                />
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>上传影像</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-2">
                    <div className="space-y-2">
                      <Label htmlFor="gallery-file">选择图片</Label>
                      <Input
                        id="gallery-file"
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                      />
                      {selectedFile && (
                        <p className="text-xs text-muted-foreground">
                          已选择: {selectedFile.name}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="gallery-desc">图片描述</Label>
                      <Textarea
                        id="gallery-desc"
                        placeholder="简单描述这张图片的故事..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={3}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setDialogOpen(false)}
                    >
                      取消
                    </Button>
                    <Button onClick={handleUpload} disabled={submitting || !selectedFile}>
                      {submitting ? "上传中..." : "上传"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

          {loading ? (
            <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 xl:columns-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="mb-4 break-inside-avoid">
                  <Skeleton
                    className="w-full rounded-lg"
                    style={{ height: `${180 + (i % 4) * 60}px` }}
                  />
                  <Skeleton className="mt-2 h-3 w-3/4" />
                </div>
              ))}
            </div>
          ) : images.length === 0 ? (
            <div className="flex flex-col items-center py-20 text-center">
              <ImageIcon className="size-12 text-muted-foreground/40" />
              <p className="mt-4 text-lg font-medium text-muted-foreground">
                暂无影像
              </p>
              <p className="mt-1 text-sm text-muted-foreground/70">
                上传第一张家族照片吧！
              </p>
            </div>
          ) : (
            <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 xl:columns-4">
              {images.map((image) => (
                <div
                  key={image.id}
                  className="mb-4 break-inside-avoid"
                >
                  <Card className="overflow-hidden transition-shadow hover:shadow-md">
                    <div className="relative">
                      <img
                        src={image.image_url}
                        alt={image.description ?? "家族影像"}
                        className="w-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <CardContent className="py-3">
                      {image.description && (
                        <p className="mb-2 text-sm leading-relaxed text-muted-foreground line-clamp-2">
                          {image.description}
                        </p>
                      )}
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                          {new Date(image.created_at).toLocaleDateString(
                            "zh-CN"
                          )}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleLike(image.id)}
                          className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-rose-500"
                        >
                          <Heart className="size-4" />
                          <span>{image.likes}</span>
                        </button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      text="上一页"
                      href="#"
                      onClick={(e: React.MouseEvent) => {
                        e.preventDefault();
                        if (page > 1) setPage((p) => p - 1);
                      }}
                      className={
                        page <= 1 ? "pointer-events-none opacity-40" : ""
                      }
                    />
                  </PaginationItem>
                  {visiblePages(page, totalPages).map((p, idx) =>
                    p === null ? (
                      <PaginationItem key={`ellipsis-${idx}`}>
                        <span className="flex size-8 items-center justify-center text-sm text-muted-foreground">
                          ...
                        </span>
                      </PaginationItem>
                    ) : (
                      <PaginationItem key={p}>
                        <PaginationLink
                          href="#"
                          isActive={p === page}
                          onClick={(e: React.MouseEvent) => {
                            e.preventDefault();
                            setPage(p);
                          }}
                        >
                          {p}
                        </PaginationLink>
                      </PaginationItem>
                    )
                  )}
                  <PaginationItem>
                    <PaginationNext
                      text="下一页"
                      href="#"
                      onClick={(e: React.MouseEvent) => {
                        e.preventDefault();
                        if (page < totalPages) setPage((p) => p + 1);
                      }}
                      className={
                        page >= totalPages
                          ? "pointer-events-none opacity-40"
                          : ""
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
