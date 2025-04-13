import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class MaterialService {
  baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) {}

  createMaterial(formdata: any) {
    const apiUrl = `${this.baseUrl}/admin/material/create`;
    return this.http.post<any>(apiUrl, formdata);
  }

  getMaterial(page: any): Observable<any> {
    const url = `${this.baseUrl}/admin/material/list/${page}`;
    return this.http.get<any>(url);
  }

  deleteMaterial(formData: FormData): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/admin/material/delete`, formData, {
      observe: 'body' 
    });
  }
}
