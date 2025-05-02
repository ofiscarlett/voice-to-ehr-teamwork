import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import "@/styles/globals.css";
import { AuthProvider } from "@/components/auth/AuthContext";

const openSans = Open_Sans({ 
  subsets: ["latin"],
  display: 'swap',
});

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
    <html lang="en" className="h-screen">
      <body className={`${openSans.className} h-screen`}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
