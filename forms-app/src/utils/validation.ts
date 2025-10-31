import type { Question, ValidationError } from '../types';

export const validateQuestion = (
  question: Question,
  value: string | boolean | undefined
): ValidationError | null => {
  if (question.required && (value === undefined || value === '' || value === null)) {
    return {
      questionId: question.id,
      message: 'This field is required',
    };
  }

  if (question.type === 'text' && typeof value === 'string' && value.length > 500) {
    return {
      questionId: question.id,
      message: 'Text must be less than 500 characters',
    };
  }

  return null;
};

export const validateSection = (
  questions: Question[],
  responses: { [key: string]: string | boolean }
): ValidationError[] => {
  const errors: ValidationError[] = [];
  
  questions.forEach((question) => {
    const error = validateQuestion(question, responses[question.id]);
    if (error) {
      errors.push(error);
    }
  });

  return errors;
};
