import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { CourseListResponse } from "src/app/apps/models/course";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: 'root'
})


export class StudentService {
  baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) {}


  createStudent(formdata: any) {
    const apiUrl = `${this.baseUrl}/admin/student/create`;
    return this.http.post<any>(apiUrl, formdata);
  }

  getStudent(page: any,search?:any): Observable<any> {
    let params: any = {};

    if (search) {
      params.search = search;
    }
    const url = `${this.baseUrl}/admin/student/list/${page}`;
    return this.http.get<any>(url, { params: params });
  }

  getStudentById(id: any): Observable<any> {
    const url = `${this.baseUrl}/admin/student/${id}`;
    return this.http.get<any>(url);
  }
  updateStudent(formdata: any,id: any) {
    const apiUrl = `${this.baseUrl}/admin/student/update/${id}`;
    return this.http.post<any>(apiUrl, formdata);
  }
  assignCourseOrMaterials(formdata: any) {
    const apiUrl = `${this.baseUrl}/admin/student/assign`;
    return this.http.post<any>(apiUrl, formdata);
  }
  
  deleteCourse(payload: any) {
    const apiUrl = `${this.baseUrl}/admin/student/course/delete`;
    return this.http.request<any>('DELETE', apiUrl, {
      body: payload, // JSON body
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
 
  deleteMaterial(payload: any) {
    const apiUrl = `${this.baseUrl}/admin/student/material/delete`;
    return this.http.request<any>('DELETE', apiUrl, {
      body: payload, // JSON body
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
  updateExpiry(formdata: any) {
    const apiUrl = `${this.baseUrl}/admin/student/expiry/update`;
    return this.http.post<any>(apiUrl, formdata);
  }

  
  

  
}