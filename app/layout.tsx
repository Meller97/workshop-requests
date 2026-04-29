import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Workshop Requests",
  description: "Submit and track maintenance and tooling requests",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body style={{ fontFamily: "system-ui, sans-serif", background: "#f9f9f9", margin: 0 }}>
        {children}
      </body>
    </html>
  );
}
