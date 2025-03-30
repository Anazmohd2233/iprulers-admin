import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CertificateResponse } from 'src/app/apps/crm/certificate/certificate/fetch_cert_model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CertificateService {
  baseUrl = environment.baseUrl;
    authorization: any;
  
    constructor(private http: HttpClient) {}

fetchCertificates(page: any): Observable<CertificateResponse> {
    const url = `${this.baseUrl}/admin/certificate/list/${page}`;
    this.authorization = localStorage.getItem("Authorization");

    const headers = new HttpHeaders({ Authorization: this.authorization });

    return this.http.get<CertificateResponse>(url, { headers });
  }

  updateCertificateStatus(formdata: any) {
    const apiUrl = `${this.baseUrl}/admin/certificate/change_certificate_payment`;
    // console.log('apiurl for listing users', apiUrl)
    this.authorization = localStorage.getItem("Authorization");

    const headers = new HttpHeaders({
      Authorization: this.authorization,
    });

    // return this.http.get<UserResponse>(`/admin/user-list/${id}`);
    return this.http.post<any>(apiUrl, formdata, { headers });
  }
}
