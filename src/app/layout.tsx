import type { Metadata } from "next";
import { Epilogue, Prata } from "next/font/google";
import "./globals.css";

const epilogue = Epilogue({
  subsets: ["latin"],
  variable: "--font-epilogue",
});

const prata = Prata({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-prata",
});

export const metadata: Metadata = {
  title: "Infinity - NuezApp",
  description: "Digitaliza tu negocio hoy",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="es"
      className={`${epilogue.variable} ${prata.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-[#FFFFFF]">{children}</body>
    </html>
  );
}
