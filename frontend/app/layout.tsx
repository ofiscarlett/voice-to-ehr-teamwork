import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.css";
import MainNav from "@/components/common/MainNav";
import { AuthProvider } from "@/components/auth/AuthContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Voice to EHR",
  description: "Voice to EHR application",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <MainNav />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
