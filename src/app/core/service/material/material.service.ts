


import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: 'root'
})


export class MaterialService {
  baseUrl = environment.baseUrl;
  authorization: any;

  constructor(private http: HttpClient) {}




  createMaterial(formdata: any) {
    const apiUrl = `${this.baseUrl}/admin/material/create`;
    this.authorization = localStorage.getItem("Authorization");

    const headers = new HttpHeaders({
      Authorization: this.authorization,
    });

    return this.http.post<any>(apiUrl, formdata, { headers });
  }

  getMaterial(page: any): Observable<any> {
    const url = `${this.baseUrl}/admin/material/list/${page}`;
    this.authorization = localStorage.getItem("Authorization");

    const headers = new HttpHeaders({ Authorization: this.authorization });

    return this.http.get<any>(url, { headers });
  }
}


