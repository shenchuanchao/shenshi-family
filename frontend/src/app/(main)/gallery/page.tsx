import { Camera, Upload } from "lucide-react";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { getGalleryImages } from "@/lib/api";
import type { GalleryImage } from "@/lib/types";
import GalleryClient from "./gallery-client";

const PAGE_SIZE = 12;

export default async function GalleryPage() {
  const res = await getGalleryImages({ page: 1, limit: PAGE_SIZE });
  const images: GalleryImage[] = res.data ?? [];
  const total: number = res.total ?? 0;

  return (
    <div className="flex flex-col">
      <div className="container max-w-4xl px-4 pt-6 md:px-6">
        <Breadcrumb items={[{ label: "影像馆" }]} />
      </div>
      {/* Hero Header */}
      <section className="bg-gradient-to-b from-cream to-background py-12 md:py-16">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center text-center">
            <div className="mb-4 flex size-14 items-center justify-center rounded-full bg-dai-green/10">
              <Camera className="size-7 text-dai-green" />
            </div>
            <h1 className="font-heading text-3xl font-bold tracking-tight text-dai-green md:text-4xl">
              家族影像馆
            </h1>
            <p className="mt-3 max-w-xl text-muted-foreground">
              记录家族记忆，传承宗族文化
            </p>
          </div>
        </div>
      </section>

      {/* Content – interactive client component */}
      <GalleryClient images={images} total={total} />
    </div>
  );
}
