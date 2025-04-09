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
}
