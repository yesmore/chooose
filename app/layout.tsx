import "@/styles/globals.css";
import cx from "classnames";
import { sfPro, inter } from "../styles/fonts";
import Nav from "@/components/layout/nav";
import Footer from "@/components/layout/footer";
import { Suspense } from "react";
import Script from "next/script";

export const metadata = {
  title: "Chooose - 选择困难症治疗中心",
  description: "...",
  metadataBase: new URL("https://chooose.icu"),
  themeColor: "#FFF",
  icons: {
    // <head><link/></head>
    icon: "/logo.png",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Google Analytics */}
        <Script
          async
          id="googletagmanager-a"
          src="https://www.googletagmanager.com/gtag/js?id=G-6YH1GY4C11"
        ></Script>
        <Script
          async
          id="googletagmanager-b"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{
            __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-6YH1GY4C11');
              `,
          }}
        ></Script>
      </head>
      <body className={cx(sfPro.variable, inter.variable)}>
        <main>{children}</main>
      </body>
    </html>
  );
}
