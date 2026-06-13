import Link from "next/link";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="border-t bg-cream">
      <div className="container px-4 py-6 md:px-6">
        <div className="flex flex-col items-center gap-4 text-center">
          <Image
            src="/img/logo-bird-gray.webp"
            alt="沈氏文化家园"
            width={40}
            height={40}
            className="h-10 w-10 opacity-60"
          />
          <nav className="flex flex-wrap justify-center gap-6">
            <Link
              href="/about"
              className="text-sm text-muted-foreground hover:text-dai-green transition-colors"
            >
              关于我们
            </Link>
            <Link
              href="/contact"
              className="text-sm text-muted-foreground hover:text-dai-green transition-colors"
            >
              联系方式
            </Link>
            <Link
              href="/privacy"
              className="text-sm text-muted-foreground hover:text-dai-green transition-colors"
            >
              隐私政策
            </Link>
          </nav>
          <p className="text-sm text-muted-foreground">
            沈氏文化家园 &copy; 2026
          </p>
        </div>
      </div>
    </footer>
  );
}
