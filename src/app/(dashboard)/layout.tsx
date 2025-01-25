"use client";
import React from "react";
import "../../app/globals.css";
import { SessionProvider } from "next-auth/react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <SessionProvider>
          {children}
          </SessionProvider>
      </body>
    </html>
  );
}
