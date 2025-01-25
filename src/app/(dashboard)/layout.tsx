"use client";
import React from "react";
import "../../app/globals.css";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "@/components/theme-provider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
      <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
        <SessionProvider>
          {children}
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
