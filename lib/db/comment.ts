import { Answer, Comment } from "../types/question";
import prisma from "./prisma";

export async function createComment(
  userId: string,
  userName: string,
  questionId: string,
  content: string,
) {
  const comment = await prisma.comment.create({
    data: {
      userId,
      questionId,
      userName,
      content,
      likes: 0,
      dislikes: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    },
  });

  return comment;
}
export async function deleteComment(id: string) {
  const res = prisma.comment.update({
    where: {
      id,
    },
    data: {
      deletedAt: new Date(),
    },
  });

  return res;
}
export async function updateComment(data: Comment) {
  const updatedQuestion = await prisma.comment.update({
    where: {
      id: data.id,
    },
    data: {
      content: data.content,
      likes: data.likes,
      dislikes: data.dislikes,
    },
  });

  return updatedQuestion;
}
export async function getComments(
  questionId: string,
  page: number,
  pageSize: number,
) {
  const total = await prisma.comment.count({
    where: {
      questionId,
      deletedAt: null,
    },
  });

  const comments = await prisma.comment.findMany({
    where: {
      questionId,
      deletedAt: null,
    },
    skip: page * pageSize,
    take: pageSize,
  });

  return { comments, total };
}
