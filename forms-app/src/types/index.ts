export type QuestionType = 'text' | 'longtext' | 'boolean' | 'options';

export interface Question {
  id: string;
  question: string;
  type: QuestionType;
  options?: string[];
  required?: boolean;
}

export interface Section {
  name: string;
  questions: Question[];
}

export interface QuestionnaireData {
  [sectionName: string]: Question[];
}

export interface ResponseData {
  [sectionName: string]: {
    [questionId: string]: string | boolean;
  };
}

export interface FinalResponse {
  version: string;
  date: string;
  responses: ResponseData;
}

export interface ValidationError {
  questionId: string;
  message: string;
}
