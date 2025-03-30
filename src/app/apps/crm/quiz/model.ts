export interface CreatedBy {
    id: string;
    name: string;
    phone_no: string;
    status: number;
    is_super_admin: number;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface Course {
    id: string;
    name: string;
    description: string;
    img: string;
    course_objective?: string | null;
    pdf_url: string;
    status: boolean;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface Quiz {
    title: string;
    description: string;
    createdBy: CreatedBy;
    course_id: Course;
    status: boolean;
    id: string;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface QuizResponse {
    success: boolean;
    data: Quiz;
  }


  export interface AdminListResponse {
    success: boolean;
    message: string;
    instance: string;
    data: {
      admin_list: AdminItem[];
      total_count: number;
      limit: number;
    };
  }
  
  export interface AdminItem {
    id: string;
    title: string;
    description: string;
    createdAt: string;  // ISO Date String
    updatedAt: string;  // ISO Date String
    course: CourseData;
  }5
  
  export interface CourseData {
    id: number;
    img: string;
    name: string;
    description: string;
    course_objective?: string | null;
  }
  
  