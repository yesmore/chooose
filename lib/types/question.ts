export interface Question {
  id?: string;
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
  click: string;
}

export interface Comment {
  id?: string;
  questionId: string;
  userId: string;

  content: string;
  likes: number;
  dislikes: number;

  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
}
