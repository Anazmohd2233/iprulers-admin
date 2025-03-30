export interface QuizAddRes {
    id: string;
    title: string;
    description: string;
    status: boolean;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface OptionAddRes {
    text: string;
    isCorrect: boolean;
    id: string;
    status: boolean;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface QuestionAddRes {
    text: string;
    quiz: QuizAddRes;
    options: OptionAddRes[];
    id: string;
    status: boolean;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface QuizModalData {
    success: boolean;
    data: QuestionAddRes[];
  }



  export interface Option {
    id: string;
    text: string;
    isCorrect: boolean;
    questionId: string;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface Question {
    id: string;
    text: string;
    quiz: string;
    createdAt: string;
    updatedAt: string;
    options: Option[];
  }
  
  export interface QuestionResponse {
    success: boolean;
    message: string;
    instance: string;
    data: {
      questions: Question[];
      total_count: number;
      limit: number;
    };
  }
  
  