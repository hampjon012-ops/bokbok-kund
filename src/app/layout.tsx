import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "Bokbok - Boka tid online",
  description: "Online-bokning för din salong",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sv">
      <body className="antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
