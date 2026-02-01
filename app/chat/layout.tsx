"use client";

import { SessionProvider } from "@/lib/session";

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SessionProvider>{children}</SessionProvider>;
}
