import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { User } from '../models/auth.models';
import { UserResponse } from 'src/app/apps/users/models/model';
import { environment } from 'src/environments/environment';
import { CourseByIdResponse } from 'src/app/apps/users/models/mode-user-courses';

@Injectable({ providedIn: 'root' })
export class UserProfileService {

    baseUrl = environment.baseUrl;
    authorization: any;


    
    constructor (private http: HttpClient) { }
    

    getAll() {
        return this.http.get<User[]>(`/api/login`);
    }


      getUserList(page: number) {

        const apiUrl = `${this.baseUrl}/admin/user-list/${page}`;
        // console.log('apiurl for listing users', apiUrl)
        this.authorization = localStorage.getItem("Authorization");

        const headers = new HttpHeaders({
            Authorization: this.authorization,
          });
        
        // return this.http.get<UserResponse>(`/admin/user-list/${id}`);
        return this.http.get<UserResponse>(apiUrl, { headers });

      }

      getCourseListUser(id: number) {

        const apiUrl = `${this.baseUrl}/admin/user-suscribed-course-list/1?user_id=${id}`;
        // console.log('apiurl for listing users', apiUrl)
        this.authorization = localStorage.getItem("Authorization");

        const headers = new HttpHeaders({
            Authorization: this.authorization,
          });
        
        // return this.http.get<UserResponse>(`/admin/user-list/${id}`);
        return this.http.get<CourseByIdResponse>(apiUrl, { headers });

      }

      updatePaymentStatus(formdata:any) {

        const apiUrl = `${this.baseUrl}/admin/updatePayment`;
        // console.log('apiurl for listing users', apiUrl)
        this.authorization = localStorage.getItem("Authorization");

        const headers = new HttpHeaders({
            Authorization: this.authorization,
          });
        
        // return this.http.get<UserResponse>(`/admin/user-list/${id}`);
        return this.http.post<any>(apiUrl, formdata, { headers });

      }
      
}