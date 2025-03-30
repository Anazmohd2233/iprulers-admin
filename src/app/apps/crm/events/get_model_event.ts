export interface EventResponse {
    success: boolean;
    message: string;
    instance: string;
    data: EventData;
  }
  
  export interface EventData {
    event_list: Event[];
    total_count: number;
    limit: number;
  }
  
  export interface Event {
    id: string;
    name: string;
    title: string;
    content: string;
    img: string;
    time: string;
    date: string;
    status: number;
    max_user: number;
    users_resgistered: number;
    location: string;
    conductor_name: string;
    conductor_phone: string;
    days_left: string;
    status_text: string;
    course: EventCourse;
  }
  
  export interface EventCourse {
    id: number;
    img: string;
    name: string;
    description: string;
    course_objective: string; // JSON string that needs parsing
  }
  