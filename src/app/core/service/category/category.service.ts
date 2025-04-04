import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { CourseListResponse } from "src/app/apps/models/course";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class CategoryService {
  baseUrl = environment.baseUrl;
  authorization: any;

  constructor(private http: HttpClient) {}




  createCategory(formdata: any) {
    const apiUrl = `${this.baseUrl}/admin/course/create`;
    // console.log('apiurl for listing users', apiUrl)
    this.authorization = localStorage.getItem("Authorization");

    const headers = new HttpHeaders({
      Authorization: this.authorization,
    });

    return this.http.post<any>(apiUrl, formdata, { headers });
  }

  getCategory(page: any): Observable<CourseListResponse> {
    const url = `${this.baseUrl}/admin/course/list/${page}`;
    this.authorization = localStorage.getItem("Authorization");

    const headers = new HttpHeaders({ Authorization: this.authorization });

    return this.http.get<CourseListResponse>(url, { headers });
  }
}
