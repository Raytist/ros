"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";

export function AuthGuard({
  children,
  role,
}: {
  children: React.ReactNode;
  role?: "candidate" | "recruiter";
}) {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/login");
    } else if (role && user?.role !== role) {
      router.replace(user?.role === "recruiter" ? "/recruiter" : "/dashboard");
    }
  }, [isAuthenticated, user, role, router]);

  if (!isAuthenticated) return null;
  if (role && user?.role !== role) return null;

  return <>{children}</>;
}
