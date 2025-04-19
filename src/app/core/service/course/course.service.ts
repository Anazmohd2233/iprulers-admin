import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { CourseListResponse } from "src/app/apps/models/course";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class CourseService {
  baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) {}

  createCourse(formdata: any) {
    const apiUrl = `${this.baseUrl}/admin/course/create`;
    return this.http.post<any>(apiUrl, formdata);
  }

  getCourses(page: any): Observable<CourseListResponse> {
    const url = `${this.baseUrl}/admin/course/list/${page}`;
    return this.http.get<CourseListResponse>(url);
  }
 
  deleteCourse(formData: FormData): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/admin/course/lab/delete`, formData, {
      observe: 'body' 
    });
  }
  updateCourse(formdata: any,id:any) {
    const apiUrl = `${this.baseUrl}/admin/course/update/${id}`;
    return this.http.post<any>(apiUrl, formdata);
  }
  assignLabOrNotes(formdata: any) {
    const apiUrl = `${this.baseUrl}/admin/course/addLabOrNotes`;
    return this.http.post<any>(apiUrl, formdata);
  }

  getCourseById(id:any) {
    const apiUrl = `${this.baseUrl}/admin/course/${id}`;
    return this.http.get<any>(apiUrl);
  }
  createModule(formdata: any) {
    const apiUrl = `${this.baseUrl}/admin/course/module/create`;
    return this.http.post<any>(apiUrl, formdata);
  }
  updateModule(formdata: any) {
    const apiUrl = `${this.baseUrl}/admin/course/module/update`;
    return this.http.post<any>(apiUrl, formdata);
  }
  createSession(formdata: any) {
    const apiUrl = `${this.baseUrl}/admin/course/session/create`;
    return this.http.post<any>(apiUrl, formdata);
  }
  updateSession(formdata: any) {
    const apiUrl = `${this.baseUrl}/admin/course/session/update`;
    return this.http.post<any>(apiUrl, formdata);
  }
  getModule(id:any) {
    const apiUrl = `${this.baseUrl}/admin/course/fetch_module/${id}`;
    return this.http.get<any>(apiUrl);
  }

  updateSessionOrder(formdata: any) {
    const apiUrl = `${this.baseUrl}/admin/course/session/update`;
    return this.http.post<any>(apiUrl, formdata);
  }
}
