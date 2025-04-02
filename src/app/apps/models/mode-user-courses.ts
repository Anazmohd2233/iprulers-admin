export interface CourseObjective {
    id?: string;
    name: string;
    description: string;
  }
  
  export interface CourseDetails {
    id: number;
    name: string;
    description: string;
    course_objective: string; // JSON string containing course objectives
  }
  
  export interface EnrolledCourse {
    id: string;
    joinDate: string;
    paymentStatus: string;
    user_name: string;
    user_phone: string;
    createdBy: string;
    CourseDetails: CourseDetails;


  }
  
  export interface ResponseData {
    enrolled: EnrolledCourse[];
    total_count: number;
    limit: number;
  }
  
  export interface CourseByIdResponse {
    success: boolean;
    message: string;
    instance: string;
    data: ResponseData;
  }
  