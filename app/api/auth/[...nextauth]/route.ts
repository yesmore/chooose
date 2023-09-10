import NextAuth, { NextAuthOptions, Theme } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/lib/db/prisma";
import EmailProvider from "next-auth/providers/email";
import { createTransport } from "nodemailer";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    EmailProvider({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM,
      maxAge: 10 * 60, // 10min, 设置邮箱链接失效时间，默认24小时
      async sendVerificationRequest({ identifier: email, url, provider }) {
        const { host } = new URL(url);
        const transport = createTransport(provider.server);
        const result = await transport.sendMail({
          to: email,
          from: provider.from,
          subject: `您正在登录选择困难症治疗中心`,
          text: text({ url, host }),
          html: html({ url, host }),
        });
        const failed = result.rejected.concat(result.pending).filter(Boolean);
        if (failed.length) {
          throw new Error(`Email(s) (${failed.join(", ")}) could not be sent`);
        }
      },
    }),
  ],
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

/**
 *使用HTML body 代替正文内容
 */
function html(params: { url: string; host: string; theme?: Theme }) {
  const { url, host, theme } = params;
  const escapedHost = host?.replace(/\./g, "&#8203;.");
  const brandColor = "#346df1";
  const color = {
    background: "#f9f9f9",
    text: "#444",
    mainBackground: "#fff",
    buttonBackground: brandColor,
    buttonBorder: brandColor,
    buttonText: "#fff",
  };

  return `
  <body style="background: ${color.background};">
  <table width="100%" border="0" cellspacing="20" cellpadding="0"
    style="background: ${color.mainBackground}; max-width: 600px; margin: auto; border-radius: 10px;">
    <tr>
      <td align="center"
        style="padding: 10px 0px; font-size: 18px; font-family: Helvetica, Arial, sans-serif; color: ${color.text};">
        您正在使用邮箱登录<strong>${escapedHost}</strong>
      </td>
    </tr>
    <tr>
      <td align="center" style="padding: 5px 0;">
        <table border="0" cellspacing="0" cellpadding="0">
          <tr>
            <td align="center" style="border-radius: 5px;" bgcolor="${color.buttonBackground}">
              <a href="${url}" target="_blank"
                style="font-size: 18px; font-family: Helvetica, Arial, sans-serif; color: ${color.buttonText}; text-decoration: none; border-radius: 5px; padding: 10px 20px; border: 1px solid ${color.buttonBorder}; display: inline-block; font-weight: bold;">点击登录
              </a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td align="center"
        style="padding: 0px 0px 10px 0px; font-size: 16px; line-height: 16px; font-family: Helvetica, Arial, sans-serif; color: ${color.text};">
        此链接10分钟内有效。如果您没有发送此电子邮件，请忽略它。
      </td>
    </tr>
  </table>
</body>
`;
}

/** 不支持HTML 的邮件客户端会显示下面的文本信息 */
function text({ url, host }: { url: string; host: string }) {
  return `欢迎登录 ${host}\n这是一个魔法链接，点击它就能登录：${url}\n\n`;
}
