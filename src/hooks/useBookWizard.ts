import { useState, useCallback } from 'react';
import { BookWizardState, BookTemplate, ChapterTemplate } from '@/types/book-templates';

const INITIAL_STATE: BookWizardState = {
  currentStep: 1,
  templateId: null,
  template: null,
  bookData: {
    title: '',
    subtitle: '',
    description: '',
    collection: '',
    status: 'draft',
    ready_flag: false,
    is_public: false,
  },
  chapters: [],
  isValid: false,
};

export const useBookWizard = () => {
  const [state, setState] = useState<BookWizardState>(INITIAL_STATE);

  const setTemplate = useCallback((template: BookTemplate) => {
    setState(prev => ({
      ...prev,
      templateId: template.id,
      template,
      bookData: {
        ...prev.bookData,
        collection: template.collection,
        series_name: template.suggested_series,
      },
      chapters: template.default_chapters.map(ch => ({ ...ch })),
    }));
  }, []);

  const updateBookData = useCallback((data: Partial<BookWizardState['bookData']>) => {
    setState(prev => ({
      ...prev,
      bookData: { ...prev.bookData, ...data },
    }));
  }, []);

  const updateChapters = useCallback((chapters: ChapterTemplate[]) => {
    setState(prev => ({ ...prev, chapters }));
  }, []);

  const addChapter = useCallback((chapter: ChapterTemplate) => {
    setState(prev => ({
      ...prev,
      chapters: [...prev.chapters, { ...chapter, order: prev.chapters.length + 1 }],
    }));
  }, []);

  const removeChapter = useCallback((index: number) => {
    setState(prev => ({
      ...prev,
      chapters: prev.chapters
        .filter((_, i) => i !== index)
        .map((ch, i) => ({ ...ch, order: i + 1 })),
    }));
  }, []);

  const nextStep = useCallback(() => {
    setState(prev => ({
      ...prev,
      currentStep: Math.min(prev.currentStep + 1, 5),
    }));
  }, []);

  const previousStep = useCallback(() => {
    setState(prev => ({
      ...prev,
      currentStep: Math.max(prev.currentStep - 1, 1),
    }));
  }, []);

  const goToStep = useCallback((step: number) => {
    setState(prev => ({
      ...prev,
      currentStep: Math.max(1, Math.min(step, 5)),
    }));
  }, []);

  const reset = useCallback(() => {
    setState(INITIAL_STATE);
  }, []);

  const validateStep = useCallback((step: number): boolean => {
    switch (step) {
      case 1:
        return !!state.template;
      case 2:
        return !!(state.bookData.title && state.bookData.description);
      case 3:
        return state.chapters.length > 0;
      case 4:
        return true; // Publishing options are all optional
      case 5:
        return true; // Review step just confirms
      default:
        return false;
    }
  }, [state]);

  return {
    state,
    setTemplate,
    updateBookData,
    updateChapters,
    addChapter,
    removeChapter,
    nextStep,
    previousStep,
    goToStep,
    reset,
    validateStep,
    canProceed: validateStep(state.currentStep),
  };
};
