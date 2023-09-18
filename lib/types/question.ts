export interface Question {
  id?: string;
  userId: string;
  userName: string;

  title: string;
  content: string;
  likes: number;
  dislikes: number;

  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
}

export interface Answer {
  id?: string;
  questionId: string;
  value: string;
  click: number;
}

export interface Comment {
  id?: string;
  questionId: string;
  userId: string;
  userName: string;

  content: string;
  likes: number;
  dislikes: number;

  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
}

export interface User {
  id?: string;
  name?: string;
  email: string;
  emailVerified: string;
  image?: string;
  credit: number;
}
