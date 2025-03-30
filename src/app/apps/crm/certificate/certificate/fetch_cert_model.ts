export interface Certificate {
    cert_id: string;
    cert_certificateId: string;
    cert_paymentStatus: string;
    cert_issuedAt: string;
    cert_userId: string;
    cert_userPhone: string;
    cert_courseId: string;
  }
  
  export interface User {
    user_id: string;
    user_name: string;
    user_phone: string;
    user_code: string;
    user_status: number;
    user_email: string | null;
    user_age: string;
    user_blood_group: string;
    user_education: string;
    user_pincode: string;
    user_thaluk: string;
    user_district: string;
    user_state: string;
    user_country: string;
    user_otp: number;
    user_api_key: string;
    user_fcm_token: string | null;
    user_profile_url: string | null;
    user_address: string | null;
    user_gender: string;
    user_date_of_birth: string | null;
    user_createdAt: string;
    user_updatedAt: string;
  }
  
  export interface CourseObjective {
    id: string;
    name: string;
    description: string;
  }
  
  export interface Course {
    course_id: string;
    course_name: string;
    course_description: string;
    course_img: string;
    course_course_objective: CourseObjective[];
    course_pdf_url: string;
    course_status: number;
    course_createdAt: string;
    course_updatedAt: string;
    course_createdById: string;
  }
  
  export interface CertificateListItem extends Certificate, User, Course {}
  
  export interface CertificateResponse {
    success: boolean;
    message: string;
    instance: string;
    data: {
      certificateList: CertificateListItem[];
      total_count: number;
      limit: number;
    };
  }
  