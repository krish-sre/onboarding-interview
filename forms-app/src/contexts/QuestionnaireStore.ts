import { create } from 'zustand';
import type { QuestionnaireData, ResponseData, Section } from '../types';
import { saveToLocalStorage, loadFromLocalStorage } from '../utils/storage';
import { formatDate } from '../utils/dateFormatter';

interface QuestionnaireStore {
  questionnaireData: QuestionnaireData | null;
  sections: Section[];
  currentSectionIndex: number;
  responses: ResponseData;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  loadQuestionnaire: () => Promise<void>;
  setResponse: (sectionName: string, questionId: string, value: string | boolean) => void;
  nextSection: () => void;
  previousSection: () => void;
  goToSection: (index: number) => void;
  saveProgress: () => void;
  loadProgress: () => void;
  clearProgress: () => void;
  importResponses: (data: ResponseData) => void;
  getFinalResponse: () => any;
}

export const useQuestionnaireStore = create<QuestionnaireStore>((set, get) => ({
  questionnaireData: null,
  sections: [],
  currentSectionIndex: 0,
  responses: {},
  isLoading: false,
  error: null,

  loadQuestionnaire: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('/questions.json');
      if (!response.ok) throw new Error('Failed to load questionnaire');
      
      const data: QuestionnaireData = await response.json();
      const sections: Section[] = Object.entries(data).map(([name, questions]) => ({
        name,
        questions,
      }));

      // Initialize responses structure
      const initialResponses: ResponseData = {};
      sections.forEach((section) => {
        initialResponses[section.name] = {};
      });

      // Load saved progress if available
      const savedResponses = loadFromLocalStorage();
      const responses = savedResponses || initialResponses;

      set({
        questionnaireData: data,
        sections,
        responses,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Unknown error',
        isLoading: false,
      });
    }
  },

  setResponse: (sectionName, questionId, value) => {
    set((state) => {
      const newResponses = {
        ...state.responses,
        [sectionName]: {
          ...state.responses[sectionName],
          [questionId]: value,
        },
      };
      saveToLocalStorage(newResponses);
      return { responses: newResponses };
    });
  },

  nextSection: () => {
    set((state) => ({
      currentSectionIndex: Math.min(
        state.currentSectionIndex + 1,
        state.sections.length - 1
      ),
    }));
  },

  previousSection: () => {
    set((state) => ({
      currentSectionIndex: Math.max(state.currentSectionIndex - 1, 0),
    }));
  },

  goToSection: (index) => {
    set({ currentSectionIndex: index });
  },

  saveProgress: () => {
    const { responses } = get();
    saveToLocalStorage(responses);
  },

  loadProgress: () => {
    const savedResponses = loadFromLocalStorage();
    if (savedResponses) {
      set({ responses: savedResponses });
    }
  },

  clearProgress: () => {
    const { sections } = get();
    const emptyResponses: ResponseData = {};
    sections.forEach((section) => {
      emptyResponses[section.name] = {};
    });
    set({ responses: emptyResponses });
    saveToLocalStorage(emptyResponses);
  },

  importResponses: (data) => {
    set({ responses: data });
    saveToLocalStorage(data);
  },

  getFinalResponse: () => {
    const { responses } = get();
    const now = new Date();
    return {
      version: 'v1.0',
      date: formatDate(now),
      responses,
    };
  },
}));
