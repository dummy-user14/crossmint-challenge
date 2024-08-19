import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster"

export const metadata: Metadata = {
  title: "Crossmint Challenge",
  description: "Technical Challenge for Crossmint",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
     <body>
        <main>{children}</main>
        <Toaster />
      </body>
    </html>
  );
}
