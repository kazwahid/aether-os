import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Æther OS — Neural Web Interface",
  description:
    "A custom WebGL fragment shader rendered fullscreen — quantum field visualization with domain-warped fBm, interactive mouse attraction, and a streaming AI core.",
  icons: [
    {
      rel: "icon",
      type: "image/svg+xml",
      url: "/favicon.svg",
    },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
