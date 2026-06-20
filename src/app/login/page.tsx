"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { User, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Logo } from "@/components/ui/logo";
import { useAuthStore } from "@/stores/auth-store";
import { APP_TAGLINE } from "@/lib/constants";
import type { UserRole } from "@/types";

export default function LoginPage() {
  const router = useRouter();
  const login = useAuthStore((s) => s.login);
  const [email, setEmail] = useState("anna.petrova@example.ru");
  const [password, setPassword] = useState("demo");
  const [role, setRole] = useState<UserRole>("candidate");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const ok = await login(email, password, role);
    setLoading(false);
    if (ok) {
      router.push(role === "recruiter" ? "/recruiter" : "/dashboard");
    } else {
      setError("Не удалось войти. Используйте демо-аккаунты.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--background)] p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center">
          <Logo />
          <p className="mt-3 text-sm text-[var(--muted)]">{APP_TAGLINE}</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Вход</CardTitle>
            <CardDescription>Выберите роль и войдите с демо-аккаунтом</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-6 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setRole("candidate");
                  setEmail("anna.petrova@example.ru");
                }}
                className={`flex flex-col items-center gap-2 rounded-lg border p-4 text-sm transition-colors ${
                  role === "candidate"
                    ? "border-[var(--primary)] bg-[var(--primary-light)]"
                    : "border-[var(--border)] hover:bg-white"
                }`}
              >
                <User className="h-5 w-5 text-[var(--primary)]" />
                Кандидат
              </button>
              <button
                type="button"
                onClick={() => {
                  setRole("recruiter");
                  setEmail("recruiter@roseltorg.ru");
                }}
                className={`flex flex-col items-center gap-2 rounded-lg border p-4 text-sm transition-colors ${
                  role === "recruiter"
                    ? "border-[var(--primary)] bg-[var(--primary-light)]"
                    : "border-[var(--border)] hover:bg-white"
                }`}
              >
                <Briefcase className="h-5 w-5 text-[var(--primary)]" />
                Рекрутер
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="email">Электронная почта</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1" />
              </div>
              <div>
                <Label htmlFor="password">Пароль</Label>
                <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1" />
              </div>
              {error && <p className="text-sm text-[var(--danger)]">{error}</p>}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Вход..." : "Войти"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
