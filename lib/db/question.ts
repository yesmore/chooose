import { Question } from "../types/question";
import prisma from "./prisma";

/**
 createQuestion()
  .then(async (question) => {
    console.log('创建的问题记录:', question);
    const answerContents = ['答案1内容', '答案2内容', '答案3内容', '答案4内容'];
    const createdAnswers = await createAnswers(question.id, answerContents);
    console.log('创建的答案记录:', createdAnswers);
  })
 */
export async function createQuestion(title: string, content: string) {
  const question = await prisma.question.create({
    data: {
      title: title,
      content: content,
      likes: 1,
      dislikes: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
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

export async function getRandomQuestion() {
  const documentCount = await prisma.question.count();

  if (documentCount === 0) return null;

  const randomIndex = Math.floor(Math.random() * documentCount);
  const randomDocument = await prisma.question.findFirst({
    skip: randomIndex,
  });

  return randomDocument;
}
export async function getQuestionById(id: string) {
  const res = await prisma.question.findFirst({
    where: { id },
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
