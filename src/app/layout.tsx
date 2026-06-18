import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Toaster } from "react-hot-toast";
import HeaderDemo from "@/components/HeaderDemo";

const googleSans = localFont({
  src: [
    {
      path: "./fonts/GoogleSans-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/GoogleSans-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "./fonts/GoogleSans-Bold.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "./fonts/GoogleSans-Italic.ttf",
      weight: "400",
      style: "italic",
    },
  ],
  variable: "--font-google-sans",
});

export const metadata: Metadata = {
  title: "GDG On Campus, MMDU",
  description: "GDG On Campus, MMDU",
  icons: {
    icon: "/favicon.ico", // Assumes favicon.ico is in the app directory
    // You can also add multiple sizes if you have them
    apple: [
      { url: "/favicon.ico" },
      { url: "/favicon.ico", sizes: "180x180", type: "image/png" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${googleSans.variable} antialiased`}>
        <Header />
        <Toaster position="bottom-right" reverseOrder={false} />
        {children}
        <Footer />
      </body>
    </html>
  );
}
