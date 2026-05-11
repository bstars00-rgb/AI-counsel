import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "오마이치가 봐주는 사주 여행지 - OHMYHOTEL & CO",
  description:
    "이름과 생년월일, 태어난 시(時)를 알려주시면 오마이치 AI가 사주를 가볍게 풀어주고, 오늘 어울리는 여행지와 오마이호텔의 추천 호텔을 골라드립니다.",
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
