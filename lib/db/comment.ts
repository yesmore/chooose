import { Answer, Comment } from "../types/question";
import prisma from "./prisma";

export async function createComment(
  userId: string,
  questionId: string,
  content: string,
) {
  const comment = await prisma.comment.create({
    data: {
      content,
      userId,
      questionId,
      likes: 0,
      dislikes: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  return comment;
}
export async function deleteComment(id: string) {
  const res = prisma.comment.delete({
    where: {
      id,
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
export async function getComments(questionId: string) {
  const comment = await prisma.comment.findMany({
    where: {
      questionId,
    },
  });

  return comment;
}
