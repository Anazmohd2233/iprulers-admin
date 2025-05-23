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

  constructor(private http: HttpClient) {}

  createCategory(formdata: any) {
    const apiUrl = `${this.baseUrl}/admin/category/create`;
    return this.http.post<any>(apiUrl, formdata);
  }

  updateCategory(id:any,formdata: any) {
    const apiUrl = `${this.baseUrl}/admin/category/update/${id}`;
    return this.http.post<any>(apiUrl, formdata);
  }

  deleteCategory(id: any) {
    const apiUrl = `${this.baseUrl}/admin/category/delete/${id}`;
    return this.http.delete<any>(apiUrl);
  }

  getCategory(page: any): Observable<any> {
    const url = `${this.baseUrl}/admin/category/list/${page}`;
    return this.http.get<any>(url);
  }
}
