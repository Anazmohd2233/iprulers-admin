import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CourseService {

  constructor() { }

  private course: any;

  // Set the course object
  setCourse(course: any): void {
    this.course = course;
  }

  // Retrieve the course object
  getCourse(): any {
    return this.course;
  }

  // Clear the stored course object (optional utility)
  clearCourse(): void {
    this.course = null;
  }
}
