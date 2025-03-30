export interface Admin {
    id: string;
    name: string;
    phone: string;
    status: number;
    email: string;
    is_skilled_user: number;
    address: string ;
    gender: string;
    ratings: number;
    language: string;
    date_of_birth: string ;
    bio: string ;
    createdAt: string;
    updatedAt: string;

    [key: string]: string | number ; // For additional fields, if any
  }
  
  export interface UserResponse {
    success: boolean;
    message: string;
    instance: string;
    data: {
      admin_list: Admin[];
      total_count: number;
      limit: number;
    };
  }
  