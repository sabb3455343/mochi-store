import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import ChatWidget from "@/components/ChatWidget";

export const metadata: Metadata = {
  title: {
    default: "MochiAura",
    template: "%s | MochiAura",
  },
  description: "Skincare, cute items, and tech gadgets",
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <ChatWidget />
      </body>
    </html>
  );
}
