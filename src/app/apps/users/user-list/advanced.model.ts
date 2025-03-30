// Table data
export interface AdvancedTable {
    name: string;
    position: string;
    office: string;
    age: number;
    date: string;
    salary: string;

    [key: string]: string | number;
}

// User data model
export interface UserDataTable {
    id: string;
    name: string;
    phone: string;
    status: number;
    email: string;
    is_skilled_user: number;
    address: string | null;
    gender: string; // Can be "OTHER", "MALE", "FEMALE", etc.
    ratings: number;
    language: string;
    date_of_birth: string | null;
    bio: string | null;
    createdAt: string; // ISO date string
    updatedAt: string; // ISO date string
  
    [key: string]: string | number | null; // For additional fields, if any
  }
  