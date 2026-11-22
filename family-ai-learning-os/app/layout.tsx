import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Family AI Learning OS",
  description: "두 학생의 학습을 안전하게 관리하는 통합 학습 매니저",
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
