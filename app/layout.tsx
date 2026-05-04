import type { Metadata } from "next";
import "./globals.css";
import { OWNER_NAME, SITE_TITLE, SITE_DESCRIPTION } from "@/lib/site.config";

export const metadata: Metadata = {
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  openGraph: {
    title: OWNER_NAME,
    description: SITE_DESCRIPTION,
    type: "website",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
