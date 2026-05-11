import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // OHMYHOTEL & CO 메인 오렌지 (CI: #ff6000)
        brand: {
          50: "#fff5ed",
          100: "#ffe3cf",
          200: "#ffc499",
          300: "#ffa566",
          400: "#ff8533",
          500: "#ff6000",
          600: "#e25400",
          700: "#b34300",
          800: "#8a3300",
          900: "#5c2200",
        },
        // 그라데이션 강조용 (참고: 빨강 → 주황 → 노랑)
        chi: {
          50: "#fff5ed",
          100: "#ffe3cf",
          200: "#fed7aa",
          300: "#fdba74",
          400: "#fb923c",
          500: "#f97316",
          600: "#ea580c",
          700: "#c2410c",
          800: "#9a3412",
        },
        // 본문 텍스트 / 다크 (CI: #383838)
        ink: {
          DEFAULT: "#383838",
          soft: "#5a5a5a",
        },
        // 배경 오프화이트 (CI: RGB 252/252/248)
        cream: "#fcfcf8",
        // 잎 그린 (CI: RGB 0/149/5)
        leaf: {
          DEFAULT: "#009505",
          600: "#007a04",
          50: "#e6f4e7",
        },
      },
      fontFamily: {
        sans: [
          "Pretendard",
          "-apple-system",
          "BlinkMacSystemFont",
          "system-ui",
          "Roboto",
          "Helvetica Neue",
          "Segoe UI",
          "Apple SD Gothic Neo",
          "Noto Sans KR",
          "Malgun Gothic",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
};

export default config;
