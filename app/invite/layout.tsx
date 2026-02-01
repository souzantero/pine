"use client";

import { SessionProvider } from "@/lib/session";

export default function InviteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SessionProvider>{children}</SessionProvider>;
}
