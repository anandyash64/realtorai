import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RealtorAI | AI lead response for real estate",
  description:
    "AI voice agents and automation for contacting, qualifying, and booking real estate leads."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
