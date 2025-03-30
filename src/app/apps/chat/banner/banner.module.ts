export interface Banner {
  id: string;
  headline: string;
  paragraph: string;
  videoUrl: string;
  courseId: string;
  status: number;
  createdAt: string;
  bannerType: string;
  updatedAt: string;
}

export interface BannerListResponse {
  success: boolean;
  message: string;
  instance: string;
  data: {
    banner: Banner[];
    total_count: number;
    limit: number;
  };
}



export interface CourseDetails {
  id: string;
  video_url: string;
  img: string;
  name: string;
  status: number;
  createdAt: string;
  course_id: string;
}

export interface Course {
  id: string;
  name: string;
  description: string;
  img: string | null;
  status: number;
  createdAt: string;
  updatedAt: string;
  details: CourseDetails[];
}

export interface CourseListResponse {
  success: boolean;
  message: string;
  instance: string;
  data: {
    courses: Course[];
    total_count: number;
    limit: number;
  };
}






export interface CourseDetailById {
  id: string;
  video_url: string;
  img: string | null;
  name: string;
  status: number;
  createdAt: string;
  course_id: string;
}

export interface CourseDataById {
  id: string;
  name: string;
  description: string;
  img: string;
  status: number;
  createdAt: string;
  updatedAt: string;
  details: CourseDetailById[];
}

export interface CourseModalResponseById {
  success: boolean;
  message: string;
  instance: string;
  data: CourseDataById;
}

