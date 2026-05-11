import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "오마이치 AI (OHMYCHI AI) - 오마이호텔 트래블쇼",
  description:
    "오마이호텔 트래블쇼의 AI 여행상담 도우미, 오마이치 AI 입니다. 궁금한 여행을 입력하면 1차 추천을 받고, 상담원이 이어서 상담해드립니다.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="font-sans">{children}</body>
    </html>
  );
}
