"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, User, LogOut, Settings, Send } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";

const navigation = [
  { name: "首页", href: "/" },
  { name: "名人堂", href: "/celebrities" },
  { name: "迁徙史", href: "/migration" },
  { name: "家规家训", href: "/family-rules" },
  { name: "字辈查询", href: "/generation" },
  { name: "堂号百科", href: "/tanghao" },
  { name: "留言墙", href: "/forum" },
  { name: "影像馆", href: "/gallery" },
  { name: "最新动态", href: "/news" },
];

export function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/img/logo-bird.webp"
            alt="沈氏文化家园"
            width={36}
            height={36}
            className="h-9 w-9"
          />
          <span className="text-xl font-bold font-heading text-dai-green">
            沈氏文化家园
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-dai-green"
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Desktop Auth */}
        <div className="hidden md:flex items-center gap-4">
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <button className="relative h-8 w-8 rounded-full outline-none">
                    <Avatar className="h-8 w-8">
                      {user?.avatar_url && (
                        <AvatarImage src={user.avatar_url} alt={user.nickname || user.email} />
                      )}
                      <AvatarFallback>
                        {user?.nickname?.[0] || user?.email[0] || "沈"}
                      </AvatarFallback>
                    </Avatar>
                  </button>
                }
              />
              <DropdownMenuContent align="end">
                <DropdownMenuGroup>
                  <DropdownMenuLabel>
                    {user?.nickname || user?.email}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Link href="/profile" className="flex items-center w-full">
                      <Settings className="mr-2 h-4 w-4" />
                      个人设置
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="/articles" className="flex items-center w-full">
                      <Send className="mr-2 h-4 w-4" />
                      立即投稿
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={logout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    退出登录
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link
                href="/login"
                className="inline-flex h-8 items-center justify-center rounded-lg px-3 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                登录
              </Link>
              <Link
                href="/register"
                className="inline-flex h-8 items-center justify-center rounded-lg bg-dai-green px-3 text-sm font-medium text-cream transition-colors hover:bg-dai-green-dark"
              >
                注册
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu */}
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger
            render={
              <button className="inline-flex h-8 w-8 items-center justify-center rounded-lg md:hidden hover:bg-muted">
                <Menu className="h-5 w-5" />
                <span className="sr-only">打开菜单</span>
              </button>
            }
          />
          <SheetContent side="right" className="w-72">
            <SheetTitle>沈氏文化家园</SheetTitle>
            <nav className="flex flex-col gap-4 mt-6">
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-base font-medium text-muted-foreground transition-colors hover:text-dai-green"
                >
                  {item.name}
                </Link>
              ))}
              <div className="border-t pt-4 mt-4">
                {isAuthenticated ? (
                  <>
                    <Link
                      href="/profile"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-2 py-2 text-sm text-muted-foreground hover:text-dai-green"
                    >
                      <User className="h-4 w-4" />
                      个人中心
                    </Link>
                    <Link
                      href="/articles"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-2 py-2 text-sm text-muted-foreground hover:text-dai-green"
                    >
                      <Send className="h-4 w-4" />
                      立即投稿
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setMobileOpen(false);
                      }}
                      className="flex items-center gap-2 py-2 text-sm text-muted-foreground hover:text-destructive"
                    >
                      <LogOut className="h-4 w-4" />
                      退出登录
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      onClick={() => setMobileOpen(false)}
                      className="block py-2 text-sm text-muted-foreground hover:text-dai-green"
                    >
                      登录
                    </Link>
                    <Link
                      href="/register"
                      onClick={() => setMobileOpen(false)}
                      className="block py-2 text-sm text-muted-foreground hover:text-dai-green"
                    >
                      注册
                    </Link>
                  </>
                )}
              </div>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
