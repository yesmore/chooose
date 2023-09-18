import "@/styles/globals.css";
import cx from "classnames";
import { sfPro, inter } from "@/styles/fonts";
import Nav from "@/components/layout/nav";
import Footer from "@/components/layout/footer";

export const metadata = {
  title: "选择困难症治疗中心 | 投稿",
  description: "...",
  metadataBase: new URL("https://chooose.icu"),
  themeColor: "#FFF",
  icons: {
    icon: "/pill.svg",
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
