import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  variant?: "icon" | "full";
  className?: string;
  href?: string;
}

export function Logo({ variant = "full", className, href = "/" }: LogoProps) {
  const src = variant === "icon" ? "/branding/logo.svg" : "/branding/logo_text.svg";
  const width = variant === "icon" ? 40 : 160;
  const height = 40;

  const img = (
    <Image
      src={src}
      alt="Росэлторг"
      width={width}
      height={height}
      priority
      className={cn("h-10 w-auto", className)}
    />
  );

  if (!href) return img;

  return (
    <Link href={href} className="inline-flex shrink-0 items-center">
      {img}
    </Link>
  );
}
