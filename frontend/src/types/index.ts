export type Role = 'USER' | 'ADMIN';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  profileImage?: string | null;
  isActive?: boolean;
  createdAt?: string;
}

export interface Section {
  id: string;
  name: string;
  description?: string | null;
  icon?: string | null;
  image?: string | null;
  isActive?: boolean;
  _count?: {
    topics?: number;
    questions?: number;
    tests?: number;
  };
}

export interface Topic {
  id: string;
  sectionId: string;
  section?: Section;
  name: string;
  description?: string | null;
  isActive?: boolean;
  subTopics?: SubTopic[];
  _count?: {
    questions?: number;
    tests?: number;
    subTopics?: number;
  };
}

export interface SubTopic {
  id: string;
  topicId: string;
  name: string;
  description?: string | null;
}

export interface Exam {
  id: string;
  name: string;
  description?: string | null;
}

export type QuestionType = 'SINGLE_CHOICE' | 'MULTIPLE_CHOICE' | 'TRUE_FALSE' | 'NUMERICAL';
export type Difficulty = 'EASY' | 'MEDIUM' | 'HARD';

export interface QuestionOption {
  id: string;
  questionId?: string;
  optionText: string;
  imageUrl?: string | null;
  isCorrect?: boolean;
  optionOrder: number;
}

export interface Question {
  id: string;
  sectionId: string;
  section?: Section;
  topicId: string;
  topic?: Topic;
  subTopicId?: string | null;
  questionText: string;
  questionType: QuestionType;
  difficulty: Difficulty;
  explanation?: string | null;
  marks: number;
  negativeMarks: number;
  imageUrl?: string | null;
  isActive?: boolean;
  options: QuestionOption[];
}

export type TestType = 'TOPIC' | 'SECTION' | 'MIXED' | 'FULL_LENGTH' | 'DAILY' | 'PRACTICE';
export type TestStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';

export interface Test {
  id: string;
  title: string;
  description?: string | null;
  examId?: string | null;
  exam?: Exam | null;
  sectionId?: string | null;
  section?: Section | null;
  topicId?: string | null;
  topic?: Topic | null;
  duration: number; // minutes
  totalQuestions: number;
  totalMarks: number;
  negativeMarking: number;
  difficulty: Difficulty;
  testType: TestType;
  status: TestStatus;
  createdAt?: string;
  _count?: {
    attempts?: number;
    testQuestions?: number;
  };
}

export type AttemptStatus = 'IN_PROGRESS' | 'COMPLETED' | 'ABANDONED';

export interface AttemptAnswer {
  id?: string;
  questionId: string;
  selectedOptionId?: string | null;
  isCorrect?: boolean;
  marksObtained?: number;
  timeSpent?: number;
  questionText?: string;
  explanation?: string;
  options?: QuestionOption[];
}

export interface TestAttempt {
  id: string;
  userId: string;
  testId: string;
  test?: Test;
  startTime: string;
  endTime?: string | null;
  timeTaken?: number | null; // seconds
  score?: number | null;
  percentage?: number | null;
  correctAnswers?: number | null;
  incorrectAnswers?: number | null;
  unattempted?: number | null;
  accuracy?: number | null;
  status: AttemptStatus;
  createdAt?: string;
  answers?: AttemptAnswer[];
}

export interface Bookmark {
  id: string;
  userId: string;
  questionId: string;
  question: Question;
  createdAt: string;
}

export interface LeaderboardUser {
  rank: number;
  userId: string;
  name: string;
  profileImage?: string | null;
  testsCompleted: number;
  totalScore: number;
  averageScore: number;
  averageAccuracy: number;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
  errors?: any;
}
