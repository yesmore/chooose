import { MetadataRoute } from "next";
import prisma from "@/lib/db/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const users = await prisma.user.findMany({
    select: {
      id: true,
    },
    take: 1,
  });

  return [
    {
      url: "https://chooose.icu",
      lastModified: new Date(),
    },
    ...users.map((user) => ({
      url: `https://chooose.icu/${user.id}`,
      lastModified: new Date(),
    })),
  ];
}
