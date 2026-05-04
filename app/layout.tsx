import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Emmanuel Osei Mensah — Portfolio",
  description:
    "Full-stack engineer building durable, well-considered web products end-to-end.",
  openGraph: {
    title: "Emmanuel Osei Mensah",
    description: "Full-stack engineer · Accra · remote",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
