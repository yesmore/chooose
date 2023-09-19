import { Question } from "../types/question";
import prisma from "./prisma";

export async function createQuestion(
  title: string,
  content: string,
  userId: string,
  userName: string,
) {
  const question = await prisma.question.create({
    data: {
      userId: userId,
      userName: userName,
      title: title,
      content: content,
      likes: 0,
      dislikes: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    },
  });

  return question;
}
export async function createAnswers(
  questionId: string,
  answerContents: string[],
) {
  const answers = answerContents.map((content) => ({
    value: content,
    click: 0,
    questionId,
  }));

  const createdAnswers = await prisma.answer.createMany({
    data: answers,
  });

  return createdAnswers;
}

export async function deleteQuestion(id: string) {
  const res = prisma.question.update({
    where: {
      id,
    },
    data: {
      deletedAt: new Date(),
    },
  });

  return res;
}

export async function updateQuestion(data: Question) {
  const updatedQuestion = await prisma.question.update({
    where: {
      id: data.id,
    },
    data: {
      title: data.title,
      content: data.content,
      likes: data.likes,
      dislikes: data.dislikes,
    },
  });

  return updatedQuestion;
}

export async function updateQuestionLikes(id: string, type: "add" | "sub") {
  const res = await prisma.question.findFirst({
    where: { id },
  });
  if (!res) return null;

  const new_likes =
    type === "add" ? res.likes + 1 : res.likes <= 0 ? 0 : res.likes - 1;
  await prisma.question.update({
    where: {
      id,
    },
    data: {
      likes: new_likes,
      // dislikes: data.dislikes,
    },
  });
  return new_likes;
}
export async function updateQuestionDislikes(id: string, type: "add" | "sub") {
  const res = await prisma.question.findFirst({
    where: { id },
  });
  if (!res) return null;

  const new_dislikes =
    type === "add"
      ? res.dislikes + 1
      : res.dislikes <= 0
      ? 0
      : res.dislikes - 1;
  await prisma.question.update({
    where: {
      id,
    },
    data: {
      dislikes: new_dislikes,
    },
  });
  return new_dislikes;
}

export async function getQuestionByIndex(index: number = 0) {
  const documentCount = await prisma.question.count({
    where: { deletedAt: null },
  });

  if (documentCount <= 0) return null;

  if (index >= documentCount) {
    // 超出最后一个，随机返回
    const documentCount = await prisma.question.count({
      where: { deletedAt: null },
    });
    if (documentCount === 0) return null;

    const randomIndex = Math.floor(Math.random() * documentCount);
    const randomDocument = await prisma.question.findFirst({
      skip: randomIndex,
      where: {
        deletedAt: null,
      },
    });
    console.log("[randomDocument]", randomDocument);

    return { count: documentCount, data: randomDocument };
  }

  const res = await prisma.question.findFirst({
    where: {
      deletedAt: null,
    },
    skip: index,
  });

  return { count: documentCount, data: res };
}
export async function getQuestionById(id: string) {
  const documentCount = await prisma.question.count({
    where: { deletedAt: null },
  });

  if (documentCount <= 0) return null;

  const res = await prisma.question.findFirst({
    where: { id, deletedAt: null },
  });

  return { count: documentCount, data: res };
}
export async function getQuestionByTitle(title: string) {
  const documentCount = await prisma.question.count({
    where: { deletedAt: null },
  });

  if (documentCount <= 0) return null;

  const res = await prisma.question.findFirst({
    where: { title, deletedAt: null },
  });

  return { count: documentCount, data: res };
}
export async function getQuestionByExcludedIds(ids: string[]) {
  const documentCount = await prisma.question.count({
    where: {
      id: {
        not: {
          in: ids,
        },
      },
      deletedAt: null,
    },
  });

  if (documentCount === 0) return null;

  const randomIndex = Math.floor(Math.random() * documentCount);

  const res = await prisma.question.findFirst({
    where: {
      id: {
        not: {
          in: ids,
        },
      },
      deletedAt: null,
    },
    skip: randomIndex,
  });

  return res;
}
export async function getQuestions(limit: number) {
  const documentCount = await prisma.question.count();

  if (documentCount <= 0) return null;

  const res = await prisma.question.findMany({
    where: { deletedAt: null },
  });

  return res;
}

export async function getAnswers(questionId: string) {
  const answer = await prisma.answer.findMany({
    where: {
      questionId,
    },
  });

  return answer;
}

export async function updateAnswer(answerId: string, type: "add" | "sub") {
  const answer = await prisma.answer.findUnique({
    where: {
      id: answerId,
    },
  });

  if (!answer) {
    return null;
  }

  // 更新 click 字段
  const updatedAnswer = await prisma.answer.update({
    where: {
      id: answerId,
    },
    data: {
      click: answer.click + (type === "add" ? 1 : answer.click === 0 ? 0 : -1),
    },
  });

  return updatedAnswer;
}
