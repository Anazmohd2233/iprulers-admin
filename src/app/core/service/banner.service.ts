import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BannerListResponse } from 'src/app/apps/chat/banner/banner.module';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BannerService {

   baseUrl = environment.baseUrl;
    authorization: any;
  
    constructor(private http: HttpClient) {}

    updateBanner(formdata: any) {
      const apiUrl = `${this.baseUrl}/admin/banner/update`;
      // console.log('apiurl for listing users', apiUrl)
      this.authorization = localStorage.getItem("Authorization");
  
      const headers = new HttpHeaders({
        Authorization: this.authorization,
      });
  
      // return this.http.get<UserResponse>(`/admin/user-list/${id}`);
      return this.http.post<any>(apiUrl, formdata, { headers });
    }

    createBanner(formdata: any) {
      const apiUrl = `${this.baseUrl}/admin/banner/create`;
      // console.log('apiurl for listing users', apiUrl)
      this.authorization = localStorage.getItem("Authorization");
  
      const headers = new HttpHeaders({
        Authorization: this.authorization,
      });
  
      // return this.http.get<UserResponse>(`/admin/user-list/${id}`);
      return this.http.post<any>(apiUrl, formdata, { headers });
    }

      getBanners(): Observable<BannerListResponse> {
        const url = `${this.baseUrl}/admin/banner/list/1`;
        this.authorization = localStorage.getItem("Authorization");
    
        const headers = new HttpHeaders({ Authorization: this.authorization });
    
        return this.http.get<BannerListResponse>(url, { headers });
      }
}
