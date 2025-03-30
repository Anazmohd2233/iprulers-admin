import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { EventResponse } from "src/app/apps/crm/events/get_model_event";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class EventsService {
  baseUrl = environment.baseUrl;
  authorization: any;

  constructor(private http: HttpClient) {}

  createEvents(formdata: any) {
    const apiUrl = `${this.baseUrl}/admin/events/create`;
    // console.log('apiurl for listing users', apiUrl)
    this.authorization = localStorage.getItem("Authorization");

    const headers = new HttpHeaders({
      Authorization: this.authorization,
    });

    return this.http.post<any>(apiUrl, formdata, { headers });
  }
  getEvents(page: any): Observable<EventResponse> {
    const url = `${this.baseUrl}/admin/events/list/${page}`;
    this.authorization = localStorage.getItem("Authorization");

    const headers = new HttpHeaders({ Authorization: this.authorization });

    return this.http.get<EventResponse>(url, { headers });
  }
  updateEvents(formdata: any) {
    const apiUrl = `${this.baseUrl}/admin/events/update`;
    // console.log('apiurl for listing users', apiUrl)
    this.authorization = localStorage.getItem("Authorization");

    const headers = new HttpHeaders({
      Authorization: this.authorization,
    });

    return this.http.post<any>(apiUrl, formdata, { headers });
  }
}
