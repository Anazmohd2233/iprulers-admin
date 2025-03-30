import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { CourseListResponse, CourseModalResponseById } from "src/app/apps/chat/banner/banner.module";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class CourseService {
  baseUrl = environment.baseUrl;
  authorization: any;

  constructor(private http: HttpClient) {}

  updateCourse(formdata: any) {
    const apiUrl = `${this.baseUrl}/admin/course/update`;
    // console.log('apiurl for listing users', apiUrl)
    this.authorization = localStorage.getItem("Authorization");

    const headers = new HttpHeaders({
      Authorization: this.authorization,
    });

    // return this.http.get<UserResponse>(`/admin/user-list/${id}`);
    return this.http.post<any>(apiUrl, formdata, { headers });
  }

  createCourseDetails(formdata: any) {
    const apiUrl = `${this.baseUrl}/admin/course/create_details`;
    // console.log('apiurl for listing users', apiUrl)
    this.authorization = localStorage.getItem("Authorization");

    const headers = new HttpHeaders({
      Authorization: this.authorization,
    });

    // return this.http.get<UserResponse>(`/admin/user-list/${id}`);
    return this.http.post<any>(apiUrl, formdata, { headers });
  }

  updateCourseDetails(formdata: any) {
    const apiUrl = `${this.baseUrl}/admin/course/update_details`;
    // console.log('apiurl for listing users', apiUrl)
    this.authorization = localStorage.getItem("Authorization");

    const headers = new HttpHeaders({
      Authorization: this.authorization,
    });

    // return this.http.get<UserResponse>(`/admin/user-list/${id}`);
    return this.http.post<any>(apiUrl, formdata, { headers });
  }
  fetchCourseDetails(courseId: any): Observable<CourseModalResponseById> {
    const url = `${this.baseUrl}/admin/course/view?id=${courseId}`;
    this.authorization = localStorage.getItem("Authorization");

    const headers = new HttpHeaders({ Authorization: this.authorization });

    return this.http.get<CourseModalResponseById>(url, { headers });
  }
  getCourses(page: any): Observable<CourseListResponse> {
    const url = `${this.baseUrl}/admin/course/list/${page}`;
    this.authorization = localStorage.getItem("Authorization");

    const headers = new HttpHeaders({ Authorization: this.authorization });

    return this.http.get<CourseListResponse>(url, { headers });
  }
}
