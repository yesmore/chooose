import "@/styles/globals.css";
import cx from "classnames";
import { sfPro, inter } from "@/styles/fonts";
import Nav from "@/components/layout/nav";
import Footer from "@/components/layout/footer";

export const metadata = {
  title: "Chooose - 好难选啊",
  description: "...",
  metadataBase: new URL("https://chooose.icu"),
  themeColor: "#FFF",
  icons: {
    icon: "/logo.png",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={cx(sfPro.variable, inter.variable)}>
      <main>{children}</main>
    </div>
  );
}
