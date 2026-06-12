"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/lib/auth-context";


export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await register(email, password, nickname || undefined);
      toast.success("注册成功！欢迎加入沈氏文化家园");
      router.push("/");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "注册失败，请重试");
    } finally {
      setLoading(false);
    }
  };

  return (
      <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <Link href="/" className="inline-block">
          <span className="text-2xl font-bold font-heading text-dai-green">
            沈氏文化家园
          </span>
        </Link>
        <CardTitle className="mt-4 font-heading text-xl">注册</CardTitle>
        <CardDescription>创建您的账户，加入沈氏大家庭</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">邮箱</Label>
            <Input
              id="email"
              type="email"
              placeholder="请输入邮箱"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">密码</Label>
            <Input
              id="password"
              type="password"
              placeholder="请输入密码（至少6位）"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="nickname">
              昵称 <span className="text-muted-foreground">(选填)</span>
            </Label>
            <Input
              id="nickname"
              type="text"
              placeholder="请输入昵称"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
            />
          </div>
        </CardContent>
        <CardFooter className="mt-4 flex flex-col gap-4">
          <Button
            type="submit"
            className="w-full bg-dai-green hover:bg-dai-green-dark text-cream"
            disabled={loading}
          >
            {loading ? "注册中..." : "注册"}
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            已有账户？{" "}
            <Link
              href="/login"
              className="font-medium text-dai-green hover:underline"
            >
              立即登录
            </Link>
          </p>
          <Link
            href="/"
            className="text-center text-sm text-muted-foreground hover:text-dai-green"
          >
            去首页
          </Link>
        </CardFooter>
      </form>
      </Card>
  );
}
